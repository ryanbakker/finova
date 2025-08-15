"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

// Date picker components for single date and date range selection
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date: Date | undefined) => {
            onChange?.(date);
            setIsOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
  name,
}: {
  value?: { from: Date; to: Date };
  onChange?: (range: { from: Date; to: Date } | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Convert our custom range type to DateRange
  const dateRange: DateRange | undefined = value
    ? {
        from: value.from,
        to: value.to,
      }
    : undefined;

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange?.({ from: range.from, to: range.to });
      setIsOpen(false);

      // Update hidden form inputs if name is provided
      if (name) {
        const fromInput = document.querySelector(
          `input[name="${name}From"]`
        ) as HTMLInputElement;
        const toInput = document.querySelector(
          `input[name="${name}To"]`
        ) as HTMLInputElement;
        if (fromInput && toInput) {
          fromInput.value = range.from.toISOString().split("T")[0];
          toInput.value = range.to.toISOString().split("T")[0];
        }
      }
    } else if (range === undefined) {
      onChange?.(undefined);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <>
                {format(value.from, "LLL dd, y")} -{" "}
                {format(value.to, "LLL dd, y")}
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Hidden form inputs for the date range */}
      {name && (
        <>
          <input
            type="hidden"
            name={`${name}From`}
            value={value?.from ? value.from.toISOString().split("T")[0] : ""}
          />
          <input
            type="hidden"
            name={`${name}To`}
            value={value?.to ? value.to.toISOString().split("T")[0] : ""}
          />
        </>
      )}
    </div>
  );
}
