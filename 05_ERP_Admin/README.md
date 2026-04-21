# ERP_Admin (NestJS)

基于 Node.js + NestJS + TypeORM(SQLite) 的 ERP 超级管理后台实现，覆盖以下模块：

- `Admin_Auth`: IDaaS 登录与会话签发
- `Admin_Dict`: 全局字典管理
- `Admin_App`: 应用管理
- `Admin_User`: 全量用户池管理
- `Admin_Tenant`: 租户配置管理（严格遵守 `Tenant_Config` 约束）

## 关键约束落实

- `Tenant_Config` 使用唯一 `tenant_id` + 索引
- `app_permission_mask` 使用 `bigint` 持久化（服务层按字符串处理，避免 JS 精度问题）
- 全业务实体均含 `tenant_id`（用户池为全局池场景，允许为空）
- 每张表包含审计字段：`created_at`、`updated_at`、`operator_id`、`is_deleted`
- 删除接口全部为软删除，不做物理删除

## 启动

```bash
npm install
npm run start:dev
```

## 一键启动前后端

在 `05_ERP_Admin` 根目录执行：

```bash
npm install
npm run dev:all
```

- 后端地址：`http://localhost:3000`
- 前端地址：`http://localhost:5173`
# 05_ERP_Admin (超级管理后台 - 开发上下文)
---
### 🎯 模块定位 (Module Scope)
本目录承载全系统的“基座管控”功能，是全量权限与租户生命的源头。对应的系统核心角色为 `@01_Glossary_&_Roles.md` 中的【系统管理员】与【运维审计】。
---
### 📂 子菜单索引 (Local Routing)
- `Admin_Auth` (IDaaS登录): 处理全局认证与 Token 签发。
- `Admin_Dict` (字典管理): 全局枚举值（如：订单状态、证件类型）的配置中心。
- `Admin_App` (应用管理): 划分业务物理边界（定义 06/07/08 模块的存在性）。
- `Admin_User` (用户管理): 维护全量基础用户池。
- `Admin_Tenant` (租户管理): 初始化 SaaS 空间及底层授权。
---
### 🛑 核心开发约束 (Cursor Rules)
- **IDaaS 优先**: 所有的新增用户必须首先在 `Admin_User` 中落库生成全局唯一 UID。
- **全局拦截**: 本模块提供的 API 必须拥有最高级别的安全校验，严禁普通租户越权访问。