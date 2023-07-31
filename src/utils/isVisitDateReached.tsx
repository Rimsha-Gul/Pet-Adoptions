import moment from "moment";

export const isVisitDateReached = (visitDate?: string) => {
  // Get the current date.
  const currentDate = moment().utc();

  // Parse visitDate as a UTC time.
  const visitDateObj = moment.utc(visitDate);

  // Check if the visitDate has been reached.
  return currentDate.isSameOrAfter(visitDateObj);
};
