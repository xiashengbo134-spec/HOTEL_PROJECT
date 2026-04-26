# 酒店订单页面对象结构说明

## 文档目的

本文件用于沉淀酒店订单模块在页面层使用到的核心对象结构，作为页面文档与后续 API 草案之间的中间层说明。

它的目标不是直接定义接口协议，而是先统一以下认知：

- 列表页需要什么对象
- 详情页需要什么对象
- 日志页需要什么对象
- 各对象之间如何关联
- 哪些字段是页面主展示字段，哪些是扩展字段

这样可以在不提前绑定接口实现细节的前提下，让产品、前端、后端先对数据模型形成统一口径。

---

## 一、建模原则

### 1. 页面优先

本文件以页面消费视角建模，不强制等同于数据库表结构，也不要求与后端领域模型一一对应。

### 2. 结果对象与过程对象分离

当前模块中既有“结果态页面”，也有“过程态页面”：

- 列表页、详情页主要消费结果对象
- 日志页主要消费过程对象

因此对象设计上建议分为：

- 订单摘要对象
- 订单详情对象
- 采购任务对象
- 采购信息对象
- 日志节点对象
- 日志明细对象

### 3. 主订单与采购任务分层

订单详情页已经明确区分：

- 主订单信息
- 采购任务列表
- 当前任务采购信息

因此对象层也应保持这种分层，不建议把所有字段拍平成一个超大对象。

### 4. 当前已实现与后续扩展兼容

对象设计既要覆盖当前页面已实现内容，也要给后续扩展保留空间，例如：

- 多采购任务
- 拆单采购
- 钟点房字段
- 售后标签
- 平台状态扩展
- 日志筛选条件扩展

---

## 二、对象总览

当前页面层建议维护以下核心对象：

### 列表页对象

- `OrderListQuery`
- `OrderListItem`
- `OrderListAmountSummary`
- `OrderListStatusSummary`
- `OrderListActionState`

### 详情页对象

- `OrderDetailPageData`
- `OrderBaseInfo`
- `PurchaseTaskCard`
- `PurchaseTaskInfo`
- `OrderIdTooltipInfo`
- `AmountTooltipInfo`

### 日志页对象

- `OrderLogPageData`
- `OrderLogHeader`
- `LogPhaseGroup`
- `LogBusinessGroup`
- `LogRecord`
- `LogJsonPayload`

---

## 三、列表页对象结构建议

### 1. `OrderListQuery`

用于承载列表页查询条件。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `orderNo` | `string` | 系统订单号，支持完整单号或尾 6 位 |
| `outerOrderNo` | `string` | 外部订单号，支持完整单号或尾 6 位 |
| `guestOrContactKeyword` | `string` | 入住人/联系人聚合搜索关键词，可命中入住人、联系人、手机号 |
| `hotelKeyword` | `string` | 酒店名称/ID 聚合搜索关键词，可命中酒店名称、聚合 ID、平台 ID、销售 ID |
| `timeType` | `'bookingTime' \| 'checkInDate' \| 'checkOutDate'` | 时间筛选类型 |
| `startTime` | `string` | 时间范围开始 |
| `endTime` | `string` | 时间范围结束 |
| `cityName` | `string` | 城市 |
| `orderSource` | `string[]` | 订单来源，可理解为平台 + 销售账号 |
| `platformOrderStatuses` | `string[]` | 平台订单状态，多选 |
| `tabKey` | `'pending' \| 'afterSale' \| 'accepted' \| 'rejected' \| 'canceled' \| 'all'` | 当前 Tab |
| `pageNum` | `number` | 页码 |
| `pageSize` | `number` | 每页条数 |

说明：

- `timeType` 是当前页面时间筛选组件的关键字段
- `guestOrContactKeyword` 与 `hotelKeyword` 都属于聚合搜索字段
- `tabKey` 既是页面视图状态，也会影响查询结果范围

---

### 2. `OrderListItem`

用于承载列表页单条订单的摘要信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `orderNo` | `string` | 系统订单号 |
| `outerOrderNo` | `string` | 外部订单号 |
| `channelCode` | `string` | 渠道编码 |
| `channelIcon` | `string` | 渠道图标地址或资源标识 |
| `orderSourceName` | `string` | 订单来源展示文案 |
| `hotelName` | `string` | 酒店名称 |
| `roomTypeName` | `string` | 房型名称 |
| `breakfastText` | `string` | 早餐文案，如“含早/无早/双早” |
| `guestName` | `string` | 入住人 |
| `contactName` | `string` | 联系人 |
| `contactMobile` | `string` | 联系电话 |
| `checkInDate` | `string` | 入住日期 |
| `checkOutDate` | `string` | 离店日期 |
| `nightCount` | `number` | 间夜 |
| `amountSummary` | `OrderListAmountSummary` | 列表金额摘要 |
| `statusSummary` | `OrderListStatusSummary` | 复合状态摘要 |
| `bookingTime` | `string` | 预订时间/用户订单创建时间 |
| `payTime` | `string` | 支付时间 |
| `cancelTime` | `string` | 取消时间 |
| `slaInfo` | `OrderSlaInfo` | 待处理时效信息 |
| `actionState` | `OrderListActionState` | 行级操作状态 |

说明：

- `OrderListItem` 应尽量保持为列表展示所需的摘要对象
- 详情页所需复杂字段不建议全部塞入该对象

---

### 3. `OrderListAmountSummary`

用于承载列表页展示的金额摘要及悬浮信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `payAmount` | `string` | 支付金额 |
| `settlementAmount` | `string` | 结算金额 |
| `commissionAmount` | `string` | 佣金 |
| `commissionRate` | `string` | 佣金比例 |
| `refundAmount` | `string` | 退款金额 |
| `cancelPenaltyAmount` | `string` | 取消罚金 |
| `saleMode` | `'底价' \| '卖价'` | 售卖模式 |

说明：

- 列表页正文只展示 `payAmount` 与 `settlementAmount`
- 其余字段可用于 hover tooltip

---

### 4. `OrderListStatusSummary`

用于承载列表页复合状态栏信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `bizStatus` | `string` | 业务状态，如待处理、售后中 |
| `systemStatus` | `string` | 系统订单状态 |
| `platformStatus` | `string` | 平台订单状态 |
| `afterSaleMainStatus` | `string` | 售后主状态，如售后中、已处理 |
| `afterSaleTags` | `string[]` | 售后补充标签，如协商退款、已同意、已取消 |
| `isTimeout` | `boolean` | 是否已超时 |

说明：

- `afterSaleTags` 用于支持列表中“主状态 + 下方补充标签”的展示方式
- `bizStatus` 用于决定当前订单归属到哪个 Tab

---

### 5. `OrderListActionState`

用于控制列表行级按钮显隐与可用性。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `canViewDetail` | `boolean` | 是否可查看详情 |
| `canViewLog` | `boolean` | 是否可查看日志 |
| `canAccept` | `boolean` | 是否可接单 |
| `canReject` | `boolean` | 是否可拒单 |
| `canCopyOrderNo` | `boolean` | 是否可复制系统订单号 |
| `canCopyOuterOrderNo` | `boolean` | 是否可复制外部订单号 |

说明：

- 该对象可避免前端在多个地方重复判断按钮状态

---

### 6. `OrderSlaInfo`

用于承载待处理订单的 SLA 信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | `boolean` | 是否启用 SLA 倒计时 |
| `sourcePlatform` | `string` | 来源平台 |
| `ruleMinutes` | `number` | 平台规定的处理时长，单位分钟 |
| `startTime` | `string` | 起算时间，按支付成功并推单时间计算 |
| `deadlineTime` | `string` | 截止时间 |
| `remainSeconds` | `number` | 剩余秒数 |
| `level` | `'normal' \| 'warning' \| 'danger' \| 'timeout'` | 时效等级 |
| `timeoutHandled` | `boolean` | 是否已触发超时处理 |

---

## 四、详情页对象结构建议

### 1. `OrderDetailPageData`

用于承载详情页整体数据。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `orderBaseInfo` | `OrderBaseInfo` | 主订单信息 |
| `purchaseTaskCards` | `PurchaseTaskCard[]` | 左侧采购任务卡片列表 |
| `selectedTaskId` | `string` | 当前选中采购任务 ID |
| `selectedTaskInfo` | `PurchaseTaskInfo \| null` | 当前选中采购任务详情 |

说明：

- 当无采购任务时，`purchaseTaskCards` 可为空数组
- 当未选中任务或无任务时，`selectedTaskInfo` 可为 `null`

---

### 2. `OrderBaseInfo`

用于承载右上订单信息区内容。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `orderNo` | `string` | 系统订单号 |
| `outerOrderNo` | `string` | 外部订单号 |
| `platformStatus` | `string` | 平台订单状态 |
| `orderSourceName` | `string` | 订单来源 |
| `hotelName` | `string` | 酒店名称 |
| `hotelAddress` | `string` | 酒店地址 |
| `cityName` | `string` | 城市 |
| `hotelPhone` | `string` | 酒店电话 |
| `hotelIds` | `OrderIdTooltipInfo` | 酒店相关 ID 集合 |
| `guestName` | `string` | 入住人 |
| `contactName` | `string` | 联系人姓名 |
| `contactMobile` | `string` | 联系人电话 |
| `roomDisplayText` | `string` | 房型 + 早餐展示文案 |
| `checkInDate` | `string` | 入住日期 |
| `checkOutDate` | `string` | 离店日期 |
| `nightCount` | `number` | 间夜 |
| `cancelRule` | `string` | 系统订单取消规则 |
| `amountInfo` | `AmountTooltipInfo` | 支付金额与结算金额及悬浮详情 |
| `bookingTime` | `string` | 预订时间 |
| `payTime` | `string` | 支付时间 |

说明：

- 当前详情页主订单区未强调展示系统状态字段，因此本对象以已确认页面字段为主
- 若后续需要，可增加 `systemStatus`

---

### 3. `OrderIdTooltipInfo`

用于承载详情页中通过 ID 图标悬浮展示的酒店相关 ID 信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `aggregateId` | `string` | 聚合 ID |
| `saleId` | `string` | 销售 ID |
| `platformId` | `string` | 平台 ID |

---

### 4. `AmountTooltipInfo`

用于承载详情页与列表页共用的金额展示对象。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `payAmount` | `string` | 支付金额 |
| `settlementAmount` | `string` | 结算金额 |
| `commissionAmount` | `string` | 佣金 |
| `commissionRate` | `string` | 佣金比例 |
| `refundAmount` | `string` | 退款金额 |
| `cancelPenaltyAmount` | `string` | 取消罚金 |
| `saleMode` | `'底价' \| '卖价'` | 售卖模式 |

说明：

- 当前列表页与详情页的金额 tooltip 口径应保持一致

---

### 5. `PurchaseTaskCard`

用于承载左侧采购任务卡片摘要信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `taskId` | `string` | 采购任务 ID |
| `title` | `string` | 卡片标题，当前固定为“采购任务” |
| `purchaseStatus` | `string` | 采购状态 |
| `createTime` | `string` | 采购任务创建时间 |
| `outerOrderNo` | `string` | 外部订单号 |
| `orderNo` | `string` | 系统订单号 |
| `isSplitTask` | `boolean` | 是否拆单采购 |
| `splitTaskLabel` | `string` | 拆单采购标签文案 |

说明：

- 后续如需增加渠道、失败原因摘要、重试次数等，可在本对象上继续扩展

---

### 6. `PurchaseTaskInfo`

用于承载右下采购信息区内容。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `taskId` | `string` | 采购任务 ID |
| `purchaseChannel` | `string` | 采购渠道，如携程-12306、艺龙-api |
| `purchaseOrderNo` | `string` | 采购单号 |
| `purchaseOrderStatus` | `string` | 采购订单状态 |
| `hotelName` | `string` | 采购酒店名称 |
| `hotelAddress` | `string` | 酒店地址 |
| `cityName` | `string` | 城市 |
| `hotelPhone` | `string` | 酒店电话 |
| `guestName` | `string` | 入住人 |
| `contactName` | `string` | 采购联系人姓名 |
| `contactMobile` | `string` | 采购联系人电话 |
| `roomDisplayText` | `string` | 房型 + 早餐展示文案 |
| `checkInDate` | `string` | 入住日期 |
| `checkOutDate` | `string` | 离店日期 |
| `nightCount` | `number` | 间夜 |
| `cancelRule` | `string` | 采购订单取消规则 |
| `invoiceType` | `string` | 开票类型 |
| `purchaseAccount` | `string` | 下单账号 |
| `selectedTimeRange` | `string` | 已选时段，钟点房场景使用 |
| `stayDuration` | `string` | 入住时长，钟点房场景使用 |
| `purchaseType` | `'自动采购' \| '手工采购'` | 采购类型 |
| `statusHints` | `string[]` | 状态提示，如失败原因、重试次数 |
| `purchasePrice` | `string` | 采购价格 |
| `monitorChannel` | `string` | 监控渠道 |

说明：

- `selectedTimeRange`、`stayDuration` 属于钟点房条件字段
- `statusHints` 用于承接“不同采购状态对应的提示信息”

---

## 五、日志页对象结构建议

### 1. `OrderLogPageData`

用于承载日志页整体数据。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `header` | `OrderLogHeader` | 日志页头部摘要 |
| `phaseGroups` | `LogPhaseGroup[]` | 阶段日志分组 |
| `businessGroups` | `LogBusinessGroup[]` | 业务日志分组 |
| `defaultView` | `'phase' \| 'business'` | 默认视图 |
| `defaultSelectedKey` | `string` | 默认选中的节点或分类 key |

---

### 2. `OrderLogHeader`

用于承载日志页头部摘要。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 页面标题，当前为“订单日志” |
| `hotelName` | `string` | 酒店名称 |
| `orderNo` | `string` | 系统订单号 |
| `outerOrderNo` | `string` | 外部订单号 |
| `channelOrderNo` | `string` | 渠道订单号 |
| `systemStatus` | `string` | 当前系统状态 |
| `platformStatus` | `string` | 平台订单状态 |
| `orderSourceName` | `string` | 订单来源 |
| `checkInDate` | `string` | 入住日期 |
| `checkOutDate` | `string` | 离店日期 |
| `traceId` | `string` | 链路标识 |

说明：

- 当前原型只展示了部分字段
- 该对象采用“当前 + 建议扩展”的统一口径

---

### 3. `LogPhaseGroup`

用于承载阶段日志左侧节点对象。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `groupKey` | `string` | 节点唯一标识 |
| `phase` | `string` | 阶段编码 |
| `phaseName` | `string` | 阶段名称 |
| `displayTime` | `string` | 节点展示时间 |
| `logCount` | `number` | 节点下日志数量 |
| `operatorText` | `string` | 操作人展示文案 |
| `nodeStatus` | `'success' \| 'processing' \| 'failed'` | 节点状态 |
| `purchaseTaskNo` | `string` | 采购任务号，可选 |
| `currentStageText` | `string` | 当前阶段补充说明 |
| `records` | `LogRecord[]` | 节点下明细记录 |

说明：

- 采购任务相关节点可通过 `purchaseTaskNo` 与详情页任务卡片形成关联理解

---

### 4. `LogBusinessGroup`

用于承载业务日志左侧分类对象。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `groupKey` | `string` | 分类唯一标识 |
| `businessType` | `'试单' \| '下单' \| '采购' \| '售后/取消'` | 业务分类 |
| `logCount` | `number` | 分类下日志数量 |
| `records` | `LogRecord[]` | 分类下明细记录 |

---

### 5. `LogRecord`

用于承载右侧明细表格中的底层日志记录。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 日志 ID |
| `time` | `string` | 精确时间 |
| `phase` | `string` | 阶段编码 |
| `phaseName` | `string` | 阶段名称 |
| `businessType` | `string` | 业务类型 |
| `title` | `string` | 标题 |
| `content` | `string` | 执行内容 |
| `result` | `string` | 执行结果 |
| `operator` | `string` | 操作人 |
| `isError` | `boolean` | 是否错误 |
| `traceId` | `string` | 链路标识 |
| `taskId` | `string` | 采购任务 ID |
| `statusText` | `string` | 状态文案 |
| `jsonPayload` | `LogJsonPayload \| null` | 报文数据 |

---

### 6. `LogJsonPayload`

用于承载日志明细中的报文信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `rawText` | `string` | 原始报文文本 |
| `formattedText` | `string` | 格式化报文文本 |
| `copyText` | `string` | 复制内容 |

---

## 六、对象关系说明

### 1. 列表页到详情页

建议通过以下主键关联：

- `orderNo`
- `outerOrderNo`

列表页点击“订单详情”后，进入详情页并拉取：

- `OrderBaseInfo`
- `PurchaseTaskCard[]`
- 默认选中的 `PurchaseTaskInfo`

### 2. 列表页到日志页

列表页点击“日志”后，进入日志抽屉并拉取：

- `OrderLogHeader`
- `LogPhaseGroup[]`
- `LogBusinessGroup[]`

### 3. 详情页与日志页的关联理解

两页不要求直接页面跳转，但在对象理解上存在对应关系：

- `PurchaseTaskCard.taskId`
- `PurchaseTaskInfo.taskId`
- `LogRecord.taskId`
- `LogPhaseGroup.purchaseTaskNo`

这能让开发与排查人员从“采购任务”这一维度串联详情与日志。

---

## 七、后续 API 设计建议

后续写 API 草案时，建议按页面对象进行组织，而不是一次返回一个超大对象。

### 1. 列表页

可拆为：

- 查询参数：`OrderListQuery`
- 返回列表项：`OrderListItem[]`
- Tab 统计：可单独返回 tab count 对象

### 2. 详情页

可拆为：

- 主订单信息：`OrderBaseInfo`
- 采购任务列表：`PurchaseTaskCard[]`
- 当前任务详情：`PurchaseTaskInfo`

### 3. 日志页

可拆为：

- 头部摘要：`OrderLogHeader`
- 阶段分组：`LogPhaseGroup[]`
- 业务分组：`LogBusinessGroup[]`

这样做的好处包括：

- 更贴合页面渲染结构
- 更利于懒加载和分区请求
- 更方便未来局部刷新

---

## 八、后续可继续补充的对象

后续若进入接口或更细的页面设计阶段，可继续补充：

1. `TabCountSummary`
2. `AfterSaleTag`
3. `PlatformStatusOption`
4. `PurchaseStatusHint`
5. `OrderExportQuery`
6. `OrderPermissionState`
7. `EmptyStateConfig`

---

## 九、结论

当前酒店订单模块的页面对象结构，建议围绕以下主线理解：

- 列表页：`OrderListQuery` + `OrderListItem`
- 详情页：`OrderBaseInfo` + `PurchaseTaskCard` + `PurchaseTaskInfo`
- 日志页：`OrderLogHeader` + `LogPhaseGroup` / `LogBusinessGroup` + `LogRecord`

这样既能覆盖当前页面已实现内容，也能为后续 API 草案、前端类型定义、mock 数据结构设计提供稳定基础。
