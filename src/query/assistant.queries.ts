import { useToast } from "@/hooks/use-toast"
import {
  getAssistantDetails,
  getAssistantLists,
  updateAssistant,
  deleteAssistant,
  createAssistant,
} from "@/service/assistant.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export {
  useCreateAssistant,
  useUpdateAssistant,
  useGetAssistantLists,
  useDeleteAssistant,
  useGetAssistantDetails,
};

const useCreateAssistant = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workShopId, assistantName }: { workShopId: string; assistantName: string }) => createAssistant({workShopId, assistantName}),
    onSuccess: () => {
      toast({
        variant : "success",
        title: "Success",
        description: "Successfully created Assistant",
      });
      queryClient.invalidateQueries({queryKey : [QUERY_KEYS.ASSISTANTLISTS]});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create assistant",
        variant: "destructive"
      });
    }
  });
};

const useGetAssistantDetails = (assistantId: string) => {
  return useQuery({
    queryKey : [QUERY_KEYS.ASSISTANT,assistantId],
    queryFn : () => getAssistantDetails(assistantId),
    enabled : !!assistantId,
  })
};

const useGetAssistantLists = (workshopId: string, page: number = 1, searchTerm: string = "",limit : number,timezone : string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ASSISTANTLISTS, workshopId, page, searchTerm,limit],
    queryFn: () => getAssistantLists(workshopId, page, searchTerm,limit,timezone),
    enabled: !!workshopId,
    retry : false
  });
};

const useUpdateAssistant = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assistantData: any) => {
      return updateAssistant(assistantData);
    },
    onSuccess: (data) => {
      toast({
        variant : "success",
        title: "Success",
        description: "Successfully updated Assistant",
      });
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ASSISTANTLISTS]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ASSISTANT, data?.assistantId]});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update assistant",
        variant: "destructive"
      });
    }
  });
};

const useDeleteAssistant = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assistantId, workshop }: { assistantId: string; workshop: string }) => deleteAssistant({assistantId, workshop}),
    onSuccess: () => {
      toast({
        variant : "success",
        title: "Success",
        description: "Successfully deleted Assistant",
      });
      queryClient.invalidateQueries({queryKey : [QUERY_KEYS.ASSISTANTLISTS]});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete assistant",
        variant: "destructive"
      });
    }
  });
};