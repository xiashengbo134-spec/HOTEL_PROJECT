import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
import type { LoginCommand } from '../types/auth'
import { authStorage } from '../auth/storage'

export default function LoginPage() {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      authStorage.setToken(result.token)
      authStorage.setUser(result.user)
      message.success('登录成功')
      navigate('/', { replace: true })
    },
  })

  const onSubmit = async (values: LoginCommand) => {
    loginMutation.mutate(values)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 420, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          ERP Admin 登录
        </Typography.Title>
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="UID"
            name="uid"
            rules={[{ required: true, message: '请输入用户UID' }]}
          >
            <Input placeholder="例如 root_admin" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loginMutation.isPending}
          >
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}
