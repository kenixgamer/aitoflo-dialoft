import apiClient from ".";

interface BatchCallData {
  name: string;
  assistantId: string;
  phoneNumberId: string;
  maxConcurrentCalls: number;
  scheduleTime?: string;
  numbers: string[];
  numberSource?: string; // Add numberSource to the interface
  timezone: string; // Add this field
  workshopId: string; // Ensure workshopId is included
}

export const createBatchCall = async (data: BatchCallData) => {
  const response = await apiClient.post('/batchcall/create', data);
  return response.data;
};

export const getBatchCalls = async (workshopId: string, page: number, name: string, limit: number,timezone?: string) => {
  const response = await apiClient.get(`/batchcall/${workshopId}`, {
    params: { page, name, limit, timezone }
  });
  return {
    batchCalls: response.data.data.batchCalls,
    currentPage: response.data.data.currentPage,
    totalPages: response.data.data.totalPages,
    hasMorePages: response.data.data.currentPage < response.data.data.totalPages
  };
};

export const deleteBatchCall = async (batchCallId: string) => {
  const response = await apiClient.delete(`/batchcall/${batchCallId}`);
  return response.data;
};