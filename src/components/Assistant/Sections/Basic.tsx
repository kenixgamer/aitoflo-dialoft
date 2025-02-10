import {  TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODELS } from "@/constants/models";

// Add proper type interface for props
interface BasicProps {
  formData: {
    name: string;
    model: string;
    silenceTimeoutSeconds: number;
    maxDurationSeconds: number;
    keywords: string[];
    content: string;
  };
  setFormData: (data: any) => void;
}

const Basic = ({formData, setFormData}: BasicProps) => {
  return (
    <TabsContent value="basic">
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-200">Assistant Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Model</Label>
            <Select
              value={formData.model}
              onValueChange={(value) =>
                setFormData({ ...formData, model: value })
              }
            >
              <SelectTrigger className="bg-gray-800 text-white border-gray-800">
                <SelectValue
                  className="text-white"
                  placeholder="Select model"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-800">
                {MODELS.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="text-white hover:bg-gray-700"
                  >
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">
              Silence Timeout (seconds)
              <span className="ml-1 text-gray-400 text-sm">(10-3600)</span>
            </Label>
            <Input
              type="number"
              min={10}
              max={3600}
              value={formData.silenceTimeoutSeconds}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  silenceTimeoutSeconds: Math.max(10, Math.min(3600, parseInt(e.target.value) || 10)),
                })
              }
              className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            />
            <p className="text-sm text-gray-400">
              Time in seconds before the assistant responds to silence
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">
              Max Duration (seconds)
            </Label>
            <Input
              type="number"
              value={formData.maxDurationSeconds}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDurationSeconds: parseInt(e.target.value),
                })
              }
              className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Keywords</Label>
          <Input
            id="keywords"
            value={formData.keywords.join(", ")}
            placeholder="Add keywords separated by commas"
            onChange={(e) =>
              setFormData({
                ...formData,
                  keywords: e.target.value
                    ? e.target.value.split(",").map((k) => k.trim())
                  : [],
              })
            }
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Content</Label>
          <Textarea
            id="content"
            rows={6}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 min-h-[150px]"
          />
        </div>
      </CardContent>
    </Card>
  </TabsContent>
  )
}

export default Basic