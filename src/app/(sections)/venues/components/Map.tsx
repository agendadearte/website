"use client";

import { icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import "./custom.css";

export type MapProps = {
  venues: {
    id: string;
    name: string;
    address: string;
    web: string;
    position?: { lat: number; lng: number };
  }[];
};

const marker = icon({
  iconUrl: "images/marker-pin.svg",
  iconAnchor: [15, 38],
  shadowUrl: "images/marker-shadow.png",
  shadowAnchor: [10, 42],
  popupAnchor: [0, -30],
});

export default function LeafletMap({ venues }: MapProps) {
  return (
    <MapContainer
      center={[40.4284, -3.70815]}
      doubleClickZoom
      scrollWheelZoom={false}
      style={{ height: "30rem", marginBlockStart: "1rem" }}
      zoom={11}
    >
      {/* https://docs.stadiamaps.com/map-styles/stamen-toner/*/}
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>
        &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a>
        &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
        &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a>
        contributors'
        url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
      />
      <MarkerClusterGroup showCoverageOnHover={false} maxClusterRadius={40}>
        {venues.map(({ id, name, address, web, position }) => {
          if (!position) return null;
          return (
            <Marker key={`${id}-marker`} position={position} icon={marker}>
              <Popup position={[0, -30]}>
                <strong>{name}</strong>
                <br />
                {address}
                <br />
                <a href={web} target="_blank" rel="noreferrer">
                  {web}
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
