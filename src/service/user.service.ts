import apiClient from ".";

export const getUserDetails = async () => {
  try {
    const response = await apiClient.get(`/user`)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const login = async (googleToken: string) => {
  try {
    const response = await apiClient.post(
      `/user/login`,
      { googleToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post(`/user/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const connectGoHighLevel = async (workshopId: string) => {
  try {
    const response = await apiClient.get(`/user/gohighlevel/connect/${workshopId}`);
    window.location.href = response.data.authUrl;
  } catch (error) {
    console.error("Error connecting to GoHighLevel:", error);
    throw error;
  }
};

export const handleGoHighLevelCallback = async (code: string, workshopId: string) => {
  try {
    const response = await apiClient.post(`/user/gohighlevel/callback`, { code, workshopId });
    return response.data;
  } catch (error) {
    console.error("Error handling GoHighLevel callback:", error);
    throw error;
  }
};