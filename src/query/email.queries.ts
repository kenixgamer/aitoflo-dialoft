import { useMutation } from '@tanstack/react-query';
import { sendSupport } from '@/service/email.service';
import { useToast } from '@/hooks/use-toast';

export const useSendSupport = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: sendSupport,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Support request sent successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send support request",
        variant: "destructive",
      });
    },
  });
};
