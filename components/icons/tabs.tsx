import Svg, { SvgProps, G, Circle, Path, Defs, Mask } from "react-native-svg";
export const SettingsBroken = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <G fill="none" stroke="currentColor" strokeWidth={1.5}>
      <Circle cx={12} cy={12} r={3} />
      <Path
        strokeLinecap="round"
        d="M3.661 10.64c.473.296.777.802.777 1.36s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.58.276.82.308a2 2 0 0 0 1.478-.396c.315-.242.548-.646 1.014-1.453.208-.36.369-.639.489-.873m-.81-2.766a1.62 1.62 0 0 1-.777-1.36c0-.559.304-1.065.777-1.362.321-.202.528-.363.676-.555a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008 1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.483-.143.863a1.62 1.62 0 0 1-.79 1.353 1.62 1.62 0 0 1-1.567.008c-.336-.178-.58-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7c-.208.36-.369.639-.489.873"
      />
    </G>
  </Svg>
);
export const SettingsFilled = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353 1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453-.47.807-.704 1.21-.757 1.605-.07.526.074 1.058.4 1.479.148.192.357.353.68.555.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353.015.38.051.64.145.863.204.49.596.88 1.09 1.083.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308.53.07 1.066-.073 1.49-.396.318-.242.553-.646 1.022-1.453.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008 1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083M12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9s-3.023 1.343-3.023 3 1.354 3 3.023 3"
      clipRule="evenodd"
    />
  </Svg>
);

export const TrippersBroken = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <G fill="none" stroke="currentColor" strokeWidth={1.5}>
      <Path
        strokeLinecap="round"
        d="M8 13h8c1.71 0 3.15 1.28 3.35 2.98L20 21.5M8 13a7.46 7.46 0 0 1-5.618-5.472L2 6m6 7v5c0 1.886 0 2.828.586 3.414S10.114 22 12 22s2.828 0 3.414-.586S16 19.886 16 18v-1"
      />
      <Circle cx={12} cy={6} r={4} />
    </G>
  </Svg>
);
export const TrippersFilled = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path fill="currentColor" d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
    <Path
      fill="currentColor"
      d="M2.728 5.818a.75.75 0 1 0-1.455.364l.382 1.528a8.21 8.21 0 0 0 5.595 5.869v4.473c0 .898 0 1.648.08 2.242.084.628.27 1.195.726 1.65.455.456 1.022.642 1.65.726.595.08 1.344.08 2.242.08h.104c.899 0 1.648 0 2.243-.08.627-.084 1.194-.27 1.65-.726s.64-1.022.725-1.65c.08-.594.08-1.344.08-2.242v-4.193a2.62 2.62 0 0 1 1.856 2.208l.65 5.52a.75.75 0 0 0 1.489-.175l-.65-5.52A4.124 4.124 0 0 0 16 12.25H8.085A6.71 6.71 0 0 1 3.11 7.346z"
    />
  </Svg>
);

export const HomeBroken = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M15 18H9m12.636-5.042-.279 1.937c-.487 3.388-.731 5.081-1.906 6.093S16.553 22 13.106 22h-2.212c-3.447 0-5.17 0-6.345-1.012s-1.419-2.705-1.906-6.093l-.279-1.937c-.38-2.637-.57-3.956-.029-5.083s1.691-1.813 3.992-3.183l1.385-.825C9.8 2.622 10.846 2 12 2s2.199.622 4.288 1.867l1.385.825c2.3 1.37 3.451 2.056 3.992 3.183"
    />
  </Svg>
);
export const HomeFilled = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.335 7.875c-.54 1.127-.35 2.446.03 5.083l.278 1.937c.487 3.388.731 5.081 1.906 6.093S7.447 22 10.894 22h2.212c3.447 0 5.17 0 6.345-1.012s1.419-2.705 1.906-6.093l.279-1.937c.38-2.637.57-3.956.029-5.083s-1.691-1.813-3.992-3.183l-1.385-.825C14.2 2.622 13.154 2 12 2s-2.199.622-4.288 1.867l-1.385.825c-2.3 1.37-3.451 2.056-3.992 3.183M8.25 18a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75"
      clipRule="evenodd"
    />
  </Svg>
);

export const MapPointerBroken = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <G
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
    >
      <Path d="M2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464c-.973.974-1.3 2.343-1.409 4.536" />
      <Path d="m14.52 14.5-1.097 2.862c-.319.83-1.483.857-1.731.04l-1.057-3.477a.84.84 0 0 0-.56-.56l-3.477-1.057c-.817-.248-.79-1.412.04-1.73l9.166-3.513a.863.863 0 0 1 1.13 1.131l-.966 2.524" />
    </G>
  </Svg>
);
export const MapPointerFilled = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.464 20.536C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535m13.47-12.34-3.511 9.166c-.319.83-1.483.857-1.731.04l-1.057-3.477a.84.84 0 0 0-.56-.56l-3.477-1.057c-.817-.248-.79-1.412.04-1.73l9.166-3.513a.863.863 0 0 1 1.13 1.131"
      clipRule="evenodd"
    />
  </Svg>
);

export const CardBroken = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <G fill="none" stroke="currentColor" strokeWidth={1.5}>
      <Path strokeLinecap="round" d="M10 16.5H6m2-3H6" />
      <Path d="M14 15c0-.943 0-1.414.293-1.707S15.057 13 16 13s1.414 0 1.707.293S18 14.057 18 15s0 1.414-.293 1.707S16.943 17 16 17s-1.414 0-1.707-.293S14 15.943 14 15Z" />
      <Path
        strokeLinecap="round"
        d="M22 12c0-3.771 0-5.657-1.172-6.828S17.771 4 14 4h-4C6.229 4 4.343 4 3.172 5.172S2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h4c3.771 0 5.657 0 6.828-1.172.654-.653.943-1.528 1.07-2.828M2 10h5m15 0H11"
      />
    </G>
  </Svg>
);
export const CardFilled = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Defs>
      <Mask id="a">
        <G fill="none">
          <Path
            fill="#fff"
            d="M14 4h-4C6.229 4 4.343 4 3.172 5.172c-.844.843-1.08 2.057-1.146 4.078h19.948c-.066-2.021-.302-3.235-1.146-4.078C19.657 4 17.771 4 14 4m-4 16h4c3.771 0 5.657 0 6.828-1.172S22 15.771 22 12q0-.662-.002-1.25H2.002Q1.999 11.338 2 12c0 3.771 0 5.657 1.172 6.828S6.229 20 10 20"
          />
          <Path
            fill="#000"
            fillRule="evenodd"
            d="M5.25 16a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75m6.5 0a.75.75 0 0 1 .75-.75H14a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75"
            clipRule="evenodd"
          />
        </G>
      </Mask>
    </Defs>
    <Path fill="currentColor" d="M0 0h24v24H0z" mask="url(#a)" />
  </Svg>
);

export const Cog = (props: SvgProps) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
    />
    <Path
      // fill="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </Svg>
);
