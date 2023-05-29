import * as React from "react";
import type { SVGProps } from "react";
const SvgItalic = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-italic"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M19 4h-9M14 20H5M15 4 9 20" />
  </svg>
);
export default SvgItalic;
