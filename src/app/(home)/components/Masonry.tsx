"use client";

import Masonry from "react-masonry-css";

import styles from "./masonry.module.scss";

const breakpointColumns = {
  default: 6,
  1240: 4,
  960: 3,
  580: 2,
  375: 1,
};

export const MasonryWrapper = ({ children }: { children: React.ReactNode }) => (
  <Masonry
    columnClassName={styles.columns}
    breakpointCols={breakpointColumns}
    className={styles.grid}
  >
    {children}
  </Masonry>
);
