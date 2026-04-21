import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Typography,
  message,
} from 'antd'
import { useState } from 'react'
import { authStorage } from '../auth/storage'
import { createUser, listUsers } from '../services/user'
import type { CreateUserPayload } from '../types/user'

export default function UserPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<CreateUserPayload>()

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success('用户创建成功')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpen(false)
      form.resetFields()
    },
  })

  const onCreate = () => {
    const user = authStorage.getUser()
    form.setFieldsValue({
      tenantId: user?.tenantId ?? null,
      roleCode: 'TENANT_OWNER',
      isActive: true,
      operatorId: user?.uid ?? 'sys_admin_web',
    })
    setOpen(true)
  }

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          用户管理
        </Typography.Title>
        <Button type="primary" onClick={onCreate}>
          新增用户
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={data ?? []}
        columns={[
          { title: 'UID', dataIndex: 'uid' },
          { title: '用户名', dataIndex: 'username' },
          { title: '租户ID', dataIndex: 'tenantId' },
          { title: '角色', dataIndex: 'roleCode' },
          { title: '状态', dataIndex: 'isActive', render: (v: boolean) => (v ? '启用' : '禁用') },
        ]}
      />
      <Modal
        title="新增用户"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields()
          createMutation.mutate(values)
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="uid" label="UID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="tenantId" label="租户ID">
            <Input />
          </Form.Item>
          <Form.Item name="roleCode" label="角色" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'SYSTEM_ADMIN', value: 'SYSTEM_ADMIN' },
                { label: 'TENANT_OWNER', value: 'TENANT_OWNER' },
              ]}
            />
          </Form.Item>
          <Form.Item name="isActive" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="operatorId" label="操作人UID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
