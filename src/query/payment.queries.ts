import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from '@/service/payment.service';
import { useToast } from '@/hooks/use-toast';

export const useCreateCheckoutSession = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ planName, billingPeriod }: { planName: string, billingPeriod: string }) => 
      createCheckoutSession(planName, billingPeriod),
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      });
    }
  });
};
