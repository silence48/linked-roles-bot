import * as React from "react";
import type { SVGProps } from "react";
const SvgPause = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-pause"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);
export default SvgPause;
