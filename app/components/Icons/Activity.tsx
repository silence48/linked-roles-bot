import * as React from "react";
import type { SVGProps } from "react";
const SvgActivity = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-activity"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
export default SvgActivity;
