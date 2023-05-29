import * as React from "react";
import type { SVGProps } from "react";
const SvgVideo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-video"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m23 7-7 5 7 5V7z" />
    <rect width={15} height={14} x={1} y={5} rx={2} ry={2} />
  </svg>
);
export default SvgVideo;
