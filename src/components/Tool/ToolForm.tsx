import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreataFunctionTool,
  useUpdateFunctionTool,
} from "@/query/tool.queries";
import { useParams } from "react-router-dom";
import Spinner from "../ui/loader";
import { PlusIconAlt, TrashIconAlt } from "@/utils/icons/icons";

interface ToolFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolData?: any; // Backend data structure
  isEditing?: boolean; // Flag to indicate if we're editing an existing tool
}

interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface Message {
  type:
    | "request-start"
    | "request-complete"
    | "request-failed"
    | "request-response-delayed";
  content: string;
  blocking?: boolean;
  endCallAfterSpokenEnabled?: boolean;
  timingMilliseconds?: number;
  conditions?: Array<{
    param: string;
    operator: string;
    value: any;
  }>;
}

interface ToolFormData {
  name: string;
  description: string;
  isAsync: boolean;
  isStrict: boolean;
  parameters: Parameter[];
  serverUrl: string;
  secretToken: string;
  timeout: number;
  headers: Record<string, string>;
  messages: Message[];
}

const formatToolParameter = (parameters: Parameter[]) => {
  const properties: Record<string, { type: string; description: string }> = {};
  const required: string[] = [];

  parameters.forEach((param) => {
    properties[param.name] = {
      type: param.type,
      description: param.description,
    };
    if (param.required) required.push(param.name);
  });

  return { properties, required };
};

const formatToolMessage = (msg: Message) => {
  const formattedMessage: any = {
    type: msg.type,
    content: msg.content,
  };

  // Add conditions if they exist
  if (msg.conditions && msg.conditions.length > 0) {
    formattedMessage.conditions = msg.conditions;
  }

  // Add type-specific properties
  if (msg.type === "request-start" && msg.blocking !== undefined) {
    formattedMessage.blocking = msg.blocking;
  }

  if (
    msg.type === "request-complete" &&
    msg.endCallAfterSpokenEnabled !== undefined
  ) {
    formattedMessage.endCallAfterSpokenEnabled = msg.endCallAfterSpokenEnabled;
  }

  if (
    msg.type === "request-response-delayed" &&
    msg.timingMilliseconds !== undefined
  ) {
    formattedMessage.timingMilliseconds = msg.timingMilliseconds;
  }

  return formattedMessage;
};

const validateToolName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z0-9_-]{1,64}$/;
  return nameRegex.test(name);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const ToolForm: React.FC<ToolFormProps> = ({
  open,
  onOpenChange,
  toolData,
  isEditing = false,
}) => {
  const { workshopId } = useParams();
  if (!workshopId) return null;
  const [formData, setFormData] = React.useState<ToolFormData>(() => {
    // If toolData is provided, use it to initialize the form
    if (toolData) {
      return {
        ...toolData,
        // Ensure all required properties exist
        parameters: toolData.parameters || [],
        headers: toolData.headers || {},
        messages: toolData.messages || [],
      };
    }
    // Otherwise use empty values
    return {
      name: "",
      description: "",
      isAsync: true,
      isStrict: true,
      parameters: [],
      serverUrl: "",
      secretToken: "",
      timeout: 30,
      headers: {},
      messages: [],
    };
  });

  const { mutateAsync: creataFunctionTool, isPending: isCreatingTool } =
    useCreataFunctionTool();
  const { mutateAsync: updateFunctionTool, isPending: isUpdatingTool } =
    useUpdateFunctionTool();
  const [nameError, setNameError] = React.useState<string>("");

  // Update form data when toolData changes
  React.useEffect(() => {
    if (toolData) {
      // Transform the backend data structure to match the form data structure
      setFormData({
        name: toolData.function?.name || "",
        description: toolData?.function?.description || "",
        isAsync: toolData?.async || false,
        isStrict: toolData.function?.strict || false,
        parameters: toolData?.function?.parameters?.properties
          ? Object.entries(toolData.function.parameters.properties).map(
              ([name, details]: [string, any]) => ({
                name,
                type: details.type || "string",
                description: details.description || "",
                required:
                  toolData.function.parameters.required?.includes(name) ||
                  false,
              })
            )
          : [],
        serverUrl: toolData?.server?.url || "",
        secretToken: toolData?.server?.secret || "",
        timeout: toolData?.server?.timeoutSeconds || 30,
        headers: toolData?.server?.headers || {},
        messages:
          toolData?.messages?.map((msg: any) => ({
            type: msg?.type,
            content: msg?.content || "",
            blocking: msg?.blocking || false,
            endCallAfterSpokenEnabled: msg?.endCallAfterSpokenEnabled || false,
            timingMilliseconds: msg?.timingMilliseconds || 0,
            conditions: msg?.conditions || [],
          })) || [],
      });
    }
  }, [toolData]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isAsync: true,
      isStrict: true,
      parameters: [],
      serverUrl: "",
      secretToken: "",
      timeout: 30,
      headers: {},
      messages: [],
    });
    onOpenChange(false);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");

    // Validate tool name
    if (!formData.name || !validateToolName(formData.name)) {
      setNameError(
        "Action name must be 1-64 characters long and can only contain letters, numbers, underscores, and hyphens"
      );
      return;
    }

    // Validate server URL if provided
    if (formData.serverUrl && !isValidUrl(formData.serverUrl)) {
      setNameError("Please enter a valid server URL");
      return;
    }

    // Validate timingMilliseconds for request-response-delayed messages
    const invalidTiming = formData.messages.some(
      (msg) => msg.type === "request-response-delayed" && (msg.timingMilliseconds || 0) < 100
    );
    if (invalidTiming) {
      setNameError("Timing milliseconds must not be less than 100");
      return;
    }

    // Format the data for the backend
    const { properties, required } = formatToolParameter(formData.parameters);

    // Prepare the tool data in the backend format
    const backendData = {
      workshopId: workshopId,
      id: toolData?.id, // Include ID if editing
      toolId: toolData?.toolId,
      async: formData.isAsync,
      name: formData.name.trim(),
      description: formData.description,
      strict: formData.isStrict,
      properties: properties,
      required: required,
      url: formData.serverUrl,
      timeoutSeconds: formData.timeout,
      secret: formData.secretToken,
      headers: formData.headers,
      messages: formData.messages.map(formatToolMessage),
      type: "function",
    };

    // Create or update the function tool
    if (isEditing && toolData?.id) {
      await updateFunctionTool(backendData).then(() => {
        // Reset form data to initial state instead of null
       resetForm();
      });
    } else {
      await creataFunctionTool(backendData).then(() => {
        // Reset form data to initial state
        resetForm();
      });
    }

  };

  const handleInputChange = (
    field: keyof ToolFormData,
    value: string | number | boolean
  ) => {
    if (field === "name") {
      setNameError(""); // Clear name error when user starts typing
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-black border border-zinc-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-zinc-800 pb-4">
          <DialogTitle className="text-2xl font-semibold text-white">
            {isEditing ? "Update Action" : "Create Action"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          {/* Basic Info */}
          <Card className="border border-zinc-800 bg-black">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-white text-sm font-medium"
                  >
                    Action Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter Action Name"
                    className={`bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-10 ${
                      nameError ? "border-red-500" : ""
                    }`}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-white text-sm font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the action in a few sentences..."
                    className="bg-zinc-900 border-zinc-800 text-white min-h-[100px] focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-4 pt-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="async"
                      checked={formData.isAsync}
                      onCheckedChange={(checked) =>
                        handleInputChange("isAsync", checked)
                      }
                      className="bg-zinc-800 data-[state=checked]:bg-purple-600"
                    />
                    <Label
                      htmlFor="async"
                      className="text-white text-sm font-medium"
                    >
                      Async
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="strict"
                      checked={formData.isStrict}
                      onCheckedChange={(checked) =>
                        handleInputChange("isStrict", checked)
                      }
                      className="bg-zinc-800 data-[state=checked]:bg-purple-600"
                    />
                    <Label
                      htmlFor="strict"
                      className="text-white text-sm font-medium"
                    >
                      Strict
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card className="border border-zinc-800 bg-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <Label className="text-white text-sm font-medium">
                  Parameters
                </Label>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="text-xs text-white h-8 px-3"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      parameters: [
                        ...prev.parameters,
                        {
                          name: "",
                          type: "string",
                          description: "",
                          required: false,
                        },
                      ],
                    }))
                  }
                >
                  <PlusIconAlt />
                  Add Property
                </Button>
              </div>
              <div className="space-y-4">
                {formData.parameters.map((param, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                  >
                    <div className="col-span-3">
                      <Input
                        placeholder="Name"
                        value={param.name}
                        onChange={(e) => {
                          const newParams = [...formData.parameters];
                          newParams[index].name = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            parameters: newParams,
                          }));
                        }}
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-9"
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={param.type}
                        onValueChange={(value) => {
                          const newParams = [...formData.parameters];
                          newParams[index].type = value;
                          setFormData((prev) => ({
                            ...prev,
                            parameters: newParams,
                          }));
                        }}
                      >
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 h-9">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem
                            value="string"
                            className="text-white hover:bg-zinc-800"
                          >
                            string
                          </SelectItem>
                          <SelectItem
                            value="number"
                            className="text-white hover:bg-zinc-800"
                          >
                            number
                          </SelectItem>
                          <SelectItem
                            value="boolean"
                            className="text-white hover:bg-zinc-800"
                          >
                            boolean
                          </SelectItem>
                          <SelectItem
                            value="object"
                            className="text-white hover:bg-zinc-800"
                          >
                            object
                          </SelectItem>
                          <SelectItem
                            value="array"
                            className="text-white hover:bg-zinc-800"
                          >
                            array
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="Description (optional)"
                        value={param.description}
                        onChange={(e) => {
                          const newParams = [...formData.parameters];
                          newParams[index].description = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            parameters: newParams,
                          }));
                        }}
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-9"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Switch
                        checked={param.required}
                        onCheckedChange={(checked) => {
                          const newParams = [...formData.parameters];
                          newParams[index].required = checked;

                          // Update the form data with the new parameters
                          setFormData((prev) => {
                            const updatedParams = [...prev.parameters];
                            updatedParams[index].required = checked;

                            // Get the required parameters based on the updated parameters
                            const { required } =
                              formatToolParameter(updatedParams);

                            return {
                              ...prev,
                              parameters: updatedParams,
                              required: required,
                            };
                          });
                        }}
                        className="bg-zinc-800 data-[state=checked]:bg-purple-600"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newParams = [...formData.parameters];
                          newParams.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            parameters: newParams,
                          }));
                        }}
                        className="p-3 bg-zinc-900 hover:bg-red-900/90 border-zinc-800"
                      >
                        <TrashIconAlt />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Server Settings */}
          <Card className="border border-zinc-800 bg-black">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="serverUrl"
                    className="text-white text-sm font-medium"
                  >
                    Server URL
                  </Label>
                  <Input
                    id="serverUrl"
                    placeholder="https://api.domain.com/function"
                    className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-10"
                    value={formData.serverUrl}
                    onChange={(e) =>
                      handleInputChange("serverUrl", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="secretToken"
                      className="text-white text-sm font-medium"
                    >
                      Secret Token
                    </Label>
                    <Input
                      id="secretToken"
                      type="password"
                      placeholder="••••••••••••••••"
                      className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-10"
                      value={formData.secretToken}
                      onChange={(e) =>
                        handleInputChange("secretToken", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="timeout"
                      className="text-white text-sm font-medium"
                    >
                      Timeout (seconds)
                    </Label>
                    <Input
                      id="timeout"
                      type="number"
                      placeholder="20"
                      className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-10"
                      value={formData.timeout}
                      onChange={(e) =>
                        handleInputChange("timeout", parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HTTP Headers */}
          <Card className="border border-zinc-800 bg-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <Label className="text-white text-sm font-medium">
                  HTTP Headers
                </Label>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="text-xs text-white h-8 px-3"
                  onClick={() => {
                    // Create a unique key for the new header
                    const newHeaderKey = `header-${Date.now()}`;
                    setFormData((prev) => ({
                      ...prev,
                      headers: { ...prev.headers, [newHeaderKey]: "" },
                    }));
                  }}
                >
                  <PlusIconAlt />
                  Add Header
                </Button>
              </div>
              <div className="space-y-4">
                {Object.entries(formData.headers).map(([key, value], _) => (
                  <div
                    key={key}
                    className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                  >
                    <div className="col-span-5">
                      <Input
                        placeholder="Header Name"
                        value={key.startsWith("header-") ? "" : key}
                        onChange={(e) => {
                          // Create a new headers object without the old key
                          const { [key]: oldValue, ...restHeaders } =
                            formData.headers;
                          // Add the new key with the existing value
                          const newKey = e.target.value || key; // Keep old key if new one is empty
                          setFormData((prev) => ({
                            ...prev,
                            headers: { ...restHeaders, [newKey]: value },
                          }));
                        }}
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-9"
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        placeholder="Value"
                        value={value}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            headers: { ...prev.headers, [key]: e.target.value },
                          }));
                        }}
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-9"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          // Create a new headers object excluding the key to remove
                          const { [key]: removed, ...restHeaders } =
                            formData.headers;
                          setFormData((prev) => ({
                            ...prev,
                            headers: restHeaders,
                          }));
                        }}
                        className="p-3 bg-zinc-900 hover:bg-red-900/90 border-zinc-800"
                      >
                        <TrashIconAlt />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border border-zinc-800 bg-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <Label className="text-white text-sm font-medium">
                  Messages
                </Label>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="text-xs text-white h-8 px-3"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      messages: [
                        ...prev.messages,
                        {
                          type: "request-start",
                          content: "",
                          conditions: [],
                          blocking: false,
                        },
                      ],
                    }))
                  }
                >
                  <PlusIconAlt />
                  Add Message
                </Button>
              </div>
              <div className="space-y-4">
                {formData.messages.map((message, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50"
                  >
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-11">
                        <Select
                          value={message.type}
                          onValueChange={(value: any) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].type = value;

                            // Reset type-specific properties when changing message type
                            if (value === "request-start") {
                              newMessages[index].blocking = false;
                              delete newMessages[index]
                                .endCallAfterSpokenEnabled;
                              delete newMessages[index].timingMilliseconds;
                            } else if (value === "request-complete") {
                              delete newMessages[index].blocking;
                              newMessages[index].endCallAfterSpokenEnabled =
                                false;
                              delete newMessages[index].timingMilliseconds;
                            } else if (value === "request-response-delayed") {
                              delete newMessages[index].blocking;
                              delete newMessages[index]
                                .endCallAfterSpokenEnabled;
                              newMessages[index].timingMilliseconds = 0;
                            } else {
                              delete newMessages[index].blocking;
                              delete newMessages[index]
                                .endCallAfterSpokenEnabled;
                              delete newMessages[index].timingMilliseconds;
                            }

                            setFormData((prev) => ({
                              ...prev,
                              messages: newMessages,
                            }));
                          }}
                        >
                          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 h-9">
                            <SelectValue placeholder="Message Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem
                              value="request-start"
                              className="text-white hover:bg-zinc-800"
                            >
                              Request Start
                            </SelectItem>
                            <SelectItem
                              value="request-complete"
                              className="text-white hover:bg-zinc-800"
                            >
                              Request Complete
                            </SelectItem>
                            <SelectItem
                              value="request-failed"
                              className="text-white hover:bg-zinc-800"
                            >
                              Request Failed
                            </SelectItem>
                            <SelectItem
                              value="request-response-delayed"
                              className="text-white hover:bg-zinc-800"
                            >
                              Request Response Delayed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const newMessages = [...formData.messages];
                            newMessages.splice(index, 1);
                            setFormData((prev) => ({
                              ...prev,
                              messages: newMessages,
                            }));
                          }}
                          className="p-3 bg-zinc-900 hover:bg-red-900/90 border-zinc-800"
                        >
                          <TrashIconAlt />
                        </Button>
                      </div>
                    </div>

                    {/* Message-specific properties */}
                    {message.type === "request-start" && (
                      <div className="flex items-center space-x-3 pt-2">
                        <Switch
                          id={`blocking-${index}`}
                          checked={message.blocking || false}
                          onCheckedChange={(checked) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].blocking = checked;
                            setFormData((prev) => ({
                              ...prev,
                              messages: newMessages,
                            }));
                          }}
                          className="bg-zinc-800 data-[state=checked]:bg-purple-600"
                        />
                        <Label
                          htmlFor={`blocking-${index}`}
                          className="text-white text-sm font-medium"
                        >
                          Blocking
                        </Label>
                      </div>
                    )}

                    {message.type === "request-complete" && (
                      <div className="flex items-center space-x-3 pt-2">
                        <Switch
                          id={`endCallAfterSpoken-${index}`}
                          checked={message.endCallAfterSpokenEnabled || false}
                          onCheckedChange={(checked) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].endCallAfterSpokenEnabled =
                              checked;
                            setFormData((prev) => ({
                              ...prev,
                              messages: newMessages,
                            }));
                          }}
                          className="bg-zinc-800 data-[state=checked]:bg-purple-600"
                        />
                        <Label
                          htmlFor={`endCallAfterSpoken-${index}`}
                          className="text-white text-sm font-medium"
                        >
                          End Call After Spoken
                        </Label>
                      </div>
                    )}

                    {message.type === "request-response-delayed" && (
                      <div className="space-y-2 pt-2">
                        <Label
                          htmlFor={`timing-${index}`}
                          className="text-white text-sm font-medium"
                        >
                          Timing (milliseconds)
                        </Label>
                        <Input
                          id={`timing-${index}`}
                          type="number"
                          min={100}
                          value={message.timingMilliseconds || 0}
                          onChange={(e) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].timingMilliseconds =
                              Math.max(100, parseInt(e.target.value) || 100);
                            setFormData((prev) => ({
                              ...prev,
                              messages: newMessages,
                            }));
                          }}
                          className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-10"
                        />
                      </div>
                    )}

                    <Textarea
                      placeholder="Enter message content"
                      value={message.content}
                      onChange={(e) => {
                        const newMessages = [...formData.messages];
                        newMessages[index].content = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          messages: newMessages,
                        }));
                      }}
                      className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 min-h-[100px] resize-none"
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-sm font-medium">
                          Conditions
                        </Label>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="text-xs text-white h-8 px-3"
                          onClick={() => {
                            const newMessages = [...formData.messages];
                            if (!newMessages[index].conditions) {
                              newMessages[index].conditions = [];
                            }
                            newMessages[index].conditions?.push({
                              param: "",
                              operator: "eq",
                              value: "",
                            });
                            setFormData((prev) => ({
                              ...prev,
                              messages: newMessages,
                            }));
                          }}
                        >
                          <PlusIconAlt />
                          Add Condition
                        </Button>
                      </div>

                      {message.conditions?.map((condition, condIndex) => (
                        <div
                          key={condIndex}
                          className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                        >
                          <div className="col-span-4">
                            <Input
                              placeholder="Parameter Name"
                              value={condition.param || ""}
                              onChange={(e) => {
                                const newMessages = [...formData.messages];
                                if (newMessages[index].conditions) {
                                  newMessages[index].conditions![
                                    condIndex
                                  ].param = e.target.value;
                                }
                                setFormData((prev) => ({
                                  ...prev,
                                  messages: newMessages,
                                }));
                              }}
                              className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-9"
                            />
                          </div>
                          <div className="col-span-3">
                            <Select
                              value={condition.operator}
                              onValueChange={(value) => {
                                const newMessages = [...formData.messages];
                                if (newMessages[index].conditions) {
                                  newMessages[index].conditions![
                                    condIndex
                                  ].operator = value;
                                }
                                setFormData((prev) => ({
                                  ...prev,
                                  messages: newMessages,
                                }));
                              }}
                            >
                              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem
                                  value="eq"
                                  className="text-white hover:bg-zinc-800"
                                >
                                  Equal (eq)
                                </SelectItem>
                                <SelectItem
                                  value="neq"
                                  className="text-white hover:bg-zinc-800"
                                >
                                  Not Equal (neq)
                                </SelectItem>
                                <SelectItem
                                  value="gt"
                                  className="text-white hover:bg-zinc-800"
                                >
                                  Greater Than (gt)
                                </SelectItem>
                                <SelectItem
                                  value="gte"
                                  className="text-white hover:bg-zinc-800"
                                >
                                  Greater Than or Equal (gte)
                                </SelectItem>
                                <SelectItem
                                  value="lt"
                                  className="text-white hover:bg-zinc-800"
                                >
                                  Less Than (lt)
                                </SelectItem>
                                <SelectItem
                                  value="lte"
                                  className="text-white hover:bg-zinc-800"
                                >
                                  Less Than or Equal (lte)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <Input
                              placeholder="Value (string or JSON object)"
                              value={
                                typeof condition.value === "object"
                                  ? JSON.stringify(condition.value, null, 2)
                                  : condition.value || ""
                              }
                              onChange={(e) => {
                                const newMessages = [...formData.messages];
                                if (newMessages[index].conditions) {
                                  // Try parsing as JSON if it looks like an object
                                  try {
                                    if (
                                      e.target.value.trim().startsWith("{") &&
                                      e.target.value.trim().endsWith("}")
                                    ) {
                                      newMessages[index].conditions![
                                        condIndex
                                      ].value = JSON.parse(e.target.value);
                                    } else {
                                      newMessages[index].conditions![
                                        condIndex
                                      ].value = e.target.value;
                                    }
                                  } catch (err) {
                                    // If JSON parsing fails, store as string
                                    newMessages[index].conditions![
                                      condIndex
                                    ].value = e.target.value;
                                  }
                                }
                                setFormData((prev) => ({
                                  ...prev,
                                  messages: newMessages,
                                }));
                              }}
                              className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 h-9"
                            />
                          </div>
                          <div className="col-span-1 flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const newMessages = [...formData.messages];
                                newMessages[index].conditions?.splice(
                                  condIndex,
                                  1
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  messages: newMessages,
                                }));
                              }}
                              className="p-3 bg-zinc-900 hover:bg-red-900/90 border-zinc-800"
                            >
                              <TrashIconAlt />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="normal"
              onClick={resetForm}
              className="bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800 h-10 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="shadow-[0_0_10px_rgba(147,51,234,0.3)] h-10 px-6"
            >
              {isCreatingTool || isUpdatingTool ? (
                <>
                  {isEditing ? "Updating" : "Creating"} Action{" "}
                  <Spinner className="h-4 w-4 ml-2" />
                </>
              ) : isEditing ? (
                "Update Action"
              ) : (
                "Create Action"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ToolForm;
