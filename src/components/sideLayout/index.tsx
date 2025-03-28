import React, { useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BuildOutlined,
  TruckFilled,
  LogoutOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_DOCS_LINK, COMPANIES_LINK, COOKIE_NAME, LOGIN_LINK, TRIPS_LINK } from '../../utils/constants';
import Logo from '../logo';
import Footer from '../footer';
import { getAuthToken } from '../../utils/axiosClient';
import Cookies from 'js-cookie';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const token = getAuthToken()

  if (!token ) {
      return <Navigate to="/" replace />;
  }

  const logout = () => {
    Cookies.remove(COOKIE_NAME);
    window.location.href = LOGIN_LINK;
    return;
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{paddingLeft: "8px"}} className="demo-logo-vertical">
            <br/>
            <Logo />
            <br/><br/>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['trips']}
          items={[
            {
              key: 'trips',
              icon: <TruckFilled />,
              label: 'Trips',
              onClick: (() => navigate(TRIPS_LINK))
            },
            {
              key: 'companies',
              icon: <BuildOutlined />,
              label: 'Companies',
              onClick: (() => navigate(COMPANIES_LINK))
            },
            {
              key: 'docs',
              icon: <BuildOutlined />,
              label: 'Docs',
              onClick: (() => navigate(API_DOCS_LINK))
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: (logout)
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: "85vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <div>
        <Footer />
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;