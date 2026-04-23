# 07_SaaS_Workstation (SaaS 租户工作站 - 开发上下文)
---
### 🎯 模块定位 (Module Scope)
本目录是各租户隔离经营的作业平台，承载资源的【投放系统】与订单的【采购系统】【自动下单系统】【售后系统】。
---
### 📂 子菜单核心索引 (Local Routing)
- `SaaS_Biz_*` (企业管理): 维护租户自身的成员、签约主体及买家。
- `SaaS_OTA_*` (OTA运营): 处理飞猪/抖音等渠道的具体投放与日历维护。
- `SaaS_Order_*` (订单与采购): 监控正向交易流转及触发采购动作。
- `SaaS_Service_*` (售后管理): 处理退款、取消等逆向工单。
- `SaaS_Pay_*` (支付引擎): **极高危模块！** 管理支付宝、VCC及客户端存活状态。
- `SaaS_Fin_*` (财务中心): 生成账期内的结算与对账单。
---
### 🛑 核心开发约束 (Cursor Rules)
- **强制租户隔离**: 所有的查询与写入操作，必须强制带上 `tenant_id` 过滤，严禁出现跨租户数据泄露。
- **自动下单三看**: 涉及自动采购逻辑时，必须强制校验 `@02_Global_Business_Flow.md` 规定的：在线状态、可用余额、供应商接口。
- **财务防资损**: 一切逆向退款操作，必须先校验资金账户余额与订单实际收款状态。
---
### 🧱 推荐目录规范 (Recommended Structure)
- 一级业务按菜单域拆分，例如：`purchase-order/`
- 二级业务按菜单分组拆分，例如：`order-management/`
- 三级业务按业务对象拆分，例如：`hotel-order/`
- 每个业务对象内部统一使用：
  - `docs/`：设计文档
  - `pages/`：页面原型
  - `api/`：接口草案
  - `mock/`：共享 mock 数据
  - `assets/`：共享图片/图标资源
- 页面目录统一结构：
  - `README.md`
  - `index.html`
  - `mock/`

### 📌 当前已落地模板
- `purchase-order/order-management/hotel-order/`
  - 对应菜单：采购/订单 -> 订单管理 -> 酒店订单
  - 日志页归属：酒店订单列表中单条订单的操作能力，不作为独立菜单入口
- `日志.html`
  - 保留为历史独立原型文件，后续建议逐步迁移至规范目录下的 `pages/log/index.html`

### 📝 命名建议
- 目录统一使用英文短横线：`purchase-order`、`order-management`、`hotel-order`、`log`
- 页面主文件统一使用：`index.html`
- 目录说明统一使用：`README.md`
- 页面设计文档统一使用：`list-page.md`、`detail-page.md`、`log-page.md`
- mock 数据统一使用：`list-data.json`、`detail-data.json`、`log-data.json`

### 🚦维护建议
- 优先维护规范目录内的文件，逐步减少零散 HTML 原型
- 列表、详情、日志等页面共享字段说明时，统一沉淀到 `docs/overview.md` 或 `api/*.md`
- 若后续接入前端工程，可直接以 `pages/` 下目录为原型来源进行组件化改造