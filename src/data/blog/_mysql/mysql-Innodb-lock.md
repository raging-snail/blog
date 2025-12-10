---
author: lavie
pubDatetime: 2025-02-20T09:19:40Z
modDatetime: 2025-11-14T02:51:00Z
title: mysql Innodb引擎锁机制
featured: true
draft: false
private: false
tags:
  - mysql
description: mysql Innodb引擎中锁的分类，以及行锁的加锁分析
---

 这篇文章按照锁的模式和粒度介绍了MySQL Innodb引擎中不同类型的锁、加锁的具体逻辑、锁的区间分析等内容。

## Table of contents

## 简介

### 分类

**按锁的模式来划分，可以分为共享锁（读锁）、排他锁（写锁）；**

* 共享锁(S锁、IS锁)，可以提高读读并发；
* 排他锁(X锁、IX锁)，保证同一行记录修改与删除的串行性；

**按锁的粒度来划分，可以分为：**

* 表锁：意向锁(IS锁、IX锁)、自增锁(AI锁)；
* 行锁：记录锁、间隙锁、临键锁、插入意向锁；

### 锁的冲突判定

锁模式的兼容性矩阵通过如下数组进行快速判定：

|     | IS  | IX  | S   | X   | AI  |
| --- | --- | --- | --- | --- | --- |
| **IS** | TRUE | TRUE | TRUE | FALSE | TRUE |
| **IX** | TRUE | TRUE | FALSE | FALSE | TRUE |
| **S** | TRUE | FALSE | TRUE | FALSE | FALSE |
| **X** | FALSE | FALSE | FALSE | FALSE | FALSE |
| **AI** | TRUE | TRUE | FALSE | FALSE | FALSE |

在比较两个锁是否冲突时，即使不满足兼容性矩阵，在如下几种情况下，依然认为是相容的，无需等待（参考函数`lock_rec_has_to_wait`）

* 对于GAP类型（锁对象建立在supremum上或者申请的锁类型为LOCK_GAP）且申请的不是插入意向锁时，无需等待任何锁，这是因为不同Session对于相同GAP可能申请不同类型的锁，而GAP锁本身设计为不互相冲突；
* LOCK_ORDINARY 或者LOCK_REC_NOT_GAP类型的锁对象，无需等待LOCK_GAP类型的锁；
* LOCK_GAP类型的锁无需等待LOCK_REC_NOT_GAP类型的锁对象；
* 任何锁请求都无需等待插入意向锁。

## 行锁

对于行锁而言，锁模式只有LOCK_S 和LOCK_X，其他的 FLAG 用于描述锁的粒度，如前述 LOCK_REC_NOT_GAP、LOCK_GAP 以及 LOCK_ORDINARY、LOCK_INSERT_INTENTION 四种。

### 记录锁（LOCK_REC_NOT_GAP）

锁带上这个 FLAG 时，表示这个锁仅锁定记录本身，不会锁记录之前的 GAP。

在 RC 隔离级别下一般加的都是该类型的记录锁（但唯一二级索引上的 duplicate key 检查除外，总是加 `LOCK_ORDINARY` 类型的锁）。

### 间隙锁（LOCK_GAP）

表示只锁住一段范围，不锁记录本身，通常表示两个索引记录之间，或者索引上的第一条记录之前，或者最后一条记录之后的锁。可以理解为一种区间锁，一般在RR隔离级别下会使用到GAP锁。

可以通过切换到RC隔离级别，或者开启选项`innodb_locks_unsafe_for_binlog`来避免GAP锁。这时候只有在检查外键约束或者duplicate key检查时才会使用到GAP LOCK。

**间隙锁之间是兼容的，两个事务之间可以共同持有包含相同间隙的间隙锁。**

### 临键锁（LOCK_ORDINARY/Next-Key Lock）

也就是所谓的 NEXT-KEY 锁，包含记录本身及记录之前的GAP，即**锁的范围是左开右闭**。

需要注意的是：**next-key lock在具体执行的时候，是要分成间隙锁和行锁两段来执行的。**

MySQL 默认情况下使用RR的隔离级别，而NEXT-KEY LOCK正是为了解决RR隔离级别下的幻读问题。

假设索引上有记录1、4、5、8、12，我们执行类似语句：SELECT… WHERE col > 10 FOR UPDATE。如果我们不在(8, 12)之间加上Gap锁，另外一个 Session 就可能向其中插入一条记录，例如11，再执行一次相同的SELECT FOR UPDATE，就会看到新插入的记录。

这也是为什么插入一条记录时，需要判断下一条记录上是否加锁了。

正常来说，我们**加行锁的基本单位就是 Next-Key Lock**，既有记录锁又有间隙锁。但是有时候 Next-Key Lock 会退化：

1. 如果是唯一非空索引的等值查询，Next-Key Lock 会退化成 Record Lock。
  
2. 普通索引上的等值查询，向后遍历时，最后一个不满足等值条件的时候，Next-Key Lock 会退化成 Gap Lock。
  

### 插入意向锁（LOCK_INSERT_INTENTION）

INSERT INTENTION锁是GAP锁的一种，如果有多个session插入同一个GAP时，他们无需互相等待，例如当前索引上有记录4和8，两个并发session同时插入记录6，7。他们会分别为(4,8)加上GAP锁，但相互之间并不冲突（因为插入的记录不冲突）。

当向某个数据页中插入一条记录时，总是会调用函数`lock_rec_insert_check_and_lock`进行锁检查（构建索引时的数据插入除外），会去检查当前插入位置的下一条记录上是否存在锁对象，这里的下一条记录不是指的物理连续，而是按照逻辑顺序的下一条记录。

* 如果下一条记录上不存在锁对象：若记录是二级索引上的，先更新二级索引页上的最大事务ID为当前事务的ID；直接返回成功。
* 如果下一条记录上存在锁对象，就需要判断该锁对象是否锁住了GAP。如果GAP被锁住了，并判定和插入意向GAP锁冲突，当前操作就需要等待，加的锁类型为`LOCK_X | LOCK_GAP | LOCK_INSERT_INTENTION`，并进入等待状态。但是插入意向锁之间并不互斥。这意味着在同一个GAP里可能有多个申请插入意向锁的会话。

### 共享锁（LOCK_S）

共享锁的作用通常用于在事务中读取一条行记录后，不希望它被别的事务锁修改，但所有的读请求产生的LOCK_S锁是不冲突的。在InnoDB里有如下几种情况会请求S锁。

1. 普通查询在隔离级别为 SERIALIZABLE 会给记录加 LOCK_S 锁。但这也取决于场景：非事务读（auto-commit）在 SERIALIZABLE 隔离级别下，无需加锁
  
2. 类似SELECT … IN SHARE MODE，会给记录加S锁，其他线程可以并发查询，但不能修改。基于不同的隔离级别，行为有所不同:
  
  * RC隔离级别： `LOCK_REC_NOT_GAP | LOCK_S`；
    
  * RR隔离级别：如果查询条件为唯一索引且是唯一等值查询时，加的是 `LOCK_REC_NOT_GAP | LOCK_S`；对于非唯一条件查询，或者查询会扫描到多条记录时，加的是`LOCK_ORDINARY | LOCK_S`锁，也就是记录本身+记录之前的GAP；
    
3. 通常INSERT操作是不加锁的，但如果在插入或更新记录时，检查到 duplicate key（或者有一个被标记删除的duplicate key），对于普通的INSERT/UPDATE，会加LOCK_S锁，而对于类似REPLACE INTO或者INSERT … ON DUPLICATE这样的SQL加的是X锁。而针对不同的索引类型也有所不同：
  
  * 对于聚集索引（参阅函数`row_ins_duplicate_error_in_clust`），隔离级别小于等于RC时，加的是`LOCK_REC_NOT_GAP`类似的S或者X记录锁。否则加`LOCK_ORDINARY`类型的记录锁（NEXT-KEY LOCK）；
    
  * 对于二级唯一索引，若检查到重复键，加 LOCK_ORDINARY 类型的记录锁(函数 `row_ins_scan_sec_index_for_duplicate`)。
    
4. 外键检查，当我们删除一条父表上的记录时，需要去检查是否有引用约束(`row_pd_check_references_constraints`)，这时候会扫描子表(`dict_table_t::referenced_list`)上对应的记录，并加上共享锁。按照实际情况又有所不同。
  

       举例说明：使用RC隔离级别，两张测试表

    create table t1 (a int, b int, primary key(a));
    create table t2 (a int, b int, primary key (a), key(b), foreign key(b) references t1(a));
    insert into t1 values (1,2), (2,3), (3,4), (4,5), (5,6), (7,8), (10,11);
    insert into t2 values (1,2), (2,2), (4,4);

执行SQL：delete from t1 where a = 10;

* 在t1表记录10上加 `LOCK_REC_NOT_GAP|LOCK_X`
* 在t2表的supremum记录（表示最大记录）上加 `LOCK_ORDINARY|LOCK_S`，即锁住(4, ~)区间

执行SQL：delete from t1 where a = 2;

* 在t1表记录(2,3)上加 `LOCK_REC_NOT_GAP|LOCK_X`
* 在t2表记录(1,2)上加 `LOCK_REC_NOT_GAP|LOCK_S`锁，这里检查到有引用约束，因此无需继续扫描(2,2)就可以退出检查，判定报错。

执行SQL：delete from t1 where a = 3;

* 在t1表记录(3,4)上加 `LOCK_REC_NOT_GAP|LOCK_X`
* 在t2表记录(4,4)上加 `LOCK_GAP|LOCK_S`锁

另外从代码里还可以看到，如果扫描到的记录被标记删除时，也会加`LOCK_ORDINARY|LOCK_S` 锁。具体参阅函数`row_ins_check_foreign_constraint`

5. INSERT … SELECT插入数据时，会对SELECT的表上扫描到的数据加LOCK_S锁

### 排他锁（LOCK_X）

排他锁的目的主要是避免对同一条记录的并发修改。通常对于UPDATE或者DELETE操作，或者类似SELECT … FOR UPDATE操作，都会对记录加排他锁。

我们以如下表为例：

    create table t1 (a int, b int, c int, primary key(a), key(b));
    insert into t1 values (1,2,3), (2,3,4),(3,4,5), (4,5,6),(5,6,7);

执行SQL（通过二级索引查询）：update t1 set c = c +1 where b = 3;

* RC隔离级别：1. 锁住二级索引记录，为NOT GAP X锁；2.锁住对应的聚集索引记录，也是NOT GAP X锁。
* RR隔离级别下：1.锁住二级索引记录，为`LOCK_ORDINARY|LOCK_X`锁；2.锁住聚集索引记录，为NOT GAP X锁

执行SQL（通过聚集索引检索，更新二级索引数据）：update t1 set b = b +1 where a = 2;

* 对聚集索引记录加 `LOCK_REC_NOT_GAP | LOCK_X`锁;
* 在标记删除二级索引时，检查二级索引记录上的锁，如果存在和`LOCK_REC_NOT_GAP | LOCK_X`冲突的锁对象，则创建锁对象并返回等待错误码；否则无需创建锁对象；
* 当到达这里时，我们已经持有了聚集索引上的排他锁，因此能保证别的线程不会来修改这条记录。（修改记录总是先聚集索引，再二级索引的顺序），即使不对二级索引加锁也没有关系。但如果已经有别的线程已经持有了二级索引上的记录锁，则需要等待。
* 在标记删除后，需要插入更新后的二级索引记录时，依然要遵循插入意向锁的加锁原则。

当同时执行上述两种 SQL ，一个是先锁住二级索引记录，再锁聚集索引；另一个是先锁聚集索引，再检查二级索引冲突，因此在这类并发更新场景下，可能会发生死锁。

不同场景，不同隔离级别下的加锁行为都有所不同，例如**在RC隔离级别下，不符合WHERE条件的扫描到的记录，会被立刻释放掉，但RR级别则会持续到事务结束。**

### 加锁原则

1. 原则 1：加锁的基本单位是 next-key lock。
  
2. 原则 2：查找过程中访问到的对象才会加锁。
  
3. 优化 1：索引上的等值查询，给唯一索引加锁时，next-key lock 退化为行锁。
  
4. 优化 2：索引上的等值查询，向后遍历时且最后一个值不满足等值条件的时候，next-key lock 退化为间隙锁。
5. 优化3：唯一索引范围查询，值不满足条件时，next-key lock 退化为间隙锁。
  
6. 旧版本bug：唯一索引上的范围查询会访问到不满足条件的第一个值为止。

> 优化3是新版本才有的，具体从哪个版本开始，没有找到相关文档。在8.0.21时，有这个优化。在8.0.15中不存在。

### 案例

#### 演示数据

    CREATE TABLE `t2` (
      `id` int(11) NOT NULL,
      `c` int(11) DEFAULT NULL,
      `d` int(11) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `c` (`c`)
    ) ENGINE=InnoDB;
    
    insert into t2 values(0,0,0),(5,5,5),
    (10,10,10),(15,15,15),(20,20,20),(25,25,25);

#### 案例一：唯一索引等值查询

| session A | session B | session C |
| --- | --- | --- |
| begin; <br/>update t2 set d=d-1 where id=7; |     |     |
|     | insert into t2 values(8,8,8);<br/> (<font color="red">blocked</font>) |     |
|     |     | update t2 set d=d+1 where id=10;<br/> (<font color="green">Query OK</font>) |

由于表t中没有id=7的记录，所以我们可以用上面提到的加锁规则判断一下：

* 根据原则1，加锁的单位是next-key lock，session A加锁范围就是(5,10]。
  
* 根据优化2，这是一个等值查询(id=7)，而id=10不满足查询条件，next-key lock退化成间隙锁，因此最终加锁的范围是(5,10)。
  

所以，session B要在两个区间里面插入id=8的记录会被锁住，但是session C修改id=10这行是可以的。

#### 案例二：非唯一索引等值查询

| session A | session B | session C |
| --- | --- | --- |
| begin;<br/>select id from t2 where c = 5 lock in share mode; |     |     |
|     | update t2 set d = d + 1 where id = 5;<br/>(<font color="green">Query OK</font>) |     |
|     |     | insert into t2 values(7,7,7);<br/>(<font color="red">blocked</font>) |

这里 session A 要给索引 c 上 c=5 的这一行加上读锁。

* 根据原则 1，加锁单位是 next-key lock，因此会给 (0,5] 加上 next-key lock。
  
* 要注意 c 是普通索引，因此仅访问 c=5 这一条记录是不能马上停下来的，需要向右遍历，查到 c=10 才放弃。根据原则 2，访问到的都要加锁，因此要给 (5,10] 加 next-key lock。
  
* 但是同时这个符合优化 2：等值判断，向右遍历，最后一个值不满足 c=5 这个等值条件，因此退化成间隙锁 (5,10)。
  
* 根据原则 2 ，**只有访问到的对象才会加锁**，这个查询使用覆盖索引，并不需要访问主键索引，所以主键索引上没有加任何锁，这就是为什么 session B 的 update 语句可以执行完成。
  

但 session C 要插入一个 (7,7,7) 的记录，就会被 session A 的间隙锁 (5,10) 锁住。

需要注意，在这个例子中，lock in share mode 只锁覆盖索引，但是如果是 for update 就不一样了。 执行 for update 时，系统会认为你接下来要更新数据，因此会顺便给主键索引上满足条件的行加上行锁。

这个例子说明，锁是加在索引上的；同时，它给我们的指导是，如果你要用 lock in share mode 来给行加读锁避免数据被更新的话，就必须得绕过覆盖索引的优化，在查询字段中加入索引中不存在的字段。比如，将 session A 的查询语句改成 select d from t2 where c=5 lock in share mode。

#### 案例三：非唯一索引上存在等值

先insert一条记录，让索引c上存在等值

    insert into t2 values(30,10,30);

| session A | session B | session C |
| --- | --- | --- |
| begin;<br/>select * from t2 where c = 10 for update; |     |     |
|     | insert into t2 values(12,12,12);<br/>(<font color="red">blocked</font>) |     |
|     |     | update t2 set d = d + 1 where c = 15;<br/>(<font color="green">Query OK</font>) |

这里 session A 要给索引 c = 15 加写锁。

* session A 先访问第一个 c=10 的记录，根据原则 1，这里加的是 (c=5,id=5) 到 (c=10,id=10) 这个 next-key lock。
  
* c=10的记录不止一条，继续向右查找，根据原则 1，这里加的是 (c=10,id=10) 到 (c=10,id=30) 这个 next-key lock。
  
* 继续向右查找直到碰到 (c=15,id=15) 这一行，这时才能确定不会再有c=10的记录了，循环才会结束。这是一个等值查询，根据优化 2，会退化成 (c=10,id=10) 到 (c=15,id=15) 的间隙锁。
  

#### 案例四：非唯一索引上存在等值 + limit语句

| session A | session B | session C |
| --- | --- | --- |
| begin;<br/>select * from t2 where c = 10 limit 2 for update; |     |     |
|     | insert into t2 values(12,12,12);<br/>(<font color="green">Query OK</font>) |     |
|     |     | update t2 set d = d + 1 where c = 15;<br/>(<font color="green">Query OK</font>) |

这里 session A 要给索引 c = 15 加写锁。

* session A 先访问第一个 c=10 的记录，根据原则 1，这里加的是 (c=5,id=5) 到 (c=10,id=10) 这个 next-key lock。
  
* c=10的记录不止一条，继续向右查找，根据原则 1，这里加的是 (c=10,id=10) 到 (c=10,id=30) 这个 next-key lock。
  
* 此时已经有两条记录了，符合 limit 2，不会继续向右查找，所以不会加(c=10,id=10) 到 (c=15,id=15) 的间隙锁。
  

#### 案例五：旧版本唯一索引范围查询的一个bug

| session A | session B | session C |
| --- | --- | --- |
| begin;<br/>select * from t2 where id>=10 and id<15 for update; |     |     |
|     | update t2 set d=d+1 where id=20;<br/>(<font color="red">blocked</font>) |     |
|     |     | insert into t2 values(16,16,16);<br/>(<font color="red">blocked</font>) |

session A 是一个范围查询，在判断id<15时，应该是索引 id 上只加 (10,15] 这个 next-key lock，并且因为 id 是唯一键，所以循环判断到 id=15 这一行就应该停止了。

但是实现上，InnoDB 会往前扫描到第一个不满足条件的行为止，也就是 id=20。而且由于这是个范围扫描，因此索引 id 上的 (15,20] 这个 next-key lock 也会被锁上。

所以 session B 要更新 id=20 这一行，是会被锁住的。同样地，session C 要插入 id=16 的一行，也会被锁住。

#### 案例六：唯一索引范围查询

| session A | session B | session C |
| --- | --- | --- |
| begin;<br/>select * from t2 where id >= 10 and id < 11 for update; |     |     |
|     | insert into t2 values(8,8,8);<br/>(<font color="green">Query OK</font>)<br/>insert into t2 values(13,13,13);<br/>(<font color="red">blocked</font>) |     |
|     |     | update t2 set d=d+1 where id=15;<br/>(<font color="green">Query OK</font>) |

session A 加锁分析：

* id>=10，根据 id=10 定位开始位置，加锁 next-key lock(5,10]。 根据优化 1， 主键 id 上的等值条件，退化成行锁，只加了 id=10 这一行的行锁。
  
* id<11，继续往后查找第一个不符合条件的，找到id=15 结束，需要加 next-key lock(10,15]。
  
  * 新版本中，根据优化3，id=15不符合查询条件，退化成间隙锁(10,15)
    
  * 旧版本中，还是next-key lock(10,15]，不会优化成间隙锁，执行session C的语句时还是会<font color="red">blocked</font>
    

这个例子中，如果条件是`id > 10 and id < 11`，则加锁范围如下：

* id>10，找到第一个符合条件的，id=15，需要加 next-key lock(10,15]，如果是新版本，会优化成间隙锁

#### 案例七：非唯一索引范围查询

| session A | session B | session C |
| --- | --- | --- |
| begin;<br/>select * from t2 where c>=10 and c<11 for update; |     |     |
|     | insert into t2 values(8,8,8);<br/>(<font color="red">blocked</font>) |     |
|     |     | update t2 set d=d+1 where c=15;<br/>(<font color="red">blocked</font>) |

这次 session A 用字段 c 来判断，加锁规则跟案例六的不同是：

* 在用 c=10 定位开始位置，索引 c 不是唯一索引，所以加的是 next-key lock (5,10] 。
  
* c不是唯一索引，需要继续向后查找到下一个值15，加锁 next-key lock (10,15]，根据优化2，非唯一索引等值查询，不符合等值条件时，退化成间隙锁 (10,15) **这一步其实可以忽略，因为c=10是开始位置，范围查询肯定需要继续向右遍历**
  
* c<11找到第一个不符合条件的是c=15，所以加的是 next-key lock (10,15]
  
* 因此最终 sesion A 加的锁是，索引 c 上的 (5,10] 和 (10,15] 这两个 next-key lock。
  

这个例子中，如果查询条件是`c>10 and c<11`，则加锁范围如下：

* c>10，找到第一个符合条件的，c=15，加 next-key lock (10,15]
  
* c<11，加的锁不变，还是next-key lock (10,15]

#### 案例八：死锁的例子

| session A | session B |
| --- | --- |
| begin;<br/>select * from t2 where c = 10 for update; |     |
|     | update t2 set d=d+1 where c=10;<br/>(<font color="red">blocked</font>) |
| insert into t2 values(8,8,8); |     |
|     | ERROR 1213(40001):<br/>Deadlock found when trying to get lock; try restarting transaction |

死锁原因：

* session A 在索引 c 上加了 next-key lock(5,10] 和间隙锁 (10,15)；
  
* session B 的 update 语句也要在索引 c 上加 next-key lock(5,10] ，阻塞；
  
* 然后 session A 要再插入 (8,8,8) 这一行，被 session B 的间隙锁锁住。
  
* 由于出现了死锁，InnoDB 让 session B 回滚。
  

session A已经获取了锁，为什么 session B 会持有间隙锁？

因为 session B “加 next-key lock(5,10] ”操作，实际上分成了两步：

* 先是加 (5,10) 的间隙锁，由于间隙锁之间是兼容的，加锁成功，
  
* 然后加 c=10 的记录锁，这个锁被 session A 持有，获取锁失败，阻塞。

结论：

* **next-key lock在具体执行的时候，是要分成间隙锁和记录锁两段来执行的**。
  
* **间隙锁之间是兼容的，两个事务之间可以共同持有包含相同间隙的间隙锁**。

#### 案例九：order by

| session A | session B |
| --- | --- |
| begin;<br/>select * from t2 where c>=15 and c<=20 order by c desc lock in share mode; |     |
|     | insert into t2 values(6,6,6);<br/>(<font color="red">blocked</font>) |

session A 加的锁：

* 由于是 order by c desc，第一个要定位的是索引 c 上 c=20 的行，所以会加上next-key lock (15,20]
  
* 由于不是唯一索引，向右查到下一个值25，加next-key lock (20,25]，**根据优化二，退化为间隙锁(20,25)**
  
* 在索引 c 上向左遍历，查到第一个不符合条件的记录是 c=10 ，所以 next-key lock 会加到 (5,10]，导致 session B 的 insert 语句阻塞。
  
* 在扫描过程中，由于是 select *，根据查询结果有两条记录，id=15和id=20的，所以会在主键 id 上加两个行锁。
  

如果将语句改为 `c>15 and c<=20`呢？

* c<=20，得到的还是next-key lock (15,20] 和 间隙锁(20,25)

* 在范围查询 c>15 时，从c=20向左遍历，查到第一个不符合条件的记录是c=15，所以锁的范围是(10,15]