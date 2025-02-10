import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { 
  addTwilioPhoneNumber, 
  addVonagePhoneNumber, 
  deletePhoneNumber, 
  getPhoneNumbers,
  removeInBoundNumber,
  updateAssistantPhoneNumber
} from "@/service/phoneNumber.service";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import { UserContext } from "@/context";

export const useGetPhoneNumbers = (page : number,searchTerm : string,limit : number,timezone :string) => {
  const {user} = useContext(UserContext);
  return useQuery({
    queryKey: [QUERY_KEYS.PHONE_NUMBERS, page,searchTerm,limit,timezone],
    queryFn: () => getPhoneNumbers(page,searchTerm,limit,timezone),
    enabled: !!user._id,
    retry : false
  });
};

export const useAddTwilioPhoneNumber = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTwilioPhoneNumber,
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Twilio phone number added successfully"
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHONE_NUMBERS] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add Twilio phone number",
        variant: "destructive"
      });
    }
  });
};

export const useAddVonagePhoneNumber = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVonagePhoneNumber,
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully added Vonage phone number"
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHONE_NUMBERS] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add Vonage phone number",
        variant: "destructive"
      });
    }
  });
};

export const useDeletePhoneNumber = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhoneNumber,
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Phone number deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PHONE_NUMBERS] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete phone number",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateAssistantPhoneNumber = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assistantId, phoneNumberId }: { assistantId: string, phoneNumberId: string }) => 
      updateAssistantPhoneNumber(assistantId, phoneNumberId),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully Added Phone Number For InBound"
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSISTANT] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update phone number",
        variant: "destructive"
      });
    }
  });
};

export const useRemoveInBoundNumber = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (phoneNumberId : string) => removeInBoundNumber(phoneNumberId),
    onSuccess : () => {
      toast({
        title : "Success",
        description : "Successfully removed assign number",
        variant : "success"
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSISTANT] })
    }
  })
}