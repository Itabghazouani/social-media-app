import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  differenceInHours,
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
  isThisYear,
  isYesterday,
} from "date-fns";
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatRelativeDate = (from: Date) => {
  const currentDate = new Date();
  const minutesDiff = differenceInMinutes(currentDate, from);
  const hoursDiff = differenceInHours(currentDate, from);

  // Less than 1 hour: "X minutes ago"
  if (minutesDiff < 60) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  }
  // Less than 24 hours: "X hours ago"
  else if (hoursDiff < 24) {
    return formatDistanceToNowStrict(from, {
      addSuffix: true,
      unit: "hour",
    });
  }
  // Yesterday: "Yesterday at 3:45 PM"
  else if (isYesterday(from)) {
    return `Yesterday at ${format(from, "h:mm a")}`;
  }
  // This year: "Mar 15 at 3:45 PM"
  else if (isThisYear(from)) {
    return format(from, "MMM d 'at' h:mm a");
  }
  // Different year: "Mar 15, 2022 at 3:45 PM"
  else {
    return format(from, "MMM d, yyyy 'at' h:mm a");
  }
};

export const formatNumber = (num: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};
