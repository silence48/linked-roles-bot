import * as React from "react";
import type { SVGProps } from "react";
const SvgVoicemail = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-voicemail"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={5.5} cy={11.5} r={4.5} />
    <circle cx={18.5} cy={11.5} r={4.5} />
    <path d="M5.5 16h13" />
  </svg>
);
export default SvgVoicemail;
