import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PlusIconAlt, TrashIconAlt } from "../../utils/icons/icons";

interface ManualNumberInputProps {
  numbers: Array<{ name: string; phoneNumber: string }>;
  onNumbersChange: (numbers: Array<{ name: string; phoneNumber: string }>) => void;
}

const ManualNumberInput = ({ numbers, onNumbersChange }: ManualNumberInputProps) => {

  const handleAddEntry = () => {
    onNumbersChange([...numbers, { name: "", phoneNumber: "" }]);
  };

  const handleRemoveEntry = (index: number) => {
    const newNumbers = numbers.filter((_, i) => i !== index);
    if (newNumbers.length === 0) {
      onNumbersChange([{ name: "", phoneNumber: "" }]);
    } else {
      onNumbersChange(newNumbers);
    }
  };

  const handleEntryChange = (index: number, field: "name" | "phoneNumber", value: string) => {
    const newNumbers = numbers.map((entry, i) => {
      if (i === index) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    onNumbersChange(newNumbers);
  };

  return (
    <div className="space-y-4">
      {numbers.map((entry, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Name"
            value={entry.name}
            onChange={(e) => handleEntryChange(index, "name", e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
          />
          <Input
            placeholder="+1234567890"
            value={entry.phoneNumber}
            onChange={(e) => handleEntryChange(index, "phoneNumber", e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
          />
          {numbers.length > 1 && (
            <Button
              className="p-3 bg-zinc-900 hover:bg-red-900/90 border-zinc-800"
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveEntry(index)}
            >
              <TrashIconAlt />
            </Button>
          )}
        </div>
      ))}
      
      <Button
        type="button"
        variant="primary"
        onClick={handleAddEntry}
      >
        <span className="mr-2 text-purple-600">
          <PlusIconAlt />
        </span>
        Add Number
      </Button>
    </div>
  );
};

export default ManualNumberInput;