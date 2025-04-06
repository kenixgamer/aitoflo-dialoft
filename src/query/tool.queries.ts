import { useToast } from "@/hooks/use-toast";
import {
  createFunctionTool,
  deleteTool,
  getTool,
  getTools,
  updateFunctionTool,
} from "@/service/tool.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export const useCreataFunctionTool = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createFunctionTool(data),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully created Action",
      });
      queryClient.invalidateQueries({queryKey : [QUERY_KEYS.TOOL_LISTS]});
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create Action",
      });
    },
  });
};

export const useUpdateFunctionTool = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateFunctionTool(data),
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully updated Action",
      });
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.TOOL_LISTS]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.ASSISTANT, data?.toolId]});
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update Action",
      });
    },
  });
};

export const useDeleteTool = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (toolId: string) => deleteTool(toolId),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully deleted Action",
      });
      queryClient.invalidateQueries({queryKey : [QUERY_KEYS.TOOL_LISTS]});
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete Action",
      });
    },
  });
};

export const useGetTool = (toolId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOOL, toolId],
    queryFn: () => getTool(toolId),
    enabled: !!toolId
  });
};

export const useGetTools = (workshopId: string, page: number = 1, search: string = "", limit: number = 10,timezone? : string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOOL_LISTS,workshopId,page,search,limit,timezone],
    queryFn: () => getTools(workshopId,page,search,limit,timezone),
  });
};
