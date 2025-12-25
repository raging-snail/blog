---
author: lavie
pubDatetime: 2024-11-25T14:00:44
modDatetime: 2025-11-14T02:51:01Z
title: Mysql Buffer Pool
featured: false
draft: false
private: false
tags:
  - Mysql
description: 详解 MySQL Buffer Pool 的内部架构：LRU List、Free List 与 Flush List 的协同工作机制及内存管理策略。
---

本文将详细介绍 MySQL Buffer Pool 的核心组成部分——LRU List、Free List 和 Flush List 的结构与作用，并深入解析 Buffer Pool 在内存管理与数据缓存中的运行机制。

## 1.Buffer Pool

`Buffer Pool`(缓冲池)是主存储器中的一个区域，`InnoDB`在访问 table 和索引数据时会对其进行缓存。缓冲池允许直接从内存中处理经常使用的数据，从而加快了处理速度。

`Buffer Pool`中的中的单位是一个个的`pages`。`pages`本质上就是从磁盘中读取进内存的数据页，数据页中存放着一行行的记录。

> `Buffer Pool`中的默认大小为128MB，`pages`大小16KB。

**合理配置Buffer Pool可以提高数据库性能**

- `innodb_buffer_pool_size`缓冲池大小。缓冲池越大，就越像内存数据库，从磁盘读取一次数据，然后在后续读取从内存中访问数据。
- `innodb_buffer_pool_instances`缓冲池实例数量。可以配置多个缓冲池，每个缓冲池管理自己的空闲列表、刷新列表、LRU 和所有其他连接到缓冲池的数据结构，以最大程度地减少并发操作之间的内存结构争用。配置选项默认为 1，最大 64
- 防止缓冲池扫描
- 配置预读
- 配置缓冲池刷新
- 保存和恢复缓冲池状态

```sql
// InnoDB 标准监视器
SHOW ENGINE INNODB STATUS
// 查看缓冲池实例化数量
show variables like '%innodb_buffer_pool_instances%'
// 查看缓冲池总大小
show variables like '%innodb_buffer_pool_size%'
```

## 2.缓冲池扫描

![LRUList](https://webp.lavieio.com/mysql-buffer-pool/LRUList.png)

缓冲池使用LRU算法管理，该算法将经常使用的`pages`（young page）保留在New Sublist中，Old Sublist包含不常用的`pages`

我们从磁盘中读取的数据页会被直接放在链表的头部，已经存在于LRU链表中数据页如果被使用到了，那么该数据页也被认为是young page而被移动到链表头部。这样链表尾部的数据就是最近最少使用的数据了，当Buffer Pool容量不足，或者后台线程主动刷新数据页时，就会优先刷新链表尾部的数据页。

### 使用传统的LRU算法的不足（MySql预读）

1. 线性预读：如果从扩展区 顺序 读取的`pages`大于或等于`innndb_read_ahead_threshold`，则`InnoDB`启动整个后续扩展区的异步预读操作。（如果没有添加这个参数，`InnoDB`仅在读取当前扩展区的最后一页时，才计算是否对整个下一个扩展区发出异步预取请求。`innndb_read_ahead_threshold`可以设置为 0-64 之间的任何值，默认为 **56**。）
2. 随机预读：如果在`Buffer Pool`中存储了来自同一扩展区的 13 个**连续**`pages`，则`InnoDB`异步发出请求以预取该扩展区的其余页面。（需要将`innodb_random_read_ahead`设置为`ON`）

默认情况下，查询读取的`pages`会立即移入New Sublist，在缓冲池中停留的时间更长。例如，针对`mysqldump`操作（备份）或**全表扫描**会将大量数据带入缓冲池，并逐出相同数量的旧`pages`，即使这些新`pages`可能不会再使用 。同样，由`预读后台线程`加载且仅访问一次的`pages`将移至New Sublist的开头。这些情况可能会将常用`pages`推送到旧的子列 ，最后被逐出。

### MySql的解决方法

- 当`InnoDB`将`pages`读入缓冲池时，它最初将其插入到中点（Old Sublist的头部）
- 访问Old Sublist中的`pages`，会将其移动到New Sublist的头部。如果`pages`是因为用户的操作而被读取的，则第一次访问会立即发生。如果由于预读操作而读取了`pages`，则第一次访问不会立即发生，并且可能在页面被驱逐之前根本不会发生
- 当通过全表扫面或者预读将一大批数据加载到Old Sublist时，然后在不到`innodb_old_blocks_time`秒内又访问了它，那在这段时间内被访问的缓存页并不会被提升到New Sublist
- 可以通过配置innodb_old_blocks_pct来控制Old Sublist的比例，默认值为37（3/8对应的百分比），范围是5-95
- New SubList是经过优化的，如果访问的是New SubList的前1/4的数据，它是不会被移动到LRU链表头部的（在官方文档没有找到对应的说明）

### FreeList

从磁盘中读取出来的数据页以缓存页和描述信息的方式组织在Buffer Pool中，通过缓冲页的描述信息可以直接且唯一的找到它所指向的缓存页。

FreeList是Buffer Pool中基于缓存页描述信息组织起来的双向链表。FreeList中的每一个结点都是缓存页对应的描述信息。

如果一个缓存页中没有存储任何数据，那么它对应的描述信息就会被维护进FreeList中。

### Flush List

MySql为了提高响应速度，会直接修改Buffer Pool中的数据，但是对LRU链表维护的缓存页数据进行修改后，会导致Buffer Pool和磁盘中的数据不一致，这种数据叫做脏页。

FlushList也是Buffer Pool中基于缓存页描述信息组织起来的双向链表。当对Buffer Pool中的缓存页数据进行了修改，那么该缓冲页的描述信息就会被维护到FlushList。

根据LRU机制，当Buffer Pool中的缓存页不够时，会将Old Sublist中的缓存页移除LRU链表。如果被移出的缓存页的描述信息被FlushList维护了，Mysql就会将数据刷新到磁盘。

配置缓冲池刷新

- `innodb_page_cleaners`控制`page cleaner threads`线程的数量，默认为4。如果配置的值大于缓冲池实例的数量，会自动修正为实例的数量
- `innodb_max_dirty_pages_pct_lwm`低水位标记阈值的目的是控制缓冲池中脏页的百分比，并防止脏页数量达到`innodb_max_dirty_pages_pct`变量(默认值为 75)所定义的阈值。当脏页的百分比达到低水位标记值时，将启动缓冲池刷新。低水位标记默认为0，表示禁用Buffer Pool早期的刷新行为。
- `innodb_flush_neighbors`变量定义从缓冲池刷新页面是否也以相同的态度将该脏页邻接的脏页一并刷新回磁盘。刷新邻接的脏页可以减少IO开销（主要是用于磁盘查找操作，SSD可以禁用）
  - 设置为 0 将禁用`innodb_flush_neighbors`，同样程度的脏页不会被刷新
  - 默认设置 1 会以相同程度刷新连续的脏页
  - 设置为 2 会以相同程度刷新脏页
- `innodb_io_capicity`控制数据库刷新页面的最大数量，磁盘IOPS越大，这个值可以设置越大
- `innodb_io_capacity_max`一般是`innodb_io_capicity`的两倍
- `innodb_lru_scan_depth`代表单个缓冲池实例刷新脏页的最大数

## 3.Buffer Pool的运行过程
 ![Buffer Pool](https://webp.lavieio.com/mysql-buffer-pool/Buffer%20Pool.png)

 - MySQL启动后，Buffer Pool就会被初始化，在没有执行任何查询操作之前，BufferPool中的缓存页都是一块块空的内存，未被使用过也没有任何数据保存在里面。
 - 从磁盘中读取出一个数据页，MySql先从FreeList中找一个节点，根据节点记录的描述信息找到对应的缓存页，接着把读取出来的这个数据页放入到该节点指向的缓存页中，当缓存页中被放入数据之后，它对应的描述信息块会被从FreeList中移出，添加到LRU链表中
 - 根据LRU机制，当Buffer Pool中的缓存页不够时，会将LRUList中Old Sublist中的缓存页移除LRU链表。如果被移出的缓存页的描述信息被FlushList维护了，Mysql就会将数据刷新到磁盘。
