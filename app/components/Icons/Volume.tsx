import * as React from "react";
import type { SVGProps } from "react";
const SvgVolume = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-volume"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
  </svg>
);
export default SvgVolume;
