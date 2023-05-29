import * as React from "react";
import type { SVGProps } from "react";
const SvgFramer = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-framer"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
  </svg>
);
export default SvgFramer;
