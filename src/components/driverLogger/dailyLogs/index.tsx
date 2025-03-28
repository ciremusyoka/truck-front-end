import React from "react";
import { Typography, Row, Col, Divider, Card, Flex } from "antd";
import { DateTime } from "luxon";
import {  XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Legend, Line } from "recharts";
import style from '../index.module.css';


const { Title, Text } = Typography;

export type TripType = {
    id: number;
    start_date: string;
    last_odm_reading: number;
    vehicle: {
      id: number;
      license_plate: string;
      truck_number: string;
    };
    company: {
      id: number;
      name: string;
      main_office_address: string;
    };
    driver: {
      id: number;
      home_terminal: string;
      license_number: string;
    };
    end_date: string | null;
    starting_location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    ending_location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    start_mileage: number;
    end_mileage: number | null;
    status: "ONGOING" | "COMPLETED" | "CANCELLED";
    manifest_no: string;
    shipper: string;
    commodity: string;
    deleted: boolean;
};

export type CategoryType = "OFF_DUTY" |"ON_DUTY" | "DRIVING" | "SLEEPER_BERTH";
type ActivityTime = Record<CategoryType, number>

type Location = {
    lat: number;
    lng: number;
  };
  
export type SeriesData = {
    id: number;
    trip_id: number;
    category: CategoryType;
    remarks: string;
    location: Location;
    odm_reading: number;
    date_created: string;
    deleted: boolean;
    date: string;
    from: string | number;
    to: string | number;
};

// export type SeriesData = BaseSeriesData;

type ProcessedSeriesData = {
    hours: number;
} & SeriesData;

export type DriversDailyLogProps = {
    printRef: React.RefObject<null>;
    data: SeriesData[];
    date: string;
    trip: TripType
}

const processSeriesData = (data: SeriesData[]) => {
    const processedData: ProcessedSeriesData[] = []
    let totalTime: number = 0;
    const activityTime: ActivityTime  = {} as any;
    data.forEach((dt) => {
        const hours = getHourDifference(dt.from as string, dt.to as string)
        totalTime += hours
        activityTime[dt.category] = (activityTime[dt.category] || 0) + hours
        processedData.push({
            ...dt,
            from: getHourFromDate(dt.from as string),
            to: getHourFromDate(dt.to as string),
            hours,
        })

        processedData.push({
            ...dt,
            from:getHourFromDate(dt.to as string),
            to: getHourFromDate(dt.to as string),
            hours
        })
    })
    return {processedData, activityTime, totalTime}
}

function getHourFromDate(dateStr: string) {
    const dt = DateTime.fromISO(dateStr, { setZone: true });
    return dt.hour + dt.minute / 60;
}

function getHourDifference(from: string, to: string): number {
    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();
    return (toTime - fromTime) / (1000 * 60 * 60);
}
  


const activityOrder = ["", "ON_DUTY", "DRIVING", "SLEEPER_BERTH", "OFF_DUTY", "_"]

const categoriesRedable:Record<CategoryType, string> = {
    OFF_DUTY: "Off duty",
    ON_DUTY: "On duty",
    DRIVING: "Driving",
    SLEEPER_BERTH: "Sleeper berth"
}

const ToolTipCustom = ({data}: {data: ProcessedSeriesData}) => {
    return (
        <>
            <div>Hours: {data.hours}</div>
            <div>Remarks: {data.remarks}</div>
            <div>ODM reading: {data.odm_reading}</div>
            <div>Activity: {categoriesRedable[data.category]}</div>
        </>
    )
}
  
const LogLineChart = ({data}: {data: ProcessedSeriesData[]}) => {
    return (
        <LineChart width={900} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="from" type="number" orientation="top" tickCount={25} domain={[0, 24]} />
        <YAxis 
            type="category" 
            dataKey="category"
            domain={activityOrder}
            
        />
        {/* <Tooltip formatter={(_, test, data) => (<ToolTipCustom data={data.payload} />)} /> */}
        <Legend />
        <Line type="monotone" dataKey="category" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
    );
};

export const DriversDailyLog = ( { printRef, data, date, trip }: DriversDailyLogProps) => {
    const dateMap = new Date(date);
    const monthName = dateMap.toLocaleString("en-US", { month: "long" });
    const {processedData, activityTime, totalTime} = processSeriesData(data);

    let ondutyHours = 0
    if(activityTime.ON_DUTY) ondutyHours += activityTime.ON_DUTY
    if(activityTime.DRIVING) ondutyHours += activityTime.DRIVING

    return (
        <div ref={printRef} id="driver-logger" className={style.wrapper} style={{ padding: 20,  margin: "auto" }}>
            <Row gutter={16} style={{ marginTop: 10 }}>
                <Col span={8}>
                    <h2 className={style.header}>Drivers Daily Log</h2>
                    <Text className={style.hours}>(24 hours)</Text>
                </Col>
                <Col span={7}>
                    <Flex gap={16}>
                        <span>
                            <Text className="underline" >{monthName}</Text> <Text>/</Text> <br/>
                            <Text>(Month)</Text>
                        </span>
                        <span>
                            <Text className="underline" >{dateMap.getDate()}</Text> <Text>/</Text> <br/>
                            <Text>(Day)</Text>
                        </span>
                        <span>
                            <Text className="underline" >{dateMap.getFullYear()}</Text> <Text>/</Text> <br/>
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
                    <div className={`${style.location}`}>{trip.starting_location.address}</div>
                    <div className={`${style.location} ${style.company}`}>From</div>
                </Col>
                <Col span={12}>
                    <div className={`${style.location}`}> {trip.ending_location.address}</div>
                    <div className={`${style.location} ${style.company}`}>To</div>
                </Col>
            </Row>

            <Row className={style.milageSection}>
                <Col span={12}>
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
                    <div className={style.box}>{trip.vehicle.truck_number}, {trip.vehicle.license_plate}</div>
                    <div className={style.company}>Truck and trailler number or licence plate</div>
                </Col>
                <Col span={12}>
                    <div className={`${style.location}`}>{trip.company.name}</div>
                    <div className={`${style.location} ${style.company}`}>Name of carrier or carriers</div>
                    <br/>
                    <div className={`${style.location}`}>{trip.company.main_office_address}</div>
                    <div className={`${style.location} ${style.company}`}>Main office address</div>
                    <br/>
                    <div className={`${style.location}`}>{trip.driver.home_terminal}</div>
                    <div className={`${style.location} ${style.company}`}>Home terminal address</div>
                </Col>
            </Row>
            
            <Divider />

            <Row>
                <Col span={18}><LogLineChart data={processedData} /></Col>

                <Col span={6}>
                    <div className={style.milageCounter}>Total Hours</div>
                    <br/><br/><br/> <br/>
                    <div className={style.milageCounter}>{activityTime.OFF_DUTY}</div>
                    <br/><br/>
                    <div className={style.milageCounter}>{activityTime.SLEEPER_BERTH}</div>
                    <br/><br/>
                    <div className={style.milageCounter}>{activityTime.DRIVING}</div>
                    <br/><br/>
                    <div className={style.milageCounter}>{activityTime.ON_DUTY}</div>
                    <br/><br/>
                    <div className={style.milageCounter}>{totalTime}</div>
                    <div className={style.milageCounter}></div>
                </Col>
            </Row>
            
            {/* Remarks Section */}
            <Card size="small" title="Remarks">
                <Text className={style.underline}>__________________________________</Text>
            </Card>
            <Divider />
            
            <Row gutter={16}>
                <Col span={16}>
                <Card size="small" title="Shipping Documents">
                    <Text>DVU or Manifest No:  <span className={style.underline}>{trip.manifest_no}</span></Text>
                    <br />
                    <Text>Shipper & Commodity: <span className={style.underline}>{trip.shipper}, {trip.commodity}</span></Text>
                </Card>
                </Col>

                <Col span={8} className={style.recap}>
                    <Title level={4}>Recap</Title>
                    <div> <Text>On Duty Hours Today: <span style={{paddingLeft: "20px"}} className={style.underline}>{ondutyHours}</span></Text></div>
                    <div><Text>Total Hours Last 8 Days: <span className={style.underline}>_</span></Text></div>
                </Col>
            </Row>
        </div>
    );
};