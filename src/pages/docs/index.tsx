import React from "react";
import { Tabs, Card, Typography, Divider } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const ApiDocs = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
  
    // Get active tab from the URL, default to "1"
    const activeTab = searchParams.get("tab") || "1";

  const handleTabChange = (key: string) => {
    navigate(`?tab=${key}`);
  };
    
  return (
    <Card title="API Documentation" style={{ maxWidth: 800, margin: "auto" }}>
        <h1>Work Flow</h1>
        <Divider/>
        <p>1. Create User</p>
        <p>2. Create Company</p>
        <p>3. Create company drivers</p>
        <p>4. Create company Vehicles</p>
        <p>5. Create company Trios and assign driver and vehicle. A vehicle and a driver can only have one ongoing trip</p>
        <p>6. Create activities for the trip. This includes Driving, onduty etc</p>
        <Divider/>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Create User" key="1">
          <Title level={4}>Endpoint</Title>
          <Paragraph>
            <code>POST /api/v1/user/</code>
          </Paragraph>
          <Title level={4}>Request Payload</Title>
          <Paragraph>
            <pre>
              {JSON.stringify(
                {
                  username: "johndoe",
                  first_name: "John",
                  last_name: "Doe",
                  email: "johndoe@example.com",
                  password: "SecureP@ssw0rd"
                },
                null,
                2
              )}
            </pre>
          </Paragraph>
        </TabPane>

        <TabPane tab="Create Company" key="2">
          <Title level={4}>Endpoint</Title>
          <Paragraph>
            <code>POST /api/v1/companies/</code>
          </Paragraph>
          <Title level={4}>Request Payload</Title>
          <Paragraph>
            <pre>
              {JSON.stringify(
                {
                  name: "Acme Logistics",
                  main_office_address: "1234 Freight Lane, Dallas, TX",
                  phone_number: "+1-555-123-4567",
                  email: "contact@acmelogistics.com",
                  created_by: 1,
                  admins: [2, 3]
                },
                null,
                2
              )}
            </pre>
          </Paragraph>
        </TabPane>

        <TabPane tab="Create Driver" key="3">
          <Title level={4}>Endpoint</Title>
          <Paragraph>
            <code>POST /api/v1/drivers/</code>
          </Paragraph>
          <Title level={4}>Request Payload</Title>
          <Paragraph>
            <pre>
              {JSON.stringify(
                {
                  user: 4,
                  company: 1,
                  license_number: "TXD123456",
                  home_terminal: "Dallas, TX",
                  created_by: 2
                },
                null,
                2
              )}
            </pre>
          </Paragraph>
          <Paragraph>
            <strong>Note:</strong> A driver can only have one ongoing trip.
          </Paragraph>
        </TabPane>

        <TabPane tab="Create Vehicle" key="4">
          <Title level={4}>Endpoint</Title>
          <Paragraph>
            <code>POST /api/v1/vehicles/</code>
          </Paragraph>
          <Title level={4}>Request Payload</Title>
          <Paragraph>
            <pre>
              {JSON.stringify(
                {
                  company: 1,
                  drivers: [4, 5],
                  truck_number: "TX12345",
                  trailer_number: "TR67890",
                  license_plate: "ABC-1234",
                  state_of_registration: "Texas",
                  operational: true,
                  created_by: 2
                },
                null,
                2
              )}
            </pre>
          </Paragraph>
        </TabPane>

        <TabPane tab="Create Trip" key="5">
          <Title level={4}>Endpoint</Title>
          <Paragraph>
            <code>POST /api/v1/trips/</code>
          </Paragraph>
          <Title level={4}>Request Payload</Title>
          <Paragraph>
            <pre>
              {JSON.stringify(
                {
                  company: 1,
                  driver: 4,
                  vehicle: 10,
                  starting_location: { lat: 32.7767, lon: -96.797 },
                  ending_location: { lat: 29.7604, lon: -95.3698 },
                  start_mileage: 15000,
                  manifest_no: "TRIP12345",
                  shipper: "ABC Logistics",
                  commodity: "Electronics"
                },
                null,
                2
              )}
            </pre>
          </Paragraph>
          <Paragraph>
            <strong>Note:</strong> A driver can only have one ongoing trip.
          </Paragraph>
        </TabPane>

        <TabPane tab="Create Trip Log Entry" key="6">
          <Title level={4}>Endpoint</Title>
          <Paragraph>
            <code>POST /api/v1/trip-log-entries/</code>
          </Paragraph>
          <Title level={4}>Request Payload</Title>
          <Paragraph>
            <pre>
              {JSON.stringify(
                {
                  trip: 5,
                  category: "DRIVING",
                  remarks: "Started the trip",
                  location: { lat: 32.7767, lon: -96.797 },
                  odm_reading: 15200,
                  date_created: "2024-07-01T12:00:00Z"
                },
                null,
                2
              )}
            </pre>
          </Paragraph>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ApiDocs;
