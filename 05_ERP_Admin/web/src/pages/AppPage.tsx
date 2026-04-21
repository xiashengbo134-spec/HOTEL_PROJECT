import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { useMemo, useState } from 'react'
import { authStorage } from '../auth/storage'
import {
  createApp,
  deleteApp,
  listApps,
  toggleAppStatus,
  updateApp,
  type AppPayload,
} from '../services/app'
import type { AdminApp } from '../types/app'

const defaultOperatorId = 'sys_admin_web'

export default function AppPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminApp | null>(null)
  const [form] = Form.useForm<AppPayload>()

  const { data, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: listApps,
  })

  const createMutation = useMutation({
    mutationFn: createApp,
    onSuccess: () => {
      message.success('应用创建成功')
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      setOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AppPayload }) => updateApp(id, payload),
    onSuccess: () => {
      message.success('应用更新成功')
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      setOpen(false)
      setEditing(null)
      form.resetFields()
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
    onSuccess: (_, variables) => {
      message.success(`应用已${variables.enabled ? '启用' : '禁用'}`)
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })

  const currentOperatorId = authStorage.getUser()?.uid ?? defaultOperatorId

  const onCreate = () => {
    const user = authStorage.getUser()
    setEditing(null)
    form.setFieldsValue({
      tenantId: user?.tenantId ?? 'global',
      appCode: '',
      appName: '',
      baseUrl: '',
      enabled: true,
      operatorId: user?.uid ?? defaultOperatorId,
    })
    setOpen(true)
  }

  const onEdit = (record: AdminApp) => {
    setEditing(record)
    form.setFieldsValue({
      tenantId: record.tenantId,
      appCode: record.appCode,
      appName: record.appName,
      baseUrl: record.baseUrl,
      enabled: record.enabled,
      operatorId: currentOperatorId,
    })
    setOpen(true)
  }

  const columns = useMemo(
    () => [
      { title: '应用编码', dataIndex: 'appCode' },
      { title: '应用名称', dataIndex: 'appName' },
      { title: '租户ID', dataIndex: 'tenantId' },
      { title: '入口地址', dataIndex: 'baseUrl' },
      {
        title: '状态',
        dataIndex: 'enabled',
        render: (enabled: boolean, record: AdminApp) => (
          <Switch
            checked={enabled}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            loading={toggleMutation.isPending}
            onChange={(checked) =>
              toggleMutation.mutate({
                id: record.id,
                enabled: checked,
                operatorId: currentOperatorId,
              })
            }
          />
        ),
      },
      {
        title: '标签',
        key: 'tag',
        render: (_: unknown, record: AdminApp) => (
          <Tag color={record.enabled ? 'green' : 'default'}>
            {record.enabled ? '运行中' : '已停用'}
          </Tag>
        ),
      },
      {
        title: '操作',
        key: 'actions',
        render: (_: unknown, record: AdminApp) => (
          <Space>
            <Button size="small" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除该应用吗？"
              onConfirm={() =>
                deleteMutation.mutate({
                  id: record.id,
                  operatorId: currentOperatorId,
                })
              }
            >
              <Button size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [currentOperatorId, deleteMutation, toggleMutation],
  )

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values })
      return
    }
    createMutation.mutate(values)
  }

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          应用管理
        </Typography.Title>
        <Button type="primary" onClick={onCreate}>
          新增应用
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={
          isLoading ||
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending ||
          toggleMutation.isPending
        }
        dataSource={data ?? []}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={editing ? '编辑应用' : '新增应用'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={onSubmit}
        okText={editing ? '保存' : '创建'}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="tenantId" label="租户ID" rules={[{ required: true, message: '请输入租户ID' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="appCode" label="应用编码" rules={[{ required: true, message: '请输入应用编码' }]}>
            <Input placeholder="例如 SAAS_WORKSTATION" disabled={Boolean(editing)} />
          </Form.Item>
          <Form.Item name="appName" label="应用名称" rules={[{ required: true, message: '请输入应用名称' }]}>
            <Input placeholder="例如 SaaS 工作站" />
          </Form.Item>
          <Form.Item name="baseUrl" label="入口地址" rules={[{ required: true, message: '请输入入口地址' }]}>
            <Input placeholder="/saas-workstation" />
          </Form.Item>
          <Form.Item name="enabled" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="operatorId" label="操作人UID" rules={[{ required: true, message: '请输入操作人UID' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
