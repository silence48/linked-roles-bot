import * as React from "react";
import type { SVGProps } from "react";
const SvgTerminal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-terminal"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m4 17 6-6-6-6M12 19h8" />
  </svg>
);
export default SvgTerminal;
