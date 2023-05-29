import * as React from "react";
import type { SVGProps } from "react";
const SvgGitPullRequest = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-git-pull-request"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={18} cy={18} r={3} />
    <circle cx={6} cy={6} r={3} />
    <path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12" />
  </svg>
);
export default SvgGitPullRequest;
