import { Divider, Select, Spin } from "antd";
import { useState, useMemo } from "react";
import Map, { NavigationControl, GeolocateControl, LngLatBoundsLike, Source, Layer, Popup, MapMouseEvent } from "react-map-gl/mapbox";
import { CategoryType, SeriesData } from "../dailyLogs";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../../utils/axiosClient";
import bbox from "@turf/bbox";


interface PointData {
  [date: string]: SeriesData[];
}

type Location = {
  lat: number;
  lng: number;
};

type TripData = {
  id: number;
  category: CategoryType;
  remarks: string;
  location: Location;
  odm_reading: number;
  date_created: string; // Use `Date` if parsing it
  deleted: boolean;
  trip: number;
};

type DailyLogsMapProps = {
    data: PointData;
    id?: string;
}

const getInitialView = (geoJsonLine: any) => {
  const [minLng, minLat, maxLng, maxLat] = bbox(geoJsonLine); // Compute bounding box
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  if(!centerLat || !centerLng) {
    return {}
  }

  return {
    latitude: centerLat,
    longitude: centerLng,
    zoom: 10, // Adjust as needed
    bounds: [minLng, minLat, maxLng, maxLat] as LngLatBoundsLike,
  };
};

const getTripData = (id: string) => async () => {
  const { data } = await axiosClient.get(`/trips/${id}/logs/`);
  return data;
};


export const DailyLogsMap = ( {data, id}: DailyLogsMapProps) => {
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<TripData[] | null>(null);

  const { data:tripData, isLoading } = useQuery({
    queryKey: [`trip-log-${id}`],
    queryFn: getTripData(id as string)
  });

  if(isLoading && !tripData) {
    <Spin fullscreen />
  }

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

  const geoJsonPoints = useMemo(
    () => ({
      type: "FeatureCollection",
      features: (tripData || []).map((trip: TripData) => ({
        type: "Feature",
        properties: { ...trip },
        geometry: {
          type: "Point",
          coordinates: [trip.location.lng, trip.location.lat],
        },
      })),
    }),
    [tripData]
  );

  const initialViewState = useMemo(() => getInitialView(geoJsonLine), [geoJsonLine])

  const options = Object.keys(data).map(key => ({label: key, value:key}))

  const handleChange = (value: string[]) => {
    setSelectedDate(value)
  };

  const tripsPointLayerName = "trips-point-layer"

  const getFeatureData = (e: MapMouseEvent) => {
    const newFeatures:TripData[] = []
    e.features?.forEach(feature => {
      if (feature && feature.geometry.type === "Point") {
        const props = feature.properties as TripData;
        const location = typeof props.location === "string"
          ? JSON.parse(props.location)
          : props.location;
        newFeatures.push({ ...props, location })
      }
    })
    if(newFeatures.length > 0){
      setHoveredPoint(newFeatures);
    } else {
      setHoveredPoint(null);
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={[tripsPointLayerName]}
        onMouseEnter={getFeatureData}
        onMouseLeave={() => setHoveredPoint(null)}
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
        {/* Points Layer */}
        <Source id={`${tripsPointLayerName}-source`} type="geojson" data={geoJsonPoints as any}>
          <Layer
            id={tripsPointLayerName}
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": "#007AFF",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fff",
            }}
          />
        </Source>

        {(hoveredPoint && hoveredPoint.length > 0) &&(
          <Popup
            latitude={hoveredPoint[0].location.lat}
            longitude={hoveredPoint[0].location.lng}
            closeButton={false}
            closeOnClick={false}
          >
            {[...hoveredPoint].reverse().map(point => (
              <div key={point.category}>
                <div style={{display: "flex", justifyContent: "center"}}>
                  <h2>{point.date_created}</h2>
                </div>
                <p><strong>Category:</strong> {point.category}</p>
                <p><strong>Remarks:</strong> {point.remarks}</p>
                <p><strong>Odometer:</strong> {point.odm_reading}</p>
                <Divider/>
              </div>
            ))}
          </Popup>
        )}
      </Map>
    </div>
  );
};
