# 酒店订单字段说明

## 文档目的

本文件用于根据当前页面原型梳理列表页、详情页、日志页涉及的核心字段，统一字段名称、业务含义与展示口径。

本次已按当前页面修正以下重点：

- 列表页状态区为四段式：系统 / 平台 / 采购 / 售后
- 列表页已兼容钟点房字段
- 详情页主 `index.html` 以总览页结构为主，不再按旧版左右三段式拆解
- 日志页头部已是多芯片摘要，不再是简单标题栏
- 日志页已支持“只看订单 / 只看采购单”范围切换

---

## 一、通用字段

| 字段名称 | 建议字段 key | 说明 |
| --- | --- | --- |
| 系统订单号 | `orderNo` | 系统内部订单号 |
| 外部订单号 | `outerOrderNo` | 平台侧订单号 |
| 订单来源 | `orderSource` | 平台 + 店铺/账号组合 |
| 酒店名称 | `hotelName` | 酒店展示名称 |
| 酒店聚合 ID | `hotelAggregateId` | 酒店统一识别 ID |
| 房型名称 | `roomName` | 房型展示名称 |
| 房型聚合 ID | `roomAggregateId` | 房型统一识别 ID |
| 早餐信息 | `breakfast` | 如双早、无早 |
| 入住人 | `guestName` | 主入住人 |
| 联系人 | `contactName` | 联系人姓名 |
| 联系电话 | `contactMobile` | 联系人电话 |
| 入住日期 | `checkInDate` | 入住日期 |
| 离店日期 | `checkOutDate` | 离店日期 |
| 房间数 | `roomCount` | 房间数量 |
| 间夜数 | `nightCount` | 晚数 |
| 取消规则 | `cancelRule` | 订单取消政策 |

---

## 二、列表页字段定义

## 1. 查询条件区字段

| 字段名称 | 建议字段 key | 当前页面规则 |
| --- | --- | --- |
| 系统订单号 | `orderNo` | 独立输入框 |
| 外部订单号 | `outerOrderNo` | 独立输入框 |
| 入住人/联系人 | `guestKeyword` | 聚合搜索，建议覆盖姓名/手机号 |
| 酒店名称/ID | `hotelKeyword` | 聚合搜索，建议覆盖名称与酒店相关 ID |
| 时间类型 | `timeType` | 当前值：`bookingTime` / `checkInDate` / `checkOutDate` |
| 开始日期 | `startDate` | 与时间类型组合 |
| 结束日期 | `endDate` | 与时间类型组合 |
| 订单来源 | `source` | 当前为单选下拉 |
| 平台订单状态 | `platformStatus` | 当前为单选下拉 |
| 当前 Tab | `bizStatus` | 对应待处理/售后中等业务视图 |

说明：

- 旧文档中的 `city` 当前页面状态对象中仍保留，但筛选区未直接呈现
- 文档以当前已展示控件为准

## 2. 列表卡片字段

### 2.1 订单标识区

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 外部订单号 | `outerOrderNo` | 主展示，带复制 |
| 系统订单号 | `orderNo` | 主展示，带复制 |
| 渠道简称 | `channelText` | 如抖音、飞猪 |
| 渠道样式 | `channelClass` | 控制渠道色块 |
| 订单来源 | `source` | 与渠道标识同组展示 |

### 2.2 酒店与入住区

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 酒店名称 | `hotelName` | 支持超长省略与 tooltip |
| 酒店地址 | `hotelAddress` | 正文展示 |
| 城市 | `city` | 与地址组合展示 |
| 酒店 ID 提示 | `hotelIdTooltip` | 通过 ID tooltip 查看 |
| 房型名称 | `roomName` | 与早餐组合展示 |
| 早餐信息 | `breakfast` | 与房型拼接展示 |
| 入住人 | `guestName` | 正文展示 |
| 联系人 | `contactName` | 正文展示 |
| 联系电话 | `contactMobile` | 与联系人拼接 |
| 入住日期 | `checkInDate` | 正文展示 |
| 离店日期 | `checkOutDate` | 正文展示 |
| 房间数 | `roomCount` | 正文展示 |
| 晚数 | `nightCount` | 正文展示 |
| 取消规则 | `cancelRule` | 通过标签 tooltip 展示 |

### 2.3 钟点房补充字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 是否钟点房 | `isHourlyRoom` | 为 `true` 时展示钟点房标签 |
| 入住时长 | `stayDuration` | 钟点房场景展示 |
| 已选时段 | `selectedTimeRange` | 钟点房场景展示 |

### 2.4 金额区字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 支付金额 | `payAmount` | 卡片主展示 |
| 结算金额 | `settlementAmount` | 卡片主展示 |
| 售卖模式 | `saleMode` | badge 展示 |
| 金额提示 | `amountTooltip` | tooltip 中补充佣金、退款、罚金等 |

### 2.5 状态区字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 业务状态 | `bizStatus` | 决定 Tab 归类 |
| 系统状态 | `systemStatus` | `{ label, text, type }` |
| 平台状态 | `platformStatus` | `{ label, text, type }` |
| 采购状态 | `purchaseTaskStatus` | `{ label, text, type }` |
| 售后状态 | `afterSaleStatus` | `{ label, text, type }` |
| 售后补充标签 | `afterSaleTags` | 如协商退款、已同意 |

### 2.6 时间与 SLA 字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 预订时间 | `bookingTime` | 卡片底部摘要 |
| 支付时间 | `payTime` | 卡片底部摘要 |
| 取消时间 | `cancelTime` | 卡片底部摘要 |
| SLA 启用标识 | `sla.enabled` | 仅待处理单启用 |
| SLA 截止时间 | `sla.deadline` | 前端倒计时依据 |
| SLA 等级 | `slaLevel` | 当前由前端根据 deadline 计算 |

### 2.7 操作字段

| 操作名称 | 建议字段 key | 当前规则 |
| --- | --- | --- |
| 接单 | `actionAccept` | 待处理可见 |
| 拒单 | `actionReject` | 待处理可见 |
| 订单详情 | `actionDetail` | 全局可见 |
| 日志 | `actionLog` | 全局可见 |
| 导出 | `actionExport` | 全局工具区 |
| 导出记录 | `actionExportRecord` | 全局工具区 |

---

## 三、详情页字段定义

当前详情能力建议拆成两个视角维护：

1. 主页面版 `pages/detail/index.html`
2. 抽屉版 `pages/detail/side-drawer.html`

## 1. 主页面版 index.html 字段

### 1.1 总览卡片字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 渠道 | `channelText` | 头部 badge |
| 酒店名称 | `hotelName` | 总览主标题 |
| 房型名称 | `roomName` | 总览主标题 |
| 早餐信息 | `breakfast` | 标签展示 |
| 售卖模式 | `saleMode` | 标签展示 |
| 订单来源 | `source` | 标签展示 |
| 系统订单号 | `orderNo` | 支持复制 |
| 外部订单号 | `outerOrderNo` | 支持复制 |
| 系统状态 | `systemStatus` | 标签展示 |
| 平台状态 | `platformStatus` | 标签展示 |
| 售后状态 | `afterSaleStatus` | 标签展示 |
| 采购结论 | `purchaseConclusion` | 标签 + 失败原因入口 |
| 预订时间 | `bookingTime` | 元信息卡片 |
| 支付时间 | `payTime` | 元信息卡片 |
| 入住摘要 | `staySummary` | 入住 / 离店 / 房晚信息 |
| 处理结果摘要 | `handlingSummary` | 元信息卡片 |
| SLA 剩余时间 | `slaDeadline` | 倒计时展示 |
| 风险提示 | `riskText` | 风险卡片 |
| 快捷提示 | `quickHint` | 辅助说明卡片 |

### 1.2 订单与入住信息字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 酒店名称 | `hotelName` | 支持 ID tooltip |
| 酒店地址 | `hotelAddress` | 正文展示 |
| 房型 / 早餐 | `roomName` / `breakfast` | 正文展示 |
| 取消规则 | `cancelRule` | 正文展示 |
| 入住人 | `guestName` | 正文展示 |
| 联系人 | `contactName` | 正文展示 |
| 联系电话 | `contactMobile` | 正文展示 |
| 入离时间 | `checkInDate` / `checkOutDate` | 正文展示 |
| 间夜 / 房间数 | `nightCount` / `roomCount` | 正文展示 |
| 平台确认号 | `platformConfirmNo` | 正文展示 |
| 销售计划 / 房型 ID | `rpCode` / `saleRoomId` | 正文展示 |

### 1.3 采购过程字段

当前不是“单一采购任务详情”，而是按日期聚合的采购过程。

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 采购日期 | `purchaseDate` | 日期分组头 |
| 当日成功数 | `successCount` | 日期头摘要 |
| 当日失败数 | `failureCount` | 日期头摘要 |
| 采购时间 | `purchaseTime` | 单条记录展示 |
| 采购单号 | `purchaseOrderNo` | 单条记录展示 |
| 供应商/渠道 | `purchaseSupplier` | 单条记录展示 |
| 采购结果 | `purchaseResult` | 成功/失败标签 |
| 失败原因摘要 | `failureSummary` | 文本说明 |
| 采购价 | `purchasePrice` | 明细字段 |
| 处理情况 | `processSummary` | 明细字段 |
| 处理人 | `processor` | 明细字段 |
| 确认号 | `confirmNo` | 成功场景字段 |
| 失败归因 | `failureReason` | 失败场景字段 |

### 1.4 金额摘要字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 支付金额 | `payAmount` | 摘要卡片 |
| 结算金额 | `settlementAmount` | 摘要卡片 |
| 采购成本 | `purchaseCost` | 摘要卡片 |
| 预估毛利 | `estimatedProfit` | 摘要卡片 |
| 售卖模式 | `saleMode` | 摘要卡片 |
| 佣金比例 | `commissionRate` | 摘要卡片 |

### 1.5 价格明细展开字段

| 字段名称 | 建议字段 key |
| --- | --- |
| 房费原价 | `originalRoomAmount` |
| 平台优惠 | `platformDiscountAmount` |
| 店铺补贴 | `shopSubsidyAmount` |
| 用户实付 | `userPaidAmount` |
| 采购成本 | `purchaseCost` |
| 结算金额 | `settlementAmount` |
| 佣金 | `commissionAmount` |
| 退款金额 | `refundAmount` |
| 取消罚金 | `cancelPenaltyAmount` |

### 1.6 底部动作字段

| 操作名称 | 建议字段 key |
| --- | --- |
| 接单 | `actionAccept` |
| 拒单 | `actionReject` |
| 人工补采 | `actionManualPurchase` |
| 发起售后 | `actionAfterSale` |
| 查看日志 | `actionLog` |
| 确认采购结果 | `actionConfirmPurchaseResult` |

## 2. 抽屉版 side-drawer.html 字段

抽屉版更强调单笔订单快速核查，核心字段包括：

- 酒店名称 / 房型名称 / 入住人 / 联系人 / 取消规则
- 创建时间 / 支付时间 / 取消时间
- 采购单号 / 采购状态 / 下单账号 / 开票类型
- 订单金额 / 价格明细
- 钟点房的入住时长 / 已选时段
- 失败原因入口

---

## 四、日志页字段定义

## 1. 顶部摘要字段

| 字段名称 | 建议字段 key | 当前展示规则 |
| --- | --- | --- |
| 系统订单号 | `orderSummary.systemOrderNo` | 摘要芯片 |
| 外部订单号 | `orderSummary.externalOrderNo` | 摘要芯片 |
| 酒店名称 | `orderSummary.hotelName` | 摘要芯片 |
| 酒店聚合 ID | `orderSummary.hotelAggregateId` | tooltip |
| 房型名称 | `orderSummary.roomName` | 摘要芯片 |
| 房型聚合 ID | `orderSummary.roomAggregateId` | tooltip |
| 早餐信息 | `orderSummary.breakfast` | 与房型拼接 |
| 入离时间 | `orderSummary.checkInDate` / `orderSummary.checkOutDate` | 摘要芯片 |
| 房间数 | `orderSummary.rooms` | 摘要芯片 |
| 晚数 | `orderSummary.nights` | 摘要芯片 |
| RP 编码 | `orderSummary.rpCode` | 摘要芯片 |

## 2. 视图控制字段

| 字段名称 | 建议字段 key | 当前规则 |
| --- | --- | --- |
| 当前 Tab | `activeTab` | `phase` / `business` |
| 查看范围 | `selectedLogScope` | `order` / `purchase` |
| 业务分类 | `selectedBusinessType` | 试单、下单、采购、取消 |

## 3. 原始日志字段

| 字段名称 | 建议字段 key | 说明 |
| --- | --- | --- |
| ID | `id` | 唯一标识 |
| 时间 | `time` | 精确时间 |
| 阶段码 | `phase` | 如 `PURCHASE_TASK_PAY` |
| 业务分类 | `businessType` | 试单/下单/采购/售后取消 |
| 阶段名称 | `phaseName` | 中文/业务化名称 |
| 执行内容 | `content` | 主描述字段 |
| 执行结果 | `result` | 结果摘要 |
| 操作人 | `operator` | 系统或人工 |
| 是否错误 | `isError` | 控制异常高亮 |
| 报文 | `json` | JSON 报文内容 |
| 范围 | `scope` | 订单 / 采购单 |

## 4. 阶段聚合字段

| 字段名称 | 建议字段 key | 说明 |
| --- | --- | --- |
| 阶段项 ID | `phaseItemId` | 聚合后唯一 ID |
| 主日志 | `primaryLog` | 当前摘要行主记录 |
| 隐藏日志 | `hiddenLogs` | 展开后显示 |
| 合并数量 | `mergedCount` | 同阶段合并数 |
| 是否可展开 | `canExpand` | 控制手风琴 |
| 尾日志 | `tailLog` | 单独保留的尾部记录 |

## 5. 报文抽屉字段

| 字段名称 | 建议字段 key | 说明 |
| --- | --- | --- |
| 抽屉是否显示 | `jsonDialogVisible` | 控制抽屉开关 |
| 报文内容 | `jsonDialogContent` | 展示的 JSON 文本 |

---

## 五、字段展示规则补充

### 1. 金额字段

- 统一保留两位小数
- 默认使用 `¥`
- 列表页以摘要为主，详情页可展示更完整明细

### 2. 状态字段

- 页面层统一按四段式理解：系统 / 平台 / 采购 / 售后
- 业务状态 `bizStatus` 仅用于列表 Tab 分流
- 状态颜色需在全模块保持一致

### 3. 时间字段

- 日期格式建议：`YYYY-MM-DD`
- 时间格式建议：`YYYY-MM-DD HH:mm:ss`
- SLA 倒计时可由前端基于 deadline 动态刷新

### 4. 长文本字段

- 酒店名、房型名、结果说明支持省略 + tooltip
- 取消规则、失败原因、风险提示支持多行文本
- 报文内容统一收敛至独立抽屉展示

### 5. 敏感信息

- 当前原型直接展示手机号与下单账号
- 正式版本建议补充权限控制与脱敏规则

---

## 六、枚举建议

### 1. 列表页 SLA 等级

| 值 | 含义 |
| --- | --- |
| `safe` | 安全 |
| `warning` | 预警 |
| `danger` | 高危 |
| `timeout` | 超时 |

### 2. 业务视图 Tab

| 值 | 含义 |
| --- | --- |
| `phase` | 阶段日志 |
| `business` | 业务日志 |

### 3. 日志范围

| 值 | 含义 |
| --- | --- |
| `order` | 订单范围 |
| `purchase` | 采购范围 |

---

## 七、后续补充建议

建议后续继续扩展：

1. 页面字段与接口字段映射表
2. 状态枚举字典
3. 动作按钮权限字段
4. 导出字段定义
5. 报文字段结构说明
6. 风险提示与 SLA 数据来源说明

---

## 八、结论

当前字段文档的目标是先与页面原型严格对齐，确保：

- 列表页字段反映真实工作台布局
- 详情页字段能区分主页面版与抽屉版
- 日志页字段反映当前聚合与报文查看模型

后续每次页面结构、字段口径或状态模型变更时，应同步更新本文件。
