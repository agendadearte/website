"use client";

import dynamic from "next/dynamic";

import type { MapProps } from "./Map";

export const MapWrapper = ({ venues }: MapProps) => {
  const LeafletMap = dynamic(() => import("./Map"), {
    loading: () => <div className="venues-map__container" />,
    ssr: false,
  });
  return <LeafletMap venues={venues} />;
};
