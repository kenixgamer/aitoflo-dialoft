import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import { VOICES } from '@/constants/voices'

const Voice = ({formData,setFormData,setShowMainVoiceSelect,setShowFallbackVoiceSelect} :any) => {
  return (
    <TabsContent value="voice">
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-200 ">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) =>
                  setFormData({ ...formData, language: value })
              }
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-800">
                <SelectValue
                  className="text-white"
                  placeholder="Select language"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-800">
                <SelectItem
                  value="en"
                  className="text-white hover:bg-gray-700"
                >
                  English
                </SelectItem>
                <SelectItem
                  value="es"
                  className="text-white hover:bg-gray-700"
                >
                  Spanish
                </SelectItem>
                <SelectItem
                  value="fr"
                  className="text-white hover:bg-gray-700"
                >
                  French
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Main Voice</Label>
            <Button
              type="button"
              onClick={() => setShowMainVoiceSelect(true)}
              className="w-full justify-start text-left font-normal bg-gray-800 text-white border-gray-800"
            >
                {formData.mainVoiceId
                  ? VOICES.find((v : any) => v.id === formData.mainVoiceId)
                      ?.name || "Select a voice"
                : "Select a voice"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-200">Fallback Voice</Label>
            <Button
              type="button"
              onClick={() => setShowFallbackVoiceSelect(true)}
              className="w-full justify-start text-left font-normal bg-gray-800 text-white border-gray-800"
            >
                {formData.fallblackVoiceId
                  ? VOICES.find((v) => v.id === formData.fallblackVoiceId)
                      ?.name || "Select a fallback voice"
                : "Select a fallback voice"}
            </Button>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Background Sound</Label>
            <Select
              value={formData.backgroundSound}
              onValueChange={(value) =>
                setFormData({ ...formData, backgroundSound: value })
              }
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-800">
                <SelectValue
                  className="text-white"
                  placeholder="Select background sound"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-800">
                <SelectItem
                  value="off"
                  className="text-white hover:bg-gray-700"
                >
                  Off
                </SelectItem>
                <SelectItem
                  value="office"
                  className="text-white hover:bg-gray-700"
                >
                  Office Ambience
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Voice Similarity Boost</Label>
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
              className="w-full"
            />
            <span className="text-white min-w-[3rem]">
              {formData.similarityBoost.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Voice Stability</Label>
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
              className="w-full"
            />
            <span className="text-white min-w-[3rem]">
              {formData.stability.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200">Voice Style</Label>
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
              className="w-full"
            />
            <span className="text-white min-w-[3rem]">
              {formData.style.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="speakerBoost"
              checked={formData.useSpeakerBoost}
              onCheckedChange={(checked :any) =>
                setFormData({
                  ...formData,
                  useSpeakerBoost: checked as boolean,
                })
              }
              className="data-[state=checked]:bg-blue-600"
            />
            <div className="space-y-1">
              <Label htmlFor="speakerBoost" className="text-gray-200 text-base font-medium">
                Enable Speaker Boost
              </Label>
              <p className="text-gray-400 text-sm">
                Enhance voice clarity and reduce background noise during calls
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
  )
}

export default Voice