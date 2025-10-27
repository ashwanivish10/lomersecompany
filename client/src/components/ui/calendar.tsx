import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper to add days
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [mode, setMode] = useState<"single" | "multiple" | "range">("single");

  const today = new Date();
  const nextMonth = addDays(today, 30);

  const [singleDate, setSingleDate] = useState<Date | undefined>(today);
  const [multipleDates, setMultipleDates] = useState<Date[] | undefined>([
    today,
  ]);
  const [range, setRange] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 7),
  });

  const handleModeChange = (value: "single" | "multiple" | "range") => {
    setMode(value);
  };

  const disabledDays = [
    new Date(2025, 6, 25),
    new Date(2025, 6, 26),
    { from: new Date(2025, 6, 28), to: new Date(2025, 6, 30) },
    (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  ];

  const commonProps = {
    weekStartsOn: 1 as const,
    defaultMonth: today,
    fromDate: today,
    toDate: nextMonth,
    disabled: disabledDays,
    showOutsideDays,
    initialFocus: true,
    classNames: {
      months: "flex justify-center",
      month: "space-y-2",
      caption:
        "flex justify-between items-center text-base font-medium text-gray-800",
      caption_label: "text-sm sm:text-base font-medium",
      nav: "flex items-center gap-2",
      nav_button: cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 rounded-md bg-transparent p-0 hover:bg-accent hover:text-accent-foreground"
      ),
      table: "w-full border-collapse mt-2 select-none text-center text-sm",
      head_row: "flex justify-between text-gray-500",
      head_cell: "w-9 font-medium text-xs uppercase tracking-wide",
      row: "flex justify-between mt-1",
      cell: cn(
        "h-9 w-9 p-0 relative flex items-center justify-center rounded-md text-sm cursor-pointer transition-all duration-150",
        "hover:bg-accent hover:text-accent-foreground"
      ),
      day_selected:
        "bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600",
      day_today:
        "border-2 border-blue-400 text-blue-600 font-semibold rounded-full",
      day_outside: "text-gray-400 opacity-60",
      day_disabled: "text-gray-400 opacity-40 cursor-not-allowed",
      day_range_middle: "bg-blue-100 text-blue-600",
      ...classNames,
    },
    components: {
      IconLeft: ({ className, ...props }) => (
        <ChevronLeft
          className={cn("h-4 w-4 text-blue-500", className)}
          {...props}
        />
      ),
      IconRight: ({ className, ...props }) => (
        <ChevronRight
          className={cn("h-4 w-4 text-blue-500", className)}
          {...props}
        />
      ),
    },
    ...props,
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div
        className={cn(
          "w-[625px] max-w-full h-[578px] rounded-xl border bg-white text-gray-800 shadow-lg p-6",
          className
        )}
      >
        {/* Selection Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
          <label className="text-sm font-medium text-gray-700">
            Selection Mode:
          </label>
          <Select value={mode} onValueChange={handleModeChange}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="multiple">Multiple</SelectItem>
              <SelectItem value="range">Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DayPicker */}
        {mode === "single" && (
          <DayPicker
            mode="single"
            selected={singleDate}
            onSelect={setSingleDate}
            {...commonProps}
          />
        )}
        {mode === "multiple" && (
          <DayPicker
            mode="multiple"
            selected={multipleDates}
            onSelect={setMultipleDates}
            {...commonProps}
          />
        )}
        {mode === "range" && (
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            {...commonProps}
          />
        )}

        {/* Selected Dates */}
        <div className="mt-6 text-center text-gray-700 text-sm">
          {mode === "single" && singleDate && (
            <p>
              Selected Date:{" "}
              <strong>{singleDate.toLocaleDateString("en-GB")}</strong>
            </p>
          )}
          {mode === "multiple" && multipleDates && (
            <p>
              Selected:{" "}
              {multipleDates.map((date) => (
                <span key={date.toString()} className="mx-1">
                  {date.toLocaleDateString("en-GB")}
                </span>
              ))}
            </p>
          )}
          {mode === "range" && range && (
            <p>
              From:{" "}
              <strong>{range.from?.toLocaleDateString("en-GB") || "—"}</strong>{" "}
              to:{" "}
              <strong>{range.to?.toLocaleDateString("en-GB") || "—"}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
