---
author: lavie
pubDatetime: 2024-11-26T05:45:21Z
modDatetime: 2025-12-25T03:23:39Z
title: 分布式事务
featured: false
draft: false
private: false
tags:
  - Mysql
description: Mysql的分布式事务中的2PC和3PC两种协议，以及不同模式实现的分布式事务。
---

 这篇文章主要介绍了Mysql分布式事务中的2PC和3PC两种协议，以及不同模式实现的分布式事务的原理、优缺点和执行过程。

## 2PC 和 3PC

**两阶段提交协议**

两阶段提交又称2PC（two-phase commit protocol），是一个非常经典的强一致、中心化的原子提交协议。中心化指协议中有两类节点：一个是中心化协调者（coordinator）和N个参与者（partcipant）。

![2PC流程](https://webp.lavieio.com/distributed-transaction/2PC流程.png)

- 第一阶段：所有事务参与者执行后进行预提交
  - 协调者收到所有参与者的预提交后进入第二阶段
  - 如果在超时时间内，有参与者的预提交preCommit没发送或未到达，都会结束事务
- 第二阶段：所有事务预提交了各自的结果后，由协调者决定最终事务是commit还是rollback

**缺点**

- 所有的参与者资源和协调者资源都是被锁住的，只有当所有节点准备完毕，事务协调者才会通知进行全局提交，参与者进行本地事务提交后才会释放资源。
- 出现单点故障
  - 协调者正常，一个或多个参与者宕机，协调者无法收集到所有参与者的反馈，会陷入阻塞情况。（解决方案：引入超时，如果超时未收到反馈，发送终止事务请求）
  - 协调者宕机：无法发送提交请求，所有处于执行了操作但是未提交状态的参与者都会陷入阻塞状态。（解决方案：协调者备份，并且协调者记录操作日志。如果协调者宕机，备份将取代协调者并读取之前的操作日志，向参与者询问状态）
  - 都宕机
    - 发生在第一阶段：由于参与者没有真正commit，没有影响，选举一个新协调者重新执行
    - 发生在第二阶段，但宕机的参与者没有收到指令：没有执行commit，重新执行
    - 发生在第二阶段，且已经开始commit：宕机的参与者没有提交事务，但是其它参与者已经提交了事务。2PC没有解决方案

**三阶段提交协议**

3PC主要是为了解决2PC的阻塞问题

3PC在2PC的基础上增加了两个变动：超时机制；将2PC的准备阶段（第一阶段）进一步拆分

![3PC流程](https://webp.lavieio.com/distributed-transaction/3PC流程.png)

- CanCommit阶段（1-3）  
  之前2PC的一阶段是本地事务执行结束后，最后不commit，等其它服务都执行结束并返回Yes，由协调者发送glabol commit才真正执行commit。而这里的CanCommit指的是 **尝试获取数据库锁** 如果可以，就返回Yes。
  - `事务询问` 协调者向参与者发送CanCommit请求。询问是否可以执行事务提交操作。
  - `响应反馈` 参与者接到CanCommit请求之后，正常情况下，如果其自身认为可以顺利执行事务，则返回Yes，并进入预备状态，否则反馈No。
- PreCommit阶段（4-6）
  - 协调者会向所有的参与者节点发送PreCommit请求，参与者收到后开始执行事务操作，记录Undo和Redo事务日志。参与者执行完事务操作后（此时属于未提交事务的状态），就会向协调者反馈表示我已经准备好提交了，并等待协调者的下一步指令。
  - 如果CanCommit阶段中有任何一个参与者节点返回的结果是No，或者协调者在等待参与者节点反馈的过程超时（2PC中只有协调者可以超时，参与者没有超时机制）。整个分布式事务就会中断，协调者就会向所有的参与者发送“abort”请求。
- DoCommit阶段（7-8）  
  在PreCommit阶段中如果所有的参与者节点都可以进行提交，那么协调者就会从“预提交状态” 转变为 “提交状态”，向所有的参与者节点发送"doCommit"请求，参与者节点在收到提交请求后就会各自执行事务提交操作，并向协调者节点反馈消息，协调者收到所有参与者的消息后完成事务  
  参与者的超时机制：避免了参与者在长时间无法与协调者节点通讯（协调者宕机）的情况下，无法释放资源的问题，因为参与者自身拥有超时机制会在超时后，自动进行本地commit从而进行释放资源。  
  另外，通过**CanCommit、PreCommit、DoCommit**三个阶段的设计，相较于2PC而言，多设置了一个**缓冲阶段**保证了在最后提交阶段之前各参与节点的状态是一致的。  
  以上就是3PC相对于2PC的一个提高，但是3PC依然没有完全解决数据不一致的问题。

`分布式事务的四种模式：AT、TCC、Saga、XA，都是2PC`

## AT模式

如seata框架

- 第一阶段  
  Seata 解析 SQL 语义，找到“业务 SQL”要更新的业务数据，在业务数据被更新前，将其保存成“before image”，然后执行“业务 SQL”更新业务数据，在业务数据更新之后，再将其保存成“after image”，最后生成行锁。以上操作全部在数据库本地事务内完成，这样保证了一阶段操作的原子性。  
  ![seata一阶段](https://webp.lavieio.com/distributed-transaction/seata一阶段.png)
- 第二阶段
  - 提交：删除快照和行锁  
    ![seata二阶段提交](https://webp.lavieio.com/distributed-transaction/seata二阶段提交.png)
  - 回滚：将数据与after image对比，看是否脏写。
    - 如果没有，根据before image还原数据，删除快照和行锁  
      ![seata二阶段回滚](https://webp.lavieio.com/distributed-transaction/seata二阶段回滚.png)
    - 如果脏写，人工处理

```java
@GlobalTransactional
public void updateAll(Dto dto) {
  serviceA.update(dto.getA());

  serviceB.update(dto.getB());
}

/**
* 避免脏写的方法
* 1.updateA添加全局事务注解
* 2.updateA添加注解@GlobalLock,这样在提交的时候会检查全局锁
* 3.updateA添加注解@GlobalLock
*/
public void updateA(Dto dto) {
  serviceA.update(dto.getA());
}
```

## TCC模式

TCC 模式需要用户根据自己的业务场景实现 Try、Confirm 和 Cancel 三个操作；事务发起方在一阶段执行 Try 方式，在二阶段提交执行 Confirm 方法，二阶段回滚执行 Cancel 方法。

- Try：资源的检测和预留
- Confirm：执行的业务操作提交，要求 Try 成功 Confirm 一定要能成功
- Cancel：预留资源释放

**TCC模式注意事项**

1. 业务拆成两个阶段，要求第一阶段成功，则第二阶段必须成功![TCC模式](https://webp.lavieio.com/distributed-transaction/TCC模式.png)
2. 允许空回滚  
  执行Try超时，事务管理器会触发Cancel，但这个时候没有对应的事务id，直接返回回滚成功。否则会一直尝试回滚。
3. 防悬挂控制  
  执行Try超时并触发Cancel，但这个时候接受到Try调用，即Cancel比Try先到达。  
  按照前面允许空回滚的逻辑，回滚会返回成功，事务管理器认为事务已回滚成功。  
  如果此时执行Try 接口，会导致数据不一致，所以我们在 Cancel 空回滚返回成功之前先记录该条事务 xid ，标识这条记录已经回滚过，Try 接口先检查这条事务xid，如果已经标记为回滚成功过，则不执行 Try 的业务操作。

相对于 AT 模式，TCC 模式对业务代码有一定的侵入性，需要将业务拆分，但是 TCC 模式没有 AT 模式的全局行锁，性能会比 AT 模式高很多。

## Saga模式

理论基础：Hector & Kenneth 发表论⽂ Sagas （1987） [sega_report](https://github.com/mltds/sagas-report)

Saga 是一种补偿协议，在 Saga 模式下，分布式事务内有多个参与者，每一个参与者都是一个冲正补偿服务，需要用户根据业务场景实现其正向操作和逆向回滚操作。

![Saga模式](https://webp.lavieio.com/distributed-transaction/Saga模式.png)

Saga 模式适用于业务流程长且需要保证事务最终一致性的业务系统，Saga 模式一阶段就会提交本地事务，无锁、长流程情况下可以保证性能。

**优势**

- 一阶段提交本地事务，无锁，高性能
- 事件驱动架构，参与者可异步执行，高吞吐
- 补偿服务易于实现

**缺点**

- 不保证隔离性
- Saga 正向服务与补偿服务也需要业务开发者实现，是业务入侵的。

## XA模式

XA是X/Open DTP组织（X/Open DTP group）定义的两阶段提交协议，XA被许多数据库（如Oracle、DB2、SQL Server、MySQL）和中间件等工具(如CICS 和 Tuxedo)本地支持 。

XA规范的基础是两阶段提交协议2PC。JTA是Java实现的XA接口。

在XA模式下，需要有一个全局协调器，每一个数据库事务完成后，进行第一阶段预提交，并通知协调器，把结果给协调器。协调器等所有分支事务操作完成、都预提交后，进行第二步；

第二步：协调器通知每个数据库进行逐个commit/rollback。  
其中，这个全局协调器就是XA模型中的TM角色，每个分支事务各自的数据库就是RM。

缺点：事务粒度大。高并发下，系统可用性低。

mysql对XA模式的实现

```sql
XA start 'xatest';
insert into erstest.admin(id) VALUES (11111111111222);
insert into erms.`user`(id) VALUES (11111111111222);
XA END 'xatest';

// 一阶段预提交
XA PREPARE 'xatest';

// 二阶段提交
XA COMMIT 'xatest';
// 二阶段回滚
XA ROLLBACK  'xatest';

// 查看处于PREPARE阶段的所有XA事务
XA RECOVER
```

### MybatisPlus中的XA事务

mybatis动态数据源，使用@DSTransactional注解

原理

- DynamicLocalTransactionInterceptor 注解拦截器，执行service方法前，给线程分配一个唯一的xid，TransactionContext类中的CONTEXT_HOLDER执行service中的方法，在执行过程中的数据库操作时，先判断当前线程有无xid
  - 如果没有，不是多数据源操作，正常执行
  - 如果有，获取数据库connection，设置自动提交为false，将涉及到的所有connection存在ConnectionFactory类的CONNECTION_HOLDER中
- service执行结束或抛出异常，进入DynamicLocalTransactionInterceptor拦截器，执行commit或rollback方法
  - 获取当前线程的所有数据库connection
  - 循环commit或rollback，然后close连接
  - 从CONNECTION_HOLDER中移除
- 删除xid
