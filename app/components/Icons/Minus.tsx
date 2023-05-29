import * as React from "react";
import type { SVGProps } from "react";
const SvgMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-minus"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M5 12h14" />
  </svg>
);
export default SvgMinus;
