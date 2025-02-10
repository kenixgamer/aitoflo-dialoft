import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { addDocument, deleteDocument, getDocuments } from "@/service/knowledgebase.services";
import { useToast } from "@/hooks/use-toast";

export const useGetDocuments = (workshopId: string, search: string, page: number, limit: number = 12,timezone :string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.KNOWLEDGE_BASE_FILES, workshopId, search, page,timezone],
    queryFn: () => getDocuments(workshopId, search, page, limit,timezone),
    enabled: !!workshopId,
  });
};

export const useAddDocument = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workShopId: workshopId, files } : any) => addDocument({ workShopId: workshopId, files }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KNOWLEDGE_BASE_FILES],
      });
      toast({
        variant: "success",
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: () => {    
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  });
}

export const useDeleteDocument = (workshopId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(workshopId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KNOWLEDGE_BASE_FILES, workshopId],
      });
      toast({
        variant: "success",
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  });
};
