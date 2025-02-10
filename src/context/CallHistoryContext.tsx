import { useGetAssistantLists } from "@/query/assistant.queries";
import { useGetCallHistory } from "@/query/call.queries";
import { getAssistantLists } from "@/service/assistant.service";
import { getTimezone } from "@/utils/helperFunctions";
import React, { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

interface FilterValue {
  type: string;
  value: string;
  label: string;
  displayValue?: string;
}

interface AssistantListResponse {
  assistants: Array<{
    id: string;
    name: string;
  }>;
  total: number;
  currentPage: number;
  totalPages: number;
}

interface CallHistoryContextType {
  currentPage: number;
  setCurrentPage: any
  callHistoryError: boolean;
  filters: FilterValue[];
  selectedAgent: string;
  isAgentDialogOpen: boolean;
  selectedFilters: FilterValue[];
  fromDate?: Date;
  toDate?: Date;
  setFilters: (filters: FilterValue[]) => void;
  setSelectedAgent: (id: string) => void;
  setIsAgentDialogOpen: (isOpen: boolean) => void;
  setSelectedFilters: (filters: FilterValue[]) => void;
  handleFilterSelect: (value: string) => void;
  handleFilterRemove: (type: string) => void;
  handleAgentSelect: () => void;
  handleAgentChange: (value: string) => void;
  handleDateSelect: (date: Date | undefined, type: "from" | "to") => void;
  assistantLists: any;
  handleInputFilterSave: (type: string, value: string) => void;
  isInputDialogOpen: boolean;
  setIsInputDialogOpen: (isOpen: boolean) => void;
  currentFilterType: string;
  setCurrentFilterType: (type: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  showAlertDialog: boolean;
  setShowAlertDialog: (isOpen: boolean) => void;
  dateRange: {
    fromDate?: Date;
    toDate?: Date;
  };
  callHistory: any;
  callHistoryLoading: boolean;
  loadMoreAssistants: (page: number) => void;
}

export const CallHistoryContext = createContext<CallHistoryContextType>(
  {} as CallHistoryContextType
);

export const CallHistoryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  if (!workshopId) return null;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>([]);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [dateRange, setDateRange] = useState<{
    fromDate?: Date;
    toDate?: Date;
  }>({});
  const timezone = getTimezone()
  const {data: callHistory,isLoading: callHistoryLoading,isError: callHistoryError} = useGetCallHistory(filters, dateRange,currentPage,timezone)
  const {
    data: initialAssistantLists = {
      assistants: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
    } as AssistantListResponse,
  } = useGetAssistantLists(workshopId, 1,"",10,"");
  const [assistantLists, setAssistantLists] = useState<any>({
    assistants: [],
    hasMore: false,
    currentPage: 1
  });

  const loadMoreAssistants = async (page: number) => {
    if (!workshopId) return;
    try {
      const response = await getAssistantLists(workshopId, page, "", 10, timezone);
      setAssistantLists((prev : any) => ({
        assistants: [...prev.assistants, ...response.assistants],
        hasMore: response.currentPage < response.totalPages,
        currentPage: response.currentPage
      }));
    } catch (error) {
      console.error('Error loading more assistants:', error);
    }
  };

  // Initialize assistants when first loading
  useEffect(() => {
    if (initialAssistantLists?.assistants) {
      setAssistantLists({
        assistants: initialAssistantLists.assistants,
        hasMore: initialAssistantLists.currentPage < initialAssistantLists.totalPages,
        currentPage: initialAssistantLists.currentPage
      });
    }
  }, [initialAssistantLists]);

  // Parse URL search params on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters: FilterValue[] = [];
    const urlDateRange: { fromDate?: Date; toDate?: Date } = {};

    // Parse filters from URL
    searchParams.forEach((value, key) => {
      if (key === 'fromDate' || key === 'toDate') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          urlDateRange[key as 'fromDate' | 'toDate'] = date;
        }
      } else {
        const filterOption = filterOptions.find(opt => opt.value === key);
        if (filterOption) {
          urlFilters.push({
            type: key,
            value: value,
            label: filterOption.label
          });
        }
      }
    });

    if (urlFilters.length > 0) {
      setFilters(urlFilters);
      setSelectedFilters(urlFilters);
    }
    if (Object.keys(urlDateRange).length > 0) {
      setDateRange(urlDateRange);
    }
  }, [location.search]);

  // Update URL when filters or date range change
  useEffect(() => {
    const searchParams = new URLSearchParams();

    // Add filters to URL
    filters.forEach(filter => {
      searchParams.set(filter.type, filter.value);
    });

    // Add date range to URL
    if (dateRange.fromDate) {
      searchParams.set('fromDate', dateRange.fromDate.toISOString());
    }
    if (dateRange.toDate) {
      searchParams.set('toDate', dateRange.toDate.toISOString());
    }

    // Update URL without triggering a page reload
    const newSearch = searchParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [filters, dateRange]);

  const handleFilterSelect = (value: string) => {
    if (value === "agent") {
      setIsAgentDialogOpen(true);
      return;
    }

    if (!selectedFilters.find((filter) => filter.type === value)) {
      const filterOption = filterOptions.find((opt) => opt.value === value);
      if (filterOption) {
        const newFilters = [
          ...selectedFilters,
          {
            type: value,
            value: "",
            label: filterOption.label,
          },
        ];
        setSelectedFilters(newFilters);
        setFilters(newFilters);
      }
    }
  };

  const handleFilterRemove = (type: string) => {
    const newFilters = selectedFilters.filter((filter) => filter.type !== type);
    setSelectedFilters(newFilters);
    setFilters(newFilters);
    if (type === "agent") {
      setSelectedAgent("");
    }
  };

  const handleAgentSelect = () => {
    if (selectedAgent && assistantLists?.assistants) {
      const agent = assistantLists.assistants.find(
        (a: any) => a._id === selectedAgent
      );
      if (agent) {
        const newFilters = [
          ...selectedFilters.filter((f) => f.type !== "agent"),
          {
            type: "assistantId",
            value: agent._id,
            label: "Agent",
            displayValue: agent.name,
          },
        ];
        setSelectedFilters(newFilters);
        setFilters(newFilters);
        setIsAgentDialogOpen(false);
      }
    }
  };

  const handleAgentChange = (value: string) => {
    setSelectedAgent(value);
  };

  const handleDateSelect = (date: Date | undefined, type: "from" | "to") => {
    if (!date) {
      setDateRange((prev) => ({
        ...prev,
        [type === "from" ? "fromDate" : "toDate"]: undefined,
      }));
      return;
    }

    const adjustedDate = new Date(date);
    if (type === "from") {
      // Set to start of day (00:00:00)
      adjustedDate.setHours(0, 0, 0, 0);
    } else {
      // Set to end of day (23:59:59)
      adjustedDate.setHours(23, 59, 59, 999);
    }

    setDateRange((prev) => ({
      ...prev,
      [type === "from" ? "fromDate" : "toDate"]: adjustedDate,
    }));
  };

  const handleInputFilterSave = (type: string, value: string) => {
    const newFilters = [
      ...selectedFilters.filter((f) => f.type !== type),
      {
        type,
        value,
        label: filterOptions.find((opt) => opt.value === type)?.label || type,
      },
    ];
    setSelectedFilters(newFilters);
    setFilters(newFilters);
    setIsInputDialogOpen(false);
    setInputValue("");
  };

  const value = {
  currentPage,
  setCurrentPage,
    callHistory,
    callHistoryLoading,
    callHistoryError,
    showAlertDialog,
    setShowAlertDialog,
    filters,
    assistantLists,
    selectedAgent,
    isAgentDialogOpen,
    selectedFilters,
    setFilters,
    setSelectedAgent,
    setIsAgentDialogOpen,
    setSelectedFilters,
    handleFilterSelect,
    handleFilterRemove,
    handleAgentSelect,
    handleAgentChange,
    handleDateSelect,
    isInputDialogOpen,
    setIsInputDialogOpen,
    currentFilterType,
    setCurrentFilterType,
    inputValue,
    setInputValue,
    handleInputFilterSave,
    dateRange,
    loadMoreAssistants,
  };

  return (
    <CallHistoryContext.Provider value={value}>
      {children}
    </CallHistoryContext.Provider>
  );
};

export const filterOptions = [
  { label: "Agent", value: "agent" },
  { label: "Call ID", value: "callId" },
  { label: "Batch Call ID", value: "batchCallId" },
  { label: "Type", value: "type" },
];

// const columns = [
//   { header: "Time", accessor: "callCreatedAt" },
//   { header: "Call Duration", accessor: "callDuration" },
//   { header: "Type", accessor: "type" },
//   { header: "Cost", accessor: "cost" },
//   { header: "Call ID", accessor: "callId" },
//   { header: "Disconnection Reason", accessor: "disconnectionReason" },
//   { header: "Call Status", accessor: "callStatus" },
//   { header: "User Sentiment", accessor: "userSentiment" },
//   { header: "From", accessor: "from" },
//   { header: "To", accessor: "to" },
//   { header: "Call Successful", accessor: "callSuccessful" },
//   { header: "End to End Latency", accessor: "endToEndLatency" }
// ];

// const handlePageChange = (page: number) => {
//   setCurrentPage(page);
// };
