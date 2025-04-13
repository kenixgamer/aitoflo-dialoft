import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getTimezone } from "@/utils/helperFunctions";
import { TIMEZONES } from "@/constants/timezones";

const CHECK_CALENDAR_AVAILABILITY_TOOL_ID = import.meta.env
  .VITE_CHECK_CALENDAR_AVAILABILITY_TOOL_ID;
const BOOK_APPOINTMENT_TOOL_ID = import.meta.env.VITE_BOOK_APPOINTMENT_TOOL_ID;

// Add country codes data
const COUNTRY_CODES = [
  { code: "US", dial_code: "1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dial_code: "44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "IN", dial_code: "91", flag: "🇮🇳", name: "India" },
  { code: "CA", dial_code: "1", flag: "🇨🇦", name: "Canada" },
  { code: "AU", dial_code: "61", flag: "🇦🇺", name: "Australia" },
  { code: "DE", dial_code: "49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial_code: "33", flag: "🇫🇷", name: "France" },
  { code: "IT", dial_code: "39", flag: "🇮🇹", name: "Italy" },
  { code: "ES", dial_code: "34", flag: "🇪🇸", name: "Spain" },
  { code: "JP", dial_code: "81", flag: "🇯🇵", name: "Japan" },
  // Add more countries as needed
];

// Add helper function to get country by dial code
const getCountryByDialCode = (dialCode: string) => {
  return COUNTRY_CODES.find((country) => {
    // Remove '+' if present in the dial code
    const cleanDialCode = dialCode.replace("+", "");
    return country.dial_code === cleanDialCode;
  });
};

export default function ActionConfig({ formData, setFormData }: any) {
  const [selectedTool, setSelectedTool] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [apiKey, setApiKey] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState(getTimezone());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  // Parse phone number on component mount
  useEffect(() => {
    if (formData?.forwardingPhoneNumber) {
      const parsedNumber = parsePhoneNumber(formData.forwardingPhoneNumber);
      if (parsedNumber) {
        setCountryCode(parsedNumber.countryCode);
        setPhoneNumber(parsedNumber.number);
      } else {
        // If parsing fails, set default country code and full number
        setCountryCode("US");
        setPhoneNumber(formData.forwardingPhoneNumber.replace(/^\+/, ""));
      }
    }
  }, [formData?.forwardingPhoneNumber]);

  // Utility functions for phone number handling
  const parsePhoneNumber = (fullNumber: string) => {
    if (!fullNumber) return null;

    // Remove any '+' from the beginning
    const cleanNumber = fullNumber.replace(/^\+/, "");

    // Try matching with 1 or 2 digit country codes first
    for (let i = 1; i <= 3; i++) {
      const dialCode = cleanNumber.substring(0, i);
      const country = getCountryByDialCode(dialCode);
      if (country) {
        return {
          countryCode: country.code,
          number: cleanNumber.substring(dialCode.length),
        };
      }
    }
    return null;
  };

  const formatPhoneNumber = (countryCode: string, number: string) => {
    const country = COUNTRY_CODES.find((c) => c.code === countryCode);
    return country ? `+${country.dial_code}${number}` : number;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setPhoneNumber(value);
    const formattedNumber = formatPhoneNumber(countryCode, value);
    setFormData({ ...formData, forwardingPhoneNumber: formattedNumber });
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    const formattedNumber = formatPhoneNumber(value, phoneNumber);
    setFormData({ ...formData, forwardingPhoneNumber: formattedNumber });
  };

  const handleToolSelection = (value: string) => {
    setSelectedTool(value);
    setIsDialogOpen(true);
  };

  const handleSaveCredentials = () => {
    if (!apiKey || !eventTypeId) {
      return;
    }

    const toolToAdd =
      selectedTool === "check_calendar"
        ? CHECK_CALENDAR_AVAILABILITY_TOOL_ID
        : BOOK_APPOINTMENT_TOOL_ID;

    // Create new toolIds array if it doesn't exist
    const currentToolIds = formData?.toolIds || [];

    // If editing, don't add the tool again
    const updatedToolIds = editingTool
      ? currentToolIds
      : currentToolIds.includes(toolToAdd)
      ? currentToolIds // If tool already exists, don't add it
      : [...currentToolIds, toolToAdd];

    setFormData({
      ...formData,
      toolIds: updatedToolIds,
      checkCalendarAvailability:
        selectedTool === "check_calendar"
          ? true
          : formData.checkCalendarAvailability,
      bookAppointment:
        selectedTool === "book_calendar" ? true : formData.bookAppointment,
      metadata: {
        ...formData.metadata,
        ...(selectedTool === "check_calendar"
          ? {
              checkAvailabilityApiKey: apiKey,
              checkAvailabilityEventTypeId: eventTypeId,
              checkAvailabilityDescription: description,
              checkAvailabilityTimezone: timezone,
            }
          : {
              bookAppointmentApiKey: apiKey,
              bookAppointmentEventTypeId: eventTypeId,
              bookAppointmentDescription: description,
              bookAppointmentTimezone: timezone,
            }),
      },
    });
    resetForm();
    setIsDialogOpen(false);
  };

  const handleRemoveTool = (tool: string) => {
    const currentToolIds = formData?.toolIds || [];

    const newToolIds = currentToolIds.filter((t: string) => t !== tool);
    const newMetadata = { ...formData.metadata };

    if (tool === CHECK_CALENDAR_AVAILABILITY_TOOL_ID) {
      delete newMetadata.checkAvailabilityApiKey;
      delete newMetadata.checkAvailabilityEventTypeId;
      delete newMetadata.checkAvailabilityDescription;
      delete newMetadata.checkAvailabilityTimezone;
    } else if (tool === BOOK_APPOINTMENT_TOOL_ID) {
      delete newMetadata.bookAppointmentApiKey;
      delete newMetadata.bookAppointmentEventTypeId;
      delete newMetadata.bookAppointmentDescription;
      delete newMetadata.bookAppointmentTimezone;
    }

    setFormData({
      ...formData,
      checkCalendarAvailability: newToolIds.includes(
        CHECK_CALENDAR_AVAILABILITY_TOOL_ID
      ),
      bookAppointment: newToolIds.includes(BOOK_APPOINTMENT_TOOL_ID),
      toolIds: newToolIds,
      metadata: newMetadata,
    });
  };

  const handleEditTool = (tool: string) => {
    setSelectedTool(
      tool === CHECK_CALENDAR_AVAILABILITY_TOOL_ID
        ? "check_calendar"
        : "book_calendar"
    );

    if (tool === CHECK_CALENDAR_AVAILABILITY_TOOL_ID) {
      setApiKey(formData.metadata?.checkAvailabilityApiKey || "");
      setEventTypeId(formData.metadata?.checkAvailabilityEventTypeId || "");
      setDescription(formData.metadata?.checkAvailabilityDescription || "");
      setTimezone(formData.metadata?.checkAvailabilityTimezone || "");
    } else {
      setApiKey(formData.metadata?.bookAppointmentApiKey || "");
      setEventTypeId(formData.metadata?.bookAppointmentEventTypeId || "");
      setDescription(formData.metadata?.bookAppointmentDescription || "");
      setTimezone(formData.metadata?.bookAppointmentTimezone || "");
    }

    setEditingTool(tool);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedTool("");
    setApiKey("");
    setEventTypeId("");
    setDescription("");
    setIsDialogOpen(false);
    setEditingTool(null);
    setTimezone("");
  };
  return (
    <div className="space-y-6">
      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Call Forwarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-zinc-300">
              Forwarding Phone Number
            </Label>
            <div className="flex gap-2">
              <Select
                value={countryCode}
                onValueChange={handleCountryCodeChange}
              >
                <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue placeholder="Country">
                    {COUNTRY_CODES.find((c) => c.code === countryCode)?.flag} +
                    {
                      COUNTRY_CODES.find((c) => c.code === countryCode)
                        ?.dial_code
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[200px]">
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className="text-white hover:bg-zinc-800"
                    >
                      {`${country.flag} +${country.dial_code}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter phone number"
                className="flex-1 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
                type="tel"
              />
            </div>
            <p className="text-xs text-zinc-400">
              Enter the phone number where calls will be forwarded. This number
              should be monitored during business hours.
            </p>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.metadata.callForwardDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      callForwardDescription: e.target.value,
                    },
                  })
                }
                placeholder="Example: All calls will be forwarded to this number during business hours. Please ensure someone is available to answer."
                className="bg-zinc-900 border-zinc-800 text-white min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Available Calendar Tools
              </Label>
              <p className="text-xs text-zinc-400">
                Configure calendar integration tools to manage appointments and
                availability.
              </p>
            </div>

            <Select value={selectedTool} onValueChange={handleToolSelection}>
              <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white">
                <SelectValue placeholder="Select a tool to add" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem
                  value="check_calendar"
                  className="text-white hover:bg-zinc-800"
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Check Calendar Availability
                  </div>
                </SelectItem>
                <SelectItem
                  value="book_calendar"
                  className="text-white hover:bg-zinc-800"
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Book Calendar Appointment
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              {formData?.toolIds?.map((tool: string) => (
               (tool == CHECK_CALENDAR_AVAILABILITY_TOOL_ID || tool == BOOK_APPOINTMENT_TOOL_ID) ? (<div
                  key={tool}
                  className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-white">
                      {tool === CHECK_CALENDAR_AVAILABILITY_TOOL_ID
                        ? "Check Calendar Availability"
                        : "Book Calendar Appointment"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTool(tool)}
                      className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTool(tool)}
                      className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>) : null
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingTool !== null
                ? "Edit Tool Configuration"
                : "Configure Cal.com Integration"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key (Cal.com)</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter Cal.com API key"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTypeId">Event Type ID (Cal.com)</Label>
              <Input
                id="eventTypeId"
                value={eventTypeId}
                onChange={(e) => setEventTypeId(e.target.value)}
                placeholder="Enter Event Type ID"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
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
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="When users ask to book an appointment, book it on the calendar."
                className="bg-zinc-900 border-zinc-800 text-white min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="normal"
              onClick={resetForm}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCredentials}
              variant="primary"
              className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            >
              {editingTool !== null ? "Save Changes" : "Add Tool"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Call Ending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-zinc-300">
              Enable End Call Function
            </Label>
            <Switch
              checked={formData.endCallFunctionEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, endCallFunctionEnabled: checked })
              }
              className="bg-zinc-800 data-[state=checked]:bg-purple-600"
            />
          </div>
          {formData.endCallFunctionEnabled && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-zinc-300">
                End Call Message
              </Label>
              <Textarea
                value={formData.metadata.callEndDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      callEndDescription: e.target.value,
                    },
                  })
                }
                placeholder="Example: Thank you for your time. I'll end our call now as we've addressed your concerns. Have a great day!"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400 min-h-[100px] resize-none"
              />
              <p className="text-xs text-zinc-400">
                This message will be spoken before the assistant ends the call.
              </p>
            </div>
          )}{" "}
        </CardContent>{" "}
      </Card>{" "}
    </div>
  );
}
