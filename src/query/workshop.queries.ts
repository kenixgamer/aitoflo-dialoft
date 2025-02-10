import { useToast } from "@/hooks/use-toast"
import { createWorkShop } from "@/service/workshop.service"
import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import { UserContext } from "@/context"

export {
    useCreateWorkShop
}

const useCreateWorkShop = () => {
    const { toast } = useToast();
    const {user,setUser} = useContext(UserContext);
    return useMutation({
        mutationFn: (newWorkShopName : string) => createWorkShop(newWorkShopName),
        onSuccess(data) {
            toast({
                variant: "success",
                title: "Workshop Created",
                description: "The workshop has been successfully created."
            });
            // queryClient.invalidateQueries({queryKey : [QUERY_KEYS.USER]});
            let workShops = [...user.workShops, { name: data.data.name, _id: data.data._id }];
            setUser((prev) => ({ ...prev, workShops }));
        },
        onError() {
            toast({
                variant: "destructive",
                title: "Creation Failed",
                description: "There was an error creating the workshop."
            })
        },
    })
}