import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import ModelConfig from "./ModelConfig";
import VoiceConfig from "./VoiceConfig";
import SpeechConfig from "./SpeechConfig";
import CallConfig from "./CallConfig";
import ActionConfig from "./ActionConfig";
import { ChevronRight, Phone, PhoneOff } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  useGetAssistantDetails,
  useUpdateAssistant,
} from "@/query/assistant.queries";
import SelectVoice from "../SelectVoice";
import { initializeVapiCall } from "../AssistantDetails";
import Spinner from "@/components/Spinner";
import { UserContext } from "@/context";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPhoneNumbers,
  useRemoveInBoundNumber,
  useUpdateAssistantPhoneNumber,
} from "@/query/phoneNumber.queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteIconMd } from "@/utils/icons/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CHECK_CALENDAR_AVAILABILITY_TOOL_ID = import.meta.env
  .VITE_CHECK_CALENDAR_AVAILABILITY_TOOL_ID;
const BOOK_APPOINTMENT_TOOL_ID = import.meta.env.VITE_BOOK_APPOINTMENT_TOOL_ID;

const steps = [
  {
    id: "prompt",
    label: "Prompt",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 9H15M9 13H15M9 17H12M8.2 4H15.8C16.9201 4 17.4802 4 17.908 4.21799C18.2843 4.40973 18.5903 4.71569 18.782 5.09202C19 5.51984 19 6.07989 19 7.2V16.8C19 17.9201 19 18.4802 18.782 18.908C18.5903 19.2843 18.2843 19.5903 17.908 19.782C17.4802 20 16.9201 20 15.8 20H8.2C7.07989 20 6.51984 20 6.09202 19.782C5.71569 19.5903 5.40973 19.2843 5.21799 18.908C5 18.4802 5 17.9201 5 16.8V7.2C5 6.07989 5 5.51984 5.21799 5.09202C5.40973 4.71569 5.40973 4.40973 6.09202 4.21799C6.51984 4 7.07989 4 8.2 4Z"
          stroke="#9333EA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "voice",
    label: "Voice",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z"
          stroke="#9333EA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "speech",
    label: "Speech",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6V18M8 8V16M4 10V14M16 8V16M20 10V14"
          stroke="#9333EA"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "call-settings",
    label: "Call Settings",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.79 21.97 18.03 21.97 18.33Z"
          stroke="#9333EA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
      </svg>
    ),
  },
  {
    id: "action",
    label: "Action",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V13M12 13L15 10M12 13L9 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#9333EA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AIAssistantConfig() {
  const { toast } = useToast();
  const { assistantId, workshopId } = useParams();
  if (!assistantId || !workshopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Assistant Or Workshop not found</p>
      </div>
    );
  }
  // const [isTestingAgent, setIsTestingAgent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: assistant } = useGetAssistantDetails(assistantId || "");
  const [showMainVoiceSelect, setShowMainVoiceSelect] = useState(false);
  const { mutateAsync: removeInBoundNumber } = useRemoveInBoundNumber();
  // const [showFallbackVoiceSelect, setShowFallbackVoiceSelect] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    assistantId: assistantId || "",
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
    toolIds: [],
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
      callForwardDescription: "",
      callEndDescription: "",
      content: "",
      knowledgebasetoolId : "",
      knowledgebaseDescription : "",
      knowledgebaseName : "",
    },
    similarityBoost: 0.5,
    stability: 0.5,
    useSpeakerBoost: false,
    style: 0,
    silenceTimeoutSeconds: 10,
    backgroundDenoisingEnabled: false,
    recordingEnabled: true,
    voicemailDetection: {
      provider: "twilio",
      voicemailDetectionTypes: [],
      enabled: false,
    },
    messagePlan: {
      idleMessages: [],
      idleMessageMaxSpokenCount: 3,
      idleTimeoutSeconds: 9,
    },
  });
  const { mutate: updateAssistant, isPending: isUpdatingAssistant } =
    useUpdateAssistant();
  const { mutate: updatePhoneNumber } = useUpdateAssistantPhoneNumber();

  const handleMainVoiceSelect = (voiceId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      mainVoiceId: voiceId,
    }));
    setShowMainVoiceSelect(false);
  };

  const handleSaveChanges = async () => {
    try {
      if(formData?.metadata?.knowledgebaseIds && formData?.metadata?.knowledgebaseIds.length > 0 && (!formData?.metadata?.knowledgebaseDescription || !formData?.metadata?.knowledgebaseName))  {
        toast({
          title: "Error",
          description: "Knowledgebase description and name are required.",
          variant: "destructive"
        })
      } else {
        updateAssistant(formData);
      }
    } catch (error) {
      console.error("Error creating voice:", error);
      toast({
        title: "Error",
        description: "Failed to create voice",
        variant: "destructive"
      });
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };
  const [isTestingAgent, setIsTestingAgent] = useState(false);
  const { user } = useContext(UserContext);
  const { data: phoneNumbersData } = useGetPhoneNumbers(1, "", 100, "");
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const handleWebCall = async () => {
    if (user.subscription.status !== "active") {
      toast({
        title: "Error",
        description: "Your Account is In-Acitve.Contact Support",
        variant: "destructive",
      });
      return;
    }
    if (user.subscription.secondsRemaining == 0) {
      return;
    }
    const vapiBtn = document.querySelector("#vapi-support-btn");
    if (vapiBtn) {
      (vapiBtn as HTMLElement).click();
    }
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
        name: assistant?.name || "",
        assistantId: assistantId || "",
        keywords: assistant?.transcriber?.keywords || [],
        language: assistant?.transcriber?.language || "en",
        mainVoiceId: assistant?.voice?.voiceId || "",
        fallblackVoiceId:
          assistant?.voice?.fallbackPlan?.voices[0]?.voiceId || "",
        firstMessage: assistant?.firstMessage || "",
        firstMessageMode:
          assistant?.firstMessageMode || "assistant-speaks-first",
        maxDurationSeconds: assistant?.maxDurationSeconds || 600,
        backgroundSound: assistant?.backgroundSound || "office",
        voicemailMessage: assistant?.voicemailMessage || "",
        endCallMessage: assistant?.endCallMessage || "",
        endCallPhrases: assistant?.endCallPhrases || [],
        forwardingPhoneNumber: assistant?.forwardingPhoneNumber || "",
        model: assistant?.model?.model || "gpt-3.5-turbo",
        toolIds: assistant?.model?.toolIds || [],
        checkCalendarAvailability: hasCheckCalendar || false,
        bookAppointment: hasBookAppointment || false,
        metadata: {
          checkAvailabilityApiKey:
            assistant?.metadata?.checkAvailabilityApiKey || "",
          checkAvailabilityTimezone : assistant?.metadata?.checkAvailabilityTimezone || "",
          content: assistant.metadata?.content || "",
          checkAvailabilityEventTypeId:
            assistant?.metadata?.checkAvailabilityEventTypeId || "",
          checkAvailabilityDescription:
            assistant?.metadata?.checkAvailabilityDescription || "",
          bookAppointmentApiKey:
            assistant?.metadata?.bookAppointmentApiKey || "",
          bookAppointmentEventTypeId:
            assistant?.metadata?.bookAppointmentEventTypeId || "",
          bookAppointmentDescription:
            assistant?.metadata?.bookAppointmentDescription || "",
          bookAppointmentTimezone : assistant?.metadata?.bookAppointmentTimezone || "",
          callForwardDescription:
            assistant?.metadata?.callForwardDescription || "",
          callEndDescription: assistant.metadata?.callEndDescription || "",
          knowledgebasetoolId : assistant?.metadata?.knowledgebasetoolId || "",
          knowledgebaseDescription : assistant?.metadata?.knowledgebaseDescription || "",
          knowledgebaseName : assistant?.metadata?.knowledgebaseName || "",
          knowledgebaseIds: assistant?.metadata?.knowledgebaseIds || [],
        },
        endCallFunctionEnabled: assistant?.endCallFunctionEnabled || false,
        similarityBoost: assistant?.voice?.similarityBoost || 0,
        stability: assistant?.voice?.stability || 0,
        useSpeakerBoost: assistant?.voice?.useSpeakerBoost || false,
        style: assistant?.voice?.style || 0,
        silenceTimeoutSeconds: assistant?.silenceTimeoutSeconds || 10,
        backgroundDenoisingEnabled:
          assistant?.backgroundDenoisingEnabled || false,
        recordingEnabled: assistant?.artifactPlan?.recordingEnabled,
        voicemailDetection: assistant?.voicemailDetection || {
          provider: "twilio",
          voicemailDetectionTypes: [],
          enabled: false,
        },
        idleMessages: assistant?.messagePlan?.idleMessages || [],
        idleMessageMaxSpokenCount:
          assistant?.messagePlan?.idleMessageMaxSpokenCount,
        idleTimeoutSeconds: assistant?.messagePlan?.idleTimeoutSeconds,
      });
      setSelectedPhoneNumber(assistant.phoneNumberId);
      let interval: NodeJS.Timeout;
      if (user.subscription.status === "active") {
        initializeVapiCall(assistant.assistantId, setIsTestingAgent).then(
          () => {
            // Check for the button every 100ms until found
            interval = setInterval(() => {
              const vapiBtn = document.querySelector("#vapi-support-btn");
              if (vapiBtn) {
                vapiBtn.addEventListener("click", () => {
                  setIsTestingAgent(true);
                });
                clearInterval(interval);
              }
            }, 100);
          }
        );
      }

      // Cleanup
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [assistant]);

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Card className="w-full max-w-6xl mx-auto bg-black border-zinc-800 shadow-2xl">
          <CardHeader className="border-b border-zinc-800 sticky top-0 z-10 bg-black">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-3xl font-bold bg-transparent border-none focus:ring-0 p-0 h-auto text-white w-40"
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <CardTitle
                  className="text-3xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {formData.name}
                </CardTitle>
              )}
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-white">Assign Number</h1>
                <Select
                  value={selectedPhoneNumber}
                  onValueChange={(value) => {
                    setSelectedPhoneNumber(value);
                    updatePhoneNumber({
                      assistantId: assistant.assistantId || "",
                      phoneNumberId: value,
                    });
                  }}
                >
                  <SelectTrigger className="w-[240px] text-white bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Select Inbound number" />
                  </SelectTrigger>
                  <SelectContent className="text-white bg-zinc-900 border-zinc-800">
                    {phoneNumbersData?.phoneNumbers?.map((phone: any) => (
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
                <div className="cursor-pointer flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger disabled={!selectedPhoneNumber}>
                      <DeleteIconMd />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Remove Inbound Number
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                          Are you sure want to remove number
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            removeInBoundNumber(selectedPhoneNumber)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Button variant="primary" onClick={handleWebCall}>
                  {isTestingAgent ? (
                    <>
                      <PhoneOff className="w-4 h-4 mr-2" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Start Test
                    </>
                  )}
                </Button>
                {/* {isTestingAgent && (
                  <Button
                    onClick={() => {
                      const vapiBtn =
                        document.querySelector("#vapi-support-btn");
                      if (vapiBtn) {
                        (vapiBtn as HTMLElement).click();
                      }
                    }}
                    className="bg-zinc-900 vapi-bdtn hover:bg-zinc-800 text-white border-zinc-800"
                  >
                    <PhoneOff className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                )} */}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={steps[activeStep].id} className="w-full">
              <TabsList className="inline-flex bg-zinc-900 rounded-lg p-1 mb-4">
                {steps.map((step, index) => (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`px-4 py-2 text-base font-medium transition-all rounded-md ${
                      activeStep === index
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span className="mr-2">{step.icon}</span>
                    {step.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="text-sm text-zinc-400 mb-4">
                Step {activeStep + 1} of {steps.length}
              </div>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <div className="space-y-8">
                  <TabsContent value="prompt">
                    <ModelConfig
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </TabsContent>
                  <TabsContent value="voice">
                    <VoiceConfig
                      formData={formData}
                      setFormData={setFormData}
                      setShowMainVoiceSelect={setShowMainVoiceSelect}
                    />
                  </TabsContent>
                  <TabsContent value="speech">
                    <SpeechConfig
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </TabsContent>
                  <TabsContent value="call-settings">
                    <CallConfig formData={formData} setFormData={setFormData} />
                  </TabsContent>
                  <TabsContent value="action">
                    <ActionConfig
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePrevious}
                disabled={activeStep === 0}
                variant="primary"
              >
                Previous
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              {activeStep !== steps.length - 1 && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                >
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSaveChanges}
                disabled={isUpdatingAssistant}
                className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
              >
                {isUpdatingAssistant ? (
                  <>
                    Saving
                    <Spinner />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <SelectVoice
        isOpen={showMainVoiceSelect}
        onClose={() => setShowMainVoiceSelect(false)}
        onSelect={handleMainVoiceSelect}
        selectedVoiceId={formData.mainVoiceId}
      />
    </>
  );
}
