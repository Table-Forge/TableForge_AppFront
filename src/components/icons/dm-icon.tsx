import React from "react";
import Svg, { G, Polygon, Polyline, Line } from "react-native-svg";
import { IconProps } from "@/src/components/icons/interface";

export const DMIcon = ({ color, size = 24, width, height }: IconProps) => {
  const iconSize = typeof size === "string" ? parseInt(size, 10) : size;
  const strokeColor = color || "#000000";

  return (
    <Svg
      height={height || iconSize}
      width={width || iconSize}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G>
        <Polygon
          points="4.5,7.5 19.5,7.5 19.5,18 12,23.5 4.5,18"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <Polyline
          points="6.5,7.5 4.5,2.5 10,5.5 13.5,2 12,0.5 10.5,2 14,5.5 19.5,2.5 17.5,7.5"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />

        <Line
          x1="12"
          y1="7.5"
          x2="12"
          y2="23.5"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <Line
          x1="7.5"
          y1="7.5"
          x2="7.5"
          y2="20.2"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <Line
          x1="16.5"
          y1="20.2"
          x2="16.5"
          y2="7.5"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
      </G>
    </Svg>
  );
};
