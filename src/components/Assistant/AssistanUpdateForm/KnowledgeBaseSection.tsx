import { useEffect } from "react"
import { FileTextIcon, LoaderIcon } from "@/utils/icons/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useGetDocuments } from "@/query/knowledgebase.queries"
import { Label } from "@/components/ui/label"
import { useUpdateAssistant } from "@/query/assistant.queries"

interface KnowledgeBaseSectionProps {
  workshopId: string
  assistantId: string
  initialKnowledgebaseIds?: string[]
  formData: any
  setFormData: (data: any) => void
  assistant?: {
    model?: {
      knowledgeBase?: {
        fileIds?: string[]
      }
    }
  }
}

interface Document {
  _id: string
  fileName: string
}

export default function KnowledgeBaseSection({
  workshopId,
  assistantId,
  initialKnowledgebaseIds = [],
  formData,
  setFormData,
  assistant
}: KnowledgeBaseSectionProps) {
  const { data: olddocuments, isLoading } = useGetDocuments(workshopId, "",1,100,"")
  const { mutate: updateAssistant } = useUpdateAssistant()
  const documents = olddocuments?.data || []

  useEffect(() => {
    const fileIds = assistant?.model?.knowledgeBase?.fileIds || initialKnowledgebaseIds
    if (fileIds.length > 0 && JSON.stringify(fileIds) !== JSON.stringify(formData.knowledgebaseIds)) {
      setFormData((prev: any) => ({
        ...prev,
        knowledgebaseIds: fileIds
      }))
    }
  }, [assistant, initialKnowledgebaseIds, setFormData])

  const handleToggleDocument = async (documentId: string) => {
    try {
      const newKnowledgebaseIds = formData.knowledgebaseIds?.includes(documentId)
        ? formData.knowledgebaseIds.filter((id: string) => id !== documentId)
        : [...(formData.knowledgebaseIds || []), documentId];

      const updatedFormData = {
        ...formData,
        knowledgebaseIds: newKnowledgebaseIds,
        assistantId // Make sure assistantId is included
      };

      setFormData(updatedFormData);
      
      // Wait for state update and then send to backend
      updateAssistant({
        ...formData,
        assistantId,
        knowledgebaseIds: newKnowledgebaseIds
      });
      
    } catch (error) {
      console.error('Error updating knowledge base:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoaderIcon />
      </div>
    )
  }

  const availableDocuments = documents?.filter((doc: Document) => 
    !formData.knowledgebaseIds?.includes(doc._id)
  ) || []

  return (
    <div className="space-y-4">
      <Label className="text-gray-200">Knowledge Base</Label>
      
      {/* Display selected documents first */}
      <div className="space-y-2 mb-4">
        {formData.knowledgebaseIds?.length > 0 ? (
          formData.knowledgebaseIds.map((id: string) => {
            const doc = documents?.find((d: Document) => d._id === id)
            return doc ? (
              <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700">
                <div className="flex items-center gap-2">
                  <FileTextIcon />
                  <span className="text-white">{doc.fileName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleDocument(doc._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  Remove
                </Button>
              </div>
            ) : null
          })
        ) : (
          <div className="p-4 text-center text-gray-400">
            No documents selected
          </div>
        )}
      </div>

      {/* Add new document select */}
      {availableDocuments.length > 0 && (
        <Select onValueChange={(value) => handleToggleDocument(value)}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Add Knowledge Base" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {availableDocuments.map((doc: Document) => (
              <SelectItem key={doc._id} value={doc._id} className="text-white hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  <FileTextIcon />
                  {doc.fileName}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

