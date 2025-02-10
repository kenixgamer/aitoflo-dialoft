import apiClient from ".";

export {
    createWorkShop,
    getWorkShopDetails,
    initiateGoHighLevelOAuth
    // deleteWorkShop
}

const createWorkShop = async (newWorkShopName : string) => {
    try {
      const response = await apiClient.post(`/workshop/create`,{name : newWorkShopName});
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
};

const getWorkShopDetails = async (workShopId : string) => {
    try {
      const response = await apiClient.get(`/workshop/${workShopId}`);
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
};

const initiateGoHighLevelOAuth = async (workshopId: string) => {
  try {
    const response = await apiClient.get(`/workshop/${workshopId}/gohighlevel/oauth/init`);
    return response.data.data; // Access the data property from ApiResponse
  } catch (error) {
    console.error("Error initiating GoHighLevel OAuth:", error);
    throw error;
  }
};