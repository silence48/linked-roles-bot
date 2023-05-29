import * as React from "react";
import type { SVGProps } from "react";
const SvgSkipForward = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-skip-forward"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m5 4 10 8-10 8V4zM19 5v14" />
  </svg>
);
export default SvgSkipForward;
