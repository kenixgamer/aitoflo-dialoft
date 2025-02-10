import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimePicker = ({ value, onChange } : any) => {
  // Parse the initial time value
  const [hour, setHour] = useState(() => {
    const [hours] = value?.split(":") || ["00"];
    return hours;
  });
  
  const [minute, setMinute] = useState(() => {
    const [_, minutes] = value?.split(":") || ["", "00"];
    return minutes;
  });

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => {
    return i.toString().padStart(2, "0");
  });

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return i.toString().padStart(2, "0");
  });

  const handleTimeChange = (type: string, value: string) => {
    if (type === "hour") setHour(value);
    if (type === "minute") setMinute(value);

    let newHour = type === "hour" ? value : hour;
    let newMinute = type === "minute" ? value : minute;

    if (onChange) {
      onChange(`${newHour}:${newMinute}`);
    }
  };

  return (
    <div className="flex text-white items-center space-x-2">
      <Select value={hour} onValueChange={(value) => handleTimeChange("hour", value)}>
        <SelectTrigger className="w-20 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 focus:ring-zinc-700">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] bg-black border-zinc-800">
          {hours.map((h) => (
            <SelectItem 
              key={h} 
              value={h}
              className="text-white hover:bg-zinc-800"
            >
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-zinc-400">:</span>

      <Select value={minute} onValueChange={(value) => handleTimeChange("minute", value)}>
        <SelectTrigger className="w-20 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 focus:ring-zinc-700">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] bg-black border-zinc-800">
          {minutes.map((m) => (
            <SelectItem 
              key={m} 
              value={m}
              className="text-white hover:bg-zinc-800"
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePicker;