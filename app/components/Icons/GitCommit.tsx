import * as React from "react";
import type { SVGProps } from "react";
const SvgGitCommit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-git-commit"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={12} r={4} />
    <path d="M1.05 12H7M17.01 12h5.95" />
  </svg>
);
export default SvgGitCommit;
