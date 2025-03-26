import { useEffect, useRef , useState} from "react";
import { Typography, Button, Space, Spin, TabsProps, Tabs } from "antd";
import { useReactToPrint } from "react-to-print";
import { useQueries, useQuery } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";
import { DriversDailyLog } from "./dailyLogs";

const getTripLogs = (tripId: string) => async () => {
  const { data } = await axiosClient.get(`/trips/${tripId}/logs_time_series/`);
  return data;
};

const getTripData = (tripId: string) => async () => {
    const { data } = await axiosClient.get(`/trips/${tripId}/`);
    return data;
};

const MAP_KEY = "map"

export const DriverLogs = () => {
    const [activeTabKey, setActiveTabKey] = useState("");
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
    });

    const queryData = useQueries({
        queries: [
          { queryKey: ["trip_log"], queryFn: getTripLogs('1') },
          { queryKey: ["trip_data"], queryFn: getTripData('1') },
        ],
    });

    const tripLogData = queryData[0].data;
    const isLoading = queryData[0].isLoading || queryData[1].isLoading;
    const tripData = queryData[1].data

    useEffect(() => {
        if(tripLogData && !activeTabKey && Object.keys(tripLogData).length > 0) {
            setActiveTabKey(Object.keys(tripLogData)[0])
        }
    }, [tripLogData]);
    
    if(isLoading) {
        return <Spin fullscreen />
    }

    const onChange = (key: string) => {
        setActiveTabKey(key)
    };
    
    const dateTabs = Object.keys(tripLogData).map((value) => ({key: value, label: value})) || []
    const tabMenuItems: TabsProps['items'] = [
        ...dateTabs,
        {
          key: MAP_KEY,
          label: "Map",
        },
    ];
    
    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Typography.Title level={2}>
                    <Tabs defaultActiveKey="1" items={tabMenuItems} onChange={onChange} />
                </Typography.Title>
                <Space>
                <Button onClick={() => handlePrint()} type="primary" className='primary-btn'>Print</Button>
                </Space>
            </div>
            {activeTabKey && activeTabKey !== MAP_KEY && (
                <DriversDailyLog
                    printRef={printRef}
                    data={tripLogData[activeTabKey]}
                    date={activeTabKey}
                    trip={tripData}
                />
            )}
        </div>
    );
};
