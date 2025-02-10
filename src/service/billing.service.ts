import apiClient from "."

export {
    getCallAnalytics
}

const getCallAnalytics = async() => {
    const response = await apiClient.get('/billing/analytics');
    return response.data
}