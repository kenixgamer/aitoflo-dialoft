import {
  useCreateAssistant,
  useDeleteAssistant,
  useGetAssistantLists,
} from "@/query/assistant.queries";
import { useNavigate, useParams } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import DataTable from "@/components/DataTable";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { getTimezone } from "@/utils/helperFunctions";
import { AssistantIcon } from "@/utils/icons/icons";
import { useDebounce } from "@/hooks/useDebounce";
import AlertInputDialog from "@/components/AlertInputDialog";

const AssistantLists = () => {
  const { workshopId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [assistantName, setAssistantName] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  if (!workshopId) {
    return <p>Error...</p>;
  }
  const navigate = useNavigate();

  const { mutateAsync: createAssistant, isPending: isCreatingAssistant } =
    useCreateAssistant();

  const { mutateAsync: deleteAssistant } = useDeleteAssistant();
  const timezone = getTimezone();
  const {
    data: assistantLists,
    isLoading,
    isError,
  } = useGetAssistantLists(workshopId, currentPage, debouncedSearchTerm, 12, timezone);

  const handleCreateAssistant = async () => {
   try {
    await createAssistant({workShopId: workshopId, assistantName});
   } catch (error) {
   }finally{
    setShowAlertDialog(false);
    setAssistantName("");
   }
  };

  const handleDelete = async (assistantId: string) => {
    await deleteAssistant({
      assistantId,
      workshop : workshopId,
    });
    
  };

  const columns = [
    { header: "Agent Name", accessor: "assistantName" },
    { header: "Model", accessor: "assistantModel" },
    { header: "InBound Phone Number", accessor: "phoneNumber" },
    { header: "Edited by", accessor: "createdAt", align: "right" as const },
  ];
  const handleNavigateOfColumn = (assistantId: any) => {
    navigate(`/${workshopId}/agents/${assistantId}`);
  };
 
  return (
    <div className="flex h-full flex-col">
      <SearchHeader
        headerIcon={<AssistantIcon />}
        textValue={searchTerm}
        setTextValue={setSearchTerm}
        headerText="Agents"
        buttonText={
          isCreatingAssistant ? (
            <>
              Creating ▼<Spinner/>
            </>
          ) : (
            "Create an Agent ▼"
          )
        }
        buttonDisabled={isCreatingAssistant}
        onButtonClick={() => setShowAlertDialog(true)}
        buttonClassName="bg-white text-black hover:bg-white hover:text-black"
      />

      <DataTable
        isLoading={isLoading}
        isError={isError}
        errorMessage="No Agents Found"
        columns={columns}
        data={assistantLists?.assistants || []}
        totalPages={assistantLists?.totalPages || 0}
        currentPage={assistantLists?.currentPage || 0}
        onPageChange={setCurrentPage}
        onDelete={(assistantId) => handleDelete(assistantId)}
        handleNavigateOfColumn={handleNavigateOfColumn}
        deleteDialogProps={{
          title: "Delete Assistant",
          description:
            "Are you sure you want to delete this assistant? This action cannot be undone.",
        }}
      />
       <AlertInputDialog
       buttonName={
        isCreatingAssistant ? (
          <>
            Creating ▼<Spinner/>
          </>
        ) : (
          "Create an Agent ▼"
        )
       }
       hiddenButton={true}
                title="Create Assistant"
                placeholder="Enter Assistant name"
                onSave={handleCreateAssistant}
                showAlertDialog={showAlertDialog}
                setShowAlertDialog={setShowAlertDialog}
                textValue={assistantName}
                setTextValue={setAssistantName}
              />
    </div>
  );
};

export default AssistantLists;
