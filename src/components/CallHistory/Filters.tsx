import { useContext, useState, useEffect } from "react";
import { PlusIcon, ArrowLeftIcon } from "@/utils/icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { CallHistoryContext } from "@/context/CallHistoryContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AlertInputDialog from "../AlertInputDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetBatchCalls } from "@/query/batchCall.queries";

const filterOptions = [
  { label: "Agent", value: "agent" },
  { label: "Call ID", value: "callId" },
  { label: "Batch Call", value: "batchCallId" },
  { label: "Call Type", value: "callType" },
  { label: "Call Outcome", value: "callOutcome" },
  { label: "Call Sentiment", value: "callSentiment" },
  { label: "Objective Achievement", value: "objectiveAchievement" },
  { label: "Follow-up Status", value: "followUpStatus" }
];

interface DialogConfig {
  title: string;
  placeholder: string;
  type: "input" | "select";
  options?: { label: string; value: string }[];
}

const Filters = () => {
  const { workshopId } = useParams();
  if(!workshopId) return null;
  
  // Add new states for cumulative data
  const [cumulativeAssistants, setCumulativeAssistants] = useState<any[]>([]);
  const [cumulativeBatchCalls, setCumulativeBatchCalls] = useState<any[]>([]);
  const [assistantPage, setAssistantPage] = useState(1);
  const [batchCallPage, setBatchCallPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const {data : batchCalls} = useGetBatchCalls(workshopId, batchCallPage, "", ITEMS_PER_PAGE);
  const {
    handleInputFilterSave,
    assistantLists,
    selectedFilters,
    isAgentDialogOpen,
    selectedAgent,
    setSelectedAgent,
    handleAgentSelect,
    handleAgentChange,
    setIsAgentDialogOpen,
    loadMoreAssistants,
  } = useContext(CallHistoryContext);

  // Initialize cumulative data when first data arrives
  useEffect(() => {
    if (assistantLists?.assistants && cumulativeAssistants.length === 0) {
      setCumulativeAssistants(assistantLists.assistants);
    }
  }, [assistantLists?.assistants]);

  useEffect(() => {
    if (batchCalls?.batchCalls && cumulativeBatchCalls.length === 0) {
      setCumulativeBatchCalls(batchCalls.batchCalls);
    }
  }, [batchCalls?.batchCalls]);

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showBatchCallDialog, setShowBatchCallDialog] = useState(false);
  const [selectBatchCall, setSelectBatchCall] = useState("");
  const [selectedFilterType, setSelectedFilterType] = useState("");
  const [textValue, setTextValue] = useState("");
  const handleFilterClick = (value: string) => {
    if (value === "agent") {
      setIsAgentDialogOpen(true);
    } else if (value === "batchCallId") {
      setShowBatchCallDialog(true);
    } else if (["workshopId", "callId", "callType", "callOutcome", "callSentiment", "objectiveAchievement", "followUpStatus"].includes(value)) {
      setSelectedFilterType(value);
      setShowAlertDialog(true);
    }
  };

  const getDialogConfig = (type: string): DialogConfig => {
    const configs: Record<string, DialogConfig> = {
      workshopId: {
        title: "Add Workshop ID",
        placeholder: "Enter workshop id",
        type: "input"
      },
      callId: {
        title: "Add Call ID",
        placeholder: "Enter call id",
        type: "input"
      },
      batchCallId: {
        title: "Add Batch Call ID",
        placeholder: "Enter batch call id",
        type: "input"
      },
      callType: {
        title: "Select Call Type",
        placeholder: "Select type",
        type: "select",
        options: [
          { label: "Web Call", value: "web_call" },
          { label: "Batch Call", value: "batch_call" }
        ]
      },
      callOutcome: {
        title: "Select Call Outcome",
        placeholder: "Select outcome",
        type: "select",
        options: [
          { label: "Meeting Booked", value: "meeting_booked" },
          { label: "Not Interested", value: "not_interested" },
          { label: "Wrong Person", value: "wrong_person_picked" },
          { label: "Person is Busy", value: "person_is_busy" },
          { label: "Callback Later", value: "user_requested_callback_later" },
          { label: "Interested but Not Now", value: "interested_but_not_now" },
          { label: "Escalated", value: "escalated" },
          { label: "Do Not Call", value: "do_not_call" },
          { label: "Completed Normally", value: "call_completed_normally" },
          { label: "Other", value: "other" }
        ]
      },
      callSentiment: {
        title: "Select Call Sentiment",
        placeholder: "Select sentiment",
        type: "select",
        options: [
          { label: "Positive", value: "positive" },
          { label: "Neutral", value: "neutral" },
          { label: "Negative", value: "negative" }
        ]
      },
      objectiveAchievement: {
        title: "Select Objective Achievement",
        placeholder: "Select achievement",
        type: "select",
        options: [
          { label: "Achieved", value: "achieved" },
          { label: "Partially Achieved", value: "partially_achieved" },
          { label: "Not Achieved", value: "not_achieved" }
        ]
      },
      followUpStatus: {
        title: "Select Follow-up Status",
        placeholder: "Select status",
        type: "select",
        options: [
          { label: "Urgent Follow-up", value: "urgent_follow_up" },
          { label: "Timely Follow-up", value: "timely_follow_up" },
          { label: "No Follow-up", value: "no_followup" }
        ]
      }
    };
    return configs[type];
  };

  const handleSave = (value: string) => {
    handleInputFilterSave(selectedFilterType, value);
    setShowAlertDialog(false);
    setSelectedFilterType("");
    setTextValue("");
  };

  // Update handlers to use cumulative data
  const handleLoadMoreAssistants = () => {
    const nextPage = assistantPage + 1;
    setAssistantPage(nextPage);
    loadMoreAssistants(nextPage);
    if (assistantLists?.assistants) {
      setCumulativeAssistants(prev => [...prev, ...assistantLists.assistants]);
    }
  };

  const handleLoadMoreBatchCalls = () => {
    setBatchCallPage(prev => prev + 1);
    if (batchCalls?.batchCalls) {
      setCumulativeBatchCalls(prev => [...prev, ...batchCalls.batchCalls]);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                className="flex items-center gap-2 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
              >
                <PlusIcon />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[200px] bg-black border border-zinc-800 text-white"
            >
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleFilterClick(option.value)}
                  className={cn(
                    "cursor-pointer hover:bg-zinc-800 text-white",
                    selectedFilters.some((f) => f.type === option.value) &&
                      "opacity-50"
                  )}
                  disabled={selectedFilters.some((f) => f.type === option.value)}
                >
                  <span className="mr-2 text-purple-500">
                    <PlusIcon />
                  </span>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog
          open={isAgentDialogOpen}
          onOpenChange={(open) => {
            setIsAgentDialogOpen(open);
            if (!open) {
              setSelectedAgent("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px] bg-black border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <ArrowLeftIcon/>
                Filter by Agent
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup
                value={selectedAgent}
                className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto"
              >
                {cumulativeAssistants.map((assistant: any) => (
                  <div
                    key={assistant._id}
                    className="flex items-center space-x-2 py-1 px-1 hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <RadioGroupItem
                      value={assistant._id}
                      id={assistant._id}
                      onClick={() => handleAgentChange(assistant._id)}
                      className="border-zinc-800 text-white data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label
                      htmlFor={assistant._id}
                      className="text-white cursor-pointer hover:text-zinc-300"
                    >
                      {assistant.assistantName}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter className="gap-2 flex justify-end items-center">
              {assistantLists?.hasMore && (
                <Button
                  variant="normal"
                  onClick={handleLoadMoreAssistants}
                  className="mr-auto"
                >
                  Load More
                </Button>
              )}
              <Button
                variant="normal"
                onClick={() => setIsAgentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAgentSelect}
                disabled={!selectedAgent}
                className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={showBatchCallDialog}
          onOpenChange={(open) => {
            setShowBatchCallDialog(open);
            if (!open) {
              setSelectBatchCall("");
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px] bg-black border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <ArrowLeftIcon />
                Filter by Batch Call
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup
                value={selectBatchCall}
                className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto"
              >
                {cumulativeBatchCalls.map((batchCall: any) => (
                  <div
                    key={batchCall._id}
                    className="flex items-center space-x-2 py-1 px-1 hover:bg-zinc-800 rounded-md transition-colors"
                  >
                    <RadioGroupItem
                      value={batchCall._id}
                      id={batchCall._id}
                      onClick={() => setSelectBatchCall(batchCall._id)}
                      className="border-zinc-800 text-white data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label
                      htmlFor={batchCall._id}
                      className="text-white cursor-pointer hover:text-gray-300"
                    >
                      {batchCall.name || batchCall._id}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter className="gap-2 flex justify-end items-center">
              {batchCalls?.hasMorePages && (
                <Button
                  variant="primary"
                  onClick={handleLoadMoreBatchCalls}
                  className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                >
                  Load More
                </Button>
              )}
              <Button
                variant="normal"
                onClick={() => setShowBatchCallDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleInputFilterSave("batchCallId", selectBatchCall);
                  setShowBatchCallDialog(false);
                }}
                variant="primary"
                className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                disabled={!selectBatchCall}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedFilterType && (
          <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <DialogContent className="sm:max-w-[425px] bg-black border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {getDialogConfig(selectedFilterType)?.title}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {getDialogConfig(selectedFilterType)?.type === 'select' ? (
                  <Select
                    onValueChange={(value) => {
                      handleInputFilterSave(selectedFilterType, value);
                      setShowAlertDialog(false);
                      setSelectedFilterType("");
                    }}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectValue placeholder={getDialogConfig(selectedFilterType)?.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-zinc-800">
                      {getDialogConfig(selectedFilterType)?.options?.map((option : any) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-white hover:bg-zinc-800"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <AlertInputDialog
                    textValue={textValue}
                    setTextValue={setTextValue}
                    title={getDialogConfig(selectedFilterType)?.title || ""}
                    placeholder={getDialogConfig(selectedFilterType)?.placeholder || ""}
                    onSave={handleSave}
                    showAlertDialog={showAlertDialog}
                    setShowAlertDialog={(show) => {
                      setShowAlertDialog(show);
                      if (!show) {
                        setSelectedFilterType("");
                        setTextValue("");
                      }
                    }}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* <div className="absolute top-0 text-white">{JSON.stringify(batchCalls)}</div> */}
    </>
  );
};

export default Filters;
