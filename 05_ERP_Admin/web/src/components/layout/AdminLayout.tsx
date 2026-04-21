import {
  AppstoreOutlined,
  BookOutlined,
  LoginOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import type { ReactNode } from 'react'

const { Header, Content, Sider } = Layout

export type AdminMenuKey =
  | 'auth'
  | 'profile'
  | 'dict'
  | 'app'
  | 'user'
  | 'tenant'

interface AdminLayoutProps {
  selectedKey: AdminMenuKey
  onSelect: (key: AdminMenuKey) => void
  contentTitle: string
  children: ReactNode
}

const menuItems = [
  { key: 'auth', icon: <LoginOutlined />, label: 'IDaaS登录' },
  { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
  { key: 'dict', icon: <BookOutlined />, label: '字典管理' },
  { key: 'app', icon: <AppstoreOutlined />, label: '应用管理' },
  { key: 'user', icon: <TeamOutlined />, label: '用户管理' },
  { key: 'tenant', icon: <TeamOutlined />, label: '租户管理' },
]

export default function AdminLayout({
  selectedKey,
  onSelect,
  contentTitle,
  children,
}: AdminLayoutProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="dark">
        <div
          style={{
            height: 56,
            margin: 16,
            color: '#fff',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: '56px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
          }}
        >
          ERP Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(info) => onSelect(info.key as AdminMenuKey)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          酒店供应链 ERP 超级管理后台
        </Header>
        <Content style={{ margin: 16 }}>
          <Breadcrumb
            style={{ marginBottom: 12 }}
            items={[{ title: 'ERP 超级管理后台' }, { title: contentTitle }]}
          />
          <div
            style={{
              padding: 20,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
