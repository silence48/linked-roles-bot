import * as React from "react";
import type { SVGProps } from "react";
const SvgAlignLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-align-left"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M17 10H3M21 6H3M21 14H3M17 18H3" />
  </svg>
);
export default SvgAlignLeft;
