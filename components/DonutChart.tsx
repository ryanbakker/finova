// Tremor DonutChart [v1.0.0]
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import {
  Pie,
  PieChart as ReChartsDonutChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

import {
  AvailableChartColors,
  constructCategoryColors,
  getColorClassName,
  type AvailableChartColorsKeys,
} from "@/lib/chartUtils";
import { cx } from "@/lib/utils";

const sumNumericArray = (arr: number[]): number =>
  arr.reduce((sum, num) => sum + num, 0);

// Convert color names to actual color values for recharts
const getColorValue = (colorName: AvailableChartColorsKeys): string => {
  const colorMap: Record<AvailableChartColorsKeys, string> = {
    // Sky color gradient (lightest to darkest) - Enhanced darker values for better contrast
    sky50: "#f0f9ff",
    sky100: "#e0f2fe",
    sky200: "#bae6fd",
    sky300: "#7dd3fc",
    sky400: "#38bdf8",
    sky500: "#0ea5e9",
    sky600: "#0284c7",
    sky700: "#0369a1",
    sky800: "#075985",
    sky900: "#0c4a6e",
    sky950: "#082f49",
    // Custom darker sky colors for maximum contrast
    sky1000: "#061c2e",
    sky1100: "#04121f",
    sky1200: "#020a10",
    // Add missing sky color
    sky: "#0ea5e9",
    // Original colors (keeping for backward compatibility)
    blue: "#3b82f6",
    emerald: "#10b981",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    gray: "#6b7280",
    cyan: "#06b6d4",
    pink: "#ec4899",
    lime: "#84cc16",
    fuchsia: "#d946ef",
    // New vibrant colors
    red: "#ef4444",
    orange: "#f97316",
    green: "#22c55e",
    teal: "#14b8a6",
    indigo: "#6366f1",
    purple: "#a855f7",
    rose: "#f43f5e",
    yellow: "#eab308",
  };
  return colorMap[colorName] || "#6b7280"; // fallback to gray
};

const parseData = (
  data: Record<string, any>[],
  categoryColors: Map<string, AvailableChartColorsKeys>,
  category: string
) => {
  return data.map((dataPoint) => {
    // If the data already has a color property, use it; otherwise fall back to category mapping
    const colorName =
      dataPoint.color ||
      categoryColors.get(dataPoint[category]) ||
      AvailableChartColors[0];

    return {
      ...dataPoint,
      color: colorName,
    };
  });
};

const calculateDefaultLabel = (data: any[], valueKey: string): number =>
  sumNumericArray(data.map((dataPoint) => dataPoint[valueKey]));

const parseLabelInput = (
  labelInput: string | undefined,
  valueFormatter: (value: number) => string,
  data: any[],
  valueKey: string
): string =>
  labelInput || valueFormatter(calculateDefaultLabel(data, valueKey));

//#region Tooltip

type TooltipProps = Pick<ChartTooltipProps, "active" | "payload">;

type PayloadItem = {
  category: string;
  value: number;
  color: AvailableChartColorsKeys;
};

interface ChartTooltipProps {
  active: boolean | undefined;
  payload: PayloadItem[];
  valueFormatter: (value: number) => string;
}

const ChartTooltip = ({
  active,
  payload,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={cx(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950"
        )}
      >
        <div className={cx("space-y-1 px-4 py-2")}>
          {payload.map(({ value, category, color }, index) => (
            <div
              key={`id-${index}`}
              className="flex items-center justify-between space-x-8"
            >
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cx(
                    "size-2 shrink-0 rounded-full",
                    getColorClassName(color, "bg")
                  )}
                />
                <p
                  className={cx(
                    // base
                    "text-right whitespace-nowrap",
                    // text color
                    "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {category}
                </p>
              </div>
              <p
                className={cx(
                  // base
                  "text-right font-medium whitespace-nowrap tabular-nums",
                  // text color
                  "text-gray-900 dark:bg-gray-50"
                )}
              >
                {valueFormatter(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

type DonutChartVariant = "donut" | "pie";

type BaseEventProps = {
  eventType: "sector";
  categoryClicked: string;
  [key: string]: number | string;
};

type DonutChartEventProps = BaseEventProps | null | undefined;

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[];
  category: string;
  value: string;
  colors?: AvailableChartColorsKeys[];
  variant?: DonutChartVariant;
  valueFormatter?: (value: number) => string;
  label?: string;
  showLabel?: boolean;
  showTooltip?: boolean;
  onValueChange?: (value: DonutChartEventProps) => void;
  tooltipCallback?: (tooltipCallbackContent: TooltipProps) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data = [],
      value,
      category,
      colors = AvailableChartColors,
      variant = "donut",
      valueFormatter = (value: number) => value.toString(),
      label,
      showLabel = false,
      showTooltip = true,
      onValueChange,
      tooltipCallback,
      customTooltip,
      className,
      ...other
    },
    forwardedRef
  ) => {
    const CustomTooltip = customTooltip;
    const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
      undefined
    );
    const isDonut = variant === "donut";
    const parsedLabelInput = parseLabelInput(
      label,
      valueFormatter,
      data,
      value
    );

    const categories = Array.from(new Set(data.map((item) => item[category])));

    // Check if data already has pre-assigned colors
    const hasPreAssignedColors = data.some((item) => item.color);

    // Only construct category colors if no pre-assigned colors exist
    const categoryColors = hasPreAssignedColors
      ? new Map() // Empty map to force use of pre-assigned colors
      : constructCategoryColors(categories, colors);

    const prevActiveRef = React.useRef<boolean | undefined>(undefined);
    const prevCategoryRef = React.useRef<string | undefined>(undefined);

    const handleShapeClick = (
      data: any,
      index: number,
      event: React.MouseEvent
    ) => {
      event.stopPropagation();
      if (!onValueChange) return;

      if (activeIndex === index) {
        setActiveIndex(undefined);
        onValueChange(null);
      } else {
        setActiveIndex(index);
        onValueChange({
          eventType: "sector",
          categoryClicked: data.payload[category],
          ...data.payload,
        });
      }
    };

    return (
      <div
        ref={forwardedRef}
        className={cx("w-full h-full min-h-[200px]", className)}
        tremor-id="tremor-raw"
        {...other}
      >
        <ResponsiveContainer className="size-full">
          <ReChartsDonutChart
            onClick={
              onValueChange && activeIndex !== undefined
                ? () => {
                    setActiveIndex(undefined);
                    onValueChange(null);
                  }
                : undefined
            }
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {showLabel && isDonut && (
              <>
                {/* Define gradient for text */}
                <defs>
                  <linearGradient
                    id="textGradient"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#082f49" /> {/* Sky-950 */}
                    <stop offset="100%" stopColor="#0284c7" /> {/* Sky-600 */}
                  </linearGradient>
                </defs>
                {/* Main value label with gradient fill */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="24"
                  fontWeight="900"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fill="url(#textGradient)"
                >
                  {parsedLabelInput}
                </text>
              </>
            )}
            <Pie
              data={parseData(data, categoryColors, category)}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={isDonut ? "75%" : "0%"}
              outerRadius="100%"
              stroke=""
              strokeLinejoin="round"
              dataKey={value}
              nameKey={category}
              isAnimationActive={false}
              onClick={handleShapeClick}
              style={{ outline: "none" }}
            >
              {parseData(data, categoryColors, category).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorValue(entry.color)} />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip
                wrapperStyle={{ outline: "none" }}
                isAnimationActive={false}
                content={({ active, payload }) => {
                  const cleanPayload = payload
                    ? payload.map((item: any) => {
                        // Find the corresponding data entry to get the correct color
                        const dataEntry = parseData(
                          data,
                          categoryColors,
                          category
                        ).find(
                          (entry: any) =>
                            entry[category] === item.payload[category]
                        );
                        return {
                          category: item.payload[category],
                          value: item.value,
                          color: dataEntry?.color || AvailableChartColors[0],
                        };
                      })
                    : [];

                  const payloadCategory: string | undefined =
                    cleanPayload[0]?.category;

                  if (
                    tooltipCallback &&
                    cleanPayload.length > 0 &&
                    (active !== prevActiveRef.current ||
                      payloadCategory !== prevCategoryRef.current)
                  ) {
                    tooltipCallback({
                      active,
                      payload: cleanPayload,
                    });
                    prevActiveRef.current = active;
                    prevCategoryRef.current = payloadCategory;
                  }

                  return showTooltip && active ? (
                    CustomTooltip ? (
                      <CustomTooltip active={active} payload={cleanPayload} />
                    ) : (
                      <ChartTooltip
                        active={active}
                        payload={cleanPayload}
                        valueFormatter={valueFormatter}
                      />
                    )
                  ) : null;
                }}
              />
            )}
          </ReChartsDonutChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

DonutChart.displayName = "DonutChart";

export { DonutChart, type DonutChartEventProps, type TooltipProps };
