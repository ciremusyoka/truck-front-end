import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BuildOutlined,
  TruckFilled,
  LogoutOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { COMPANIES_LINK, TRIPS_LINK } from '../../utils/constants';
import Logo from '../logo';
import Footer from '../footer';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [logout, setLogout] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
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
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: (() => setLogout(true))
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