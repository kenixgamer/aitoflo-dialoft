import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  useUpdateAssistant,
} from "@/query/assistant.queries";
import { useParams } from "react-router-dom";
import SelectVoice from "./SelectVoice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Spinner from "../Spinner";
import Basic from "./Sections/Basic";
import Voice from "./Sections/Voice";
import Message from "./Sections/Message";
import Advance from "./Sections/Advance";
import KnowledgeBase from "./Sections/KnowledgeBase";
import Tools from "./Sections/Tools";

const CHECK_CALENDAR_AVAILABILITY_TOOL_ID = import.meta.env
  .VITE_CHECK_CALENDAR_AVAILABILITY_TOOL_ID;
const BOOK_APPOINTMENT_TOOL_ID = import.meta.env.VITE_BOOK_APPOINTMENT_TOOL_ID;

interface FormData {
  name: string;
  content: string;
  assistantId: string;
  keywords: string[];
  language: string;
  mainVoiceId: string;
  fallblackVoiceId: string;
  firstMessage: string;
  firstMessageMode: string;
  maxDurationSeconds: number;
  backgroundSound: string;
  voicemailMessage: string;
  endCallMessage: string;
  endCallPhrases: string[];
  forwardingPhoneNumber: string;
  model: string;
  checkCalendarAvailability: boolean;
  bookAppointment: boolean;
  metadata: {
    userId?: string;
    checkAvailabilityApiKey?: string;
    checkAvailabilityEventTypeId?: string;
    checkAvailabilityTimezone?: string;
    bookAppointmentApiKey?: string;
    bookAppointmentEventTypeId?: string;
    bookAppointmentTimezone?: string;
  };
  knowledgebaseIds?: string[];
  similarityBoost: number;
  stability: number;
  useSpeakerBoost: boolean;
  style: number;
  silenceTimeoutSeconds: number;
  backgroundDenoisingEnabled: boolean;
  recordingEnabled: boolean;
  voicemailDetection: {
    provider: string;
    voicemailDetectionTypes: string[];
    enabled: boolean;
  };
  messagePlan: {
    idleMessages: string[];
    idleMessageMaxSpokenCount: number;
    idleTimeoutSeconds: number;
  };
}

const AssistantDetailsForm = ({assistant} : any) => {
  const [showMainVoiceSelect, setShowMainVoiceSelect] = useState(false);
  const [showFallbackVoiceSelect, setShowFallbackVoiceSelect] = useState(false);
  const { assistantId, workshopId } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    content: "",
    assistantId: assistantId || ""  ,
    keywords: [],
    language: "en",
    mainVoiceId: "",
    fallblackVoiceId: "",
    firstMessage: "",
    firstMessageMode: "assistant-speaks-first",
    maxDurationSeconds: 0,
    backgroundSound: "",
    voicemailMessage: "",
    endCallMessage: "",
    endCallPhrases: [],
    forwardingPhoneNumber: "",
    model: "gpt-3.5-turbo",
    checkCalendarAvailability: false,
    bookAppointment: false,
    metadata: {
      userId: "",
      checkAvailabilityApiKey: "",
      checkAvailabilityEventTypeId: "",
      checkAvailabilityTimezone: "",
      bookAppointmentApiKey: "",
      bookAppointmentEventTypeId: "",
      bookAppointmentTimezone: "",
    },
    similarityBoost: 0.5,
    stability: 0.5,
    useSpeakerBoost: false,
    style: 0,
    silenceTimeoutSeconds: 10,
    backgroundDenoisingEnabled: false,
    recordingEnabled: true,
    voicemailDetection: {
      provider: 'twilio',
      voicemailDetectionTypes: [],
      enabled: false
    },
    messagePlan: {
      idleMessages: [],
      idleMessageMaxSpokenCount: 3,
      idleTimeoutSeconds: 9
    },
  });
  const { mutate: updateAssistant,isPending : isUpdatingAssistant } = useUpdateAssistant();

  const handleMainVoiceSelect = (voiceId: string) => {
    setFormData({
      ...formData,
      mainVoiceId: voiceId,
    });
    setShowMainVoiceSelect(false);
  };

  const handleFallbackVoiceSelect = (voiceId: string) => {
    setFormData({
      ...formData,
      fallblackVoiceId: voiceId,
    });
    setShowFallbackVoiceSelect(false);
  };

  const handleSaveChanges = () => {
    const updatedData = {
      ...formData,
      // Include messagePlan data explicitly
      idleMessages: formData.messagePlan.idleMessages,
      idleMessageMaxSpokenCount: formData.messagePlan.idleMessageMaxSpokenCount,
      idleTimeoutSeconds: formData.messagePlan.idleTimeoutSeconds,
      metadata: {
        userId: formData.metadata.userId || "1111",
        checkAvailabilityApiKey:
          formData.metadata.checkAvailabilityApiKey || "1111",
        checkAvailabilityEventTypeId:
          formData.metadata.checkAvailabilityEventTypeId || "1111",
        checkAvailabilityTimezone:
          formData.metadata.checkAvailabilityTimezone || "1111",
        bookAppointmentApiKey:
          formData.metadata.bookAppointmentApiKey || "1111",
        bookAppointmentEventTypeId:
          formData.metadata.bookAppointmentEventTypeId || "1111",
        bookAppointmentTimezone:
          formData.metadata.bookAppointmentTimezone || "1111",
      },
    };

    updateAssistant(updatedData);
  };
 
  useEffect(() => {
    if (assistant) {
      const hasCheckCalendar = assistant.model?.toolIds?.includes(
        CHECK_CALENDAR_AVAILABILITY_TOOL_ID
      );
      const hasBookAppointment = assistant.model?.toolIds?.includes(
        BOOK_APPOINTMENT_TOOL_ID
      );

      setFormData({
        name: assistant.name || "",
        content: assistant?.model?.messages[0]?.content || "",
        assistantId: assistantId || "",
        keywords: assistant.transcriber?.keywords || [],
        language: assistant.transcriber?.language || "en",
        mainVoiceId: assistant.voice?.voiceId || "",
        fallblackVoiceId:
          assistant.voice?.fallbackPlan?.voices[0]?.voiceId || "",
        firstMessage: assistant.firstMessage || "",
        firstMessageMode:
          assistant.firstMessageMode || "assistant-speaks-first",
        maxDurationSeconds: assistant.maxDurationSeconds || 600,
        backgroundSound: assistant.backgroundSound || "office",
        voicemailMessage: assistant.voicemailMessage || "",
        endCallMessage: assistant.endCallMessage || "",
        endCallPhrases: assistant.endCallPhrases || [],
        forwardingPhoneNumber: assistant.forwardingPhoneNumber || "",
        model: assistant.model?.model || "gpt-3.5-turbo",
        checkCalendarAvailability: hasCheckCalendar || false,
        bookAppointment: hasBookAppointment || false,
      knowledgebaseIds : assistant?.model?.knowledgeBase?.fileIds || [],
        metadata: {
          checkAvailabilityApiKey:
            assistant.metadata?.checkAvailabilityApiKey || "",
          checkAvailabilityEventTypeId:
            assistant.metadata?.checkAvailabilityEventTypeId || "",
          checkAvailabilityTimezone:
            assistant.metadata?.checkAvailabilityTimezone || "",
          bookAppointmentApiKey:
            assistant.metadata?.bookAppointmentApiKey || "",
          bookAppointmentEventTypeId:
            assistant.metadata?.bookAppointmentEventTypeId || "",
          bookAppointmentTimezone:
            assistant.metadata?.bookAppointmentTimezone || "",
        },
        similarityBoost: assistant.similarityBoost || 0.5,
        stability: assistant.voice?.stability || 0.5,
        useSpeakerBoost: assistant.voice?.useSpeakerBoost || false,
        style: assistant.voice?.style || 0,
        silenceTimeoutSeconds: assistant.silenceTimeoutSeconds || 10,
        backgroundDenoisingEnabled: assistant.backgroundDenoisingEnabled || false,
        recordingEnabled: assistant?.artifactPlan?.recordingEnabled,
        voicemailDetection: assistant.voicemailDetection || {
          provider: 'twilio',
          voicemailDetectionTypes: [],
          enabled: false
        },
        messagePlan: assistant.messagePlan || {
          idleMessages: [],
          idleMessageMaxSpokenCount: 3,
          idleTimeoutSeconds: 9
        },
      });
    }
  }, [assistant]);

  const [showFunctionDialog, setShowFunctionDialog] = useState(false);
  const [calendarConfig, setCalendarConfig] = useState<{
    apiKey: string;
    eventTypeId: string;
    username: string;
  }>({
    apiKey: "cal_live_d50796ab39501656e17ea5e46239c92d",
    eventTypeId: "1577623",
    username: "Parmar Harsh",
  });

  const [selectedFunction, setSelectedFunction] = useState<
    "check-calendar" | "book-calendar" | null
  >(null);

  const handleSaveCalendarFunction = () => {
    const newMetadata = {
      ...formData.metadata,
      ...(selectedFunction === "check-calendar"
        ? {
            checkAvailabilityApiKey: calendarConfig.apiKey,
            checkAvailabilityEventTypeId: calendarConfig.eventTypeId,
            checkAvailabilityTimezone: calendarConfig.username,
          }
        : {
            bookAppointmentApiKey: calendarConfig.apiKey,
            bookAppointmentEventTypeId: calendarConfig.eventTypeId,
            bookAppointmentTimezone: calendarConfig.username,
          }),
    };

    // Preserve both tool states
    const updatedData = {
      assistantId: formData.assistantId,
      name: formData.name,
      content: formData.content,
      model: formData.model,
      checkCalendarAvailability: selectedFunction === "check-calendar" 
        ? true 
        : formData.checkCalendarAvailability,
      bookAppointment: selectedFunction === "book-calendar" 
        ? true 
        : formData.bookAppointment,
      metadata: newMetadata,
    };

    updateAssistant(updatedData);

    setFormData((prev) => ({
      ...prev,
      [selectedFunction === "check-calendar"
        ? "checkCalendarAvailability"
        : "bookAppointment"]: true,
      metadata: newMetadata,
    }));

    setShowFunctionDialog(false);
    setSelectedFunction(null);
  };

  const handleRemoveCalendarFunction = (type: string) => {
    const updatedData = {
      assistantId: formData.assistantId,
      name: formData.name,
      content: formData.content,
      model: formData.model,
      checkCalendarAvailability:
        type === "check-calendar" ? false : formData.checkCalendarAvailability,
      bookAppointment:
        type === "book-calendar" ? false : formData.bookAppointment,
      metadata: {
        ...formData.metadata,
        ...(type === "check-calendar"
          ? {
              checkAvailabilityApiKey: "",
              checkAvailabilityEventTypeId: "",
              checkAvailabilityTimezone: "",
              bookAppointmentApiKey: formData.metadata.bookAppointmentApiKey,
              bookAppointmentEventTypeId:
                formData.metadata.bookAppointmentEventTypeId,
              bookAppointmentTimezone:
                formData.metadata.bookAppointmentTimezone,
            }
          : {
              bookAppointmentApiKey: "",
              bookAppointmentEventTypeId: "",
              bookAppointmentTimezone: "",
              checkAvailabilityApiKey:
                formData.metadata.checkAvailabilityApiKey,
              checkAvailabilityEventTypeId:
                formData.metadata.checkAvailabilityEventTypeId,
              checkAvailabilityTimezone:
                formData.metadata.checkAvailabilityTimezone,
            }),
      },
      keywords: formData.keywords,
      language: formData.language,
      mainVoiceId: formData.mainVoiceId,
      fallblackVoiceId: formData.fallblackVoiceId,
      firstMessage: formData.firstMessage,
      firstMessageMode: formData.firstMessageMode,
      maxDurationSeconds: formData.maxDurationSeconds,
      backgroundSound: formData.backgroundSound,
      voicemailMessage: formData.voicemailMessage,
      endCallMessage: formData.endCallMessage,
      endCallPhrases: formData.endCallPhrases,
      forwardingPhoneNumber: formData.forwardingPhoneNumber,
    };


    updateAssistant(updatedData);

    setFormData((prev) => ({
      ...prev,
      [type === "check-calendar"
        ? "checkCalendarAvailability"
        : "bookAppointment"]: false,
      metadata: {
        ...formData.metadata,
        ...(type === "check-calendar"
          ? {
              checkAvailabilityApiKey: "",
              checkAvailabilityEventTypeId: "",
              checkAvailabilityTimezone: "",
              bookAppointmentApiKey: formData.metadata.bookAppointmentApiKey,
              bookAppointmentEventTypeId:
                formData.metadata.bookAppointmentEventTypeId,
              bookAppointmentTimezone:
                formData.metadata.bookAppointmentTimezone,
            }
          : {
              bookAppointmentApiKey: "",
              bookAppointmentEventTypeId: "",
              bookAppointmentTimezone: "",
              checkAvailabilityApiKey:
                formData.metadata.checkAvailabilityApiKey,
              checkAvailabilityEventTypeId:
                formData.metadata.checkAvailabilityEventTypeId,
              checkAvailabilityTimezone:
                formData.metadata.checkAvailabilityTimezone,
            }),
      },
    }));
  };

  return (
    <>
    <div className="flex-1 p-6 bg-black min-h-screen">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-900">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            Basic Settings
          </TabsTrigger>
          <TabsTrigger
            value="voice"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            Voice & Language
          </TabsTrigger>
          <TabsTrigger
            value="knowledgebase"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            Tools
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            Advanced
          </TabsTrigger>
        </TabsList>
        <Basic formData={formData} setFormData={setFormData}/>
        <Voice formData={formData} setFormData={setFormData} setShowMainVoiceSelect={setShowMainVoiceSelect} setShowFallbackVoiceSelect={setShowFallbackVoiceSelect}/>
        <KnowledgeBase 
          formData={formData} 
          setFormData={setFormData}
          workshopId={workshopId}
          assistantId={assistantId}
          assistant={assistant}
        />
        <Message formData={formData} setFormData={setFormData}/>
        <Tools 
          formData={formData}
          handleRemoveCalendarFunction={handleRemoveCalendarFunction}
          setSelectedFunction={setSelectedFunction}
          setShowFunctionDialog={setShowFunctionDialog}
        />
        <Advance 
          formData={formData} 
          setFormData={setFormData} 
          setSelectedFunction={setSelectedFunction} 
          setShowFunctionDialog={setShowFunctionDialog} 
          handleRemoveCalendarFunction={handleRemoveCalendarFunction} 
          assistant={assistant} 
          updateAssistant={updateAssistant}
        />
      </Tabs>

      <div className="flex justify-end mt-6 space-x-4">
        <Button
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isUpdatingAssistant ? <>Saving<Spinner/></> : "Save Changes"}
        </Button>
      </div>
      <SelectVoice
        isOpen={showMainVoiceSelect}
        onClose={() => setShowMainVoiceSelect(false)}
        onSelect={handleMainVoiceSelect}
        selectedVoiceId={formData.mainVoiceId}
      />
      <SelectVoice
        isOpen={showFallbackVoiceSelect}
        onClose={() => setShowFallbackVoiceSelect(false)}
        onSelect={handleFallbackVoiceSelect}
        selectedVoiceId={formData.fallblackVoiceId}
      />
        <Dialog open={showFunctionDialog} onOpenChange={setShowFunctionDialog}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>
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
                  className="bg-gray-800 border-gray-700 text-white"
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
                  className="bg-gray-800 border-gray-700 text-white"
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
                  className="bg-gray-800 border-gray-700 text-white"

                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="primary"
                onClick={handleSaveCalendarFunction}
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
    </div>
    </>
  );
};



export default AssistantDetailsForm;
