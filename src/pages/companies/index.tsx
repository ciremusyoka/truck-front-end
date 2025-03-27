import React from 'react';
import { Button, Space, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../utils/axiosClient';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { API_DOCS_LINK, TRIPS_LINK } from '../../utils/constants';

const getCompanyData = async () => {
  const { data } = await axiosClient.get(`/companies/`);
  return data;
};

type CompanyType = {
  id: number;
  name: string;
  main_office_address: string;
  phone_number: string;
  email: string;
  created_by: number;
  admins: number[];
  date_created: string; // ISO date string
  date_updated: string; // ISO date string
};

const columns: TableProps<CompanyType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    render: (_, {name}) => (
      <>
      <div>{name}</div>
      <Link to={`${TRIPS_LINK}`}>COMPANY TRIPS <ArrowRightOutlined /></Link>
      </>
    )
  },
  {
    title: 'Address',
    dataIndex: 'main_office_address',
    key: 'main_office_address',
  },
  {
    title: 'Phone number',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title: 'Phone number',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Date Created',
    dataIndex: 'date_created',
    key: 'date_created',
  },
];


export const CompaniesList: React.FC = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanyData
  });

  if(isLoading) {
    <Spin fullscreen />
  }
  return(
      <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography.Title level={2}>Companies</Typography.Title>
              <Space>
              <Button onClick={() => navigate(`${API_DOCS_LINK}?tab=3`)} type="primary" className='primary-btn'>Add Driver</Button>
              <Button onClick={() => navigate(`${API_DOCS_LINK}?tab=5`)} type="primary" className='primary-btn'>Add Trip</Button>
              <Button onClick={() => navigate(`${API_DOCS_LINK}?tab=2`)} type="primary" className='primary-btn'>Add Company</Button>
              <Button onClick={() => navigate(`${API_DOCS_LINK}?tab=4`)} type="primary" className='primary-btn'>Add Vehicle</Button>
              </Space>
          </div>
          <Table<CompanyType> columns={columns} dataSource={data} />
      </>
  )
}
