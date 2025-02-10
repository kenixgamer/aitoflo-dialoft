import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "@/utils/icons/icons";

interface SearchHeaderProps {
  buttonText: string | ReactNode;
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
  buttonClassName?: string;
  headerText: string;
  textValue: string;
  setTextValue: (value: string) => void;
  headerIcon : ReactNode;
  buttonDisabled?: boolean;
}

const SearchHeader = ({
  buttonDisabled,
  headerIcon,
  textValue,
  setTextValue,
  buttonText, 
  buttonIcon, 
  onButtonClick, 
  headerText
}: SearchHeaderProps) => {
  return (
    <div className="p-4 text-white bg-black border-b border-zinc-800">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-4">
        <span className="text-purple-600">{headerIcon}</span> 
        {headerText}
      </h1>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center bg-zinc-900 p-1 rounded-md flex-1 max-w-md border border-zinc-800 hover:border-zinc-700 transition-colors">
          <SearchIcon/>
          <Input
            type="search"
            placeholder="Search..."
            value={textValue}
            className="bg-transparent border-none w-full focus:ring-0 focus-visible:ring-0 placeholder:text-zinc-500 text-white"
            onChange={(e) => setTextValue(e.target.value)}
            aria-label="Search"
          />
        </div>
        <Button 
          disabled={buttonDisabled}
          onClick={onButtonClick} 
          variant="primary"
          className="whitespace-nowrap shadow-[0_0_10px_rgba(147,51,234,0.3)]"
        >
          {buttonText} {buttonIcon && <span className="ml-2">{buttonIcon}</span>}
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;