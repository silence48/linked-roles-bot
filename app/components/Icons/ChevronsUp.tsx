import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronsUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-chevrons-up"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m17 11-5-5-5 5M17 18l-5-5-5 5" />
  </svg>
);
export default SvgChevronsUp;
