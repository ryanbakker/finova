"use client";

import * as React from "react";
import { Time } from "@internationalized/date";
import * as PopoverPrimitives from "@radix-ui/react-popover";
import {
  useDateSegment,
  useTimeField,
  type AriaTimeFieldProps,
  type TimeValue,
} from "@react-aria/datepicker";
import {
  useTimeFieldState,
  type DateFieldState,
  type DateSegment,
} from "@react-stately/datepicker";
import { RiCalendar2Fill, RiSubtractFill } from "@remixicon/react";
import { format, type Locale } from "date-fns";
import { enUS } from "date-fns/locale";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import type { Matcher } from "react-day-picker";

//#region TimeInput
// ============================================================================

const isBrowserLocaleClockType24h = () => {
  const language =
    typeof window !== "undefined" ? window.navigator.language : "en-US";

  const hr = new Intl.DateTimeFormat(language, {
    hour: "numeric",
  }).format();

  return Number.isInteger(Number(hr));
};

type TimeSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
};

const TimeSegment = ({ segment, state }: TimeSegmentProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  // Skip rendering for any non-editable segments except colon
  if (
    !segment.isEditable &&
    segment.type === "literal" &&
    segment.text !== ":"
  ) {
    return null;
  }

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        // base
        "relative block w-full appearance-none rounded-md border px-2.5 py-1.5 text-left uppercase tabular-nums shadow-xs outline-hidden transition sm:text-sm",
        // border color
        "border-input",
        // text color
        "text-foreground",
        // background color
        "bg-background",
        // focus
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // invalid (optional)
        "group-aria-invalid/time-input:border-destructive group-aria-invalid/time-input:ring-2 group-aria-invalid/time-input:ring-destructive/20 invalid:border-destructive invalid:ring-2 invalid:ring-destructive/20",
        {
          "w-fit! border-none bg-transparent px-0 text-muted-foreground shadow-none":
            segment.type === "literal",
          "border-input bg-muted text-muted-foreground":
            state.isDisabled && segment.text !== ":",
        }
      )}
    >
      {segment.isPlaceholder ? segment.placeholder : segment.text}
    </div>
  );
};

type TimeInputProps = Omit<
  AriaTimeFieldProps<TimeValue>,
  "label" | "shouldForceLeadingZeros" | "description" | "errorMessage"
>;

const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>(
  ({ hourCycle, ...props }: TimeInputProps, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => innerRef?.current
    );

    const locale = window !== undefined ? window.navigator.language : "en-US";

    const state = useTimeFieldState({
      hourCycle: hourCycle,
      locale: locale,
      shouldForceLeadingZeros: true,
      autoFocus: true,
      ...props,
    });

    const { fieldProps } = useTimeField(
      {
        ...props,
        hourCycle: hourCycle,
        shouldForceLeadingZeros: true,
      },
      state,
      innerRef
    );

    return (
      <div
        {...fieldProps}
        ref={innerRef}
        className="group/time-input inline-flex w-full gap-x-2"
      >
        {state.segments.map((segment, i) => (
          <TimeSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    );
  }
);
TimeInput.displayName = "TimeInput";

//#region Trigger
// ============================================================================

const triggerStyles = tv({
  base: [
    // base
    "peer flex w-full cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 py-2 shadow-sm outline-hidden transition-all sm:text-sm",
    // background color
    "bg-background",
    // border color
    "border-input",
    // text color
    "text-foreground",
    // placeholder color
    "placeholder-muted-foreground",
    // hover
    "hover:bg-accent hover:text-accent-foreground",
    // disabled
    "disabled:pointer-events-none",
    "disabled:bg-muted disabled:text-muted-foreground",
    // focus
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  variants: {
    hasError: {
      true: "border-destructive ring-2 ring-destructive/20",
    },
  },
});

interface TriggerProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof triggerStyles> {
  placeholder?: string;
}

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  (
    { className, children, placeholder, hasError, ...props }: TriggerProps,
    forwardedRef
  ) => {
    return (
      <PopoverPrimitives.Trigger asChild>
        <button
          ref={forwardedRef}
          className={cn(triggerStyles({ hasError }), className)}
          {...props}
        >
          <RiCalendar2Fill className="size-5 shrink-0 text-muted-foreground" />
          <span className="flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap text-foreground">
            {children ? (
              children
            ) : placeholder ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : null}
          </span>
        </button>
      </PopoverPrimitives.Trigger>
    );
  }
);

Trigger.displayName = "DatePicker.Trigger";

//#region Popover
// ============================================================================

const CalendarPopover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Content>,
  React.ComponentProps<typeof PopoverPrimitives.Content>
>(({ align, className, children, ...props }, forwardedRef) => {
  return (
    <PopoverPrimitives.Portal>
      <PopoverPrimitives.Content
        ref={forwardedRef}
        sideOffset={10}
        side="bottom"
        align={align}
        avoidCollisions
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          // base
          "relative z-50 w-fit rounded-md border text-sm shadow-xl shadow-black/[2.5%]",
          // widths
          "max-w-[95vw] min-w-[calc(var(--radix-select-trigger-width)-2px)]",
          // border color
          "border-border",
          // background color
          "bg-popover",
          // transition
          "will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[state=open]:data-[side=bottom]:animate-slide-down-and-fade data-[state=open]:data-[side=left]:animate-slide-left-and-fade data-[state=open]:data-[side=right]:animate-slide-right-and-fade data-[state=open]:data-[side=top]:animate-slide-up-and-fade",
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitives.Content>
    </PopoverPrimitives.Portal>
  );
});

CalendarPopover.displayName = "DatePicker.CalendarPopover";

//#region Preset
// ============================================================================

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface Preset {
  label: string;
}

interface DatePreset extends Preset {
  date: Date;
}

interface DateRangePreset extends Preset {
  dateRange: DateRange;
}

type PresetContainerProps<TPreset extends Preset, TValue> = {
  presets: TPreset[];
  onSelect: (value: TValue) => void;
  currentValue?: TValue;
};

const PresetContainer = <TPreset extends Preset, TValue>({
  // Available preset configurations
  presets,
  // Event handler when a preset is selected
  onSelect,
  // Currently selected preset
  currentValue,
}: PresetContainerProps<TPreset, TValue>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDateRangePresets = (preset: any): preset is DateRangePreset => {
    return "dateRange" in preset;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDatePresets = (preset: any): preset is DatePreset => {
    return "date" in preset;
  };

  const handleClick = (preset: TPreset) => {
    if (isDateRangePresets(preset)) {
      onSelect(preset.dateRange as TValue);
    } else if (isDatePresets(preset)) {
      onSelect(preset.date as TValue);
    }
  };

  const compareDates = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const compareRanges = (range1: DateRange, range2: DateRange) => {
    const from1 = range1.from;
    const from2 = range2.from;

    let equalFrom = false;

    if (from1 && from2) {
      const sameFrom = compareDates(from1, from2);

      if (sameFrom) {
        equalFrom = true;
      }
    }

    const to1 = range1.to;
    const to2 = range2.to;

    let equalTo = false;

    if (to1 && to2) {
      const sameTo = compareDates(to1, to2);

      if (sameTo) {
        equalTo = true;
      }
    }

    return equalFrom && equalTo;
  };

  const matchesCurrent = (preset: TPreset) => {
    if (isDateRangePresets(preset)) {
      const value = currentValue as DateRange | undefined;

      return value && compareRanges(value, preset.dateRange);
    }
    if (isDatePresets(preset)) {
      const value = currentValue as Date | undefined;

      return value && compareDates(value, preset.date);
    }

    return false;
  };

  return (
    <ul className="flex items-start gap-x-2 sm:flex-col">
      {presets.map((preset) => {
        return (
          <li key={`preset-${preset.label}`} className="sm:w-full sm:py-px">
            <button
              type="button"
              title={preset.label}
              className={cn(
                // base
                "relative w-full overflow-hidden rounded-sm border px-2.5 py-1.5 text-left text-base text-ellipsis whitespace-nowrap shadow-xs outline-hidden transition-all sm:border-none sm:py-2 sm:text-sm sm:shadow-none",
                // text color
                "text-foreground",
                // border color
                "border-border",
                // focus
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                // background color
                "focus-visible:bg-accent",
                "hover:bg-accent",
                {
                  "bg-accent": matchesCurrent(preset),
                }
              )}
              onClick={() => handleClick(preset)}
              aria-label={`Select ${preset.label}`}
            >
              <span>{preset.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

PresetContainer.displayName = "DatePicker.PresetContainer";

//#region Date Picker Shared
// ============================================================================

const formatDate = (
  date: Date,
  locale: Locale,
  includeTime?: boolean
): string => {
  const usesAmPm = !isBrowserLocaleClockType24h();
  let dateString: string;

  if (includeTime) {
    dateString = usesAmPm
      ? format(date, "dd MMM, yyyy h:mm a", { locale })
      : format(date, "dd MMM, yyyy HH:mm", { locale });
  } else {
    dateString = format(date, "dd MMM, yyyy", { locale });
  }

  return dateString;
};

type CalendarProps = {
  fromYear?: number;
  toYear?: number;
  fromMonth?: Date;
  toMonth?: Date;
  fromDay?: Date;
  toDay?: Date;
  fromDate?: Date;
  toDate?: Date;
  locale?: Locale;
};

type Translations = {
  cancel?: string;
  apply?: string;
  start?: string;
  end?: string;
  range?: string;
};

interface PickerProps extends CalendarProps {
  className?: string;
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[] | undefined;
  required?: boolean;
  showTimePicker?: boolean;
  placeholder?: string;
  disableNavigation?: boolean;
  hasError?: boolean;
  id?: string;
  // Customize the date picker for different languages.
  translations?: Translations;
  align?: "center" | "end" | "start";
  "aria-invalid"?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-required"?: boolean;
}

//#region Range Date Picker
// ============================================================================

interface RangeProps extends PickerProps {
  presets?: DateRangePreset[];
  defaultValue?: DateRange;
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
}

const RangeDatePicker = ({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disableNavigation,
  disabledDays,
  locale = enUS,
  showTimePicker,
  placeholder = "Select date range",
  hasError,
  translations,
  align = "center",
  className,
  ...props
}: RangeProps) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>(
    value ?? defaultValue ?? undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(range?.from);

  const [startTime, setStartTime] = React.useState<TimeValue | null>(
    value?.from
      ? new Time(value.from.getHours(), value.from.getMinutes())
      : defaultValue?.from
      ? new Time(defaultValue.from.getHours(), defaultValue.from.getMinutes())
      : new Time(0, 0)
  );
  const [endTime, setEndTime] = React.useState<TimeValue | null>(
    value?.to
      ? new Time(value.to.getHours(), value.to.getMinutes())
      : defaultValue?.to
      ? new Time(defaultValue.to.getHours(), defaultValue.to.getMinutes())
      : new Time(0, 0)
  );

  const initialRange = React.useMemo(() => {
    return range;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (range) {
      setMonth(range.from);
    }
  }, [range]);

  React.useEffect(() => {
    if (!open) {
      setMonth(range?.from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onRangeChange = (range: DateRange | undefined) => {
    const newRange = range;
    if (showTimePicker) {
      if (newRange?.from && !startTime) {
        setStartTime(new Time(0, 0));
      }

      if (newRange?.to && !endTime) {
        setEndTime(new Time(0, 0));
      }

      if (newRange?.from && startTime) {
        newRange.from.setHours(startTime.hour);
        newRange.from.setMinutes(startTime.minute);
      }

      if (newRange?.to && endTime) {
        newRange.to.setHours(endTime.hour);
        newRange.to.setMinutes(endTime.minute);
      }
    }

    setRange(newRange);
  };

  const onCancel = () => {
    setRange(initialRange);
    setStartTime(
      initialRange?.from
        ? new Time(initialRange.from.getHours(), initialRange.from.getMinutes())
        : new Time(0, 0)
    );
    setEndTime(
      initialRange?.to
        ? new Time(initialRange.to.getHours(), initialRange.to.getMinutes())
        : new Time(0, 0)
    );
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }

    setOpen(open);
  };

  const onTimeChange = (time: TimeValue | null, pos: "start" | "end") => {
    switch (pos) {
      case "start":
        setStartTime(time);
        break;
      case "end":
        setEndTime(time);
        break;
    }

    if (!range) {
      return;
    }

    if (pos === "start") {
      if (!range.from) {
        return;
      }

      const newDate = new Date(range.from.getTime());

      if (!time) {
        newDate.setHours(0);
        newDate.setMinutes(0);
      } else {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
      }

      setRange({
        ...range,
        from: newDate,
      });
    }

    if (pos === "end") {
      if (!range.to) {
        return;
      }

      const newDate = new Date(range.to.getTime());

      if (!time) {
        newDate.setHours(0);
        newDate.setMinutes(0);
      } else {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
      }

      setRange({
        ...range,
        to: newDate,
      });
    }
  };

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);

    setStartTime(
      value?.from
        ? new Time(value.from.getHours(), value.from.getMinutes())
        : defaultValue?.from
        ? new Time(defaultValue.from.getHours(), defaultValue.from.getMinutes())
        : new Time(0, 0)
    );
    setEndTime(
      value?.to
        ? new Time(value.to.getHours(), value.to.getMinutes())
        : defaultValue?.to
        ? new Time(defaultValue.to.getHours(), defaultValue.to.getMinutes())
        : new Time(0, 0)
    );
  }, [value, defaultValue]);

  const displayRange = React.useMemo(() => {
    if (!range) {
      return null;
    }

    return `${
      range.from ? formatDate(range.from, locale, showTimePicker) : ""
    } - ${range.to ? formatDate(range.to, locale, showTimePicker) : ""}`;
  }, [range, locale, showTimePicker]);

  const onApply = () => {
    setOpen(false);
    onChange?.(range);
  };

  return (
    <PopoverPrimitives.Root
      tremor-id="tremor-raw"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        hasError={hasError}
        aria-required={props.required || props["aria-required"]}
        aria-invalid={props["aria-invalid"]}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
      >
        {displayRange}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="w-full max-w-[95vw]">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:items-start overflow-hidden">
            {presets && presets.length > 0 && (
              <div
                className={cn(
                  "relative hidden sm:flex sm:h-full sm:w-40",
                  "border-b border-border sm:border-r sm:border-b-0",
                  "overflow-auto"
                )}
              >
                <div className="absolute px-3 sm:inset-0 sm:left-0 sm:p-2">
                  <PresetContainer
                    currentValue={range}
                    presets={presets}
                    onSelect={onRangeChange}
                  />
                </div>
              </div>
            )}
            <div className="w-full">
              <Calendar
                mode="range"
                selected={range}
                onSelect={onRangeChange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 1
                    : 2
                }
                disabled={disabledDays}
                disableNavigation={disableNavigation}
                locale={locale}
                initialFocus
                classNames={{
                  months:
                    "grid grid-cols-1 sm:flex sm:flex-row sm:divide-x sm:divide-border",
                }}
                {...props}
              />
              {showTimePicker && (
                <div className="flex items-center justify-evenly gap-x-3 border-t border-border p-3">
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="text-foreground">
                      {translations?.start ?? "Start"}:
                    </span>
                    <TimeInput
                      value={startTime}
                      onChange={(v) => onTimeChange(v, "start")}
                      aria-label="Start date time"
                      isDisabled={!range?.from}
                      isRequired={props.required}
                    />
                  </div>
                  <RiSubtractFill className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="text-foreground">
                      {translations?.end ?? "End"}:
                    </span>
                    <TimeInput
                      value={endTime}
                      onChange={(v) => onTimeChange(v, "end")}
                      aria-label="End date time"
                      isDisabled={!range?.to}
                      isRequired={props.required}
                    />
                  </div>
                </div>
              )}
              <div className="border-t border-border p-3 sm:flex sm:items-center sm:justify-between">
                <p className="text-foreground tabular-nums hidden sm:block">
                  <span className="text-muted-foreground">
                    {translations?.range ?? "Range"}:
                  </span>{" "}
                  <span className="font-medium">{displayRange}</span>
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-0 sm:flex sm:items-center sm:gap-x-2">
                  <Button
                    variant="secondary"
                    className="h-9 w-full"
                    type="button"
                    onClick={onCancel}
                  >
                    {translations?.cancel ?? "Cancel"}
                  </Button>
                  <Button
                    variant="default"
                    className="h-9 w-full"
                    type="button"
                    onClick={onApply}
                  >
                    {translations?.apply ?? "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </PopoverPrimitives.Root>
  );
};

//#region Types & Exports
// ============================================================================

type RangeDatePickerProps = {
  presets?: DateRangePreset[];
  defaultValue?: DateRange;
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
} & PickerProps;

const DateRangePicker = ({ presets, ...props }: RangeDatePickerProps) => {
  return <RangeDatePicker presets={presets} {...(props as RangeProps)} />;
};

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker, type DateRangePreset, type DateRange };
