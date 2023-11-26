import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);

  if (secondsDifference < 60) {
    return `Just now`;
  }

  const minutesDifference = Math.floor(secondsDifference / 60);
  if (minutesDifference < 60) {
    return `${minutesDifference} ${minutesDifference === 1 ? "minute" : "minutes"} ago`;
  }

  const hoursDifference = Math.floor(minutesDifference / 60);
  if (hoursDifference < 24) {
    return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
  }

  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric' 
  };

  return date.toLocaleDateString(undefined, options);
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
