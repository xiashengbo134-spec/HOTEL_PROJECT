# 04_System_Menu_Map (系统菜单与工程映射图谱)
> [!TIP]
> **维护指南：** 采用树状结构维护，方便后续直接在对应模块下按回车新增页面。文档路径统一指向后续的详细设计文件。

## 全局信息架构与菜单映射 (Navigation Map)

### 🔴 A. ERP 超级管理后台 (05_ERP_Admin)
**【基础与系统支撑】**
- `IDaaS登录`: 统一身份认证入口。 ➡️ `../05_ERP_Admin/Admin_Auth.md`
- `个人中心`: 个人信息与安全管理。 ➡️ `../05_ERP_Admin/Admin_Profile.md`
- `字典管理`: 维护前端与系统的全局枚举值字典库。 ➡️ `../05_ERP_Admin/Admin_Dict.md`
- `应用管理`: 顶层资源单元管控，定义不同的独立业务域（如ERP后台、SaaS平台等）。 ➡️ `../05_ERP_Admin/Admin_App.md`
**【权限与租户资源】**
- `用户管理`: 维护 IDaaS 系统注册的全量基础用户池。 ➡️ `../05_ERP_Admin/Admin_User.md`
- `租户管理`: SaaS 租户空间的初始化配置与底层信息维护。 ➡️ `../05_ERP_Admin/Admin_Tenant.md`

### 🟠 B. ERP 管理后台 (06_ERP_Manager)
**【企业组织】**
- `角色管理`: 对应应用中配置的角色及其底层的细粒度权限管控。 ➡️ `../06_ERP_Manager/ERP_Role.md`
- `成员与组织`: 内部平台的组织架构搭建与人员节点映射。 ➡️ `../06_ERP_Manager/ERP_Org.md`
**【信息中心】**
- `平台管理`: 合作平台（OTA、集团、B2B渠道）的全局档案维护。 ➡️ `../06_ERP_Manager/ERP_Info_Platform.md`
- `城市管理`: 我方采集的各个平台城市地理信息的统一映射库。 ➡️ `../06_ERP_Manager/ERP_Info_City.md`
- `价格体系`: 定义多渠道获取价与下单的全局加价规则与模型。 ➡️ `../06_ERP_Manager/ERP_Info_Price.md`
- `指标规则`: 配置各个平台中订单维度的各类业务考核与预警指标。 ➡️ `../06_ERP_Manager/ERP_Info_Metrics.md`
**【平台酒店 (Raw)】**
- `酒店管理`: 沉淀从各个渠道平台采集回来的原始酒店静态数据。 ➡️ `../06_ERP_Manager/ERP_Raw_Hotel.md`
- `房型管理`: 沉淀从各个渠道平台采集回来的原始房型静态数据。 ➡️ `../06_ERP_Manager/ERP_Raw_Room.md`
**【匹配管理 (Mapping)】**
- `关系维护`: 查询并监控我方标准数据与渠道原始数据的聚合关联网。 ➡️ `../06_ERP_Manager/ERP_Map_Relation.md`
- `匹配酒店`: 人工或辅助操作我方标准酒店与平台原始酒店的 ID 绑定。 ➡️ `../06_ERP_Manager/ERP_Map_Hotel.md`
- `匹配房型`: 人工或辅助操作我方标准房型与平台原始房型的 ID 绑定。 ➡️ `../06_ERP_Manager/ERP_Map_Room.md`
**【畅行酒店 (Master)】**
- `酒店管理`: 我方清洗聚合后的唯一标准酒店资源库。 ➡️ `../06_ERP_Manager/ERP_Master_Hotel.md`
- `房型管理`: 我方清洗聚合后的唯一标准房型资源库。 ➡️ `../06_ERP_Manager/ERP_Master_Room.md`
- `房价房态`: 最终生成并可用于多渠道售卖的标准价态大盘。 ➡️ `../06_ERP_Manager/ERP_Master_Status.md`
**【开发管理】**
- `API密钥管理`: 管理系统对接的密钥生命周期及调用凭证。 ➡️ `../06_ERP_Manager/ERP_Dev_API.md`
- `ACL配置管理`: 接口访问控制列表（白名单/限流）的安全管控。 ➡️ `../06_ERP_Manager/ERP_Dev_ACL.md`
- `交易模型`: 底层交易链路的模型节点配置与规则定义。 ➡️ `../06_ERP_Manager/ERP_Dev_Trade.md`
- `B2B接口管理`: 针对下游买家开放平台接口的统一定义与管控。 ➡️ `../06_ERP_Manager/ERP_Dev_B2B.md`

### 🔵 C. SaaS 平台 (07_SaaS_Workstation)
**【企业管理】**
- `成员管理`: 维护租户内部员工的账号生命周期与登录鉴权。 ➡️ `../07_SaaS_Workstation/SaaS_Biz_Member.md`
- `角色管理`: 依据企业组织架构，定义细粒度的岗位权限及数据隔离边界。 ➡️ `../07_SaaS_Workstation/SaaS_Biz_Role.md`
- `公司管理`: 管理本租户下属的法务签约主体，用于对外业务签署与关联。 ➡️ `../07_SaaS_Workstation/SaaS_Biz_Company.md`
- `账号管理`: 集中管控租户授权的外部业务账号，并强制关联归属的签约公司。 ➡️ `../07_SaaS_Workstation/SaaS_Biz_Account.md`
- `买家管理`: 维护 B2B 平台买家信息（归属签约主体）及开发者配置（API、Webhook）。 ➡️ `../07_SaaS_Workstation/SaaS_Biz_Buyer.md`
**【OTA 渠道运营】**
- `飞猪_酒店管理`: 对应账号下飞猪平台的酒店信息管理，进行匹配、投放、上下架。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Fliggy_Hotel.md`
- `飞猪_房型管理`: 对应账号下飞猪平台的酒店房型管理，进行匹配、投放、上下架。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Fliggy_Room.md`
- `飞猪_房价房态`: 对应账号下飞猪平台的实时动态日历报价与房态开关。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Fliggy_Status.md`
- `飞猪_指标看板`: 依据指标规则触发的订单转化率与实际业务数据看板。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Fliggy_Board.md`
- `抖音_酒店管理`: 对应账号下抖音平台的酒店信息匹配与投放。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Douyin_Hotel.md`
- `抖音_房型管理`: 对应账号下抖音平台的房型信息匹配与投放。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Douyin_Room.md`
- `抖音_房价房态`: 对应账号下抖音平台的实时动态日历报价与房态。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Douyin_Status.md`
- `抖音_指标看板`: 对应账号下抖音平台的转化与业务大盘。 ➡️ `../07_SaaS_Workstation/SaaS_OTA_Douyin_Board.md`
**【订单与服务管理】**
- `酒店订单`: 租户全平台订单总盘，监控并自动触发履约采购同步至账号后台。 ➡️ `../07_SaaS_Workstation/SaaS_Order_Main.md`
- `采购订单`: 记录系统为完成订单履约而向供应商发起的实际底层采购单据。 ➡️ `../07_SaaS_Workstation/SaaS_Order_Purchase.md`
- `售后任务`: 接收取消、纠纷、退款等动作生成的任务，确认后完成采购单退款闭环。 ➡️ `../07_SaaS_Workstation/SaaS_Service_Task.md`
- `售后查询`: 支持根据订单号查询进度，或主动新建售后任务推入任务列表。 ➡️ `../07_SaaS_Workstation/SaaS_Service_Query.md`
**【支付宝管理】**
- `账号管理`: 维护租户绑定的企业支付宝主体矩阵及状态。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_Alipay_Account.md`
- `员工管理`: 同步并管理挂载于企业支付宝下的员工子账号信息。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_Alipay_Staff.md`
- `额度管理`: 集中管理与分配全部支付宝账号的可用消耗额度。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_Alipay_Quota.md`
**【客户端管理】**
- `个人支付宝`: 监控承担自动下单支付任务的个人支付宝客户端节点信息。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_Client_Personal.md`
- `企业支付宝`: 监控承担自动下单支付任务的企业支付宝客户端节点信息。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_Client_Enterprise.md`
- `香港支付宝`: 监控承担自动下单支付任务的香港支付宝客户端节点信息。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_Client_HK.md`
**【VCC管理】**
- `账号管理`: 维护系统对接合作的底层 VCC 供应商主体信息。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_VCC_Account.md`
- `卡号管理`: 针对具体生成的虚拟信用卡（VCC）卡号进行生命周期管理。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_VCC_Card.md`
- `卡BIN管理`: 管控用于生成 VCC 卡号的卡 BIN 规则与属性库。 ➡️ `../07_SaaS_Workstation/SaaS_Pay_VCC_Bin.md`
**【财务中心】**
- `结算信息`: 租户配置其名下的 B2B 买家与合作平台的财务对账及结算规则。 ➡️ `../07_SaaS_Workstation/SaaS_Fin_Rule.md`
- `财务对账`: 生成并处理租户与 B2B 买家、平台的实际财务对账单据与流水。 ➡️ `../07_SaaS_Workstation/SaaS_Fin_Bill.md`

### 🟢 D. B2B 平台 (08_B2B_Platform)
> 预留占位：承载下游买家前台选购、资产充值、订单追踪及开放 API 门户。 ➡️ 详见后续设计文档。