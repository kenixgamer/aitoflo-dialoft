import { useQuery } from "@tanstack/react-query";
import { getCallDetails, getCallHistory } from "@/service/call.service";
import { QUERY_KEYS } from "./queryKeys";
import { useContext } from "react";
import { UserContext } from "@/context";
import { useParams } from "react-router-dom";

export const useGetCallHistory = (filters: any,dateRange: any,currentPage : number,timezone : string) => {
  const {user} = useContext(UserContext);
  const {workshopId} = useParams()
  let queryFilter: any = {};
  const formatData = (data: any) => {
    data.map((item: any) => {
     queryFilter[item.type] = item.value
    })
    queryFilter.fromDate = dateRange.fromDate
    queryFilter.toDate = dateRange.toDate
    queryFilter.workShop = workshopId
    queryFilter.page = currentPage
    queryFilter.timezone = timezone
  }
  formatData(filters)
  return useQuery({
    queryKey: [QUERY_KEYS.CALL_HISTORY, queryFilter],
    queryFn: () => getCallHistory(queryFilter),
    enabled: !!user.email,
  });
}; 

export const useGetCallDetails = (callId : string) => {
  return useQuery({
    queryKey : [QUERY_KEYS.CALL_DETAILS,callId],
    queryFn : () => getCallDetails(callId),
    enabled : !!callId
  })
}