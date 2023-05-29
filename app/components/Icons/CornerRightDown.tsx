import * as React from "react";
import type { SVGProps } from "react";
const SvgCornerRightDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-corner-right-down"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m10 15 5 5 5-5" />
    <path d="M4 4h7a4 4 0 0 1 4 4v12" />
  </svg>
);
export default SvgCornerRightDown;
