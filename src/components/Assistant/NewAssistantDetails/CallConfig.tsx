import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const validateInput = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
export default function CallConfig({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Call Duration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-zinc-300">Silence Timeout (seconds)</Label>
            <Input
              type="number"
              value={formData.silenceTimeoutSeconds}
              onChange={(e) => {
                const value = validateInput(parseInt(e.target.value), 10, 3600);
                setFormData({ ...formData, silenceTimeoutSeconds: value })
              }
            }
              min={1}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
            />
            <p className="text-xs text-zinc-400">
              The time to wait before ending the call due to inactivity.
            </p>
          </div>
          
          <div className="space-y-4">
            <Label className="text-sm font-medium text-zinc-300">Maximum Duration (minutes)</Label>
            <Input
              type="number"
              value={formData.maxDurationSeconds / 60}
              onChange={(e) => {
                const value = validateInput(parseInt(e.target.value), 0, 720);
                setFormData({ ...formData, maxDurationSeconds: value * 60})
              }
            }
              min={1}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
            />
            <p className="text-xs text-zinc-400">
              The maximum length a call can last.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Voicemail Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-white">Enable Voicemail Detection</Label>
            <Switch
              checked={formData.voicemailDetection?.enabled}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                voicemailDetection: {
                  ...formData.voicemailDetection,
                  enabled: checked
                }
              })}
              className="bg-zinc-900 data-[state=checked]:bg-purple-600"
            />
          </div>
          
          {formData.voicemailDetection?.enabled && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-zinc-300">Voicemail Message</Label>
              <Textarea
                value={formData.voicemailMessage}
                onChange={(e) => setFormData({ ...formData, voicemailMessage: e.target.value })}
                placeholder="Enter the message to leave on voicemail"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400 min-h-[100px] resize-none"
              />
              <p className="text-xs text-zinc-400">
                This is the message that the assistant will say if the call is forwarded to voicemail.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

