// Tremor Raw chartColors [v0.1.0]

export type ColorUtility = "bg" | "stroke" | "fill" | "text";

export const chartColors = {
  // Sky color gradient for value-based coloring
  sky50: {
    bg: "bg-sky-50",
    stroke: "stroke-sky-50",
    fill: "fill-sky-50",
    text: "text-sky-50",
  },
  sky100: {
    bg: "bg-sky-100",
    stroke: "stroke-sky-100",
    fill: "fill-sky-100",
    text: "text-sky-100",
  },
  sky200: {
    bg: "bg-sky-200",
    stroke: "stroke-sky-200",
    fill: "fill-sky-200",
    text: "text-sky-200",
  },
  sky300: {
    bg: "bg-sky-300",
    stroke: "stroke-sky-300",
    fill: "fill-sky-300",
    text: "text-sky-300",
  },
  sky400: {
    bg: "bg-sky-400",
    stroke: "stroke-sky-400",
    fill: "fill-sky-400",
    text: "text-sky-400",
  },
  sky500: {
    bg: "bg-sky-500",
    stroke: "stroke-sky-500",
    fill: "fill-sky-500",
    text: "text-sky-500",
  },
  sky600: {
    bg: "bg-sky-600",
    stroke: "stroke-sky-600",
    fill: "fill-sky-600",
    text: "text-sky-600",
  },
  sky700: {
    bg: "bg-sky-700",
    stroke: "stroke-sky-700",
    fill: "fill-sky-700",
    text: "text-sky-700",
  },
  sky800: {
    bg: "bg-sky-800",
    stroke: "stroke-sky-800",
    fill: "fill-sky-800",
    text: "text-sky-800",
  },
  sky900: {
    bg: "bg-sky-900",
    stroke: "stroke-sky-900",
    fill: "fill-sky-900",
    text: "text-sky-900",
  },
  sky950: {
    bg: "bg-sky-950",
    stroke: "stroke-sky-950",
    fill: "fill-sky-950",
    text: "text-sky-950",
  },
  // Custom darker sky colors for enhanced contrast
  sky1000: {
    bg: "bg-sky-950",
    stroke: "stroke-sky-950",
    fill: "fill-sky-950",
    text: "text-sky-950",
  },
  sky1100: {
    bg: "bg-sky-950",
    stroke: "stroke-sky-950",
    fill: "fill-sky-950",
    text: "text-sky-950",
  },
  sky1200: {
    bg: "bg-sky-950",
    stroke: "stroke-sky-950",
    fill: "fill-sky-950",
    text: "text-sky-950",
  },
  sky: {
    bg: "bg-sky-500",
    stroke: "stroke-sky-500",
    fill: "fill-sky-500",
    text: "text-sky-500",
  },
  blue: {
    bg: "bg-blue-500",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500",
    text: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    stroke: "stroke-violet-500",
    fill: "fill-violet-500",
    text: "text-violet-500",
  },
  amber: {
    bg: "bg-amber-500",
    stroke: "stroke-amber-500",
    fill: "fill-amber-500",
    text: "text-amber-500",
  },
  gray: {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  lime: {
    bg: "bg-lime-500",
    stroke: "stroke-lime-500",
    fill: "fill-lime-500",
    text: "text-lime-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-500",
    stroke: "stroke-fuchsia-500",
    fill: "fill-fuchsia-500",
    text: "text-fuchsia-500",
  },
  // New vibrant colors for greater variety
  red: {
    bg: "bg-red-500",
    stroke: "stroke-red-500",
    fill: "fill-red-500",
    text: "text-red-500",
  },
  orange: {
    bg: "bg-orange-500",
    stroke: "stroke-orange-500",
    fill: "fill-orange-500",
    text: "text-orange-500",
  },
  green: {
    bg: "bg-green-500",
    stroke: "stroke-green-500",
    fill: "fill-green-500",
    text: "text-green-500",
  },
  teal: {
    bg: "bg-teal-500",
    stroke: "stroke-teal-500",
    fill: "fill-teal-500",
    text: "text-teal-500",
  },
  indigo: {
    bg: "bg-indigo-500",
    stroke: "stroke-indigo-500",
    fill: "fill-indigo-500",
    text: "text-indigo-500",
  },
  purple: {
    bg: "bg-purple-500",
    stroke: "stroke-purple-500",
    fill: "fill-purple-500",
    text: "text-purple-500",
  },
  rose: {
    bg: "bg-rose-500",
    stroke: "stroke-rose-500",
    fill: "fill-rose-500",
    text: "text-rose-500",
  },
  yellow: {
    bg: "bg-yellow-500",
    stroke: "stroke-yellow-500",
    fill: "fill-yellow-500",
    text: "text-yellow-500",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility
): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

// Tremor Raw getYAxisDomain [v0.0.0]

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
) => {
  const minDomain = autoMinValue ? "auto" : minValue ?? 0;
  const maxDomain = maxValue ?? "auto";
  return [minDomain, maxDomain];
};

// Tremor Raw hasOnlyOneValueForKey [v0.1.0]

export function hasOnlyOneValueForKey(
  array: Record<string, unknown>[],
  keyToCheck: string
): boolean {
  const val: unknown[] = [];

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck]);
      if (val.length > 1) {
        return false;
      }
    }
  }

  return true;
}
