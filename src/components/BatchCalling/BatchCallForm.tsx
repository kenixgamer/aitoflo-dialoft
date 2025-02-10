import { useCreateBatchCall } from "@/query/batchCall.queries";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGetAssistantLists } from "@/query/assistant.queries";
import { useGetPhoneNumbers } from "@/query/phoneNumber.queries";
import CSVUpload from "./CSVUpload";
import ManualNumberInput from "./ManualNumberInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useParams } from "react-router-dom";
import { TIMEZONES } from "@/constants/timezones";
import { DatePicker } from "@/components/ui/date-picker";
import TimePicker from "./TimePicker";
import moment from 'moment-timezone';
import Spinner from "../Spinner";
import { UserContext } from "@/context";

interface BatchCallFormProps {
  onClose: () => void;
}

interface BatchCallFormData {
  name: string;
  assistantId: string;
  phoneNumberId: string;
  maxConcurrentCalls: number;
  scheduleTime: string;
  recipients: Array<{
    phoneNumber: string;
    dynamicValues: Record<string, any>;
  }>;
}


const BatchCallForm = ({ onClose }: BatchCallFormProps) => {
  const { mutate: createBatchCall, isPending } = useCreateBatchCall();
  const { workshopId } = useParams();
  const { data: assistants } = useGetAssistantLists(workshopId || "", 1, "", 1000, "");
  const { data: phoneNumbers } = useGetPhoneNumbers(1, "", 100, "");
  const { user } = useContext(UserContext);
  const maxCallLimit = user?.subscription?.concurrentCallLimit || 0;
  const { toast } = useToast();
  const [headers, setHeaders] = useState<string[]>([]);
  const [formData, setFormData] = useState<BatchCallFormData>({
    name: "1st Batch Call",
    assistantId: "",
    phoneNumberId: "",
    maxConcurrentCalls: 1,
    scheduleTime: "",
    recipients: [],
  });

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00 PM");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handleCSVUpload = (csvData: any[]) => {
    if (csvData.length > 0) {
      // Get all headers from the first row
      const allHeaders = Object.keys(csvData[0]);
      setHeaders(allHeaders);

      // Transform the data to match the required format
      const formattedRecipients = csvData.map(row => {
        const { phoneNumber, ...dynamicValues } = row;
        return {
          phoneNumber: phoneNumber || '',
          dynamicValues
        };
      });

      setFormData(prev => ({
        ...prev,
        recipients: formattedRecipients
      }));
    }
  };

  const handleManualNumbersUpdate = (
    numbers: Array<{ name: string; phoneNumber: string }>
  ) => {
    // Set headers for manual input
    setHeaders(['name']);

    const formattedRecipients = numbers.map(number => ({
      phoneNumber: number.phoneNumber,
      dynamicValues: {
        name: number.name
      }
    }));

    setFormData(prev => ({
      ...prev,
      recipients: formattedRecipients
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.assistantId ||
      !formData.phoneNumberId ||
      formData.recipients.length === 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add phone numbers",
        variant: "destructive",
      });
      return;
    }

    let scheduleTime = "";
    if (date) {
      const scheduledDate = new Date(date);
      const [timeStr, meridiem] = time.split(" ");
      const [hours, minutes] = timeStr.split(":");
      
      let hour = parseInt(hours);
      if (meridiem === "PM" && hour !== 12) {
        hour += 12;
      } else if (meridiem === "AM" && hour === 12) {
        hour = 0;
      }

      scheduledDate.setHours(hour, parseInt(minutes), 0, 0);
      const userTimezoneOffset = moment.tz(timezone).utcOffset();
      const UTCTime = moment(scheduledDate).utcOffset(userTimezoneOffset);
      
      scheduleTime = UTCTime.toISOString();
    }

    createBatchCall(
      {
        ...formData,
        scheduleTime,
        workshop: workshopId,
        timezone,
        numberSource: formData.recipients.length > 0 ? 'csv' : 'manual',
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            variant : "success",
            description: scheduleTime 
              ? `Batch call scheduled for ${moment.tz(scheduleTime, timezone).format('YYYY-MM-DD hh:mm A z')}`
              : "Batch call created successfully",
          });
          onClose();
        },
      }
    );
  };

  return (
    <div className="flex gap-6 batchcallForm">
      <Card className="border w-full max-w-2xl bg-black border-zinc-800 min-w-[700px]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Batch Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter batch name"
                  className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Max Concurrent Calls</Label>
                <Input
                  type="number"
                  min={1}
                  max={maxCallLimit}
                  value={formData.maxConcurrentCalls}
                  onChange={(e) => {
                    const value = Math.min(
                      Math.max(1, parseInt(e.target.value) || 1),
                      maxCallLimit
                    );
                    setFormData({
                      ...formData,
                      maxConcurrentCalls: value,
                    });
                  }}
                  className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                />
                <p className="text-xs text-gray-400">
                  Maximum concurrent calls allowed for {user?.subscription?.planId} plan: {maxCallLimit}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Select Assistant</Label>
                <Select
                  value={formData.assistantId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assistantId: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700">
                    <SelectValue placeholder="Select an assistant" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-black border-zinc-800">
                    {assistants?.assistants?.map((assistant: any) => (
                      <SelectItem
                        key={assistant._id}
                        value={assistant._id}
                        className="text-white hover:bg-zinc-800"
                      >
                        {assistant.assistantName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Select Phone Number</Label>
                <Select
                  value={formData.phoneNumberId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, phoneNumberId: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700">
                    <SelectValue placeholder="Select a phone number" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-black border-zinc-800">
                    {phoneNumbers?.phoneNumbers?.map((phone: any) => (
                      <SelectItem
                        key={phone._id}
                        value={phone._id}
                        className="text-white hover:bg-zinc-800"
                      >
                        {phone.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Schedule Time (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <DatePicker date={date} setDate={setDate} />
                  <TimePicker value={time} onChange={setTime} />
                </div>
                <div>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="h-10 w-full bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-black border-zinc-800">
                      {TIMEZONES.map((tz) => (
                        <SelectItem
                          key={tz.value}
                          value={tz.value}
                          className="text-white hover:bg-zinc-800"
                        >
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="csv" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-900">
                <TabsTrigger value="csv" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  Upload CSV
                </TabsTrigger>
                <TabsTrigger value="manual" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  Manual Input
                </TabsTrigger>
                <TabsTrigger value="ghl" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  GoHighLevel
                </TabsTrigger>
              </TabsList>
              <TabsContent value="csv">
                <CSVUpload onUpload={handleCSVUpload} />
              </TabsContent>
              <TabsContent value="manual">
                <ManualNumberInput
                  numbers={formData.recipients.map(r => ({
                    name: r.dynamicValues.name || '',
                    phoneNumber: r.phoneNumber
                  }))}
                  onNumbersChange={handleManualNumbersUpdate}
                />
              </TabsContent>
              <TabsContent value="ghl">
                <div className="flex flex-col gap-4 p-4">
                  <Button
                    disabled
                    className="p-2 text-white bg-red-900"
                  >
                    This Feature will be available soon.
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="normal"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
              >
                {isPending ? <>Creating<Spinner/></> : "Create Batch Call"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Updated Preview Table Card */}
      {formData.recipients.length > 0 && (
        <Card className="w-full max-w-md bg-black border-zinc-800 h-fit">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              Uploaded Data Preview
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Column headers will be available as dynamic variables. Use them in your messages using {'{{'}headerName{'}}'}' format.
              Example: If you have a column "name", use {'{{'}name{'}}'}' in your messages.
            </p>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-white">Phone Number</TableHead>
                    {headers.filter(header => header !== 'phoneNumber').map((header) => (
                      <TableHead key={header} className="text-white">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.recipients.map((recipient, index) => (
                    <TableRow key={index} className="border-zinc-800">
                      <TableCell className="text-gray-300">
                        {recipient.phoneNumber}
                      </TableCell>
                      {headers.filter(header => header !== 'phoneNumber').map((header) => (
                        <TableCell key={header} className="text-gray-300">
                          {recipient.dynamicValues[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Total Records: {formData.recipients.length}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchCallForm;
