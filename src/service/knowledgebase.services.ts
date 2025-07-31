import apiClient from "."
import axios from "axios";

export interface UploadDocumentParams {
  workShopId: string;
  files: File[];
}

export const deleteDocument = async (workshopId: string, documentId: string) => {
  const response = await apiClient.delete("/workshop/document/delete", {
    data: { workShopId: workshopId, documentId },
  });
  return response.data;
}

export const getDocuments = async (workShopId: string, search?: string, page: number = 1, limit: number = 12,timezone? : string) => {
  const response = await apiClient.get(`/workshop/document/${workShopId}`, {
    params: { search, page, limit,timezone }
  });
  return response.data.data;
}


export const uploadFilesToVapi = async (files : File[]) => {
  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://api.vapi.ai/file",
          formData,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_PRIVATE_KEY}`,
            },
          }
        );

        return response.data.id;
      })
    );

    return results;
  } catch (error) {
    console.error("Error uploading files to VAPI:", error);
    throw new Error(`File upload to VAPI failed: ${error}`);
  }
};
export const addDocument = async ({ workShopId, files }: UploadDocumentParams) => {
  const response = await apiClient.post("/workshop/document/add", {workShopId,files}, {
  });
  return response.data;
}
