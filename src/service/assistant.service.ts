import apiClient from ".";

export const createAssistant = async ({workShopId, assistantName} : {workShopId : string,assistantName : string}) => {
  try {
    const response = await apiClient.post("/assistant/create",{workshop : workShopId, name : assistantName});
    return response.data.data;
  } catch (error) {
    console.error("Error Creating Assistant", error);
    throw error;
  }
};

export const getAssistantDetails = async (
  assistantId: string
) => {
  try {
    const response = await apiClient.get(`/assistant/${assistantId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching assistant details:', error);
    throw error;
  }
};

export const getAssistantLists = async (
  workshopId: string,
  page: number = 1,
  searchTerm: string = "",
  limit : number = 10,
  timezone : string
) => {
  try {
    const response = await apiClient.get(`/assistant/lists/${workshopId}`, {
      params: {
        page,
        search: searchTerm,
        limit,
        timezone
      }
    });
    
    return response.data.data
  } catch (error) {
    console.error("Error Getting Assistant Lists", error);
    throw error;
  }
};

export const updateAssistant = async (
  assistant: any
) => {
  try {
    const response = await apiClient.put(
      `/assistant/${assistant.assistantId}`,
      assistant
    );
    return response.data.data;
  } catch (error) {
    console.error("Error Updating Assistant", error);
    throw error;
  }
};

export const deleteAssistant = async ({assistantId,workshop} : any)=> {
  try {
    const response = await apiClient.delete("/assistant/delete", {
      data: { assistantId, workshop },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error Deleting Assistant", error);
    throw error;
  }
};