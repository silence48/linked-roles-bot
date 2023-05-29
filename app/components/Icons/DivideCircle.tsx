import * as React from "react";
import type { SVGProps } from "react";
const SvgDivideCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-divide-circle"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 12h8M12 16h0M12 8h0" />
    <circle cx={12} cy={12} r={10} />
  </svg>
);
export default SvgDivideCircle;
