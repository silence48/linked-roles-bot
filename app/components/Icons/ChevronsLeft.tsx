import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronsLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-chevrons-left"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
  </svg>
);
export default SvgChevronsLeft;
