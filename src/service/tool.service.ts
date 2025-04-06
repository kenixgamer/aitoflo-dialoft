import apiClient from ".";

export const createFunctionTool = async (data: any) => {
  try {
    const response = await apiClient.post("/tool/create/function", data);
    return response.data.data;
  } catch (error) {
    console.error("Error Creating Tool", error);
    throw error;
  }
};

export const updateFunctionTool = async (data: any) => {
  try {
    const response = await apiClient.patch("/tool/update/function", data);
    return response.data.data;
  } catch (error) {
    console.error("Error Updating Tool", error);
    throw error;
  }
};

export const deleteTool = async (toolId: string) => {
  try {
    const response = await apiClient.delete(`/tool/delete/${toolId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error Deleting Tool", error);
    throw error;
  }
};

export const getTool = async (toolId: string) => {
  try {
    const response = await apiClient.get(`/tool/get/${toolId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error Getting Tool", error);
    throw error;
  }
};

export const getTools = async (
  workshopId: string,
  page: number = 1,
  search: string = "",
  limit: number = 12,
  timezone?: string
) => {
  try {
    const response = await apiClient.get(`/tool/lists/${workshopId}`, {
      params: {
        page,
        search,
        limit,
        timezone,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error Getting Tools", error);
    throw error;
  }
};
