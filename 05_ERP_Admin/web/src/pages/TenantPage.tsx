import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { authStorage } from '../auth/storage'
import { listApps } from '../services/app'
import {
  createTenant,
  deleteTenant,
  listTenants,
  updateTenant,
} from '../services/tenant'
import type { Tenant, TenantFormValues } from '../types/tenant'

const statusOptions = [
  { label: 'active', value: 'active' },
  { label: 'disabled', value: 'disabled' },
]

const defaultOperatorId = 'sys_admin_web'

const encodeMask = (ids: number[]): string => {
  let mask = 0n
  for (const id of ids) {
    mask |= 1n << BigInt(id)
  }
  return mask.toString()
}

const decodeMask = (maskRaw: string, ids: number[]): number[] => {
  const mask = BigInt(maskRaw || '0')
  return ids.filter((id) => ((mask >> BigInt(id)) & 1n) === 1n)
}

export default function TenantPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Tenant | null>(null)
  const [form] = Form.useForm<TenantFormValues>()

  const { data, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: listTenants,
  })
  const { data: apps = [] } = useQuery({
    queryKey: ['apps'],
    queryFn: listApps,
  })

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
    mutationFn: ({ id, payload }: { id: number; payload: TenantFormValues }) =>
      updateTenant(id, payload),
    onSuccess: () => {
      message.success('租户更新成功')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      setOpen(false)
      setEditing(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTenant(id, defaultOperatorId),
    onSuccess: () => {
      message.success('租户删除成功')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })

  const columns = useMemo(
    () => [
      { title: '租户名称', dataIndex: 'tenantName', key: 'tenantName' },
      { title: '租户ID', dataIndex: 'tenantId', key: 'tenantId' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
        ),
      },
      {
        title: '权限掩码',
        dataIndex: 'appPermissionMask',
        key: 'appPermissionMask',
      },
      {
        title: '开通应用',
        key: 'appNames',
        render: (_: unknown, record: Tenant) => {
          const selectedIds = decodeMask(
            record.appPermissionMask,
            apps.map((app) => app.id),
          )
          const names = apps
            .filter((app) => selectedIds.includes(app.id))
            .map((app) => app.appName)
          return names.length ? names.join(' / ') : '-'
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'actions',
        render: (_: unknown, record: Tenant) => (
          <Space>
            <Button size="small" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除该租户吗？"
              onConfirm={() => deleteMutation.mutate(record.id)}
            >
              <Button size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [apps, deleteMutation],
  )

  const onCreate = () => {
    const user = authStorage.getUser()
    setEditing(null)
    setOpen(true)
    form.setFieldsValue({
      tenantId: '',
      tenantName: '',
      status: 'active',
      appPermissionMask: '0',
      extJson: '',
      selectedAppIds: [],
      operatorId: user?.uid ?? defaultOperatorId,
    })
  }

  const onEdit = (tenant: Tenant) => {
    const user = authStorage.getUser()
    setEditing(tenant)
    setOpen(true)
    const selectedAppIds = decodeMask(
      tenant.appPermissionMask,
      apps.map((app) => app.id),
    )
    form.setFieldsValue({
      tenantId: tenant.tenantId,
      tenantName: tenant.tenantName,
      status: tenant.status,
      appPermissionMask: tenant.appPermissionMask,
      extJson: tenant.extJson ?? '',
      selectedAppIds,
      operatorId: user?.uid ?? defaultOperatorId,
    })
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    const appIds = (values.selectedAppIds as number[] | undefined) ?? []
    const appPermissionMask = encodeMask(appIds)
    const { selectedAppIds, ...rest } = values
    void selectedAppIds
    const payload: TenantFormValues = {
      ...rest,
      appPermissionMask,
      extJson: values.extJson || undefined,
      operatorId: values.operatorId || defaultOperatorId,
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload })
      return
    }
    createMutation.mutate(payload)
  }

  return (
    <>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          租户管理
        </Typography.Title>
        <Button type="primary" onClick={onCreate}>
          新增租户
        </Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data ?? []}
        loading={
          isLoading ||
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editing ? '编辑租户' : '新增租户'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText={editing ? '保存' : '创建'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="租户名称"
            name="tenantName"
            rules={[{ required: true, message: '请输入租户名称' }]}
          >
            <Input placeholder="请输入租户名称" />
          </Form.Item>
          <Form.Item
            label="租户ID"
            name="tenantId"
            rules={[{ required: true, message: '请输入租户ID' }]}
          >
            <Input placeholder="例如 tenant_10001" />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item
            label="应用权限掩码"
            name="appPermissionMask"
            rules={[{ required: true, message: '请输入应用权限掩码' }]}
          >
            <Input placeholder="由应用勾选自动计算" disabled />
          </Form.Item>
          <Form.Item
            label="开通应用"
            name="selectedAppIds"
            rules={[{ required: true, message: '请至少选择一个应用' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择租户可开通应用"
              options={apps.map((app) => ({ label: app.appName, value: app.id }))}
              onChange={(ids) => form.setFieldValue('appPermissionMask', encodeMask(ids))}
            />
          </Form.Item>
          <Form.Item label="扩展JSON" name="extJson">
            <Input.TextArea rows={3} placeholder='例如 {"region":"CN"}' />
          </Form.Item>
          <Form.Item
            label="操作人UID"
            name="operatorId"
            rules={[{ required: true, message: '请输入操作人UID' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
