export  const formatWorkshopName = (workshopName:string) => {
    if(!workshopName){
      return "";
    }
    if(workshopName.length > 12){
      return workshopName.slice(0,12) + "...";
    }
    return workshopName;
}

export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}