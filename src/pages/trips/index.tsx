import React from 'react';
import { Button, Space, Spin, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { TripType } from '../../components/driverLogger/dailyLogs';
import { COMPANIES_LINK, TRIPS_LINK } from '../../utils/constants';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

export const getTripData = async () => {
  const { data } = await axiosClient.get(`/trips/`);
  return data;
};

const columns: TableProps<TripType>['columns'] = [
  {
    title: 'Actions',
    key: 'status',
    dataIndex: 'status',
    fixed: 'left',
    render: (_, { status, id }) => (
      <>
        <Link to={`${TRIPS_LINK}/${id}`}> <EyeOutlined /> See trip logs</Link>
        <br />
        <Link to={`${TRIPS_LINK}/${id}/add-log`}> <PlusOutlined /> Add trip log</Link>
      </>
    ),
  },
  {
    title: 'status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status, id }) => (
      <>
        {status === "ONGOING" && <span style={{color: "green"}}>On going</span>}
        {status === "CANCELLED" && <span style={{color: "red"}}> Cancelled</span>}
        {status === "COMPLETED" && <span style={{color: "blue"}}>Completed</span>}
      </>
    ),
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    render: (_, {company}) => <Link to={`${COMPANIES_LINK}/${company.id}`}>{company.name}</Link>,
  },
  {
    title: 'Start Date',
    dataIndex: 'start_date',
    key: 'start_date',
  },
  {
    title: 'End Date',
    dataIndex: 'end_date',
    key: 'end_date',
  },
  {
    title: 'from',
    dataIndex: 'starting_location',
    key: 'starting_location',
    render: (_, {starting_location}) => <span>{starting_location.address}</span>
  },
  {
    title: 'to',
    dataIndex: 'ending_location',
    key: 'ending_location',
    render: (_, {ending_location}) => <span>{ending_location.address}</span>
  },
  {
    title: 'Start milage',
    dataIndex: 'start_mileage',
    key: 'start_mileage',
  },
  {
    title: 'Recent milage reading',
    dataIndex: 'last_odm_reading',
    key: 'last_odm_reading',
  },
  {
    title: 'Manifest No.',
    dataIndex: 'manifest_no',
    key: 'manifest_no',
  },
  {
    title: 'shipper',
    dataIndex: 'shipper',
    key: 'shipper',
  },
  {
    title: 'commodity',
    dataIndex: 'commodity',
    key: 'commodity',
  },
  {
    title: 'Driver',
    dataIndex: 'driver',
    key: 'driver',
    render: (_, {driver}) => <span>{driver.license_number}</span>,
  },
  {
    title: 'Vehicle LN.',
    dataIndex: 'vehicle',
    key: 'vehicle',
    render: (_, {vehicle}) => <span>{vehicle.license_plate}</span>
  }
];

export const TripsList: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTripData
  });

  if(isLoading && !data) {
    <Spin fullscreen />
  }

  return (
      <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography.Title level={2}>Trips</Typography.Title>
              <Space>
              <Button type="primary" className='primary-btn'>Add Trip</Button>
              </Space>
          </div>
          <div>
          <Table<TripType> columns={columns} dataSource={data} scroll={{ x: 'max-content' }} />
          </div>
      </>
  )
}
