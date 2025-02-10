import { useState } from "react";
import BatchCallForm from "@/components/BatchCalling/BatchCallForm";
import BatchCallList from "@/components/BatchCalling/BatchCallList";
import SearchHeader from "@/components/SearchHeader";
import { FileEarmarkIcon } from "@/utils/icons/icons";

const BatchCall = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleFormClose = () => {
    setShowForm(false);
    
    // Add a small delay before removing elements to ensure proper cleanup
    setTimeout(() => {
      const vapiElements = document.querySelectorAll('[id^="vapi"]');
      vapiElements.forEach(element => {
        element.remove();
      });
    }, 100);
  };

  return (
    <div className="w-full bg-black h-screen flex flex-col">
      <SearchHeader
      headerIcon={<FileEarmarkIcon />}
      onButtonClick={() => setShowForm(true)}
        buttonText="Create Batch Call"
        headerText="Batch Calls"
        textValue={searchTerm}
        setTextValue={setSearchTerm}
      />
      
      <BatchCallList searchTerm={searchTerm}/>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <BatchCallForm onClose={handleFormClose} />
        </div>
      )}
    </div>
  );
};

export default BatchCall;