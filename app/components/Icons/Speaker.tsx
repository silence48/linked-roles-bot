import * as React from "react";
import type { SVGProps } from "react";
const SvgSpeaker = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-speaker"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={16} height={20} x={4} y={2} rx={2} ry={2} />
    <circle cx={12} cy={14} r={4} />
    <path d="M12 6h.01" />
  </svg>
);
export default SvgSpeaker;
