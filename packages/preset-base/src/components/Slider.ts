import { ComponentTheme, mode, getOrientationStyle } from "./utils"

const Slider: ComponentTheme = {
  defaultProps: {
    size: "md",
  },
  sizes: {
    lg: props => ({
      Thumb: { width: "16px", height: "16px" },
      Track: getOrientationStyle({
        orientation: props.orientation,
        horizontal: { height: "4px" },
        vertical: { width: "4px" },
      }),
    }),
    md: props => ({
      Thumb: { width: "14px", height: "14px" },
      Track: getOrientationStyle({
        orientation: props.orientation,
        horizontal: { height: "4px" },
        vertical: { width: "4px" },
      }),
    }),
    sm: props => ({
      Thumb: { width: "10px", height: "10px" },
      Track: getOrientationStyle({
        orientation: props.orientation,
        horizontal: { height: "2px" },
        vertical: { width: "2px" },
      }),
    }),
  },
  baseStyle: props => ({
    Root: {
      _disabled: {
        opacity: 0.6,
        cursor: "default",
        pointerEvents: "none",
      },
      ...getOrientationStyle({
        orientation: props.orientation,
        vertical: { height: "100%" },
        horizontal: { width: "100%" },
      }),
    },
    Track: {
      borderRadius: "sm",
      bg: mode("gray.200", "whiteAlpha.200")(props),
      _disabled: {
        bg: mode("gray.300", "whiteAlpha.300")(props),
      },
    },
    Thumb: {
      zIndex: 1,
      borderRadius: "full",
      bg: "white",
      boxShadow: "sm",
      border: "1px solid",
      borderColor: "transparent",
      transition: "transform 0.2s",
      _focus: {
        boxShadow: "outline",
      },
      _disabled: {
        bg: "gray.300",
      },
      ...getOrientationStyle({
        orientation: props.orientation,
        vertical: {
          left: "50%",
          transform: `translateX(-50%)`,
          _active: {
            transform: `translateX(-50%) scale(1.15)`,
          },
        },
        horizontal: {
          top: "50%",
          transform: `translateY(-50%)`,
          _active: {
            transform: `translateY(-50%) scale(1.15)`,
          },
        },
      }),
    },
    FilledTrack: {
      bg: mode(`${props.colorScheme}.500`, `${props.colorScheme}.200`)(props),
    },
  }),
}

export const SliderTokens = {
  sizes: {
    lg: "lg",
    sm: "sm",
    md: "md",
  },
}

export default Slider
