import { getUserDetails, logout } from "@/service/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { useToast } from "@/hooks/use-toast";

export {
    useGetUserDetails,
    useLogOut
}

const useGetUserDetails = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.USER],
      queryFn: getUserDetails,
      retry : false,
      staleTime : 10000
    });
};

const useLogOut = () => {
  const { toast } = useToast();
    return useMutation({
      mutationFn : () => logout(),
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Logged out successfully"
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to logout",
          variant: "destructive"
        });
      }
    });
  };