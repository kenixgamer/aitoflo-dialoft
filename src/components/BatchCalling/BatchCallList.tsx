import { useGetBatchCalls, useDeleteBatchCall } from "@/query/batchCall.queries";
import DataTable from "../DataTable";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { getTimezone } from "@/utils/helperFunctions";
import { useDebounce } from "@/hooks/useDebounce";

const BatchCallList = ({searchTerm}:{searchTerm : string}) => {
  const {workshopId} = useParams();
  if(!workshopId) return null;
  const timezone = getTimezone();
  const navigate = useNavigate();
  const [currentPage,setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: batchCalls, isLoading, isError } = useGetBatchCalls(
    workshopId,
    currentPage,
    debouncedSearchTerm,
    10,
    timezone
  );

  const { mutate: deleteBatchCall } = useDeleteBatchCall();

  const columns = [
    { header: "Batch Call Name", accessor: "name" },
    { header: "BatchCall Id", accessor: "_id" },
    { header: "Status", accessor: "status" },
    { header: "Recipients", accessor: "totalRecipients" },
    // { header: "Send Pickup Successfull", accessor: "completedCalls" },
    { header: "Last Sent By", accessor: "createdAt", align: "right" as const }
  ];

  return (
    <DataTable 
    handleNavigateOfColumn={(id) => navigate(`/${workshopId}/call-history?batchCallId=${id}`)}
      columns={columns}
      data={batchCalls?.batchCalls || []}
      totalPages={batchCalls?.totalPages}
      currentPage={batchCalls?.currentPage}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
      isError={isError}
      errorMessage="No Batch Calls found"
      onDelete={deleteBatchCall}
      deleteDialogProps={{
        title: "Delete Batch Call",
        description: "Are you sure you want to delete this batch call? This action cannot be undone."
      }}
    />
  );
};

export default BatchCallList;