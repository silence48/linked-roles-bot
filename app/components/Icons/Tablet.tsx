import * as React from "react";
import type { SVGProps } from "react";
const SvgTablet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-tablet"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={16} height={20} x={4} y={2} rx={2} ry={2} />
    <path d="M12 18h.01" />
  </svg>
);
export default SvgTablet;
