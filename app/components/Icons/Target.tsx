import * as React from "react";
import type { SVGProps } from "react";
const SvgTarget = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-target"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <circle cx={12} cy={12} r={6} />
    <circle cx={12} cy={12} r={2} />
  </svg>
);
export default SvgTarget;
