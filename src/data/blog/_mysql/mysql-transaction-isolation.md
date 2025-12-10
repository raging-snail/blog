---
author: lavie
pubDatetime: 2024-11-26T07:45:22Z
modDatetime: 2025-10-14T02:54:59Z
title: 事务的隔离级别
featured: false
draft: false
private: false
tags:
  - Mysql
description: Mysql并发事务导致的问题和事务的隔离级别
---

 这篇文章主要介绍Mysql并发事务导致的脏读、不可重复读、幻读问题，以及读未提交、读已提交、可重复读和可串行化四种不同隔离级别。

## Table of contents

## 并发事务导致的问题

### 脏读 Dirty Read

一个事务读取数据并且对数据进行了修改，这个修改对其他事务来说是可见的，即使当前事务没有提交。这时另外一个事务读取了这个还未提交的数据，但第一个事务突然回滚，导致数据并没有被提交到数据库，那第二个事务**读到的是被回滚的脏数据**。

1. 事务A开始，并更新了一条记录，将其值从10修改为20，但未提交。
2. 事务B开始，并读取了事务A修改但未提交的值20。
3. 事务A回滚，值恢复为10。
4. 事务B读取的值20是无效的，因为事务A的更改被回滚了，这就产生了脏读。

### 不可重复读 Unrepeatable Read

指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了**在一个事务内两次读到的数据是不一样的情况**，因此称为不可重复读。

1. 事务A开始，并读取一条记录，值为10。
2. 事务B开始，并将该记录的值从10修改为20，然后提交。
3. 事务A再次读取同一条记录，这次读取到的值为20。
4. 事务A在同一个事务中两次读取同一记录却得到了不同的值，这就是不可重复读。

### 幻读 Phantom Read

指在一个事务读取了几行数据，接着另一个并发事务插入了一些数据时。在随后的查询中，第一个事务就会发现多了一些原本不存在的记录，在**同一个事务中两次相同的查询范围得到不同的结果**。

1. 事务A开始，并读取某个范围的数据。
2. 事务B开始，在这个范围插入了新的数据。
3. 事务A再次读取这个范围的数据，发现比第一次读取的结果多了新的数据。
4. 虽然事务A两次执行相同的查询，但因为其他事务插入了新记录，结果集发生了变化，这就是幻读。

## 事务隔离级别

从一致性和保护程度最低到最高，InnoDB 支持的隔离级别为：**READ-UNCOMMITTED、READ-COMMITTED、REPEATABLE-READ、SERIALIZABLE。**

MySQL InnoDB 存储引擎的默认支持的隔离级别是 **REPEATABLE-READ**。

通过`SELECT @@tx_isolation;`命令来查看，MySQL 8.0 改为`SELECT @@transaction_isolation;`

| 隔离级别             | 脏读  | 不可重复读 | 幻读  |
| ---------------- | --- | ----- | --- |
| READ-UNCOMMITTED | √   | √     | √   |
| READ-COMMITTED   | ×   | √     | √   |
| REPEATABLE-READ  | ×   | ×     | √   |
| SERIALIZABLE     | ×   | ×     | ×   |

### READ-UNCOMMITTED(读未提交)

最低的隔离级别，可能会导致**脏读**、**幻读**或**不可重复读**。

`SELECT`语句以**nonlocking(非锁定读取)**方式执行，可能会读取尚未提交的数据变更，会导致**脏读**。

其它情况下，此隔离级别的工作方式和**READ-COMMITTED**一致。

### READ-COMMITTED(读已提交)

允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生。

对于**锁定读取**（`SELECT`语句使用`FOR UPDATE`或`IN SHARE MODE`）、`UPDATE`和`DELETE`语句，`InnoDB`**仅锁定索引记录，不使用间隙锁**，从而允许在锁定的记录旁边自由插入新记录。间隙锁定仅用于外键约束检查和重复键检查。

由于禁用了间隙锁定，其他会话可以将新行插入间隙，因此可能会发生幻读问题。

对于`UPDATE`和`DELETE`语句， `InnoDB`仅对更新或删除的行保持锁定。在判断`WHERE`条件后，将释放不匹配行的记录锁，降低了死锁的可能性，但仍有可能发生死锁。

对于`UPDATE`语句，`InnoDB` 则执行“半一致性”读取，将最新提交的版本返回给 MySQL，确定该行是否符合 `WHERE`的条件。 如果该行匹配，MySQL 将再次读取该行，这次`InnoDB`要么锁定它，要么等待该行的锁。

演示

```sql
CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
COMMIT;

CREATE TABLE t1 (a INT NOT NULL, b INT, c INT, INDEX (b)) ENGINE = InnoDB;
INSERT INTO t1 VALUES (1,2,3),(2,2,4);
COMMIT;
```

```sql
-- 修改会话的隔离级别
SET SESSION transaction_isolation = 'READ-COMMITTED';
SHOW SESSION VARIABLES LIKE 'transaction_isolation';

-- 关闭自动提交
SET SESSION autocommit = 0;
SHOW SESSION VARIABLES LIKE 'autocommit'
```

```sql
-- 修改会话的隔离级别
SET SESSION transaction_isolation = 'READ-COMMITTED';
SHOW SESSION VARIABLES LIKE 'transaction_isolation';
```

开启两个session分别执行下面的`UPDATE`语句

```sql
# Session 1
START TRANSACTION;
UPDATE t SET b = 5 WHERE b = 3;

# Session 2
UPDATE t SET b = 4 WHERE b = 2;
```

在[InnoDB](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)执行`UPDATE`时，它首先获取每行的排它锁（x锁），然后确定是否修改它。

- 如果[InnoDB](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)不修改该行，则释放锁。
- 否则， [InnoDB](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)保留锁直到事务结束

第一个`UPDATE`会在它读取的每一行上获取一个x锁，并释放它不会修改的行的 x 锁：

```plain
x-lock(1,2); unlock(1,2)
x-lock(2,3); update(2,3) to (2,5); retain x-lock
x-lock(3,2); unlock(3,2)
x-lock(4,3); update(4,3) to (4,5); retain x-lock
x-lock(5,2); unlock(5,2)
```

对于第二个`UPDATE`， `InnoDB`执行 “半一致性”读取

```plain
x-lock(1,2); update(1,2) to (1,4); retain x-lock
x-lock(2,3); unlock(2,3)
x-lock(3,2); update(3,2) to (3,4); retain x-lock
x-lock(4,3); unlock(4,3)
x-lock(5,2); update(5,2) to (5,4); retain x-lock
```

但是，如果`WHERE`条件包含索引列，并且`InnoDB`使用索引，则在获取和保留记录锁时仅考虑索引列。在下面的示例中，第一个`UPDATE`在 b = 2 的每一行上获取并保留 x 锁。第二个`UPDATE`在尝试获取相同记录上的 x 锁时会阻塞，因为它还使用在列 b 上定义的索引。

```sql
# Session 1
START TRANSACTION;
UPDATE t1 SET b = 3 WHERE b = 2 AND c = 3;

# Session 2
UPDATE t1 SET b = 4 WHERE b = 2 AND c = 4;
```

### REPEATABLE-READ(可重复读)

这是`InnoDB`的默认隔离级别 。 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。

`InnoDB` 实现的`REPEATABLE-READ`隔离级别其实是可以解决幻读问题发生的

对于锁定读取（`SELECT`语句使用`FOR UPDATE`或`in share mode`）、`UPDATE`和`DELETE`语句，锁定取决于语句是否使用具有唯一搜索条件的唯一索引，还是使用范围类型搜索条件。

- 对于具有唯一搜索条件的唯一索引， `InnoDB`仅锁定找到的索引记录，而不锁定其之前的间隙。
- 对于其他搜索条件，`InnoDB` 锁定扫描的索引范围，使用间隙锁或下一个键锁阻止其他会话插入范围覆盖的间隙。

**Mysql不建议在单个事务中混合使用锁定语句和非锁定语句，这种情况需要使用 `SERIALIZABLE`。**

使用默认`REPEATABLE READ` 隔离级别时，上述例子第一个Session会获取每行的排它锁，并且不会释放

```sql
x-lock(1,2); retain x-lock
x-lock(2,3); update(2,3) to (2,5); retain x-lock
x-lock(3,2); retain x-lock
x-lock(4,3); update(4,3) to (4,5); retain x-lock
x-lock(5,2); retain x-lock
```

第二个Session在尝试获取锁时阻塞，直到第一个Session更新提交或回滚后才会继续：

```plain
x-lock(1,2); 此时锁被Session1持有，Session2堵塞等待锁
```

### SERIALIZABLE(可串行化)

最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。

> InnoDB 存储引擎提供了对 XA 事务的支持，并通过 XA 事务来支持分布式事务的实现。分布式事务指的是允许多个独立的事务资源（transactional resources）参与到一个全局的事务中。事务资源通常是关系型数据库系统，但也可以是其他类型的资源。全局事务要求在其中的所有参与的事务要么都提交，要么都回滚，这对于事务原有的 ACID 要求又有了提高。另外，**在使用分布式事务时，InnoDB 存储引擎的事务隔离级别必须设置为 SERIALIZABLE**。


