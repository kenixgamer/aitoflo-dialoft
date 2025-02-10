import { format } from "date-fns"
import { CalendarIconAlt } from "@/utils/icons/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"normal"}
          className={cn(
            "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700",
            !date && "text-zinc-400"
          )}
        >
          <span className="mr-2 h-4 w-4">
          <CalendarIconAlt />
          </span>
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black border-zinc-800">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
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
      </PopoverContent>
    </Popover>
  )
}
