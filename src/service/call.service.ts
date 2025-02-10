import apiClient from ".";

export const getCallHistory = async (filters: any) => {
  const response = await apiClient.get(`/call/history`, {
    params: filters,
  });
  return response.data.data
  // return {
  //   callHistory: response.data.data.callHistory.map((call: any) => ({
  //     callId: call.callId,
  //     type: call.type,
  //     callStatus: call.callStatus,
  //     callDuration: call.callDuration,
  //     cost: call.cost,
  //     createdAt: new Date(call.createdAt).toLocaleDateString(),
  //     _id: call.id,
  //   })),
  //   totalPages: response.data.data.totalPages,
  //   currentPage: response.data.data.currentPage,
  //   total: response.data.data.totalDocuments,
  // };
};

export const getCallDetails = async (callId: string) => {
  const response = await apiClient.get(`/call/details/${callId}`);
  return response.data.data;
};

export const updateCallDuration = async (callId: string) => {
  const response = await apiClient.put("/call/update", { callId });
  return response.data.data;
};
