import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import {  handleEndTest, initializeVapiCall } from "./AssistantDetails";
import AssistantDetailsForm from "./AssistantDetailsForm";
import { useGetAssistantDetails } from "../../query/assistant.queries";
import { useToast } from "@/hooks/use-toast";

const AssistantDetails = () => {
  const { assistantId, workshopId } = useParams();
  const { data: assistant } = useGetAssistantDetails(assistantId || "");
  const [isTestingAgent, setIsTestingAgent] = useState(false);
const {toast} = useToast()

  if (!assistantId || !workshopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Assistant Or Workshop not found</p>
      </div>
    );
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if(!assistant) return;
    initializeVapiCall(assistant.assistantId, setIsTestingAgent).then(() => {
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
    });

    // Cleanup
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [assistant]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="flex-1">
          <AssistantDetailsForm assistant={assistant} />
        </div>

        <div className="w-[25%] bg-black p-4 border-l border-gray-800">
          <div className="flex flex-col h-full">
            <div className="flex h-10 rounded-lg gap-2 mb-4 bg-gray-900 text-white items-center justify-center">
              <span>Test Audio</span>
              <FaPhoneAlt className="text-white" size={16} />
            </div>

            <div className="flex-1 bg-gray-900 rounded-lg gap-4 flex items-center justify-center flex-col p-4">
              <h1 className="text-xl font-semibold text-white text-center" style={{position: "absolute", top: "40%", left: "82%"}}>
                Test Your Agent
              </h1>
              <div className="flex items-center justify-center gap-2 w-full">
                <Button
                  variant="default"
                  className="w-40 bg-blue-600 hover:bg-blue-700 btnForVapiAndStartTest"
                  disabled={isTestingAgent}
                  onClick={() => {
                    const vapiBtn = document.querySelector("#vapi-support-btn");
                    if (vapiBtn) {
                      (vapiBtn as HTMLElement).click();
                    }
                  }}
                >
                  {isTestingAgent ? 'Testing...' : 'Start Test'}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <Button
                variant="destructive"
                className="w-40 btnForVapiAndEndTest"
                onClick={() => handleEndTest({ setIsTestingAgent, toast })}
                disabled={!isTestingAgent}
              >
                End Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDetails;