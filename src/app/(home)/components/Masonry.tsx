"use client";

import Masonry from "react-masonry-css";

const breakpointColumns = {
  default: 6,
  1240: 4,
  960: 3,
  580: 2,
  375: 1,
};

export const MasonryWrapper = ({ children }: { children: React.ReactNode }) => (
  <Masonry
    breakpointCols={breakpointColumns}
    className="masonry__container"
    columnClassName="masonry__columns"
  >
    {children}
  </Masonry>
);
