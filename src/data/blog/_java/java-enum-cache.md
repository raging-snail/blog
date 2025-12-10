---
author: lavie
pubDatetime: 2025-01-10T05:24:31Z
modDatetime: 2025-02-25T06:43:38Z
title: Java中使用枚举缓存
featured: true
draft: false
private: false
tags:
  - java
description: 使用枚举缓存减少代码冗余，提高执行效率。
---

 枚举是一个系统中的基础部分，在项目中随处可见，其中大部分枚举类中都包含findByName、findByValue之类的用法，通过遍历枚举，去寻找与参数匹配的枚举值，这种做法导致大量冗余代码，并且当枚举内的实例数越多时性能越差。本文通过将枚举类注册到缓存中来消除这部分冗余代码，并且去掉缓存查询时的for循环。

## Table of contents

##  1.原始写法
```java
/**
 * @author lavie
 * @version 1.0
 * @date 2025/1/10
 **/
@Getter
@AllArgsConstructor
public enum EnumTaskState {
    INIT(1, "初始化"),
    PROCESSING(2, "处理中"),
    SUCCESS(3, "成功"),
    FAIL(4, "失败");
    ;

    private final Integer value;
    private final String name;

    /**
     * 根据枚举代码获取枚举
     *
     */
    public static EnumTaskState getByCode(Integer value){
        if (null == value) {
            return null;
        }
        for (EnumTaskState v : values()) {
            if (Objects.equals(v.getValue(), value)) {
                return v;
            }
        }
        return null;
    }

    /**
     * 根据枚举名称获取枚举
     * 当枚举内的实例数越多时性能越差
     */
    public static EnumTaskState getByName(String name){
        if (Strings.isNullOrEmpty(name)) {
            return null;
        }
        for (EnumTaskState v : values()) {
            if (v.name().equals(name)) {
                return v;
            }
        }
        return null;
    }

}

```

## 2.枚举缓存

### 2.1 源码
```java
/**
 * @author lavie
 * @version 1.0
 * @date 2024/7/22
 **/
public class EnumCache {

    /**
     * 以枚举任意值构建的缓存结构
     */
    static final Map<Class<? extends Enum>, Map<Object, Enum>> CACHE_BY_VALUE = new ConcurrentHashMap<>();

    /**
     * 以枚举名称构建的缓存结构
     */
    static final Map<Class<? extends Enum>, Map<Object, Enum>> CACHE_BY_NAME = new ConcurrentHashMap<>();

    /**
     * 枚举静态块加载标识缓存结构
     */
    static final Map<Class<? extends Enum>, Boolean> LOADED = new ConcurrentHashMap<>();


    /**
     * 以枚举名称构建缓存，在枚举的静态块里面调用
     *
     * @param clazz       枚举类
     * @param es          枚举集合
     * @param enumMapping 获取name的function
     * @author lavie
     * @date 2024/7/22 下午3:06
     */
    public static <E extends Enum> void registerByName(Class<E> clazz, E[] es, EnumMapping<E> enumMapping) {
        if (CACHE_BY_NAME.containsKey(clazz)) {
            throw new RuntimeException(String.format("枚举%s已经构建过name缓存,不允许重复构建", clazz.getSimpleName()));
        }
        Map<Object, Enum> map = new ConcurrentHashMap<>();
        for (E e : es) {
            Object value = enumMapping.value(e);
            if (map.containsKey(value)) {
                throw new RuntimeException(String.format("枚举%s存在相同的名称%s映射同一个枚举%s.%s", clazz.getSimpleName(), value, clazz.getSimpleName(), e));
            }
            map.put(value, e);
        }
        CACHE_BY_NAME.put(clazz, map);
    }

    /**
     * 以枚举转换出的任意值构建缓存，在枚举的静态块里面调用
     *
     * @param clazz       枚举类
     * @param es          枚举集合
     * @param enumMapping 获取value的function
     * @author lavie
     * @date 2024/7/22 下午3:07
     */
    public static <E extends Enum> void registerByValue(Class<E> clazz, E[] es, EnumMapping<E> enumMapping) {
        if (CACHE_BY_VALUE.containsKey(clazz)) {
            throw new RuntimeException(String.format("枚举%s已经构建过value缓存,不允许重复构建", clazz.getSimpleName()));
        }
        Map<Object, Enum> map = new ConcurrentHashMap<>();
        for (E e : es) {
            Object value = enumMapping.value(e);
            if (map.containsKey(value)) {
                throw new RuntimeException(String.format("枚举%s存在相同的值%s映射同一个枚举%s.%s", clazz.getSimpleName(), value, clazz.getSimpleName(), e));
            }
            map.put(value, e);
        }
        CACHE_BY_VALUE.put(clazz, map);
    }

    /**
     * 从以枚举名称构建的缓存中通过枚举名获取枚举
     *
     * @param clazz 枚举类
     * @param name  名称
     * @return 枚举
     * @author lavie
     * @date 2024/8/2 下午2:58
     */
    public static <E extends Enum> E findByName(Class<E> clazz, String name) {
        if (Strings.isNullOrEmpty(name)) {
            throw new CustomException(Vm.ERROR_PARAMS);
        }
        Map<Object, Enum> map = findEnumMap(clazz, CACHE_BY_NAME);
        if (map.containsKey(name)) {
            return (E) map.get(name);
        }
        throw new CustomException(String.format("枚举%s中不存在对应的名称 : %s", clazz.getSimpleName(), name));
    }

    /**
     * 从以枚举名称构建的缓存中通过枚举名获取枚举
     *
     * @param clazz       枚举类
     * @param name        名称
     * @param defaultEnum 返回的默认值
     * @return 枚举
     * @author lavie
     * @date 2024/7/22 下午3:07
     */
    public static <E extends Enum> E findByName(Class<E> clazz, String name, E defaultEnum) {
        Map<Object, Enum> map = findEnumMap(clazz, CACHE_BY_VALUE);
        if (Strings.isNullOrEmpty(name)) {
            return defaultEnum;
        }
        return (E) map.getOrDefault(name, defaultEnum);
    }

    /**
     * 从以枚举转换值构建的缓存中通过枚举转换值获取枚举
     *
     * @param clazz 枚举类
     * @param value 值
     * @return 枚举
     * @author lavie
     * @date 2024/8/2 下午2:58
     */
    public static <E extends Enum> E findByValue(Class<E> clazz, Object value) {
        if (value == null) {
            throw new CustomException(Vm.ERROR_PARAMS);
        }
        Map<Object, Enum> map = findEnumMap(clazz, CACHE_BY_VALUE);
        if (map.containsKey(value)) {
            return (E) map.get(value);
        }
        throw new CustomException(String.format("枚举%s中不存在对应的值 : %s", clazz.getSimpleName(), ConvertUtil.objToStr(value)));
    }

    /**
     * 从以枚举转换值构建的缓存中通过枚举转换值获取枚举
     *
     * @param clazz       枚举类
     * @param value       值
     * @param defaultEnum 返回的默认值
     * @return 枚举
     * @author lavie
     * @date 2024/7/22 下午3:08
     */
    public static <E extends Enum> E findByValue(Class<E> clazz, Object value, E defaultEnum) {
        Map<Object, Enum> map = findEnumMap(clazz, CACHE_BY_VALUE);
        if (value == null) {
            return defaultEnum;
        }
        return (E) map.getOrDefault(value, defaultEnum);
    }

    private static <E extends Enum> Map<Object, Enum> findEnumMap(Class<E> clazz, Map<Class<? extends Enum>, Map<Object, Enum>> cache) {
        Map<Object, Enum> map;
        if ((map = cache.get(clazz)) == null) {
            // 触发枚举静态块执行
            executeEnumStatic(clazz);
            // 执行枚举静态块后重新获取缓存
            map = cache.get(clazz);
        }
        // 还是null说明没有static代码块或者代码块中没有添加注册的方法
        if (map == null) {
            String msg = null;
            if (cache == CACHE_BY_NAME) {
                msg = String.format(
                        "枚举%s还没有注册到枚举缓存中，请在%s.static代码块中加入如下代码 : EnumCache.registerByName(%s.class, %s.values());",
                        clazz.getSimpleName(),
                        clazz.getSimpleName(),
                        clazz.getSimpleName(),
                        clazz.getSimpleName()
                );
            }
            if (cache == CACHE_BY_VALUE) {
                msg = String.format(
                        "枚举%s还没有注册到枚举缓存中，请在%s.static代码块中加入如下代码 : EnumCache.registerByValue(%s.class, %s.values(), %s::getXxx);",
                        clazz.getSimpleName(),
                        clazz.getSimpleName(),
                        clazz.getSimpleName(),
                        clazz.getSimpleName(),
                        clazz.getSimpleName()
                );
            }
            throw new RuntimeException(msg);
        }
        return map;
    }

    /**
     * 执行静态代码块，将枚举注册到缓存中
     *
     * @param clazz 枚举类
     * @author lavie
     * @date 2024/7/22 下午3:08
     */
    private static <E extends Enum> void executeEnumStatic(Class<E> clazz) {
        if (!LOADED.containsKey(clazz)) {
            synchronized (clazz) {
                if (!LOADED.containsKey(clazz)) {
                    try {
                        // 目的是让枚举类的static块运行，static块没有执行完是会阻塞在此的
                        Class.forName(clazz.getName());
                        LOADED.put(clazz, true);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    /**
     * 枚举缓存映射器函数式接口
     */
    @FunctionalInterface
    public interface EnumMapping<E extends Enum> {
        /**
         * 自定义映射器
         *
         * @param e 枚举
         * @return 映射关系，最终体现到缓存中
         */
        Object value(E e);
    }
}

```

### 2.2 使用方法
```java
/**
 * @author lavie
 * @version 1.0
 * @date 2025/1/10
 **/
@Getter
@AllArgsConstructor
public enum EnumTaskState {
    INIT(1, "初始化"),
    PROCESSING(2, "处理中"),
    SUCCESS(3, "成功"),
    FAIL(4, "失败");

    private final Integer value;
    private final String name;

    static {
        EnumCache.registerByName(EnumTaskState.class, EnumTaskState.values(),EnumTaskState::getName);
        EnumCache.registerByValue(EnumTaskState.class, EnumTaskState.values(),EnumTaskState::getValue);
    }

}
```

### 2.3 源码解读

缓存注册时机
+ 第一次引用此枚举类的任何枚举常量
+ 第一次调用此枚举类的任意静态方法时
+ 第一次使用Class.forName时

按照EnumTaskState类创建枚举，那么在应用系统启动的过程中EnumTaskState的static块可能从未执行过，则枚举缓存注册失败，所以需要考虑延迟注册，代码如下：
```java
private static <E extends Enum> void executeEnumStatic(Class<E> clazz) {
        if (!LOADED.containsKey(clazz)) {
            synchronized (clazz) {
                if (!LOADED.containsKey(clazz)) {
                    try {
                        // 目的是让枚举类的static块运行，static块没有执行完是会阻塞在此的
                        Class.forName(clazz.getName());
                        LOADED.put(clazz, true);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

```

Class.forName(clazz.getName())被执行的两个必备条件：
+ 缓存中没有枚举class的键，也就是说没有执行过枚举向缓存注册的调用，见EnumCache.find方法对executeEnumStatic方法的调用；
+ executeEnumStatic中的LOADED.put(clazz, true);还没有被执行过，也就是Class.forName(clazz.getName());没有被执行过；


我们看到executeEnumStatic中用到了双重检查锁，所以分析一下正常情况下代码执行情况和性能：
1. 当静态块还未执行时，大量的并发执行find查询。
   + 此时executeEnumStatic中synchronized会阻塞其他线程；
   + 第一个拿到锁的线程会执行Class.forName(clazz.getName());同时触发枚举静态块的同步执行；
   + 之后其他线程会逐一拿到锁，第二次检查会不成立跳出executeEnumStatic；
2. 当静态块已经执行，且静态块里面正常执行了缓存注册，大量的并发执行find查询。
   + executeEnumStatic方法不会调用，没有synchronized引发的排队问题；
3. 当静态块已经执行，但是静态块里面没有调用缓存注册，大量的并发执行find查询。
   + find方法会调用executeEnumStatic方法，但是executeEnumStatic的第一次检查通不过；
   + find方法会提示异常需要在静态块中添加注册缓存的代码；

总结：第一种场景下会有短暂的串行，但是这种内存计算短暂串行相比应用系统的业务逻辑执行是微不足道的，也就是说这种短暂的串行不会成为系统的性能瓶颈

> https://mp.weixin.qq.com/s/CLr5bcxsG7C8v6qSsagEbw
