import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { authStorage } from '../auth/storage'
import {
  createApp,
  deleteApp,
  distributeAppTenants,
  listApps,
  rotateAppSecret,
  toggleAppStatus,
  updateApp,
  type AppPayload,
} from '../services/app'
import { listTenants } from '../services/tenant'
import type { AdminApp, AppStatus } from '../types/app'

const statusColors: Record<AppStatus, string> = {
  enabled: 'green',
  disabled: 'default',
  testing: 'blue',
  deprecated: 'red',
}

const appTypeOptions = ['ERP 后台', 'SaaS 工作台', 'B2B 平台', '开发者门户', '内部支撑系统']
const authModeOptions = ['IDaaS', 'OAuth2', 'OIDC', 'SAML']
const statusOptions: { label: string; value: AppStatus }[] = [
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
  { label: '测试中', value: 'testing' },
  { label: '已废弃', value: 'deprecated' },
]
const defaultOperatorId = 'sys_admin_web'

const generateAppId = (code: string) => `app_${code.toLowerCase()}`

export default function AppPage() {
  const queryClient = useQueryClient()
  const [queryForm] = Form.useForm()
  const [appForm] = Form.useForm<AppPayload>()
  const [securityForm] = Form.useForm<AppPayload>()
  const [distributeForm] = Form.useForm<{ tenantIds: number[] }>()
  const [open, setOpen] = useState(false)
  const [securityOpen, setSecurityOpen] = useState(false)
  const [distributeOpen, setDistributeOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editing, setEditing] = useState<AdminApp | null>(null)
  const [currentApp, setCurrentApp] = useState<AdminApp | null>(null)

  const { data: apps = [], isLoading } = useQuery({ queryKey: ['apps'], queryFn: listApps })
  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: listTenants })

  const createMutation = useMutation({
    mutationFn: createApp,
    onSuccess: () => {
      message.success('应用创建成功')
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      setOpen(false)
      appForm.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AppPayload }) => updateApp(id, payload),
    onSuccess: () => {
      message.success('应用更新成功')
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      setOpen(false)
      setSecurityOpen(false)
      appForm.resetFields()
      securityForm.resetFields()
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, operatorId }: { id: number; operatorId: string }) => deleteApp(id, operatorId),
    onSuccess: () => {
      message.success('应用删除成功')
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled, operatorId }: { id: number; enabled: boolean; operatorId: string }) =>
      toggleAppStatus(id, enabled, operatorId),
    onSuccess: (_, vars) => {
      message.success(`应用已${vars.enabled ? '启用' : '停用'}`)
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })

  const rotateMutation = useMutation({
    mutationFn: rotateAppSecret,
    onSuccess: (app) => {
      message.success('Secret 已轮换')
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      securityForm.setFieldsValue({ appSecretMasked: app.appSecretMasked })
    },
  })

  const distributeMutation = useMutation({
    mutationFn: ({ id, tenantIds }: { id: number; tenantIds: number[] }) => distributeAppTenants(id, tenantIds),
    onSuccess: () => {
      message.success('租户分发已更新')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      setDistributeOpen(false)
    },
  })

  const filters = Form.useWatch([], queryForm) ?? {}
  const operatorId = authStorage.getUser()?.uid ?? defaultOperatorId

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const name = String(filters.appName ?? '').trim().toLowerCase()
      const code = String(filters.appCode ?? '').trim().toLowerCase()
      const status = filters.status as AppStatus | undefined
      const tenantAccessEnabled = filters.tenantAccessEnabled as boolean | undefined
      if (name && !app.appName.toLowerCase().includes(name)) return false
      if (code && !app.appCode.toLowerCase().includes(code)) return false
      if (status && (app.status ?? (app.enabled ? 'enabled' : 'disabled')) !== status) return false
      if (typeof tenantAccessEnabled === 'boolean' && (app.tenantAccessEnabled ?? true) !== tenantAccessEnabled) {
        return false
      }
      return true
    })
  }, [apps, filters])

  const appTenantNames = (appId: number) =>
    tenants
      .filter((tenant) => (tenant.appIds ?? []).includes(appId))
      .map((tenant) => tenant.tenantName)

  const openCreate = () => {
    setEditing(null)
    appForm.setFieldsValue({
      tenantId: 'global',
      appCode: '',
      appName: '',
      appType: 'SaaS 工作台',
      appDesc: '',
      baseUrl: '',
      homeUrl: '',
      authMode: 'IDaaS',
      appId: '',
      appSecretMasked: '',
      callbackUrls: [],
      tokenTtl: 7200,
      refreshTokenTtl: 604800,
      tenantAccessEnabled: true,
      defaultOpenToTenant: false,
      enabled: true,
      status: 'enabled',
      operatorId,
    })
    setOpen(true)
  }

  const openEdit = (record: AdminApp) => {
    setEditing(record)
    appForm.setFieldsValue({
      tenantId: record.tenantId,
      appCode: record.appCode,
      appName: record.appName,
      appType: record.appType,
      appDesc: record.appDesc,
      baseUrl: record.baseUrl,
      homeUrl: record.homeUrl,
      authMode: record.authMode,
      appId: record.appId,
      appSecretMasked: record.appSecretMasked,
      callbackUrls: record.callbackUrls,
      tokenTtl: record.tokenTtl,
      refreshTokenTtl: record.refreshTokenTtl,
      tenantAccessEnabled: record.tenantAccessEnabled,
      defaultOpenToTenant: record.defaultOpenToTenant,
      enabled: record.enabled,
      status: record.status,
      operatorId,
    })
    setOpen(true)
  }

  const openDetail = (record: AdminApp) => {
    setCurrentApp(record)
    setDetailOpen(true)
  }

  const openSecurity = (record: AdminApp) => {
    setCurrentApp(record)
    securityForm.setFieldsValue({
      tenantId: record.tenantId,
      appCode: record.appCode,
      appName: record.appName,
      baseUrl: record.baseUrl,
      enabled: record.enabled,
      operatorId,
      authMode: record.authMode,
      appId: record.appId,
      appSecretMasked: record.appSecretMasked,
      callbackUrls: record.callbackUrls,
      tokenTtl: record.tokenTtl,
      refreshTokenTtl: record.refreshTokenTtl,
      homeUrl: record.homeUrl,
      tenantAccessEnabled: record.tenantAccessEnabled,
      defaultOpenToTenant: record.defaultOpenToTenant,
      status: record.status,
      appType: record.appType,
      appDesc: record.appDesc,
    })
    setSecurityOpen(true)
  }

  const openDistribute = (record: AdminApp) => {
    setCurrentApp(record)
    distributeForm.setFieldsValue({
      tenantIds: tenants.filter((tenant) => (tenant.appIds ?? []).includes(record.id)).map((tenant) => tenant.id),
    })
    setDistributeOpen(true)
  }

  const buildPayload = (values: AppPayload): AppPayload => ({
    ...values,
    appId: values.appId || generateAppId(values.appCode),
    appSecretMasked: values.appSecretMasked || `MASKED-${values.appCode}`,
    homeUrl: values.homeUrl || values.baseUrl,
    callbackUrls: values.callbackUrls ?? [],
    status: values.status ?? (values.enabled ? 'enabled' : 'disabled'),
    operatorId: values.operatorId || operatorId,
  })

  const columns = [
    { title: '应用名称', dataIndex: 'appName' },
    { title: '应用 Code', dataIndex: 'appCode' },
    { title: 'AppID', dataIndex: 'appId', render: (value: string | undefined) => value || '-' },
    { title: '应用类型', dataIndex: 'appType', render: (value: string | undefined) => value || '-' },
    { title: '接入方式', dataIndex: 'authMode', render: (value: string | undefined) => value || '-' },
    {
      title: '允许租户接入',
      dataIndex: 'tenantAccessEnabled',
      render: (value: boolean | undefined) => (
        <Tag color={value ? 'green' : 'default'}>{value ? '允许' : '禁止'}</Tag>
      ),
    },
    {
      title: '当前状态',
      render: (_: unknown, record: AdminApp) => {
        const status = record.status ?? (record.enabled ? 'enabled' : 'disabled')
        return <Tag color={statusColors[status]}>{status}</Tag>
      },
    },
    {
      title: 'Token 有效期',
      dataIndex: 'tokenTtl',
      render: (value: number | undefined) => (value ? `${value}s` : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (value: string | undefined) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-'),
    },
    { title: '最后操作人', dataIndex: 'operatorId', render: (value: string | undefined) => value || '-' },
    {
      title: '操作',
      render: (_: unknown, record: AdminApp) => (
        <Space wrap>
          <Button size="small" onClick={() => openDetail(record)}>详情</Button>
          <Button size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Button size="small" onClick={() => openSecurity(record)}>安全配置</Button>
          <Button size="small" onClick={() => openDistribute(record)}>租户分发</Button>
          <Switch
            size="small"
            checked={record.enabled}
            checkedChildren="启"
            unCheckedChildren="停"
            onChange={(checked) =>
              toggleMutation.mutate({ id: record.id, enabled: checked, operatorId })
            }
          />
          <Popconfirm title="确认删除该应用吗？" onConfirm={() => deleteMutation.mutate({ id: record.id, operatorId })}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>应用管理</Typography.Title>
          <Typography.Text type="secondary">
            维护平台级应用注册、接入协议、权限边界与租户分发关系。
          </Typography.Text>
        </Space>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Form form={queryForm} layout="vertical">
          <Row gutter={12}>
            <Col span={6}><Form.Item name="appName" label="应用名称"><Input placeholder="按名称搜索" /></Form.Item></Col>
            <Col span={6}><Form.Item name="appCode" label="应用 Code"><Input placeholder="按 Code 搜索" /></Form.Item></Col>
            <Col span={6}><Form.Item name="status" label="应用状态"><Select allowClear options={statusOptions} /></Form.Item></Col>
            <Col span={6}>
              <Form.Item name="tenantAccessEnabled" label="是否允许租户接入">
                <Select
                  allowClear
                  options={[{ label: '允许', value: true }, { label: '禁止', value: false }]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button type="primary" onClick={openCreate}>新建应用</Button>
            <Button onClick={() => queryForm.resetFields()}>重置筛选</Button>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['apps'] })}>刷新</Button>
          </Space>
        </Form>
      </Card>

      <Table
        rowKey="id"
        loading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
        dataSource={filteredApps}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editing ? '编辑应用' : '新建应用'}
        open={open}
        width={920}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={async () => {
          const values = await appForm.validateFields()
          const payload = buildPayload(values)
          if (editing) {
            updateMutation.mutate({ id: editing.id, payload })
            return
          }
          createMutation.mutate(payload)
        }}
        okText={editing ? '保存' : '创建应用'}
      >
        <Form form={appForm} layout="vertical">
          <Row gutter={12}>
            <Col span={12}><Form.Item name="appName" label="应用名称" rules={[{ required: true, message: '请输入应用名称' }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="appCode" label="应用 Code" rules={[{ required: true, message: '请输入应用 Code' }]}><Input disabled={Boolean(editing)} /></Form.Item></Col>
            <Col span={8}><Form.Item name="appType" label="应用类型" rules={[{ required: true, message: '请选择应用类型' }]}><Select options={appTypeOptions.map((item) => ({ label: item, value: item }))} /></Form.Item></Col>
            <Col span={8}><Form.Item name="authMode" label="登录协议"><Select options={authModeOptions.map((item) => ({ label: item, value: item }))} /></Form.Item></Col>
            <Col span={8}><Form.Item name="tenantId" label="租户范围"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="baseUrl" label="入口地址" rules={[{ required: true, message: '请输入入口地址' }]}><Input placeholder="/saas-workstation" /></Form.Item></Col>
            <Col span={12}><Form.Item name="homeUrl" label="首页地址"><Input placeholder="/saas-workstation/home" /></Form.Item></Col>
            <Col span={12}><Form.Item name="appId" label="AppID"><Input placeholder="可自动生成" /></Form.Item></Col>
            <Col span={12}><Form.Item name="appSecretMasked" label="AppSecret"><Input placeholder="创建时自动生成" /></Form.Item></Col>
            <Col span={12}><Form.Item name="tokenTtl" label="AccessToken 有效期(秒)"><InputNumber min={300} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="refreshTokenTtl" label="RefreshToken 有效期(秒)"><InputNumber min={3600} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={24}><Form.Item name="appDesc" label="应用描述"><Input.TextArea rows={3} /></Form.Item></Col>
            <Col span={24}><Form.Item name="callbackUrls" label="回调地址列表"><Select mode="tags" tokenSeparators={[',']} placeholder="输入回调地址后回车" /></Form.Item></Col>
            <Col span={8}><Form.Item name="tenantAccessEnabled" label="允许租户接入" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={8}><Form.Item name="defaultOpenToTenant" label="默认对新租户开放" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={8}><Form.Item name="enabled" label="启用状态" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={12}><Form.Item name="status" label="状态"><Select options={statusOptions} /></Form.Item></Col>
            <Col span={12}><Form.Item name="operatorId" label="操作人UID" rules={[{ required: true, message: '请输入操作人 UID' }]}><Input /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={currentApp ? `安全配置 - ${currentApp.appName}` : '安全配置'}
        open={securityOpen}
        width={760}
        onCancel={() => setSecurityOpen(false)}
        onOk={async () => {
          if (!currentApp) return
          const values = await securityForm.validateFields()
          updateMutation.mutate({ id: currentApp.id, payload: buildPayload(values) })
        }}
      >
        <Form form={securityForm} layout="vertical">
          <Row gutter={12}>
            <Col span={12}><Form.Item name="appId" label="AppID"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="appSecretMasked" label="AppSecret"><Input addonAfter={<Button size="small" type="link" onClick={() => currentApp && rotateMutation.mutate(currentApp.id)}>轮换 Secret</Button>} /></Form.Item></Col>
            <Col span={8}><Form.Item name="authMode" label="登录协议"><Select options={authModeOptions.map((item) => ({ label: item, value: item }))} /></Form.Item></Col>
            <Col span={8}><Form.Item name="tokenTtl" label="AccessToken TTL"><InputNumber min={300} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="refreshTokenTtl" label="RefreshToken TTL"><InputNumber min={3600} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={24}><Form.Item name="callbackUrls" label="回调地址列表"><Select mode="tags" tokenSeparators={[',']} /></Form.Item></Col>
            <Col span={12}><Form.Item name="homeUrl" label="首页地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="baseUrl" label="基础入口地址"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="tenantAccessEnabled" label="允许租户接入" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={12}><Form.Item name="defaultOpenToTenant" label="默认对新租户开放" valuePropName="checked"><Switch /></Form.Item></Col>
            <Col span={24}><Form.Item name="operatorId" label="操作人UID"><Input /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={currentApp ? `租户分发 - ${currentApp.appName}` : '租户分发'}
        open={distributeOpen}
        onCancel={() => setDistributeOpen(false)}
        onOk={async () => {
          if (!currentApp) return
          const values = await distributeForm.validateFields()
          distributeMutation.mutate({ id: currentApp.id, tenantIds: values.tenantIds ?? [] })
        }}
      >
        <Form form={distributeForm} layout="vertical">
          <Form.Item name="tenantIds" label="已分配租户">
            <Select
              mode="multiple"
              options={tenants.map((tenant) => ({ label: `${tenant.tenantName} (${tenant.tenantId})`, value: tenant.id }))}
              placeholder="选择允许访问该应用的租户"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={currentApp ? `应用详情 - ${currentApp.appName}` : '应用详情'}
        open={detailOpen}
        width={760}
        onClose={() => setDetailOpen(false)}
      >
        {currentApp && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="应用名称">{currentApp.appName}</Descriptions.Item>
              <Descriptions.Item label="应用 Code">{currentApp.appCode}</Descriptions.Item>
              <Descriptions.Item label="AppID">{currentApp.appId || '-'}</Descriptions.Item>
              <Descriptions.Item label="应用类型">{currentApp.appType || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColors[currentApp.status ?? (currentApp.enabled ? 'enabled' : 'disabled')]}>
                  {currentApp.status ?? (currentApp.enabled ? 'enabled' : 'disabled')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="允许租户接入">{currentApp.tenantAccessEnabled ? '是' : '否'}</Descriptions.Item>
              <Descriptions.Item label="首页地址">{currentApp.homeUrl || '-'}</Descriptions.Item>
              <Descriptions.Item label="入口地址">{currentApp.baseUrl}</Descriptions.Item>
              <Descriptions.Item label="Token 有效期">{currentApp.tokenTtl ?? '-'}s</Descriptions.Item>
              <Descriptions.Item label="RefreshToken 有效期">{currentApp.refreshTokenTtl ?? '-'}s</Descriptions.Item>
              <Descriptions.Item label="最近轮换 Secret">{currentApp.secretRotatedAt ? dayjs(currentApp.secretRotatedAt).format('YYYY-MM-DD HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="最后操作人">{currentApp.operatorId || '-'}</Descriptions.Item>
              <Descriptions.Item label="应用描述" span={2}>{currentApp.appDesc || '-'}</Descriptions.Item>
              <Descriptions.Item label="回调地址" span={2}>{(currentApp.callbackUrls ?? []).join('；') || '-'}</Descriptions.Item>
            </Descriptions>
            <Card size="small" title="租户使用情况">
              {(appTenantNames(currentApp.id).length ? appTenantNames(currentApp.id).join(' / ') : '暂无分发租户')}
            </Card>
            <Card size="small" title="权限边界摘要">
              菜单数：{currentApp.menuCount ?? 0} ｜ 权限点数：{currentApp.permissionCount ?? 0}
            </Card>
          </Space>
        )}
      </Drawer>
    </>
  )
}
