import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Space, Switch, Table, Typography, message } from 'antd'
import { useState } from 'react'
import { authStorage } from '../auth/storage'
import { createApp, listApps, type AppPayload } from '../services/app'

export default function AppPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
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

  const onCreate = () => {
    const user = authStorage.getUser()
    form.setFieldsValue({
      tenantId: user?.tenantId ?? 'global',
      enabled: true,
      operatorId: user?.uid ?? 'sys_admin_web',
    } as AppPayload)
    setOpen(true)
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
        loading={isLoading}
        dataSource={data ?? []}
        columns={[
          { title: '应用编码', dataIndex: 'appCode' },
          { title: '应用名称', dataIndex: 'appName' },
          { title: '入口地址', dataIndex: 'baseUrl' },
          { title: '状态', dataIndex: 'enabled', render: (v: boolean) => (v ? '启用' : '禁用') },
        ]}
      />
      <Modal
        title="新增应用"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields()
          createMutation.mutate(values)
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="tenantId" label="租户ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="appCode" label="应用编码" rules={[{ required: true }]}>
            <Input placeholder="例如 SAAS_WORKSTATION" />
          </Form.Item>
          <Form.Item name="appName" label="应用名称" rules={[{ required: true }]}>
            <Input placeholder="例如 SaaS 工作站" />
          </Form.Item>
          <Form.Item name="baseUrl" label="入口地址" rules={[{ required: true }]}>
            <Input placeholder="/saas-workstation" />
          </Form.Item>
          <Form.Item name="enabled" label="启用状态" valuePropName="checked">
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
