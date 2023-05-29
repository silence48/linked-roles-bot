import * as React from "react";
import type { SVGProps } from "react";
const SvgToggleRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-toggle-right"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={22} height={14} x={1} y={5} rx={7} ry={7} />
    <circle cx={16} cy={12} r={3} />
  </svg>
);
export default SvgToggleRight;
