import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCallDetails } from "@/query/call.queries";
import { saveAs } from 'file-saver';
import CallLogDetailsSkeleton from "./CallLogDetailsSkeleton";
import { DownloadIconAlt } from "@/utils/icons/icons";

interface CallLogDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string;
}

const CallLogDetails = ({ isOpen, onClose, callId }: CallLogDetailsProps) => {
  const { data: callDetails, isLoading, isError } = useGetCallDetails(callId);
  const handleDownloadTranscript = () => {
    if (!callDetails?.transcript) return;
    
    // Create blob from transcript
    const blob = new Blob([callDetails.transcript], { type: 'text/plain;charset=utf-8' });
    
    // Generate filename with timestamp
    const filename = `transcript_${format(new Date(callDetails.startedAt), "yyyyMMdd_HHmmss")}.txt`;
    
    // Trigger download
    saveAs(blob, filename);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-black border-zinc-800 text-white">
        <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-white">
  {!isLoading && !isError && (
    <>
      {(callDetails?.startedAt || callDetails?.createdAt) ? 
        format(new Date(callDetails.startedAt || callDetails.createdAt), "MM/dd/yyyy HH:mm") : 
        'No date'
      } {callDetails?.type}
    </>
  )}
</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <CallLogDetailsSkeleton />
        ) : isError ? (
          <div className="flex items-center justify-center h-[400px] text-red-500">
            Failed to load call details. Please try again later.
          </div>
        ) : (
          <div className="mt-4 call-log-details">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-zinc-400">Assistant ID</p>
                <p className="font-mono text-sm text-white">{callDetails?.assistantId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-zinc-400">Call ID</p>
                <p className="font-mono text-sm text-white">{callDetails?.id}</p>
              </div>
              <div>
                <p className="text-zinc-400">Duration</p>
                <p className="text-white">{Math.round((new Date(callDetails?.endedAt).getTime() - new Date(callDetails?.startedAt).getTime()) / 1000)} seconds</p>
              </div>
              <div>
                <p className="text-zinc-400">Cost</p>
                <p className="text-white">${callDetails?.cost?.toFixed(4) || '0.00'}</p>
              </div>
            </div>

            <Tabs defaultValue="conversation" className="w-full">
              <TabsList className="bg-zinc-900">
                <TabsTrigger value="conversation" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  Conversation
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="evaluation" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  Success Evaluation
                </TabsTrigger>
                <TabsTrigger value="recording" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-800">
                  Recording
                </TabsTrigger>
              </TabsList>

              <TabsContent value="conversation" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-md border border-zinc-800">
                    <div>
                      <p className="text-zinc-400">Status</p>
                      <p className="capitalize text-white">{callDetails?.status || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400">End Reason</p>
                      <p className="text-white">{callDetails?.endedReason || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-zinc-400">Conversation</p>
                      <button 
                        onClick={handleDownloadTranscript}
                        className="flex items-center gap-2 text-purple-500 hover:text-purple-400 transition-colors"
                      >
                        <DownloadIconAlt />
                        Download Transcript
                      </button>
                    </div>
                    <div className="space-y-2">
                      {callDetails?.messages?.map((message: any, index: number) => (
                        <div key={index} className="flex gap-4 py-2 border-b border-zinc-800 last:border-0">
                          <span className="text-zinc-400 min-w-[60px]">
                            {format(new Date(message.time), "HH:mm:ss")}
                          </span>
                          <span className="font-semibold min-w-[60px] capitalize text-purple-500">
                            {message.role}:
                          </span>
                          <span className="text-white">{message.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-zinc-400">Call Summary</p>
                  </div>
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap">
                      {callDetails?.analysis?.summary || 'No summary available'}
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-400">Call Outcome</p>
                        <p className="capitalize text-white">{callDetails?.analysis?.structuredData?.callOutcome?.replace(/_/g, ' ') || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Call Sentiment</p>
                        <p className="capitalize text-white">{callDetails?.analysis?.structuredData?.callSentiment || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Follow-up Status</p>
                        <p className="capitalize text-white">{callDetails?.analysis?.structuredData?.followUpStatus?.replace(/_/g, ' ') || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Objective Achievement</p>
                        <p className="capitalize text-white">{callDetails?.analysis?.structuredData?.objectiveAchievement?.replace(/_/g, ' ') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evaluation" className="mt-4">
                <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-zinc-400">Success Evaluation</p>
                  </div>
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap">
                      {callDetails?.analysis?.successEvaluation || 'No evaluation available'}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recording" className="mt-4">
                <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800">
                  <audio 
                    controls 
                    className="w-full [&::-webkit-media-controls-panel]:bg-zinc-900 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white"
                  >
                    <source src={callDetails?.recordingUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallLogDetails;