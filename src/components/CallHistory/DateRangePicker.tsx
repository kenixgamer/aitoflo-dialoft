import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateIcon } from "@/utils/icons/icons";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useContext } from "react";
import { CallHistoryContext } from "@/context/CallHistoryContext";

const DateRangePicker = () => {
  const { dateRange, handleDateSelect } = useContext(CallHistoryContext);

  return (
    <div className="flex-1 flex justify-end items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="primary"
            className="w-full justify-start text-left font-normal min-w-60 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700"
          >
            <DateIcon />
            {dateRange.fromDate ? (
              <>
                {format(dateRange.fromDate, "PPP")} -{" "}
                {format(dateRange.toDate || dateRange.fromDate, "PPP")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-4 bg-black border-zinc-800" 
          align="start"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2">
              <Label className="text-white font-medium">From</Label>
              <Calendar
                mode="single"
                selected={dateRange.fromDate}
                onSelect={(date) => handleDateSelect(date, 'from')}
                initialFocus
                className="rounded-md bg-black"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-white",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-zinc-800 text-white",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-zinc-400 rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-800",
                  day: "h-8 w-8 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-zinc-800 rounded-md",
                  day_range_end: "day-range-end",
                  day_selected: "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white",
                  day_today: "bg-zinc-800 text-white",
                  day_outside: "text-zinc-500 opacity-50 aria-selected:bg-zinc-800/50 aria-selected:text-zinc-500 aria-selected:opacity-30",
                  day_disabled: "text-zinc-500 opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white font-medium">To</Label>
              <Calendar
                mode="single"
                selected={dateRange.toDate}
                onSelect={(date) => handleDateSelect(date, 'to')}
                initialFocus
                className="rounded-md bg-black"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-white",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-zinc-800 text-white",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-zinc-400 rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-800",
                  day: "h-8 w-8 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-zinc-800 rounded-md",
                  day_range_end: "day-range-end",
                  day_selected: "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white",
                  day_today: "bg-zinc-800 text-white",
                  day_outside: "text-zinc-500 opacity-50 aria-selected:bg-zinc-800/50 aria-selected:text-zinc-500 aria-selected:opacity-30",
                  day_disabled: "text-zinc-500 opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;