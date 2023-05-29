import * as React from "react";
import type { SVGProps } from "react";
const SvgBarChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-bar-chart"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 20V10M18 20V4M6 20v-4" />
  </svg>
);
export default SvgBarChart;
