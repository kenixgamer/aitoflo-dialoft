import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MODELS } from '@/constants/models'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGetDocuments } from '@/query/knowledgebase.queries'

export default function ModelConfig({ formData, setFormData }: any) {
  const { workshopId } = useParams();
  if (!workshopId) return null;
  const [selectedFile] = useState("");
  const {data : knowledgeBase} = useGetDocuments(workshopId,"",1,1000,"");
  if (!workshopId) return null;
  const handleKnowledgeBaseChange = (value: string) => {
    // Check if knowledgebaseIds exists, if not initialize it
    const currentIds = formData.knowledgebaseIds || [];
    
    // Check if the id is already in the array
    if (!currentIds.includes(value)) {
      // Add the new id to the array
      setFormData({
        ...formData,
        knowledgebaseIds: [...currentIds, value]
      });
    }
  };
  
  const handleRemoveKnowledgebase = (value: string) => {
    // Filter out the id to remove
    const updatedIds = formData.knowledgebaseIds.filter((id: string) => id !== value);
    
    // Update formData with the new array
    setFormData({
      ...formData,
      knowledgebaseIds: updatedIds
    });
  };
  return (
    <div className="grid grid-cols-10 gap-6">
      <div className="col-span-7 space-y-6">
        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Conversation Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstMessageMode" className="text-sm font-medium text-zinc-300">
                First Message Mode
              </Label>
              <Select
                value={formData.firstMessageMode}
                onValueChange={(value) => setFormData({ ...formData, firstMessageMode: value })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700">
                  <SelectValue className="text-white" placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-black border-zinc-800">
                  {["assistant-speaks-first", "assistant-speaks-first-with-model-generated-message", "assistant-waits-for-user"].map((mode) => (
                    <SelectItem
                      key={mode}
                      value={mode}
                      className="text-white hover:bg-zinc-800"
                    >
                      {mode.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstMessage" className="text-sm font-medium text-zinc-300">
                First Message
              </Label>
              <Input
                id="firstMessage"
                value={formData.firstMessage}
                onChange={(e) => setFormData({ ...formData, firstMessage: e.target.value })}
                placeholder="Enter the first message"
                className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemMessage" className="text-sm font-medium text-zinc-300">
                System Message 
                <span className="block text-xs text-zinc-400 mt-1">
                  Use {'{{'}variableName{'}}'} to insert dynamic values
                </span>
              </Label>
              <Textarea
                id="systemMessage"
                value={formData?.metadata?.content}
                onChange={(e) => setFormData({ ...formData, metadata: {...formData.metadata, content: e.target.value } })}
                placeholder="Define your AI voice agent’s persona, style, and response behavior here.. Use {{variableName}} for dynamic values from your data."
                className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700 min-h-[300px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endCallMessage" className="text-sm font-medium text-zinc-300">
                End Call Message
              </Label>
              <Input
                id="endCallMessage"
                value={formData.endCallMessage}
                onChange={(e) => setFormData({ ...formData, endCallMessage: e.target.value })}
                placeholder="Enter the end call message"
                className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-3 space-y-6">
        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium text-zinc-300">Select Version</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger id="model" className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent className="bg-black border-zinc-800">
                  {MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-white hover:bg-zinc-800">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="knowledgeBase" className="text-sm font-medium text-gray-300">Select File</Label>
              <Select
                value={selectedFile}
                onValueChange={handleKnowledgeBaseChange}
              >
                <SelectTrigger id="knowledgeBase" className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue placeholder="Select a file" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                 {
                  knowledgeBase?.data?.map((doc: any) => (
                    <SelectItem key={doc._id} value={doc._id} className="text-white hover:bg-zinc-800">
                      {doc.fileName}
                    </SelectItem>
                  ))
                 }
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {formData.knowledgebaseIds?.map((id: string) => {
                const doc = knowledgeBase?.data?.find((d: any) => d._id === id);
                return doc && (
                  <div key={id} className="flex items-center justify-between bg-black p-2 rounded">
                    <span className="truncate text-sm text-white">{doc.fileName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveKnowledgebase(id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}