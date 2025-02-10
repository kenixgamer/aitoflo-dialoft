import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const IdleMessagesSection = ({ formData, setFormData, updateAssistant } : any) => {
    const [newMessage, setNewMessage] = useState('');
  
    const handleAddMessage = () => {
      if (!newMessage.trim()) return;
      
      const updatedData = {
        ...formData,
        messagePlan: {
          ...formData.messagePlan,
          idleMessages: [...(formData.messagePlan.idleMessages || []), newMessage.trim()]
        }
      };
      
      setFormData(updatedData);
      // Trigger update to backend immediately
      updateAssistant({
        assistantId: formData.assistantId,
        idleMessages: updatedData.messagePlan.idleMessages,
        idleMessageMaxSpokenCount: updatedData.messagePlan.idleMessageMaxSpokenCount,
        idleTimeoutSeconds: updatedData.messagePlan.idleTimeoutSeconds
      });
      setNewMessage('');
    };
  
    const handleRemoveMessage = (index: number) => {
      const updatedMessages = formData.messagePlan.idleMessages.filter((_ :any, i : number) => i !== index);
      const updatedData = {
        ...formData,
        messagePlan: {
          ...formData.messagePlan,
          idleMessages: updatedMessages
        }
      };
      
      setFormData(updatedData);
      // Trigger update to backend immediately
      updateAssistant({
        assistantId: formData.assistantId,
        idleMessages: updatedMessages,
        idleMessageMaxSpokenCount: updatedData.messagePlan.idleMessageMaxSpokenCount,
        idleTimeoutSeconds: updatedData.messagePlan.idleTimeoutSeconds
      });
    };
  
    const handleConfigChange = (field: string, value: number) => {
      const updatedData = {
        ...formData,
        messagePlan: {
          ...formData.messagePlan,
          [field]: value
        }
      };
      
      setFormData(updatedData);
      // Trigger update to backend immediately
      updateAssistant({
        assistantId: formData.assistantId,
        idleMessages: updatedData.messagePlan.idleMessages,
        idleMessageMaxSpokenCount: updatedData.messagePlan.idleMessageMaxSpokenCount,
        idleTimeoutSeconds: updatedData.messagePlan.idleTimeoutSeconds
      });
    };
  
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200">Idle Messages</Label>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e : any) => setNewMessage(e.target.value)}
              placeholder="Add new idle message"
              className="bg-gray-800 border-gray-700 text-white flex-grow"
            />
            <Button 
              onClick={handleAddMessage}
              disabled={!newMessage.trim()}
              variant="primary"
            >
              Add
            </Button>
          </div>
        </div>
  
        {formData.messagePlan.idleMessages.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-gray-200 text-base font-medium">Active Idle Messages</Label>
              <div className="space-x-4 flex items-center">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-400 text-sm">Max Spoken:</Label>
                  <Input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.messagePlan.idleMessageMaxSpokenCount}
                    onChange={(e) => handleConfigChange('idleMessageMaxSpokenCount', Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
                    className="w-20 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-400 text-sm">Timeout (sec):</Label>
                  <Input
                    type="number"
                    min={5}
                    max={300}
                    value={formData.messagePlan.idleTimeoutSeconds}
                    onChange={(e) => handleConfigChange('idleTimeoutSeconds', Math.max(5, Math.min(300, parseInt(e.target.value) || 5)))}
                    className="w-20 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {formData.messagePlan.idleMessages.map((message : any, index : number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-2 rounded"
                >
                  <span className="text-white">{message}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMessage(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default IdleMessagesSection;