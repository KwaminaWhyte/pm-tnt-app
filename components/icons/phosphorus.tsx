import * as React from "react";
import Svg, { SvgProps, G, Path } from "react-native-svg";
const PhWarningCircleDuotone = (props: SvgProps) => (
  <Svg {...props}>
    <G fill="currentColor">
      <Path d="M224 128a96 96 0 1 1-96-96 96 96 0 0 1 96 96" opacity={0.2} />
      <Path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m-8-80V80a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0m20 36a12 12 0 1 1-12-12 12 12 0 0 1 12 12" />
    </G>
  </Svg>
);

const PhCheckCircle = (props: SvgProps) => (
  <Svg {...props}>
    <G fill="currentColor">
      <Path d="M224 128a96 96 0 1 1-96-96 96 96 0 0 1 96 96" opacity={0.2} />
      <Path d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88 88.1 88.1 0 0 0 88-88" />
    </G>
  </Svg>
);
const PhInfo = (props: SvgProps) => (
  <Svg {...props}>
    <G fill="currentColor">
      <Path d="M224 128a96 96 0 1 1-96-96 96 96 0 0 1 96 96" opacity={0.2} />
      <Path d="M144 176a8 8 0 0 1-8 8 16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16 16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m88-48A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88 88.1 88.1 0 0 0 88-88m-92-32a12 12 0 1 0-12-12 12 12 0 0 0 12 12" />
    </G>
  </Svg>
);
const PhXCircle = (props: SvgProps) => (
  <Svg {...props}>
    <G fill="currentColor">
      <Path d="M224 128a96 96 0 1 1-96-96 96 96 0 0 1 96 96" opacity={0.2} />
      <Path d="M165.66 101.66 139.31 128l26.35 26.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88 88.1 88.1 0 0 0 88-88" />
    </G>
  </Svg>
);
const PhX = (props: SvgProps) => (
  <Svg {...props}>
    <Path
      fill="currentColor"
      d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
    />
  </Svg>
);
export { PhWarningCircleDuotone, PhCheckCircle, PhInfo, PhXCircle, PhX };
