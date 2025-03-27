import { Select } from "antd";
import { useState, useMemo } from "react";
import Map, { NavigationControl, GeolocateControl, Source, Layer, Popup } from "react-map-gl/mapbox";
import { SeriesData } from "../dailyLogs";


interface PointData {
  [date: string]: SeriesData[];
}

type DailyLogsMapProps = {
    data: PointData
}

// const data: PointData = {
//   "2024-03-26": [
//     { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
//     { lat: 34.0522, lng: -118.2437, name: "Los Angeles" }
//   ],
//   "2024-03-27": [
//     { lat: 40.7128, lng: -74.006, name: "New York" },
//     { lat: 41.8781, lng: -87.6298, name: "Chicago" }
//   ]
// };

export const DailyLogsMap = ( {data}: DailyLogsMapProps) => {
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
//   const [popupInfo, setPopupInfo] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const filteredPoints = useMemo(() => {
    let selected = selectedDate
    let combinedData:SeriesData[] = []
    if(selectedDate.length == 0) {
        selected = Object.keys(data);
    }
    selected.forEach(value => {
        combinedData = [...combinedData, ...data[value]] 
    })
    return combinedData.filter(item => item.location?.lat || item.location?.lng)
  }, [selectedDate, data]);
  
  const geoJsonLine = useMemo(() => ({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: filteredPoints.map(({ location: {lng, lat} }) => [lng, lat])
        }
      }
    ]
  }), [filteredPoints]);

  const options = Object.keys(data).map(key => ({label: key, value:key}))

  const handleChange = (value: string[]) => {
    setSelectedDate(value)
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
        {Object.keys(data).map((date) => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select> */}
      <Select
          mode="multiple"
          size="large"
          placeholder="Filter map"
          defaultValue={selectedDate}
          onChange={handleChange}
          style={{ width: '100%' }}
          options={options}
        />
      <Map
        // initialViewState={{ latitude: 37.7749, longitude: -122.4194, zoom: 4 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />
        
        {/* Line Layer */}
        <Source id="line-source" type="geojson" data={geoJsonLine as any}>
          <Layer
            id="line-layer"
            type="line"
            paint={{ "line-color": "#FF5733", "line-width": 4 }}
          />
        </Source>
      </Map>
    </div>
  );
};
