import { useToast } from "@/hooks/use-toast";

interface StartTestProps {
  setIsTestingAgent: (value: boolean) => void;
  assistantId: string;
  toast: ReturnType<typeof useToast>["toast"];
  workshopId : string
}

interface EndTestProps {
  setIsTestingAgent: (value: boolean) => void;
  toast: ReturnType<typeof useToast>["toast"];
}

export const initializeVapiCall = async(
  assistantId: string,
  setIsTestingAgent: (value: boolean) => void,
) => {
  try {
    let vapiInstance = (window as any).vapiSDK;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;

    return new Promise((resolve) => {
      script.onload = () => {
        vapiInstance = (window as any).vapiSDK.run({
          apiKey: import.meta.env.VITE_VAPI_PUBLIC_KEY,
          assistant: assistantId,
          config: {
            mode: "iframe",
            hideWidget: false,
            showButton: true,
            showBranding: false,
            autoConnect: false,
            immediateConnect: false,
            position: "static",
            styles: {},
          },
          webhook: {
            url: `${import.meta.env.VITE_API_URL}/api/v1/webhook/call`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        });

        // Wait for Vapi to be fully initialized
        setTimeout(() => {
          resolve(vapiInstance);
        }, 1000);

        vapiInstance.on("call-start", () => {
          setIsTestingAgent(true);
        });

        vapiInstance.on("call-end", () => {
          setIsTestingAgent(false);
        });
      };

      document.body.appendChild(script);
    });
  } catch (error) {
    console.error("Error initializing Vapi:", error);
  }
};

export const handleStartTest = ({
  setIsTestingAgent,
  toast,
}: StartTestProps) => {
  try {
    setIsTestingAgent(true);
    // initializeVapiCall(assistantId, toast, setIsTestingAgent,workshopId);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to start test call",
      variant: "destructive",
    });
    console.error("Error starting test:", error);
    setIsTestingAgent(false);
  }
};

export const handleEndTest = ({ setIsTestingAgent, toast }: EndTestProps) => {
  try {
    const vapiInstance = (window as any).vapiSDK;
    if (vapiInstance) {
      vapiInstance.endCall("user_ended");
    }
    setIsTestingAgent(false);
    alert("Ended");
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to end test call",
      variant: "destructive",
    });
    console.error("Error ending test:", error);
    setIsTestingAgent(false);
  }
};