import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowRightCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-arrow-right-circle"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="m12 16 4-4-4-4M8 12h8" />
  </svg>
);
export default SvgArrowRightCircle;
