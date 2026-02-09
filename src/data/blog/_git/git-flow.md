---
author: lavie
pubDatetime: 2026-02-09T08:44:21Z
modDatetime: 
title: Gitflow 工作流与版本管理指南
featured: false
draft: false
tags:
  - git
description: Gitflow 是一种基于 Git 分支模型的严格工作流框架，特别适合具有固定发布周期的大型项目管理。它通过定义不同分支的职责和交互规则，让版本控制变得井然有序。
---

在团队协作开发中，**如何管理分支、控制发布节奏、降低合并风险**是非常核心的问题。
Git Flow 是一种经典且体系化的 Git 分支管理模型，尤其适用于 **有明确版本发布周期** 的项目。

本文将系统讲清：
* Git Flow 的设计思想
* 各分支职责
* 完整开发流程
* 实战命令示例

---

## 1. 分支详解：来源、去向与职责

Gitflow 模型中主要包含五类分支，分为“长期分支”和“临时分支”。

| 分支类型 | 分支名称规范 | 来源 | 合并去向 | 核心作用与生命周期 |
| :--- | :--- | :--- | :--- | :--- |
| **Master / Main** | `master` 或 `main` | - | - | **生产分支**。存放随时可部署的稳定代码。所有提交都必须打上版本 Tag。 |
| **Develop** | `develop` | Master | - | **集成分支**。包含下个版本的所有代码。是开发的主干线。 |
| **Feature** | `feature/*` | Develop | Develop | **功能分支**。用于开发新功能。开发完成后合并回 Develop 并删除。 |
| **Release** | `release/*` | Develop | Master **和** Develop | **发布分支**。进行发布前的测试、文档更新和 Bug 修复。严禁添加新功能。 |
| **Hotfix** | `hotfix/*` | Master | Master **和** Develop | **修复分支**。用于修复线上紧急 Bug。是唯一能直接从 Master 派生的分支。 |

> **注意**：
> * **Master 和 Develop** 是长期存在的，不会被删除。
> * **Feature, Release, Hotfix** 是临时的，任务完成后即被删除。
> * 只有**Hotfix**允许直接从Master分支拉取。

---

## 2. Gitflow 标准执行流程

### 初始化 (Initialization)
项目开始时，需构建基础结构。
* **命令**: `git flow init`
* **作用**: 
    * 约定分支前缀（feature/release/hotfix）
    * 自动创建 `develop` 分支并切换过去
    * 统一团队规范


### 新功能开发 (Feature)
* **开始**: `git flow feature start <name>` (基于 Develop 创建分支)。
* **开发**: 提交代码，不影响主干。
* **结束**: `git flow feature finish <name>` (合并回 Develop，删除 Feature 分支)。
* **建议**
    * 一个Feature对应一个明确需求，避免“巨型Feature分支”
    * 功能周期不宜过长（≤ 1~2 周）

### 版本发布 (Release)
当 Develop 分支积累了足够功能，准备发布新版。
* **开始**: `git flow release start <version>` (基于 Develop 创建，**冻结新功能**)。
* **工作**: 更新版本号，修复测试 Bug，更新文档。
* **结束**: `git flow release finish <version>`
    * 自动合并到 **Master** (并打 Tag)。
    * 自动合并到 **Develop**。
    * 删除 **Release** 分支。

Release 分支中 **只允许**：
* 修复Bug 
* 文案调整
* 修改配置
* 更新版本号

**禁止事项**
* 新功能
* 重构
* 技术升级

### 紧急修复 (Hotfix)
线上 Master 版本出现严重 Bug。
*   **开始**: `git flow hotfix start <version>` (直接基于 **Master** 创建)。
*   **工作**: 修复 Bug，更新版本号。
*   **结束**: `git flow hotfix finish <version>`。
    *   合并回 **Master** (并打 Tag)。
    *   合并回 **Develop** (确保下个版本也有此修复)。

> **强制规则**：Hotfix 必须同时合并回 Develop，否则下个版本一定复现 Bug

---

## 3. 版本号规范 (XYZ 的含义)

当代码合并到 `Master` 时，Gitflow 会自动打上 Tag（标签）。该标签应遵循 **语义化版本 (Semantic Versioning)** 规范，格式为 **X.Y.Z**。

| 组成部分 | 代号 | 含义 | 递增规则 | 示例场景 |
| :--- | :--- | :--- | :--- | :--- |
| **主版本号** | **X** (Major) | 重大架构变更 | **不兼容**的 API 修改 | 重构核心架构，升级后旧代码无法运行 (1.0.0 -> 2.0.0)。 |
| **次版本号** | **Y** (Minor) | 新功能发布 | **向下兼容**的功能性新增 | 增加了一个新的登录方式，旧功能不受影响 (1.1.0 -> 1.2.0)。 |
| **修订号** | **Z** (Patch) | Bug 修复 | **向下兼容**的问题修正 | 修复了登录页面的一个排版错误 (1.2.0 -> 1.2.1)。 |

> **Gitflow 中的应用**：
> *   `git flow release start 1.2.0` -> 对应次版本号递增 (Y)。
> *   `git flow hotfix start 1.2.1` -> 对应修订号递增 (Z)。

---

## 4. 总结

Gitflow 不仅仅是一组命令，更是一种**约定**。它通过严格的分支隔离：
1.  保证了 **Master** 永远是干净、稳定的发布版。
2.  保证了 **Develop** 作为持续集成的缓冲地带。
3.  确保了 **Hotfix** 能够快速修复线上问题且不丢失代码。