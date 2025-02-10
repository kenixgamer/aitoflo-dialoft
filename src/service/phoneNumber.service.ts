import apiClient from "."

interface TwilioPhoneNumberParams {
  number: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
}

interface VonagePhoneNumberParams {
  number: string;
  credentialId: string;
}

export const getPhoneNumbers = async (page : number = 1,searchTerm : string = "",limit : number,timezone : string) => {
  const response = await apiClient.get('/phonenumber', {
    params: {
      page,
      searchTerm,
      limit : limit || 10,
      timezone : timezone || ""
    }
  });
  return response.data.data;
};

export const addTwilioPhoneNumber = async (data: TwilioPhoneNumberParams) => {
  const response = await apiClient.post('/phonenumber/twilio/add', data);
  return response;
};

export const addVonagePhoneNumber = async (data: VonagePhoneNumberParams) => {
  const response = await apiClient.post('/phonenumber/vonage/add', data);
  return response;
};

export const deletePhoneNumber = async (phoneNumber: string) => {
  const response = await apiClient.delete(`/phonenumber/${phoneNumber}`);
  return response;
};

export const updateAssistantPhoneNumber = async (assistantId: string, phoneNumberId : string) => {
  const response = await apiClient.put(`/phonenumber/update`, { assistantId, phoneNumberId });
  return response.data;
};
export const removeInBoundNumber = async (phoneNumberId : string) => {
  const response = await apiClient.put(`/phonenumber/remove/${phoneNumberId}`);
  return response.data;
};