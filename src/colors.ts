export const Colors = {
  BLACK: { red: 0, green: 0, blue: 0, alpha: 1 },
  WHITE: { red: 1, green: 1, blue: 1, alpha: 1 },
  BLACK_DIMMED: { red: 0, green: 0, blue: 0, alpha: 0.96 },
  ACCENT: { red: 18 / 255, green: 82 / 255, blue: 209 / 255, alpha: 1 },
  ACCENT_DIMMED: {
    red: 14 / 255,
    green: 52 / 255,
    blue: 129 / 255,
    alpha: 1,
  },
  ACCENT_VERY_DIMMED: {
    red: 3 / 255,
    green: 24 / 255,
    blue: 66 / 255,
    alpha: 1,
  },
};

export const TabColors = {
  "settings.png": {
    red: 8 / 255,
    green: 33 / 255,
    blue: 73 / 255,
    alpha: 1,
  },
  "assist.png": {
    red: 52 / 255,
    green: 4 / 255,
    blue: 63 / 255,
    alpha: 1,
  },
  "player.png": {
    red: 75 / 255,
    green: 6 / 255,
    blue: 25 / 255,
    alpha: 1,
  },
  "enlighten.png": {
    red: 83 / 255,
    green: 30 / 255,
    blue: 7 / 255,
    alpha: 1,
  },
  "editor.png": {
    red: 28 / 255,
    green: 63 / 255,
    blue: 4 / 255,
    alpha: 1,
  },
  "relax.png": {
    red: 4 / 255,
    green: 62 / 255,
    blue: 56 / 255,
    alpha: 1,
  },
  "misc.png": {
    red: 114 / 255,
    green: 114 / 255,
    blue: 114 / 255,
    alpha: 1,
  },
  "misc2.png": {
    red: 109 / 255,
    green: 97 / 255,
    blue: 31 / 255,
    alpha: 1,
  },
} as const;

export function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

export function changeColor(colorVal: number) {
  const hslArr = [colorVal, 84, 45];

  const accent = hslToRgb(hslArr[0], hslArr[1], hslArr[2]);
  const accent_dimmed = hslToRgb(hslArr[0], hslArr[1], 28);
  const accent_very_dimmed = hslToRgb(hslArr[0], hslArr[1], 16);

  Colors.ACCENT = {
    red: accent[0] / 255,
    green: accent[1] / 255,
    blue: accent[2] / 255,
    alpha: 1,
  };
  Colors.ACCENT_DIMMED = {
    red: accent_dimmed[0] / 255,
    green: accent_dimmed[1] / 255,
    blue: accent_dimmed[2] / 255,
    alpha: 1,
  };
  Colors.ACCENT_VERY_DIMMED = {
    red: accent_very_dimmed[0] / 255,
    green: accent_very_dimmed[1] / 255,
    blue: accent_very_dimmed[2] / 255,
    alpha: 1,
  };
}
