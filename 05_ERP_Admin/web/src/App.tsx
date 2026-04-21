import { Button, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { authStorage } from './auth/storage'
import AdminLayout, { type AdminMenuKey } from './components/layout/AdminLayout'
import AppPage from './pages/AppPage'
import TenantPage from './pages/TenantPage'
import UserPage from './pages/UserPage'

const placeholderText: Record<Exclude<AdminMenuKey, 'tenant'>, string> = {
  auth: 'IDaaS 登录页面（预留）',
  profile: '个人中心页面（预留）',
  dict: '字典管理页面（预留）',
  app: '应用管理页面（预留）',
  user: '用户管理页面（预留）',
}

const pageTitleMap: Record<AdminMenuKey, string> = {
  auth: 'IDaaS登录',
  profile: '个人中心',
  dict: '字典管理',
  app: '应用管理',
  user: '用户管理',
  tenant: '租户管理',
}

const demoUser = {
  userId: 0,
  uid: 'demo_admin',
  username: '演示管理员',
  tenantId: 'demo',
  roleCode: 'super_admin',
}

function App() {
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState<AdminMenuKey>('tenant')
  const user = authStorage.getUser() ?? demoUser

  const content = useMemo(() => {
    if (selectedKey === 'tenant') return <TenantPage />
    if (selectedKey === 'app') return <AppPage />
    if (selectedKey === 'user') return <UserPage />
    return <Typography.Text>{placeholderText[selectedKey]}</Typography.Text>
  }, [selectedKey])

  const adminContent = (
    <AdminLayout
      selectedKey={selectedKey}
      onSelect={setSelectedKey}
      contentTitle={pageTitleMap[selectedKey]}
    >
      <div style={{ marginBottom: 12, textAlign: 'right' }}>
        <Tag color="processing" style={{ marginRight: 12 }}>
          演示模式
        </Tag>
        <Typography.Text style={{ marginRight: 12 }}>
          当前用户：{user.username} ({user.tenantId ?? 'global'})
        </Typography.Text>
        <Button
          size="small"
          onClick={() => {
            authStorage.clear()
            navigate('/', { replace: true })
          }}
        >
          重置演示状态
        </Button>
      </div>
      {content}
    </AdminLayout>
  )

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={adminContent} />
    </Routes>
  )
}

export default App
