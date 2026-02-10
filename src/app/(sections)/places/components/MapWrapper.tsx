"use client";

import dynamic from "next/dynamic";

import type { MapProps } from "./Map";
import styles from "./map.module.scss";

export const MapWrapper = ({ locations }: MapProps) => {
  const LeafletMap = dynamic(() => import("./Map"), {
    loading: () => <div className={styles.map__container} />,
    ssr: false,
  });
  return <LeafletMap locations={locations} />;
};
