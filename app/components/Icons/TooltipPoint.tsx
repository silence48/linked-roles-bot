import * as React from "react";
import type { SVGProps } from "react";
const SvgTooltipPoint = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={512}
    viewBox="0 0 512 512"
    {...props}
  >
    <path d="M512 .001 261.688 187.733c-45.508 34.132-45.508 102.399 0 136.534L512 512V0z" />
  </svg>
);
export default SvgTooltipPoint;
