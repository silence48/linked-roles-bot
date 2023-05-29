import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronsRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-chevrons-right"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
  </svg>
);
export default SvgChevronsRight;
