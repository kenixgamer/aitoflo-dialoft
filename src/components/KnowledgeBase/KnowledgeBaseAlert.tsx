import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIconLarge } from "@/utils/icons/icons";

interface KnowledgeBaseAlertProps {
    showKnowledgeBaseAlertBox: boolean;
  setShowKnowledgeBaseAlertBox: (show: boolean) => void;
    name: string;
  setName: (name: string) => void;
    files: File[];
  setFiles: (files: File[]) => void;
  onSave: () => void;
    isCreateKnowledgeBaseListLoading: boolean;
}

const KnowledgeBaseAlert = ({
    showKnowledgeBaseAlertBox,
    setShowKnowledgeBaseAlertBox,
    name,
    setName,
    files,
    setFiles,
  onSave,
  isCreateKnowledgeBaseListLoading,
}: KnowledgeBaseAlertProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

    return (
    <Dialog open={showKnowledgeBaseAlertBox} onOpenChange={setShowKnowledgeBaseAlertBox}>
      <DialogContent className="sm:max-w-[425px] bg-black border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create Knowledge Base</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter knowledge base name"
              className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
          <div className="flex flex-col gap-2">
            <Label className="text-white">Upload Files</Label>
            <div className="relative">
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
              />
              <Label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-800 rounded-md cursor-pointer hover:border-zinc-700 transition-colors bg-zinc-900"
              >
                <UploadIconLarge />
                <span className="text-sm text-zinc-400">
                  {files.length > 0
                    ? `${files.length} file(s) selected`
                    : "Click to upload or drag and drop"}
                </span>
              </Label>
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                    className="text-sm text-zinc-400 flex items-center gap-2 bg-zinc-900 p-2 rounded-md border border-zinc-800"
                  >
                    <span className="text-purple-500">📄</span>
                    <span className="text-white">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
            )}
                            </div>
                        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="normal"
                                onClick={() => setShowKnowledgeBaseAlertBox(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={!name.trim() || files.length === 0 || isCreateKnowledgeBaseListLoading}
            className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
          >
            {isCreateKnowledgeBaseListLoading ? "Creating..." : "Upload Documents"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    );
};

export default KnowledgeBaseAlert;
