import * as React from "react";
import type { SVGProps } from "react";
const SvgCornerUpRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-corner-up-right"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m15 14 5-5-5-5" />
    <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
  </svg>
);
export default SvgCornerUpRight;
