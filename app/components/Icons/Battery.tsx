import * as React from "react";
import type { SVGProps } from "react";
const SvgBattery = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-battery"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={18} height={12} x={1} y={6} rx={2} ry={2} />
    <path d="M23 13v-2" />
  </svg>
);
export default SvgBattery;
