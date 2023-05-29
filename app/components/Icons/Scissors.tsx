import * as React from "react";
import type { SVGProps } from "react";
const SvgScissors = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-scissors"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={6} cy={6} r={3} />
    <circle cx={6} cy={18} r={3} />
    <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
  </svg>
);
export default SvgScissors;
