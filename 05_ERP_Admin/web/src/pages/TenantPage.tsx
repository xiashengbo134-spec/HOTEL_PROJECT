import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
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
import { listApps } from '../services/app'
import { createTenant, deleteTenant, listTenants, toggleTenantStatus, updateTenant } from '../services/tenant'
import type { Tenant, TenantFormValues, TenantStatus } from '../types/tenant'

const statusOptions: { label: string; value: TenantStatus }[] = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'disabled' },
  { label: '初始化中', value: 'initializing' },
  { label: '异常', value: 'exception' },
]
const statusColorMap: Record<TenantStatus, string> = {
  active: 'green',
  disabled: 'default',
  initializing: 'blue',
  exception: 'red',
}
const defaultOperatorId = 'sys_admin_web'

const encodeMask = (ids: number[]): string => {
  let mask = 0n
  for (const id of ids) {
    mask |= 1n << BigInt(id)
  }
  return mask.toString()
}

const buildInitChecks = (tenant: Tenant, apps: Array<{ id: number; appCode: string; enabled: boolean }>) => {
  const appIds = tenant.appIds ?? []
  const defaultAppValid = appIds.some((id) => apps.find((app) => app.id === id)?.appCode === tenant.defaultAppCode)
  return [
    { key: 'base', label: '租户基础信息完整', status: tenant.tenantName && tenant.tenantId ? '已完成' : '待处理' },
    { key: 'status', label: '租户状态为启用', status: tenant.status === 'active' ? '已完成' : '待处理' },
    { key: 'domain', label: '域名配置完成', status: tenant.fullDomain ? '已完成' : '待处理' },
    { key: 'route', label: '路由生成成功', status: tenant.routeStatus === 'ready' ? '已完成' : '待处理' },
    { key: 'app', label: '至少分配 1 个应用', status: appIds.length > 0 ? '已完成' : '待处理' },
    { key: 'default', label: '默认应用已设置', status: defaultAppValid ? '已完成' : '待处理' },
    { key: 'contact', label: '联系人信息完整', status: tenant.contactName && tenant.contactMobile ? '已完成' : '待处理' },
  ]
}

export default function TenantPage() {
  const queryClient = useQueryClient()
  const [queryForm] = Form.useForm()
  const [form] = Form.useForm<TenantFormValues>()
  const [open, setOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editing, setEditing] = useState<Tenant | null>(null)
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)

  const { data: tenants = [], isLoading } = useQuery({ queryKey: ['tenants'], queryFn: listTenants })
  const { data: apps = [] } = useQuery({ queryKey: ['apps'], queryFn: listApps })

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      message.success('租户创建成功')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TenantFormValues }) => updateTenant(id, payload),
    onSuccess: () => {
      message.success('租户更新成功')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      setOpen(false)
      setEditing(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, operatorId }: { id: number; operatorId: string }) => deleteTenant(id, operatorId),
    onSuccess: () => {
      message.success('租户删除成功')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TenantStatus }) => toggleTenantStatus(id, status),
    onSuccess: (_, vars) => {
      message.success(`租户状态已更新为 ${vars.status}`)
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })

  const operatorId = authStorage.getUser()?.uid ?? defaultOperatorId
  const filters = Form.useWatch([], queryForm) ?? {}

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const name = String(filters.tenantName ?? '').trim().toLowerCase()
      const tenantId = String(filters.tenantId ?? '').trim().toLowerCase()
      const status = filters.status as TenantStatus | undefined
      const appCode = String(filters.appCode ?? '').trim()
      if (name && !tenant.tenantName.toLowerCase().includes(name)) return false
      if (tenantId && !tenant.tenantId.toLowerCase().includes(tenantId)) return false
      if (status && tenant.status !== status) return false
      if (appCode) {
        const hasApp = (tenant.appIds ?? []).some((id) => apps.find((app) => app.id === id)?.appCode === appCode)
        if (!hasApp) return false
      }
      return true
    })
  }, [apps, filters, tenants])

  const appNameByIds = (ids: number[] | undefined) =>
    (ids ?? []).map((id) => apps.find((app) => app.id === id)?.appName).filter(Boolean).join(' / ') || '-'

  const openCreate = () => {
    setEditing(null)
    form.setFieldsValue({
      tenantName: '',
      tenantId: '',
      shortName: '',
      status: 'active',
      initStatus: 'completed',
      routeStatus: 'ready',
      subdomainPrefix: '',
      fullDomain: '',
      selectedAppIds: [],
      appIds: [],
      appPermissionMask: '0',
      defaultAppCode: undefined,
      contactName: '',
      contactMobile: '',
      contactEmail: '',
      remark: '',
      extJson: '',
      operatorId,
    })
    setOpen(true)
  }

  const openEdit = (tenant: Tenant) => {
    setEditing(tenant)
    form.setFieldsValue({
      tenantName: tenant.tenantName,
      tenantId: tenant.tenantId,
      shortName: tenant.shortName,
      status: tenant.status,
      initStatus: tenant.initStatus,
      routeStatus: tenant.routeStatus,
      subdomainPrefix: tenant.subdomainPrefix,
      fullDomain: tenant.fullDomain,
      selectedAppIds: tenant.appIds ?? [],
      appIds: tenant.appIds ?? [],
      appPermissionMask: tenant.appPermissionMask,
      defaultAppCode: tenant.defaultAppCode,
      contactName: tenant.contactName,
      contactMobile: tenant.contactMobile,
      contactEmail: tenant.contactEmail,
      remark: tenant.remark,
      extJson: tenant.extJson ?? '',
      operatorId,
    })
    setOpen(true)
  }

  const openDetail = (tenant: Tenant) => {
    setCurrentTenant(tenant)
    setDetailOpen(true)
  }

  const onAppChange = (ids: number[]) => {
    form.setFieldValue('selectedAppIds', ids)
    form.setFieldValue('appIds', ids)
    form.setFieldValue('appPermissionMask', encodeMask(ids))
    const currentDefault = form.getFieldValue('defaultAppCode')
    const valid = ids.some((id) => apps.find((app) => app.id === id)?.appCode === currentDefault)
    if (!valid) {
      form.setFieldValue('defaultAppCode', apps.find((app) => ids.includes(app.id))?.appCode)
    }
  }

  const columns = [
    { title: '租户名称', dataIndex: 'tenantName' },
    { title: '租户编码', dataIndex: 'tenantId' },
    {
      title: '租户状态',
      dataIndex: 'status',
      render: (value: TenantStatus) => <Tag color={statusColorMap[value]}>{value}</Tag>,
    },
    { title: '初始化状态', dataIndex: 'initStatus', render: (value: string | undefined) => value || '-' },
    { title: '访问域名', dataIndex: 'fullDomain', render: (value: string | undefined) => value || '-' },
    { title: '已分配应用', render: (_: unknown, record: Tenant) => appNameByIds(record.appIds) },
    { title: '默认应用', dataIndex: 'defaultAppCode', render: (value: string | undefined) => value || '-' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
    { title: '最后操作人', dataIndex: 'operatorId' },
    {
      title: '操作',
      render: (_: unknown, record: Tenant) => (
        <Space wrap>
          <Button size="small" onClick={() => openDetail(record)}>详情</Button>
          <Button size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Switch
            size="small"
            checked={record.status === 'active'}
            checkedChildren="启"
            unCheckedChildren="停"
            onChange={(checked) => toggleMutation.mutate({ id: record.id, status: checked ? 'active' : 'disabled' })}
          />
          <Popconfirm title="确认删除该租户吗？" onConfirm={() => deleteMutation.mutate({ id: record.id, operatorId })}>
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
          <Typography.Title level={4} style={{ margin: 0 }}>租户管理</Typography.Title>
          <Typography.Text type="secondary">
            维护 SaaS 租户空间、访问入口与应用分发关系，支持初始化检查与状态管控。
          </Typography.Text>
        </Space>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Form form={queryForm} layout="vertical">
          <Row gutter={12}>
            <Col span={6}><Form.Item name="tenantName" label="租户名称"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="tenantId" label="租户编码"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="status" label="租户状态"><Select allowClear options={statusOptions} /></Form.Item></Col>
            <Col span={6}><Form.Item name="appCode" label="绑定应用 Code"><Select allowClear options={apps.map((app) => ({ label: app.appCode, value: app.appCode }))} /></Form.Item></Col>
          </Row>
          <Space>
            <Button type="primary" onClick={openCreate}>新建租户</Button>
            <Button onClick={() => queryForm.resetFields()}>重置筛选</Button>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['tenants'] })}>刷新</Button>
          </Space>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredTenants}
        loading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editing ? '编辑租户' : '新建租户'}
        open={open}
        width={980}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={async () => {
          const values = await form.validateFields()
          const appIds = values.appIds ?? values.selectedAppIds ?? []
          const payload: TenantFormValues = {
            ...values,
            appIds,
            selectedAppIds: appIds,
            appPermissionMask: encodeMask(appIds),
            operatorId: values.operatorId || operatorId,
          }
          if (editing) {
            updateMutation.mutate({ id: editing.id, payload })
            return
          }
          createMutation.mutate(payload)
        }}
        okText={editing ? '保存租户' : '创建租户'}
      >
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            <Col span={12}><Form.Item name="tenantName" label="租户名称" rules={[{ required: true, message: '请输入租户名称' }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="tenantId" label="租户编码" rules={[{ required: true, message: '请输入租户编码' }]}><Input disabled={Boolean(editing)} /></Form.Item></Col>
            <Col span={8}><Form.Item name="shortName" label="租户简称"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="contactName" label="联系人"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="contactMobile" label="联系电话"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="contactEmail" label="联系邮箱"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="status" label="租户状态" rules={[{ required: true, message: '请选择租户状态' }]}><Select options={statusOptions} /></Form.Item></Col>
            <Col span={8}><Form.Item name="initStatus" label="初始化状态"><Select options={[{ label: '已完成', value: 'completed' }, { label: '待处理', value: 'pending' }, { label: '异常', value: 'exception' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="routeStatus" label="路由状态"><Select options={[{ label: 'ready', value: 'ready' }, { label: 'pending', value: 'pending' }, { label: 'failed', value: 'failed' }]} /></Form.Item></Col>
            <Col span={8}><Form.Item name="subdomainPrefix" label="二级域名前缀"><Input /></Form.Item></Col>
            <Col span={16}><Form.Item name="fullDomain" label="完整访问域名"><Input placeholder="demo001.example.com" /></Form.Item></Col>
            <Col span={24}><Form.Item name="selectedAppIds" label="应用分配" rules={[{ required: true, message: '至少选择一个应用' }]}><Select mode="multiple" options={apps.filter((app) => app.enabled).map((app) => ({ label: `${app.appName} (${app.appCode})`, value: app.id }))} onChange={onAppChange} /></Form.Item></Col>
            <Col span={12}><Form.Item name="defaultAppCode" label="默认应用" rules={[{ required: true, message: '请选择默认应用' }]}><Select options={(form.getFieldValue('selectedAppIds') ?? []).map((id: number) => { const app = apps.find((item) => item.id === id); return { label: app?.appName, value: app?.appCode } })} /></Form.Item></Col>
            <Col span={12}><Form.Item name="appPermissionMask" label="应用权限掩码"><Input disabled /></Form.Item></Col>
            <Col span={24}><Form.Item name="remark" label="备注"><Input.TextArea rows={2} /></Form.Item></Col>
            <Col span={24}><Form.Item name="extJson" label="扩展 JSON"><Input.TextArea rows={3} placeholder='例如 {"region":"CN"}' /></Form.Item></Col>
            <Col span={24}><Form.Item name="operatorId" label="操作人UID" rules={[{ required: true, message: '请输入操作人 UID' }]}><Input /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title={currentTenant ? `租户详情 - ${currentTenant.tenantName}` : '租户详情'}
        open={detailOpen}
        width={860}
        onClose={() => setDetailOpen(false)}
      >
        {currentTenant && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="租户名称">{currentTenant.tenantName}</Descriptions.Item>
              <Descriptions.Item label="租户编码">{currentTenant.tenantId}</Descriptions.Item>
              <Descriptions.Item label="租户状态"><Tag color={statusColorMap[currentTenant.status]}>{currentTenant.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="初始化状态">{currentTenant.initStatus || '-'}</Descriptions.Item>
              <Descriptions.Item label="访问域名">{currentTenant.fullDomain || '-'}</Descriptions.Item>
              <Descriptions.Item label="默认应用">{currentTenant.defaultAppCode || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系人">{currentTenant.contactName || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentTenant.contactMobile || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系邮箱">{currentTenant.contactEmail || '-'}</Descriptions.Item>
              <Descriptions.Item label="最近活跃时间">{currentTenant.lastActiveAt ? dayjs(currentTenant.lastActiveAt).format('YYYY-MM-DD HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{dayjs(currentTenant.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{dayjs(currentTenant.updatedAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentTenant.remark || '-'}</Descriptions.Item>
              <Descriptions.Item label="扩展 JSON" span={2}>{currentTenant.extJson || '-'}</Descriptions.Item>
            </Descriptions>
            <Card size="small" title="已分配应用">
              {appNameByIds(currentTenant.appIds)}
            </Card>
            <Card size="small" title="初始化检查">
              <Space direction="vertical" style={{ width: '100%' }}>
                {buildInitChecks(currentTenant, apps).map((item) => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.label}</span>
                    <Tag color={item.status === '已完成' ? 'green' : 'orange'}>{item.status}</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>
    </>
  )
}
