"use client"

import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string | Date;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const date = value ? new Date(value) : undefined;
  const isInvalid = date && isNaN(date.getTime());
  const displayDate = date && !isInvalid ? date : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Offset timezone to avoid date shifting
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
  };

  const formatButtonDate = (d?: Date) => {
    if (!d) return placeholder;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-(--lf-bg) border border-(--lf-border) text-(--lf-ink) hover:bg-(--lf-surface) hover:text-(--lf-ink) rounded-lg px-3 py-2 text-[0.85rem] h-auto shadow-none font-sans",
            !displayDate && "text-(--lf-muted)",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-(--lf-muted)" />
          <span className="truncate">{formatButtonDate(displayDate)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
