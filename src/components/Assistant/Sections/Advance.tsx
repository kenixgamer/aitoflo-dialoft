import {  TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import IdleMessagesSection from "./IdleMessagesSection";

const Advance = ({formData, setFormData, updateAssistant}: any) => {
  return (
    <TabsContent value="advanced">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Voicemail Detection Types</Label>
              <Select
                onValueChange={(value) => {
                  if (!formData.voicemailDetection.voicemailDetectionTypes.includes(value)) {
                    setFormData({
                      ...formData,
                      voicemailDetection: {
                        ...formData.voicemailDetection,
                        provider: 'twilio',
                        enabled: true, // Auto-enable when types are added
                        voicemailDetectionTypes: [...formData.voicemailDetection.voicemailDetectionTypes, value]
                      }
                    });
                  }
                }}
              >
                <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Add detection type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="fax" className="text-white hover:bg-gray-800">Fax Machine</SelectItem>
                  <SelectItem value="machine_end_beep" className="text-white hover:bg-gray-800">Machine End (Beep)</SelectItem>
                  <SelectItem value="machine_end_other" className="text-white hover:bg-gray-800">Machine End (Other)</SelectItem>
                  <SelectItem value="machine_end_silence" className="text-white hover:bg-gray-800">Machine End (Silence)</SelectItem>
                  <SelectItem value="machine_start" className="text-white hover:bg-gray-800">Machine Start</SelectItem>
                  <SelectItem value="unknown" className="text-white hover:bg-gray-800">Unknown Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.voicemailDetection.voicemailDetectionTypes.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <Label className="text-gray-200 text-base font-medium mb-3">Active Detection Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.voicemailDetection.voicemailDetectionTypes.map((type :any) => (
                    <div
                      key={type}
                      className="bg-gray-700 text-white px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">
                        {type.split('_').map((word :any) => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                      <button
                        onClick={() => {
                          const newTypes = formData.voicemailDetection.voicemailDetectionTypes.filter((t :any) => t !== type);
                          setFormData({
                            ...formData,
                            voicemailDetection: {
                              ...formData.voicemailDetection,
                              enabled: newTypes.length > 0, // Disable if no types remain
                              voicemailDetectionTypes: newTypes
                            }
                          });
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Assistant will detect and handle these voicemail types automatically
                </p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="backgroundDenoising"
                  checked={formData.backgroundDenoisingEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      backgroundDenoisingEnabled: checked as boolean,
                    })
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
                <div className="space-y-1">
                  <Label htmlFor="backgroundDenoising" className="text-gray-200 text-base font-medium">
                    Enable Background Denoising
                  </Label>
                  <p className="text-gray-400 text-sm">
                    Reduce background noise and improve audio clarity during calls
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="recording"
                  checked={formData.recordingEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      recordingEnabled: checked as boolean,
                    })
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
                
                <div className="space-y-1">
                  <Label htmlFor="recording" className="text-gray-200 text-base font-medium">
                    Enable Call Recording
                  </Label>
                  <p className="text-gray-400 text-sm">
                    Record all calls for quality assurance and training purposes
                  </p>
                </div>
              </div>
            </div>
          </div>
          <IdleMessagesSection 
            formData={formData} 
            setFormData={setFormData} 
            updateAssistant={updateAssistant}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Advance;