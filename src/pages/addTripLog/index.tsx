import React, { useState } from "react";
import { Form, Input, Select, Button, DatePicker, notification } from "antd";
import {Map, NavigationControl, GeolocateControl, GeolocateResultEvent} from "react-map-gl/mapbox";
import {
  setKey,
  setLanguage,
  fromLatLng,
} from "react-geocode";
import { GOOGLE_MAPS_API_KEY, MAPBOX_ACCESS_TOKEN } from "../../utils/configs";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";



const { Option } = Select;

// Set Google Maps API Key for Geocoding
setKey(GOOGLE_MAPS_API_KEY);
setLanguage("en");

export const AddTripLog= () => {
  const { id } = useParams();
  const [userLocation, setUserLocation] = useState({});
  const [posting, setPosting] = useState(false);
  const [form] = Form.useForm();
  const [location, setLocation] = useState({
    lat: 40.9200,
    lng: -74.2100,
    city: "",
    state: "",
    country: "",
  });

  const [api, contextHolder] = notification.useNotification();

  // Reverse geocoding function
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fromLatLng(lat, lng);
      const addressComponents = response.results[0].address_components;
      
      const city = addressComponents.find((comp: any) => comp.types.includes("locality"))?.long_name || "";
      const state = addressComponents.find((comp: any) => comp.types.includes("administrative_area_level_1"))?.long_name || "";
      const country = addressComponents.find((comp: any) => comp.types.includes("country"))?.long_name || "";

      setLocation({ lat, lng, city, state, country });
      form.setFieldsValue({ location: `City: ${city}, State: ${state}, Coutry:${country}` });
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Handle marker movement on the map
  const handleMapClick = (event: any) => {
    const {lng, lat} = event.lngLat;
    fetchAddress(lat, lng);
  };

  const mutation = useMutation({
    mutationFn: async (newData) => {
      const response = await axiosClient.post("/trip-logs/", newData);
      return response.data;
    },
    onSuccess: () => {
      api.success({message: 'Trip log saved successifully' })
      form.resetFields();
      setPosting(false)
    },
    onError: () => {
      setPosting(false)
    },
  });

  // Handle form submission
  const onFinish = (values: any) => {
    setPosting(true)
    const formData = {
      ...values,
      location: { lat: location.lat, lng: location.lng, city: location.city, state: location.state, country: location.country },
      trip: id
    };
    mutation.mutate(formData)
    console.log("Form Data:", formData);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item label="Action" name="category" rules={[{ required: true, message: "Please select a category" }]}>
        <Select placeholder="Select Category">
          <Option value="OFF_DUTY">Off Duty</Option>
          <Option value="ON_DUTY">On Duty (Not driving)</Option>
          <Option value="DRIVING">Driving</Option>
          <Option value="SLEEPER_BERTH">Sleeper berth</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Remarks" name="remarks">
        <Input.TextArea placeholder="Enter remarks" />
      </Form.Item>

      <Form.Item label="Odometer Reading" name="odm_reading" rules={[{ required: true, message: "Enter ODM Reading" }]}>
        <Input type="number" placeholder="Enter ODM reading" />
      </Form.Item>

      <Form.Item label="Date Created" name="date_created" rules={[{ required: true, message: "Select a date" }]}>
        <DatePicker showTime />
      </Form.Item>
    
      <Form.Item label="Location (Select location on map)" name="location" rules={[{ required: true, message: "Select a point" }]}>
        {/* {location && <p>{`${location.city}, ${location.state}, ${location.country}`}</p>} */}
        <Input value={`${location.city}, ${location.state}, ${location.country}`} readOnly />
      </Form.Item>

      <div style={{ height: "600px", marginBottom: "20px" }}>
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onClick={handleMapClick}
        >
          <NavigationControl position="top-left" />
          <GeolocateControl
          position="top-left"
          trackUserLocation={true} // Keeps tracking user location
          showUserHeading={true} // Shows direction user is facing
          onGeolocate={(e: GeolocateResultEvent) => {
            fetchAddress(e.coords?.latitude, e.coords?.longitude)
            setUserLocation({
              latitude: e.coords?.latitude,
              longitude: e.coords?.longitude,
            });
          }}
        />
        </Map>
      </div>

      <Button disabled={posting} type="primary" htmlType="submit" className='primary-btn'>{posting ? "Saving data...." : "Submit"}</Button>
    </Form>
  );
};
