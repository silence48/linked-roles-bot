import * as React from "react";
import type { SVGProps } from "react";
const SvgDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-delete"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6" />
  </svg>
);
export default SvgDelete;
