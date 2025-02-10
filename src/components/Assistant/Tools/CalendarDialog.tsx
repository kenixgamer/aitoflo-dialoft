import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CalendarDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  selectedFunction: "check-calendar" | "book-calendar" | null;
  calendarConfig: {
    apiKey: string;
    eventTypeId: string;
    username: string;
  };
  setCalendarConfig: (config: any) => void;
  onSave: () => void;
}

const CalendarDialog = ({
  showDialog,
  setShowDialog,
  selectedFunction,
  calendarConfig,
  setCalendarConfig,
  onSave,
}: CalendarDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px] bg-black border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {selectedFunction === "check-calendar"
              ? "Check Calendar Availability Configuration"
              : "Book Appointment Configuration"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              value={calendarConfig.apiKey}
              onChange={(e) =>
                setCalendarConfig({
                  ...calendarConfig,
                  apiKey: e.target.value,
                })
              }
              placeholder="Enter Cal.com API Key"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Event Type ID</Label>
            <Input
              value={calendarConfig.eventTypeId}
              onChange={(e) =>
                setCalendarConfig({
                  ...calendarConfig,
                  eventTypeId: e.target.value,
                })
              }
              placeholder="Enter Event Type ID"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={calendarConfig.username}
              onChange={(e) =>
                setCalendarConfig({
                  ...calendarConfig,
                  username: e.target.value,
                })
              }
              placeholder="Enter Cal.com Username"
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onSave}
            variant="primary"
            className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            disabled={
              !calendarConfig.apiKey ||
              !calendarConfig.eventTypeId ||
              !calendarConfig.username
            }
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
