import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { createBatchCall, deleteBatchCall, getBatchCalls } from "@/service/batchCall.service";
import { useToast } from "@/hooks/use-toast";

export const useGetBatchCalls = (workshopId: string, page: number = 1, name: string = "", limit: number = 10,timezone? : string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BATCH_CALLS, workshopId, page, name, limit],
    queryFn: () => getBatchCalls(workshopId, page, name, limit,timezone),
  });
};

export const useCreateBatchCall = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => createBatchCall(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCH_CALLS] });
      toast({
        variant: "success",
        title: "Success",
        description: "Batch call created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create batch call",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteBatchCall = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteBatchCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCH_CALLS] });
      toast({
        variant: "success",
        title: "Success",
        description: "Batch call deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete batch call",
        variant: "destructive"
      });
    }
  });
};