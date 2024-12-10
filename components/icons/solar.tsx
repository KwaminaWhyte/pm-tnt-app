import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const BedDuotoneIcon = (props: SvgProps) => (
  <Svg {...props}>
    <Path
      fill="currentColor"
      d="M3.002 12.267a2 2 0 0 0-.85.968C2 13.602 2 14.068 2 15s0 1.398.152 1.765a2 2 0 0 0 1.083 1.083c.252.104.55.137 1.015.147V20a.75.75 0 0 0 1.5 0v-2h12.5v2a.75.75 0 0 0 1.5 0v-2.005c.464-.01.763-.043 1.015-.147a2 2 0 0 0 1.083-1.083C22 16.398 22 15.932 22 15s0-1.398-.152-1.765a2 2 0 0 0-.85-.968L19.25 12H4.75z"
    />
    <Path
      fill="currentColor"
      d="M10.998 4h2c3.77 0 5.656 0 6.828 1.172 1.023 1.022 1.153 2.588 1.17 5.477v1.617L19.25 12H4.75l-1.748.267H3V10.65c.017-2.889.147-4.455 1.17-5.477C5.34 4 7.225 4 10.997 4"
      opacity={0.5}
    />
    <Path
      fill="currentColor"
      d="M19 10.5c0-1.186-.002-1.983-.081-2.578-.076-.568-.206-.811-.365-.971-.158-.16-.399-.293-.96-.37-.589-.079-1.377-.081-2.55-.081h-2.131v4zm-7.913 0v-4h-2.13c-1.174 0-1.962.002-2.55.082-.562.076-.803.208-.961.369-.159.16-.29.403-.365.971C5.001 8.517 5 9.314 5 10.5z"
    />
  </Svg>
);

const CarFilledIcon = (props: SvgProps) => (
  <Svg {...props}>
    <Path
      fill="currentColor"
      d="M9.266 1.992a.75.75 0 0 0-.75.75V4.5h-.664a3.25 3.25 0 0 0-3.11 2.303L4.683 7H3.75a.75.75 0 0 0 0 1.5h.533l-.202.827A2.25 2.25 0 0 0 3 11.25v8.5c0 .966.784 1.75 1.75 1.75h1.5A1.75 1.75 0 0 0 8 19.75V18.5h8v1.25c0 .966.784 1.75 1.75 1.75h1.5A1.75 1.75 0 0 0 21 19.75v-8.5c0-.815-.434-1.53-1.083-1.924l-.206-.826h.539a.75.75 0 0 0 0-1.5h-.942l-.055-.184A3.25 3.25 0 0 0 16.14 4.5h-.656V2.742a.75.75 0 0 0-.75-.75zM7.852 6h8.288a1.75 1.75 0 0 1 1.676 1.247l.21.702L18.29 9H5.705l.257-1.052.216-.708A1.75 1.75 0 0 1 7.852 6M4.5 18.5h2v1.25a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25zm13 0h2v1.25a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25zM8.005 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0M17 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2"
    />
  </Svg>
);

const MapFlagFilled = (props: SvgProps) => (
  <Svg {...props}>
    <Path
      fill="currentColor"
      d="M12 1.25a.75.75 0 0 1 .75.75v1.036l5.008 2.504.054.027c.734.367 1.36.68 1.796.984.442.309.906.757.906 1.449s-.464 1.14-.906 1.449c-.436.304-1.062.617-1.796.984l-5.062 2.53V18a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75"
    />
    <Path
      fill="currentColor"
      d="M12 22c5.523 0 10-1.567 10-3.5 0-1.662-3.31-3.054-7.75-3.411V18a2.25 2.25 0 0 1-4.5 0v-2.911C5.31 15.446 2 16.838 2 18.5 2 20.433 6.477 22 12 22"
    />
    <Path
      fill="currentColor"
      d="M12 1.25a.75.75 0 0 0-.75.75v16a.75.75 0 0 0 1.5 0v-5.036l5.062-2.531c.734-.367 1.36-.68 1.796-.984.442-.309.906-.756.906-1.449 0-.692-.464-1.14-.906-1.449-.436-.304-1.062-.617-1.796-.984l-5.062-2.53V2a.75.75 0 0 0-.75-.75"
    />
  </Svg>
);
export { BedDuotoneIcon, CarFilledIcon, MapFlagFilled };
