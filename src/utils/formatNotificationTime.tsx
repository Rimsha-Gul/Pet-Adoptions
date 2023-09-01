import moment from "moment";

export const formatNotificationTime = (date: string) => {
  const now = moment();
  const then = moment(date);
  const diffSeconds = now.diff(then, "seconds");
  const diffMinutes = now.diff(then, "minutes");
  const diffHours = now.diff(then, "hours");
  const diffDays = now.diff(then, "days");
  const diffWeeks = now.diff(then, "weeks");
  if (diffSeconds < 60) {
    return `Less than a minute ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}min ago`;
  } else if (diffHours < 24) {
    return `${diffHours}hr ago`;
  } else if (diffDays === 1) {
    return `Yesterday at ${then.format("h:mma")}`;
  } else if (diffDays < 7) {
    return then.format("ddd [at] h:mma");
  } else if (diffWeeks < 52) {
    return then.format("MMM D [at] h:mma");
  } else {
    return then.format("MMM D, YYYY [at] h:mma");
  }
};
