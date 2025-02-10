export const formatDate = (date: string) => {
  return date.toString().slice(0,10).split("-").reverse().join("/");
}

export const PLAN_CONCURRENT_CALL_LIMITS = {
  trial: 1,
  starter: 2,
  professional: 5,
  growth: 7,
  elite: 10
} as const;

export function capitalizeFirstLetter(str : string) {
  if(!str) return "Free Trial";
  return str.charAt(0).toUpperCase() + str.slice(1); 
}
