---
author: lavie
pubDatetime: 2025-07-28T08:25:54Z
modDatetime: 
title: Java树形工具类TreeUtil
featured: false
draft: false
private: false
tags:
  - java
description: 构造树形结构的工具类，还包含一些常见的方法。
---

 TreeUtil中封装了`makeTree`方法，方便快速构造树形结构。同时还提供了过滤、查询、广度优先遍历、深度优先遍历、扁平化树形结构、查询路径等一系列常见的方法。

## Table of contents

## 1.代码
``` java
/**
 * @author yeweiwei
 * @version 1.0
 * @date 2024/12/3
 **/
public class TreeUtil {
    /**
     * 构建树结构
     *
     * @param list           需要合成树的List
     * @param pId            对象中的父ID字段,如:Menu:getPid
     * @param id             对象中的id字段 ,如：Menu:getId
     * @param rootCheck      判断E中为根节点的条件，如：x->x.getPId()==-1L, x->x.getParentId()==null, x->x.getParentMenuId()==0
     * @param setSubChildren E中设置下级数据方法，如：Menu::setSubMenus
     * @param <T>            ID字段类型
     * @param <E>            泛型实体对象
     * @return List<E> 树形结构集合
     */
    public static <T, E> List<E> makeTree(List<E> list,
                                          Function<E, T> pId,
                                          Function<E, T> id,
                                          Predicate<E> rootCheck,
                                          BiConsumer<E, List<E>> setSubChildren) {

        Map<T, List<E>> parentMap = list.stream().collect(Collectors.groupingBy(pId));
        List<E> result = new ArrayList<>();

        for (E node : list) {
            T nodeId = id.apply(node);
            List<E> children = parentMap.get(nodeId);
            if (children != null) {
                setSubChildren.accept(node, children);
            }
            if (rootCheck.test(node)) {
                result.add(node);
            }
        }

        return result;
    }

    /**
     * 树中过滤
     *
     * @param tree        需要过滤的树
     * @param predicate   过滤条件
     * @param getChildren 获取下级数据方法，如：MenuVo::getSubMenus
     * @param <E>         泛型实体对象
     * @return List<E> 过滤后的树
     */
    public static <E> List<E> filter(List<E> tree, Predicate<E> predicate, Function<E, List<E>> getChildren) {
        return tree.stream().filter(item -> {
            if (predicate.test(item)) {
                List<E> children = getChildren.apply(item);
                if (children != null && !children.isEmpty()) {
                    filter(children, predicate, getChildren);
                }
                return true;
            }
            return false;
        }).collect(Collectors.toList());
    }


    /**
     * 树中搜索
     *
     * @param tree           需要搜索的树
     * @param predicate      搜索条件
     * @param getSubChildren 获取下级数据方法，如：MenuVo::getSubMenus
     * @param <E>            泛型实体对象
     * @return 返回搜索到的节点及其父级到根节点
     */
    public static <E> List<E> search(List<E> tree, Predicate<E> predicate, Function<E, List<E>> getSubChildren) {
        Iterator<E> iterator = tree.iterator();
        while (iterator.hasNext()) {
            E item = iterator.next();
            List<E> childList = getSubChildren.apply(item);
            if (childList != null && !childList.isEmpty()) {
                search(childList, predicate, getSubChildren);
            }
            if (!predicate.test(item) && (childList == null || childList.isEmpty())) {
                iterator.remove();
            }
        }
        return tree;
    }

    /**
     * 深度优先遍历（DFS）
     */
    public static <E> void dfs(List<E> tree, Consumer<E> consumer, Function<E, List<E>> getChildren) {
        for (E node : tree) {
            consumer.accept(node);
            List<E> children = getChildren.apply(node);
            if (children != null && !children.isEmpty()) {
                dfs(children, consumer, getChildren);
            }
        }
    }

    /**
     * 广度优先遍历（BFS）
     */
    public static <E> void bfs(List<E> tree, Consumer<E> consumer, Function<E, List<E>> getChildren) {
        Queue<E> queue = new LinkedList<>(tree);
        while (!queue.isEmpty()) {
            E node = queue.poll();
            consumer.accept(node);
            List<E> children = getChildren.apply(node);
            if (children != null && !children.isEmpty()) {
                queue.addAll(children);
            }
        }
    }

    /**
     * 扁平化树结构
     */
    public static <E> List<E> flatten(List<E> tree, Function<E, List<E>> getChildren) {
        List<E> flatList = new ArrayList<>();
        dfs(tree, flatList::add, getChildren);
        return flatList;
    }

    /**
     * 查找所有叶子节点
     */
    public static <E> List<E> findLeafNodes(List<E> tree, Function<E, List<E>> getChildren) {
        List<E> leaves = new ArrayList<>();
        dfs(tree, node -> {
            List<E> children = getChildren.apply(node);
            if (children == null || children.isEmpty()) {
                leaves.add(node);
            }
        }, getChildren);
        return leaves;
    }

    /**
     * 根据ID查找节点
     */
    public static <T, E> E findById(List<E> tree, T targetId,
                                    Function<E, T> id,
                                    Function<E, List<E>> getChildren) {
        for (E node : tree) {
            if (Objects.equals(id.apply(node), targetId)) {
                return node;
            }
            List<E> children = getChildren.apply(node);
            if (children != null) {
                E result = findById(children, targetId, id, getChildren);
                if (result != null) return result;
            }
        }
        return null;
    }

    /**
     * 找到从子节点到根节点的路径
     */
    public static <T, E> List<E> findPathToRoot(List<E> tree, T targetId,
                                                Function<E, T> id,
                                                Function<E, List<E>> getChildren) {
        for (E node : tree) {
            if (Objects.equals(id.apply(node), targetId)) {
                List<E> path = new ArrayList<>();
                path.add(node);
                return path;
            }
            List<E> children = getChildren.apply(node);
            if (children != null) {
                List<E> childPath = findPathToRoot(children, targetId, id, getChildren);
                if (childPath != null) {
                    childPath.add(0, node);
                    return childPath;
                }
            }
        }
        return null;
    }

    /**
     * 深拷贝对象（需要你实现或使用BeanUtils、MapStruct等工具）
     */
    public static <E> E deepCopy(E source) {
        if (source == null) return null;
        try {
            @SuppressWarnings("unchecked")
            E target = (E) source.getClass().getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(source, target);
            return target;
        } catch (Exception e) {
            throw new RuntimeException("Deep copy failed", e);
        }
    }
}

```

## 2.使用示例

假设你有一个 `Menu` 类：

``` java
public class Menu {
    private Long id;
    private Long parentId;
    private String name;
    private List<Menu> children;

    // getter/setter
}
```

使用示例如下

``` java
// 构造树形结构
List<Menu> tree = TreeUtil.makeTree(menuList,
        Menu::getParentId,
        Menu::getId,
        menu -> menu.getParentId() == 0,
        Menu::setChildren);

// 扁平过滤所有包含“用户”关键词的菜单
List<Menu> flatResult = TreeUtil.filter(tree, m -> m.getName().contains("用户"), Menu::getChildren);

// 搜索并保留树结构
List<Menu> searchResult = TreeUtil.search(tree,
        m -> m.getName().contains("用户"),
        Menu::getChildren,
        Menu::setChildren);

// DFS
List<Menu> dfsList = new ArrayList<>();
TreeUtil.dfs(tree, dfsList::add, Menu::getChildren); 

// BFS 
List<Menu> bfsList = new ArrayList<>();
TreeUtil.dfs(tree, bfsList::add, Menu::getChildren); 

// 扁平化树形结构
List<Menu> flatList = TreeUtil.flatten(tree, Menu::getChildren);

// 查询所有叶子节点
List<Menu> leaves = TreeUtil.flatten(tree, Menu::getChildren);

// 查找ID=1的节点
Menu targetNode = TreeUtil.findById(tree, 1L, Menu::getId, Menu::getChildren);

// 找到ID=1000的子节点到根节点的路径
List<Menu> pathToRoot = TreeUtil.findPathToRoot(tree, 1000L, Menu::getId, Menu::getChildren);

```