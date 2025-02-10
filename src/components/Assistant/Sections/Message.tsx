import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const Message = ({formData,setFormData} :any) => {
  return (
    <TabsContent value="messages">
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
              <Label className="text-gray-200">First Message Mode</Label>
            <Select
              value={formData.firstMessageMode}
              onValueChange={(value) =>
                setFormData({ ...formData, firstMessageMode: value })
              }
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-800">
                <SelectValue
                  className="text-white"
                  placeholder="Select mode"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-800">
                <SelectItem
                  value="assistant-speaks-first"
                  className="text-white hover:bg-gray-700"
                >
                  Assistant Speaks First
                </SelectItem>
                <SelectItem
                  value="assistant-speaks-first-with-model-generated-message"
                  className="text-white hover:bg-gray-700"
                >
                  Assistant Speaks First with Model Generated Message
                </SelectItem>
                <SelectItem
                  value="assistant-waits-for-user"
                  className="text-white hover:bg-gray-700"
                >
                  Assistant Waits for User
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">First Message</Label>
          <Textarea
            value={formData.firstMessage}
            onChange={(e :any) =>
              setFormData({
                ...formData,
                firstMessage: e.target.value,
              })
            }
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Voicemail Message</Label>
          <Textarea
            value={formData.voicemailMessage}
            onChange={(e) =>
              setFormData({
                ...formData,
                voicemailMessage: e.target.value,
              })
            }
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">End Call Message</Label>
          <Textarea
            value={formData.endCallMessage}
            onChange={(e) =>
              setFormData({
                ...formData,
                endCallMessage: e.target.value,
              })
            }
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 min-h-[100px]"
          />
        </div>
        {/* <div className="space-y-2">
          <Label className="text-gray-200">End Call Phrases</Label>
          <Input
            placeholder="Add phrases separated by commas"
            value={formData.endCallPhrases.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                endCallPhrases: e.target.value
                  .split(",")
                  .map((p) => p.trim()),
              })
            }
            className="bg-gray-800 border-gray-800 text-white"
          />
        </div> */}
      </CardContent>
    </Card>
  </TabsContent>
  )
}

export default Message