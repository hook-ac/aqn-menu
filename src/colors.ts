export const Colors = {
  BLACK: { red: 0, green: 0, blue: 0, alpha: 1 },
  WHITE: { red: 1, green: 1, blue: 1, alpha: 1 },
  BLACK_DIMMED: { red: 0, green: 0, blue: 0, alpha: 0.9 },
  BLUE: { red: 18 / 255, green: 82 / 255, blue: 209 / 255, alpha: 1 },
  BLUE_DIMMED: {
    red: 14 / 255,
    green: 52 / 255,
    blue: 129 / 255,
    alpha: 1,
  },
  BLUE_VERY_DIMMED: {
    red: 3 / 255,
    green: 24 / 255,
    blue: 66 / 255,
    alpha: 255,
  },
  BLUE_FOREGROUND: {
    red: 56 / 255,
    green: 66 / 255,
    blue: 84 / 255,
    alpha: 255,
  },
} as const;
