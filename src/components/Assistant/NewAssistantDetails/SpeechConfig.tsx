import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'
// Add validation function
const validateInput = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
export default function SpeechConfig({ formData,setFormData } : any) {
  const [keyword, setKeyword] = useState('');
  const [idleMessage, setIdleMessage] = useState('');
  const addKeyword = () => {
    if (keyword.trim()) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword.trim()],
      })
      setKeyword('')
    }
  }

  const addIdleMessage = () => {
    if (idleMessage.trim()) {
      setFormData({
        ...formData,
        idleMessages: [...formData?.idleMessages, idleMessage.trim()],
      })
      setIdleMessage('')
    }
  }

  const removeIdleMessage = (index : any) => {
    const newIdleMessages = formData?.idleMessages.filter((_ : any, i:number) => i !== index)
    setFormData({
      ...formData,
        idleMessages: newIdleMessages,
    })
  }
  const removeKeyword = (index : any) => {
    const newKeywords = formData.keywords.filter((_ :any, i: number) => i !== index)
    setFormData({
      ...formData,
      keywords: newKeywords,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Speech Enhancement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-white">Enable Background Denoising</Label>
            <Switch
              id="backgroundDenoisingEnabled"
              checked={formData.backgroundDenoisingEnabled}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  backgroundDenoisingEnabled: checked as boolean,
                })
              }
              className="bg-zinc-800 data-[state=checked]:bg-purple-600"
            />
          </div>
          <p className="text-xs text-zinc-400">
            Filter background noise while the user is talking.
          </p>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-300">Background Sound</Label>
            <Select
              value={formData.backgroundSound}
              onValueChange={(value) => setFormData({ ...formData, backgroundSound: value })}
            >
              <SelectTrigger id="backgroundSound" className="bg-zinc-900 border-zinc-800 text-white">
                <SelectValue placeholder="Select background sound" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="off" className="text-white hover:bg-zinc-800">Off</SelectItem>
                <SelectItem value="office" className="text-white hover:bg-zinc-800">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-zinc-300">Focus Keywords</Label>
            <div className="flex space-x-2">
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter focus keywords"
                className="flex-grow bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
              />
              <Button onClick={addKeyword} variant="primary" className="shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.keywords.map((kw :any, index : number) => (
                <div key={index} className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                  <span className="text-white">{kw}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeKeyword(index)} 
                    className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Idle Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-zinc-300">Idle Messages</Label>
            <div className="flex space-x-2">
              <Input
                value={idleMessage}
                onChange={(e) => setIdleMessage(e.target.value)}
                placeholder="Enter an idle message"
                min={0}
                max={10}
                className="flex-grow bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
              />
              <Button onClick={addIdleMessage} variant="primary" className="shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.idleMessages.map((msg :any, index : number) => (
                <div key={index} className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                  <span className="truncate flex-grow text-white">{msg}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeIdleMessage(index)} 
                    className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Max Idle Messages</Label>
              <Input
                type="number"
                value={formData.idleMessageMaxSpokenCount}
                onChange={(e) => {
                  const value = validateInput(parseInt(e.target.value), 0, 10);
                  setFormData({ ...formData, idleMessageMaxSpokenCount: value 
                  })}}
                min={1}
                max={10}
                className="bg-zinc-900 border-zinc-800 text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Idle Timeout (s)</Label>
              <Input
                type="number"
                value={formData.idleTimeoutSeconds}
                onChange={(e) => {
                  const value = validateInput(parseInt(e.target.value), 5, 30);
                  setFormData({ ...formData, idleTimeoutSeconds: value 
                  })}}
                min={5}
                max={30}
                className="bg-zinc-900 border-zinc-800 text-white w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

