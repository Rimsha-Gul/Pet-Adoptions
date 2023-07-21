import Datetime from "react-datetime";
import moment, { Moment } from "moment";
import loadingIcon from "../../assets/loading.gif";
import { useEffect, useState } from "react";
import api from "../../api";
import { useLocation, useParams } from "react-router-dom";
import { VisitType } from "../../types/enums";

interface ScheduleFormProps {
  title: string;
  handleDateChange: (date: string | Moment) => void;
  handleTimeChange: (time: string | Moment) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
  selectedDate: Date;
  selectedTime: Date;
  visitType: VisitType;
}

export const ScheduleForm = ({
  title,
  handleDateChange,
  handleTimeChange,
  handleSubmit,
  isLoading,
  selectedDate,
  selectedTime,
  visitType,
}: ScheduleFormProps) => {
  const [isDateValid, setDateValid] = useState<boolean>(false);
  const [isTimeValid, setTimeValid] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const location = useLocation();
  const [application, setApplication] = useState(location.state?.application);
  const [isLoadingApplication, setIsLoadingApplication] =
    useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    setIsDisabled(!isDateValid || !isTimeValid || isLoading);
  }, [isDateValid, isTimeValid, isLoading]);

  const validateDateTime = (date: string | Moment, time: string | Moment) => {
    const dateMoment = typeof date === "string" ? moment(date) : date;
    const timeMoment = typeof time === "string" ? moment(time) : time;

    const emailSentTimestamp =
      visitType === VisitType.Home
        ? application.homeVisitEmailSentDate
        : application.shelterVisitEmailSentDate;
    const emailSentTime = moment(emailSentTimestamp);
    const oneWeekFromEmailSent = emailSentTime
      .clone()
      .add(7, "days")
      .endOf("day");
    const twentyFourHoursFromEmailSent = emailSentTime.clone().add(24, "hours");

    const isDateValid =
      dateMoment.isAfter(emailSentTime) &&
      dateMoment.isBefore(oneWeekFromEmailSent);
    const isTimeValid = dateMoment.isSame(emailSentTime, "day")
      ? timeMoment.isAfter(twentyFourHoursFromEmailSent)
      : true;

    return isDateValid && isTimeValid;
  };

  const handleDateChangeValidated = (date: string | Moment) => {
    if (validateDateTime(date, moment(selectedTime))) {
      setDateValid(true);
      setTimeValid(true);
    } else {
      setDateValid(false);
    }
    handleDateChange(date);
  };

  const handleTimeChangeValidated = (time: string | Moment) => {
    if (validateDateTime(moment(selectedDate), time)) {
      setDateValid(true);
      setTimeValid(true);
    } else {
      setTimeValid(false);
    }
    handleTimeChange(time);
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoadingApplication(true);
        const endpoint =
          visitType === VisitType.Home
            ? "/application/"
            : "/shelter/application/";
        const response = await api.get(endpoint, {
          params: {
            id: id,
          },
        });
        setApplication(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingApplication(false);
      }
    };

    if (id && !application) {
      fetchApplication();
    }
  }, [id, application]);
  console.log(application);
  const visitScheduled =
    application &&
    ((visitType === VisitType.Home && application.homeVisitDate) ||
      (visitType === VisitType.Shelter && application.shelterVisitDate));
  console.log(visitScheduled);

  if (isLoadingApplication) {
    return (
      <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      </div>
    );
  } else if (visitScheduled) {
    return (
      <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
          <h2 className="mt-12 text-center text-4xl font-extrabold text-primary mb-12">
            {title}
          </h2>
          <p className="text-gray-700 text-xl font-medium text-center">
            The visit for this application has already been scheduled.
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
          <h2 className="mt-12 text-center text-4xl font-extrabold text-primary mb-12">
            {title}
          </h2>
          <p className="text-gray-700 text-xl font-medium text-center">
            Schedule a visit within the next week
          </p>
          <form
            className="mx-auto sm:w-2/3 md:w-1/2 lg:w-1/3 2xl:w-1/4 space-y-8 mt-8 flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="-space-y-px">
              <label
                className="text-gray-700 text-xl font-medium"
                htmlFor="date"
              >
                Date:
              </label>
              <Datetime
                value={selectedDate}
                onChange={handleDateChangeValidated}
                timeFormat={false} // don't need time selection
                closeOnSelect
                inputProps={{ id: "date" }}
                isValidDate={(current) => {
                  const today = moment().startOf("day");
                  const nextWeek = moment().add(7, "days").endOf("day");
                  const isValid =
                    current.isAfter(today) && current.isBefore(nextWeek);
                  return isValid;
                }}
                className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm cursor-pointer bg-white"
              />
            </div>
            <div className="-space-y-px">
              <label
                className="text-gray-700 text-xl font-medium"
                htmlFor="time"
              >
                Time:
              </label>
              <Datetime
                value={selectedTime}
                onChange={handleTimeChangeValidated}
                dateFormat={false} // don't need date selection
                closeOnSelect
                inputProps={{ id: "time" }}
                className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm cursor-pointer bg-white"
              />
            </div>
            <button
              className={`group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary ${
                isLoading ? "bg-primary text-white cursor-not-allowed" : ""
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={isDisabled}
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Schedule Visit
            </button>
          </form>
        </div>
      </div>
    );
  }
};
