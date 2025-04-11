import {
  useDeleteTool,
  useGetTool,
  useGetTools,
} from "@/query/tool.queries";
import DataTable from "../DataTable";
import { getTimezone } from "@/utils/helperFunctions";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchHeader from "../SearchHeader";
import { ActionsIcon } from "@/utils/icons/icons";
import ToolForm from "./ToolForm";
import Spinner from "../ui/loader";

const ToolList = () => {
  const { workshopId } = useParams();
  if (!workshopId) return null;
  const timezone = getTimezone();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Created At",
      accessor: "createdAt",
    },
    {
      header: "Type",
      accessor: "type",
    },
  ];
  const {
    data: data,
    isLoading,
    isError,
  } = useGetTools(workshopId, currentPage, debouncedSearchTerm, 12, timezone);
  const { mutateAsync: deleteTool } = useDeleteTool();
  const [toolId, setToolId] = useState("");
  const [toolData, setToolData] = useState<any>(null);
  const { data: toolDetailsData, isFetching : isFetchingToolDetails, refetch : refetchToolDetails } = useGetTool(toolId);
  const [isEditing,setIsEditing] = useState(false);
  
  const handleNavigateOfColumn = async (toolId: any) => {
    setToolId(toolId);
    await refetchToolDetails();
    setShowAlertDialog(true);
  };

  const handleHeaderButtonClick = () => {
    setIsEditing(false);
    setToolData(null);
    setShowAlertDialog(true)
  }
  useEffect(() => {
    if (toolDetailsData) {
      setToolData(toolDetailsData);
      setIsEditing(true);
      setShowAlertDialog(true);
    }
  }, [toolDetailsData]);

  return (
    <div className="flex h-full flex-col">
      <SearchHeader
        headerIcon={<ActionsIcon />}
        textValue={searchTerm}
        setTextValue={setSearchTerm}
        headerText="Action"
        buttonText={"Create Action ▼"}
        buttonDisabled={false}
        onButtonClick={handleHeaderButtonClick}
        buttonClassName="bg-white text-black hover:bg-white hover:text-black"
      />

      <DataTable
        isLoading={isLoading}
        isError={isError}
        errorMessage="No Actions Found"
        columns={columns}
        data={data?.tools || []}
        totalPages={data?.totalPages || 0}
        currentPage={data?.currentPage || 0}
        onPageChange={setCurrentPage}
        onDelete={(toolId) => deleteTool(toolId)}
        handleNavigateOfColumn={handleNavigateOfColumn}
        deleteDialogProps={{
          title: "Delete Action",
          description:
            "Are you sure you want to delete this action? This action cannot be undone.",
        }}
      />
      <ToolForm onOpenChange={() => setShowAlertDialog(false)} open={showAlertDialog} toolData={toolData} isEditing={isEditing}/>
     {isFetchingToolDetails && <div className="absolute  inset-0 top-1/2 flex items-center justify-center h-16">
        <Spinner />
      </div>}
    </div>
  );
};

export default ToolList;
