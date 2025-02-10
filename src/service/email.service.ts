import apiClient from ".";

interface SupportPayload {
  subject: string;
  description: string;
  email: string;
}

export const sendSupport = async (payload: SupportPayload) => {
  const response = await apiClient.post('/email', payload);
  return response.data;
};
