import * as React from "react";
import type { SVGProps } from "react";
const SvgCompass = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-compass"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);
export default SvgCompass;
