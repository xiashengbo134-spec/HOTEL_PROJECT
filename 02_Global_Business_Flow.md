# 02_Global_Business_Flow (全局业务流转 - 深度开发版)
---
### 🟢 I. 供应侧：从数据抓取到资源上架 (Supply Side Logic)
- **1. 采集触发 (Collection)**: 采集系统根据 [信息中心-平台管理] 配置，定时轮询/监听渠道接口，获取 Raw Hotel/Room 及全量 RP。
- **2. 聚合清洗 (Aggregation)**: 聚合系统匹配映射表 `Mapping_Hotel/Room`。成功则更新 [畅行酒店]；失败则推至 [06_ERP_Manager-匹配管理] 待人工干预。
- **3. 报价计算 (Quotation)**: 报价系统监听价态变更，调用加价公式与指标规则（例：最终售卖价 = (获取价+固定加价)*(1+比例)+附加费）。
- **4. 投放执行 (Injection)**: 投放系统读取 [07_SaaS_Workstation-投放账号] 令牌，执行 OTA (飞猪/抖音) 上架与库存日历同步。
---
### 🔵 II. 需求侧：从订单生成到自动履约 (Demand & Fulfillment Logic)
- **1. 交易流转 (Transaction)**: 买家在 B2B 或 OTA 下单。交易系统创建 `Order_Main`，校验库存合法性。
- **2. 采购触发 (Procurement)**: 订单转为 `Paid` 后，触发采购系统，自动匹配最优“签约公司”作为结算主体。
- **3. 自动下单校验 (Auto-Ordering Pre-check)**: 启动前“三看”：看 [支付客户端] 是否在线，看 [支付宝/VCC] 余额是否覆盖成本，看供应商接口是否响应。
- **4. 执行支付 (Payment Execution)**: 模拟登录/API调用。VCC动态扣额或支付宝代扣，回填 `supplier_order_sn`，交易转为“已出货”。
---
### 🟡 III. 异常处理与逆向流 (Edge Case & After-Sales)
- **1. 下单失败熔断**: 自动下单失败（额度不足/客户端掉线）必须立即挂起采购单为“待人工”，推送高优先级售后任务至 [服务管理]。
- **2. 逆向取消流 (After-Sales)**: 售后系统锁定订单状态。检查上游退改规则：支持自动则触发逆向退款模块；不支持则转人工并更新财务账单。
---
### 🔴 IV. 核心状态转换矩阵 (State Transition Matrix)
- **订单主状态 (Order)**: Draft -> Pending_Pay -> Paid(触发采购) -> Purchasing -> Shipped(已回填采购号) -> Finished(成交)。
- **采购任务状态 (Purchase)**: Waiting(待执行) -> Executing(下单中) -> Success(已支付) -> Fail(异常挂起) -> Manual(人工介入) -> Synced(已同步)。
- **财务账单状态 (Billing)**: Unsettled(未结算) -> Settled(已结算) -> Adjusting(调账中) -> Refunded(已退款)。