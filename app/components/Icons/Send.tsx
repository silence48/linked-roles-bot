import * as React from "react";
import type { SVGProps } from "react";
const SvgSend = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-send"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);
export default SvgSend;
