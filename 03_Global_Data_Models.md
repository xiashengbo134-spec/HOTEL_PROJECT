# 03_Global_Data_Models (业务实体与核心字段定义 - 开发确认版)
---
### 🟢 I. 供应链核心实体 (Supply Side Entities)
- **Standard_Hotel (畅行酒店主表)**: 主键 `hotel_id`，关联 `city_code`，核心字段 `mapping_json` (存储渠道映射关系)，状态 `audit_status`。
- **Rate_Plan (RP/价格计划实体)**: 关联酒店房型，核心字段 `meal_type` (含早)、`cancel_policy` (取消规则)、`payment_type` (预付/现付)。
- **Price_Snapshot (报价快照)**: 存储实时售卖价。核心字段 `cost_price` (获取价)、`sale_price` (售卖价，单位：分)、`markup_rule_id`。
---
### 🔵 II. 交易与履约实体 (Transaction & Fulfillment Entities)
- **Order_Main (交易主单)**: 唯一单号 `order_sn`，关联 `tenant_id` 与 `buyer_id`。核心状态机 `main_status`。
- **Purchase_Order (采购单)**: 唯一单号 `purchase_sn`，关联 `order_sn`。核心字段 `supplier_id`、`signing_company_id`、`purchase_cost`。
- **Payment_Context (自动下单上下文)**: 关联 `pay_client_id` 与 `vcc_card_id`/`alipay_acc_id`。记录自动化脚本执行流水号。
---
### 🟡 III. 财务与权限实体 (Finance & Auth Entities)
- **Tenant_Config (租户配置)**: 唯一标识 `tenant_id`，关联[应用管理]分发的 `app_permission_mask` (权限掩码)。
- **Finance_Balance (资金账户)**: 关联签约公司/买家。核心字段 `available_amount` (可用分)、`frozen_amount` (冻结分)、`credit_limit` (授信额度)。
---
### 🔴 IV. 数据库设计约束 (DB Constraints - 需开发核对)
- **1. 租户隔离**: 所有业务表（订单、采购、配置、报价）必须包含 `tenant_id` 字段并建立索引。
- **2. 精度规范**: 凡涉及金额（成本、售价、余额、额度），数据库一律使用 `BigInt` 存储**分(Cent)**，严禁使用 Float。
- **3. 审计字段**: 每张表包含 `created_at`、`updated_at` (UTC时间戳) 及 `operator_id` (最后操作人UID)。
- **4. 软删除**: 默认使用 `is_deleted` (TinyInt) 进行逻辑删除，严禁物理删除生产数据。