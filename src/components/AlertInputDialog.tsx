import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AlertInputDialogProps {
  buttonName?: any,
    textValue: string;
    setTextValue: (value: string) => void;
  title: string;
  placeholder: string;
  hiddenButton ?: boolean;
  onSave: (value: string) => void;
  showAlertDialog: boolean;
  setShowAlertDialog: (show: boolean) => void;
}

const AlertInputDialog = ({title, placeholder, onSave, buttonName, showAlertDialog, setShowAlertDialog, textValue, setTextValue, hiddenButton}: AlertInputDialogProps) => {

  return (
    <Dialog  open={showAlertDialog} onOpenChange={setShowAlertDialog}>
      <DialogTrigger asChild>
        <Button 
          className={`w-full ${hiddenButton && "hidden"} bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]`}
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-purple-500/20 [&>button>svg]:text-purple-400 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-white">
              {placeholder}
            </Label>
            <Input
              id="name"
              placeholder={placeholder}
              className="bg-zinc-900 border-zinc-800 text-white focus:border-purple-500/50 focus-visible:ring-1 focus-visible:ring-purple-500/50"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            onClick={() => onSave(textValue)}
            variant="primary"
            className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            disabled={!textValue.trim()}
          >
            {buttonName || "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AlertInputDialog