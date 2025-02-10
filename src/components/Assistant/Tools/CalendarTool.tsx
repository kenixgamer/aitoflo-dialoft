import { CalendarIcon } from "@/utils/icons/icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";

interface CalendarToolProps {
  formData: any;
  handleRemoveCalendarFunction: (type: string) => void;
  setSelectedFunction: (type: "check-calendar" | "book-calendar" | null) => void;
  setShowFunctionDialog: (show: boolean) => void;
}

const CalendarTool = ({
  formData,
  handleRemoveCalendarFunction,
  setSelectedFunction,
  setShowFunctionDialog,
}: CalendarToolProps) => {
  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value: "check-calendar" | "book-calendar") => {
          setSelectedFunction(value);
          setShowFunctionDialog(true);
        }}
      >
        <SelectTrigger className="bg-gray-800 text-white border-gray-700">
          <SelectValue placeholder="Add Calendar Function" />
        </SelectTrigger>
        <SelectContent className="bg-black border-white/10">
          <SelectGroup>
            <SelectLabel className="text-white/70">
              Calendar Functions
            </SelectLabel>
            <SelectItem
              value="check-calendar"
              className="text-white hover:bg-black/80"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon />
                Check Calendar Availability (Cal.com)
              </div>
            </SelectItem>
            <SelectItem
              value="book-calendar"
              className="text-white hover:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon />
                Book on the Calendar (Cal.com)
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="space-y-2">
        {formData.checkCalendarAvailability && (
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span className="text-white">
                Check Calendar Availability (Cal.com)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCalendarFunction("check-calendar")}
              className="text-red-400 hover:text-red-500"
            >
              Remove
            </Button>
          </div>
        )}
        {formData.bookAppointment && (
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span className="text-white">
                Book on the Calendar (Cal.com)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCalendarFunction("book-calendar")}
              className="text-red-400 hover:text-red-500"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTool;
