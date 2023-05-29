import * as React from "react";
import type { SVGProps } from "react";
const SvgBarChart2 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-bar-chart-2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);
export default SvgBarChart2;
