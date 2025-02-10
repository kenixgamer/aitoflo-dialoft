import apiClient from ".";

const createCheckoutSession = async (planName: string, billingPeriod: string) => {
  try {
    const response = await apiClient.post('/payment/create-checkout', { 
      planName, billingPeriod
    });
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export {
  createCheckoutSession
}