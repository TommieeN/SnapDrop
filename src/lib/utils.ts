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
    return `${minutesDifference} minutes ago`;
  }
  const hoursDifference = Math.floor(minutesDifference / 60);
  if (hoursDifference < 24) {
    return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
  }
  const daysDifference = Math.floor(hoursDifference / 24);
  if (daysDifference === 1) {
    return "1 day ago";
  }
  return `${daysDifference} days ago`;
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
