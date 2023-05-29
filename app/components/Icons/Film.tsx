import * as React from "react";
import type { SVGProps } from "react";
const SvgFilm = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-film"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={20} height={20} x={2} y={2} rx={2.18} ry={2.18} />
    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
  </svg>
);
export default SvgFilm;
