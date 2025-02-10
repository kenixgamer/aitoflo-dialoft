import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VOICES } from '@/constants/voices'
import { Button } from '@/components/ui/button'

interface VoiceConfigProps {
  formData: any;
  setFormData: (updates: Partial<any>) => void;
  setShowMainVoiceSelect: (show: boolean) => void;
}

export default function VoiceConfig({ formData, setFormData, setShowMainVoiceSelect }: VoiceConfigProps) {
  return (
      <div className="space-y-6">
        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Voice Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Main Voice</Label>
              <Button
                type="button"
                onClick={() => setShowMainVoiceSelect(true)}
                className="w-full justify-start text-left font-normal bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800"
              >
                {formData.mainVoiceId
                  ? VOICES.find(v => v.id === formData.mainVoiceId)?.name || "Select a voice"
                  : "Select a voice"}
              </Button>
              <p className="text-xs text-zinc-400">
                Choose the primary voice for your AI assistant. This voice will be used for all main interactions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Voice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-zinc-300">
                Voice Similarity: {formData.similarityBoost.toFixed(2)}
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.similarityBoost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      similarityBoost: Math.max(0, Math.min(1, parseFloat(e.target.value))),
                    })
                  }
                  className="w-full bg-zinc-900 accent-purple-600 hover:accent-purple-500"
                />
                <span className="text-white min-w-[3rem]">
                  {formData.similarityBoost.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Controls how closely the AI mimics the original voice. Higher values result in better matching but may introduce background noise.
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-zinc-300">
                Voice Stability: {formData.stability.toFixed(2)}
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.stability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stability: Math.max(0, Math.min(1, parseFloat(e.target.value))),
                    })
                  }
                  className="w-full bg-zinc-900 accent-purple-600 hover:accent-purple-500"
                />
                <span className="text-white min-w-[3rem]">
                  {formData.stability.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Controls voice consistency. Higher values produce more stable output but may sound less natural.
              </p>
            </div>
            <div className="space-y-4">
              <Label className="text-sm font-medium text-zinc-300">
                Style Strength: {formData.style.toFixed(2)}
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.style}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      style: Math.max(0, Math.min(1, parseFloat(e.target.value))),
                    })
                  }
                  className="w-full bg-zinc-900 accent-purple-600 hover:accent-purple-500"
                />
                <span className="text-white min-w-[3rem]">
                  {formData.style.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Adjusts the intensity of voice characteristics. Higher values create more distinctive speech patterns.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-white">Speaker Boost</Label>
                <Switch
                  checked={formData?.useSpeakerBoost}
                  onCheckedChange={(data) => setFormData({
                    ...formData,
                      useSpeakerBoost: data
                  })}
                  className="bg-zinc-900 data-[state=checked]:bg-purple-600"
                />
              </div>
              <p className="text-xs text-white/60">
                Enhances voice clarity and reduces background noise. May increase processing time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}