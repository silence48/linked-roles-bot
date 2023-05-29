import * as React from "react";
import type { SVGProps } from "react";
const SvgAtSign = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-at-sign"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={12} r={4} />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);
export default SvgAtSign;
