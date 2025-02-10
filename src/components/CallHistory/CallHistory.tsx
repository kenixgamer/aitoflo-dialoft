import { HistoryIconAlt } from "@/utils/icons/icons";
import DataTable from "../DataTable";
import CallHistoryFilters from "./CallHistoryFilters";
import { CallHistoryContext, CallHistoryContextProvider } from "@/context/CallHistoryContext";
import SelectedFilters from "./SelectedFilters";
import { useContext, useState } from "react";
import CallLogDetails from "./CallLogDetails";

const CallHistory = () => {
  return (
    <CallHistoryContextProvider>
      <CallHistoryContent />
    </CallHistoryContextProvider>
  );
};

const CallHistoryContent = () => {
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [selectedCallId, setSelectedCallId] = useState<any>(null);
  const handleRowClick = (call: any) => {
    setSelectedCallId(call);
    setShowCallDetails(true);
  };

  const columns = [
    { header: "Time", accessor: "createdAt" },
    { header: "Type", accessor: "type" },
    { header: "Call Duration", accessor: "callDuration" },
    { header: "Call Outcome", accessor: "callOutcome" },
    { header: "Call Sentiment", accessor: "callSentiment" },
    { header: "FollowUp Status", accessor: "followUpStatus" },
    { header: "Objective Achievement", accessor: "objectiveAchievement" },
    { header: "Cost", accessor: "cost" },
    { header: "Disconnection Reason", accessor: "disconnectionReason" },
    { header: "From", accessor: "from" },
    { header: "To", accessor: "to" },
    { header: "Call Status", accessor: "callStatus" },
  ]
  const {callHistory, callHistoryLoading,callHistoryError , setCurrentPage} = useContext(CallHistoryContext);
  return (
    <div className="p-4 space-y-4 max-h-screen overflow-scroll">
      <div className="flex items-center justify-between pt-1 space-x-2">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
          <HistoryIconAlt />
          Call History
        </h2>  
      <CallHistoryFilters />
      </div>


      <SelectedFilters />

        <DataTable
          columns={columns}
        data={callHistory?.callHistory || []}
        isLoading={callHistoryLoading}
        isError={callHistoryError}
        errorMessage="No Call History found"
          totalPages={callHistory?.totalPages || 1}
        currentPage={callHistory?.currentPage || 1}
        onPageChange={setCurrentPage}
        handleNavigateOfColumn={handleRowClick}
      />

      {selectedCallId && (
        <CallLogDetails
          isOpen={showCallDetails}
          onClose={() => setShowCallDetails(false)}
          callId={selectedCallId}
        />
      )}
    </div>
  );
};

export default CallHistory;