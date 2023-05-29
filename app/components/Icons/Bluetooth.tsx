import * as React from "react";
import type { SVGProps } from "react";
const SvgBluetooth = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-bluetooth"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m6.5 6.5 11 11L12 23V1l5.5 5.5-11 11" />
  </svg>
);
export default SvgBluetooth;
