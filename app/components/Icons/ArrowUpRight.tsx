import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowUpRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-arrow-up-right"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);
export default SvgArrowUpRight;
