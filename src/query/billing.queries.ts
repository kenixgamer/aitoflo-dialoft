import { getCallAnalytics } from "@/service/billing.service"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"

export {
    useGetCallAnalytics
}

const useGetCallAnalytics = () => {
    return useQuery({
        queryKey : [QUERY_KEYS.ANALYTICS],
        queryFn : getCallAnalytics
    })
}