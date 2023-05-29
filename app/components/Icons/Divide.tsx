import * as React from "react";
import type { SVGProps } from "react";
const SvgDivide = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-divide"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={6} r={2} />
    <path d="M5 12h14" />
    <circle cx={12} cy={18} r={2} />
  </svg>
);
export default SvgDivide;
