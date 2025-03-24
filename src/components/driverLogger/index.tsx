import React, { useRef } from "react";
import { Typography, Row, Col, Divider, Card, Flex, Button, Space } from "antd";
import { DateTime } from "luxon";
import {  XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Legend, Line } from "recharts";
import style from './index.module.css';
import { useReactToPrint } from "react-to-print";
const { Title, Text } = Typography;


const data = [
    {
        "category": "OFF_DUTY",
        "date_created": "2024-03-20T00:00:00Z",
        "from": "2024-03-20T00:00:00Z",
        "to": "2024-03-20T06:00:00Z"
    },
    {
        "id": 1,
        "trip_id": 1,
        "category": "ON_DUTY",
        "remarks": "Pre-trip inspection completed",
        "location": {
            "lat": 40.7128,
            "lng": -74.006
        },
        "odm_reading": 12345,
        "date_created": "2024-03-20T06:00:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T06:00:00Z",
        "to": "2024-03-20T07:00:00Z"
    },
    {
        "id": 2,
        "trip_id": 1,
        "category": "DRIVING",
        "remarks": "Started trip from terminal",
        "location": {
            "lat": 40.7138,
            "lng": -74.007
        },
        "odm_reading": 12350,
        "date_created": "2024-03-20T07:00:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T07:00:00Z",
        "to": "2024-03-20T10:00:00Z"
    },
    {
        "id": 3,
        "trip_id": 1,
        "category": "ON_DUTY",
        "remarks": "Fuel stop",
        "location": {
            "lat": 40.72,
            "lng": -74.01
        },
        "odm_reading": 12400,
        "date_created": "2024-03-20T10:00:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T10:00:00Z",
        "to": "2024-03-20T10:30:00Z"
    },
    {
        "id": 4,
        "trip_id": 1,
        "category": "DRIVING",
        "remarks": "Resumed trip after fuel stop",
        "location": {
            "lat": 40.73,
            "lng": -74.02
        },
        "odm_reading": 12410,
        "date_created": "2024-03-20T10:30:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T10:30:00Z",
        "to": "2024-03-20T14:00:00Z"
    },
    {
        "id": 5,
        "trip_id": 1,
        "category": "SLEEPER_BERTH",
        "remarks": "Rest break",
        "location": {
            "lat": 40.75,
            "lng": -74.04
        },
        "odm_reading": 12450,
        "date_created": "2024-03-20T14:00:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T14:00:00Z",
        "to": "2024-03-20T16:00:00Z"
    },
    {
        "id": 6,
        "trip_id": 1,
        "category": "DRIVING",
        "remarks": "Resumed trip after break",
        "location": {
            "lat": 40.77,
            "lng": -74.06
        },
        "odm_reading": 12470,
        "date_created": "2024-03-20T16:00:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T16:00:00Z",
        "to": "2024-03-20T18:00:00Z"
    },
    {
        "id": 7,
        "trip_id": 1,
        "category": "ON_DUTY",
        "remarks": "Delivery stop",
        "location": {
            "lat": 40.79,
            "lng": -74.08
        },
        "odm_reading": 12500,
        "date_created": "2024-03-20T18:00:00Z",
        "deleted": false,
        "date": "2024-03-20",
        "from": "2024-03-20T18:00:00Z",
        "to": "2024-03-20T20:00:00Z"
    }
]

const newData: any = []
data.map(dt => {
    newData.push({
        from: getHourFromDate(dt.from),
        to: getHourFromDate(dt.to),
        hours: getHourDifference(dt.from, dt.to),
        activity: dt.category,
    })

    newData.push({
        from:getHourFromDate(dt.to),
        to: getHourFromDate(dt.to),
        hours: getHourDifference(dt.from, dt.to),
        activity: dt.category,
    })
})

function getHourFromDate(dateStr: string) {
    const dt = DateTime.fromISO(dateStr, { setZone: true });
    return dt.hour + dt.minute / 60;
}

function getHourDifference(from: string, to: string): number {
    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();
    return (toTime - fromTime) / (1000 * 60 * 60);
}
  
  const activityLabels:any = {
    1: "OFF_DUTY",
    2: "ON_DUTY",
    3: "DRIVING",
    4: "SLEEPER_BERTH",
  };

  const activityOrder = ["", "ON_DUTY", "DRIVING", "SLEEPER_BERTH", "OFF_DUTY", "_"]
  
  const LogLineChart = () => {
    return (
      <LineChart width={900} height={300} data={newData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="from" type="number" orientation="top" tickCount={25} domain={[0, 24]} />
        <YAxis 
            type="category" 
          dataKey="activity"
          domain={activityOrder}
          
        />
        <Tooltip formatter={(value) => activityLabels[value as number]} />
        <Legend />
        <Line type="monotone" dataKey="activity" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    );
  };

export const DriversDailyLog = () => {
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
      });
  return (
    <div >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
            <Typography.Title level={2}>Companies</Typography.Title>
            <Space>
            <Button onClick={() => handlePrint()} type="primary" className='primary-btn'>Print</Button>
            </Space>
        </div>
        <div ref={printRef} id="driver-logger" className={style.wrapper} style={{ padding: 20,  margin: "auto" }}>
            <Row gutter={16} style={{ marginTop: 10 }}>
                <Col span={8}>
                    <h2 className={style.header}>Drivers Daily Log</h2>
                    <Text className={style.hours}>(24 hours)</Text>
                </Col>
                <Col span={7}>
                    <Flex gap={16}>
                        <span>
                            <Text className="underline" >January</Text> <Text>/</Text> <br/>
                            <Text>(Month)</Text>
                        </span>
                        <span>
                            <Text className="underline" >10</Text> <Text>/</Text> <br/>
                            <Text>(Day)</Text>
                        </span>
                        <span>
                            <Text className="underline" >2025</Text> <Text>/</Text> <br/>
                            <Text>(Year)</Text>
                        </span>
                    </Flex>
                </Col>
                <Col span={9}>
                    <span>
                        <Text>Original - File at home terminal</Text> <br/>
                        <Text>Duplicate - Driver retails in his/her possession 8 days</Text>
                    </span>
                </Col>
            </Row>
            <Divider />

            <Row className={style.locationWrapper}>
                <Col span={12}>
                    <div className={`${style.location}`}>Form: Nairobi</div>
                </Col>
                <Col span={12}>
                    <div className={`${style.location}`}> To: Mombasa</div>
                </Col>
            </Row>

                <br/><br/>
            <Row className={style.milageSection}>
                <Col span={12}>
                    <br />
                    <Row>
                        <Col span={12}>
                            <div className={style.box}>1000</div>
                            <div className={style.company}>Total miles driving today</div>
                        </Col>
                        <Col span={12}>
                            <div className={style.box}>1000</div>
                            <div className={style.company}>Total milage today</div>
                        </Col>
                    </Row>
                    <br/>
                    <div className={style.box}>KCS</div>
                    <div className={style.company}>Truck and trailler number or licence plate</div>
                </Col>
                <Col span={12}>
                    <div className={`${style.location}`}>Ghetto transpotters</div>
                    <div className={`${style.location} ${style.company}`}>Name of carrier or carriers</div>
                    <br/>
                    <div className={`${style.location}`}>Nairobi kenya</div>
                    <div className={`${style.location} ${style.company}`}>Main office address</div>
                    <br/>
                    <div className={`${style.location}`}>Ghetto transpotters</div>
                    <div className={`${style.location} ${style.company}`}>Name of carrier or carriers</div>
                </Col>
            </Row>
            
            <Divider />

            <Row>
                <Col span={18}><LogLineChart /></Col>
                <Col span={6}>
                    <div className={style.milageCounter}>Total Hours</div>
                    <br/><br/><br/> <br/>
                    <div className={style.milageCounter}>10</div>
                    <br/><br/>
                    <div className={style.milageCounter}>10</div>
                    <br/><br/>
                    <div className={style.milageCounter}>10</div>
                    <br/><br/>
                    <div className={style.milageCounter}>10</div>
                    <br/><br/>
                    <div className={style.milageCounter}>100</div>
                    <div className={style.milageCounter}></div>
                </Col>
            </Row>
            
            {/* Remarks Section */}
            <Card size="small" title="Remarks">
                <Text>__________________________________</Text>
            </Card>
            <Divider />
            
            <Row gutter={16}>
                <Col span={16}>
                <Card size="small" title="Shipping Documents">
                    <Text>DVU or Manifest No: __________</Text>
                    <br />
                    <Text>Shipper & Commodity: __________</Text>
                </Card>
                </Col>

                <Col span={8} className={style.recap}>
                    <Title level={4}>Recap</Title>
                    <div> <Text>On Duty Hours Today: ______</Text></div>
                    <div><Text>Total Hours Last 8 Days: ______</Text></div>
                </Col>
            </Row>
        </div>
    </div>
  );
};
