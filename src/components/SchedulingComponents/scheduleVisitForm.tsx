import Datetime from "react-datetime";
import moment, { Moment } from "moment";
import loadingIcon from "../../assets/loading.gif";
import { useEffect, useState } from "react";
import api from "../../api";
import { useParams } from "react-router-dom";
import { Status, VisitType } from "../../types/enums";
import { Application } from "../../types/interfaces";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import Select from "react-select";

interface ScheduleFormProps {
  title: string;
  handleDateChange: (date: string | Moment) => void;
  handleTimeChange: (time: string | Moment) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
  selectedDate: Date;
  selectedTime: Date | null;
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
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #ff5363" : "1px solid #9ca3af",
      borderRadius: "0.375rem",
      backgroundColor: "#fff",
      padding: "0.5rem",
      cursor: "pointer",
      "&:hover": {
        border: "1px solid #ff5363",
      },
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#ff5363" : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      padding: "0.5rem",
      "&:hover": {
        backgroundColor: "#fb7a75",
        color: "#fff",
        cursor: "pointer",
      },
    }),
  };

  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isDateValid, setDateValid] = useState<boolean>(true);
  const [isTimeValid, setTimeValid] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [canSchedule, setCanSchedule] = useState<boolean>(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] =
    useState<boolean>(true);
  const { id } = useParams();
  const emailSentTimestamp =
    visitType === VisitType.Home
      ? application?.homeVisitEmailSentDate
      : application?.shelterVisitEmailSentDate;
  const emailSentTime = moment(emailSentTimestamp);

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
        setApplication(response.data.application);
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

  useEffect(() => {
    // Get the current date and time
    const now = moment();

    // Set to the next day
    const initialSelectedDate = now.add(1, "days");

    // Make sure the date is set to start of day to avoid time conflicts
    initialSelectedDate.startOf("day");

    // Update the state with the new initialSelectedDate
    handleDateChange(initialSelectedDate);
    handleDateChangeValidated(initialSelectedDate);
  }, []);

  useEffect(() => {
    if (isDateValid && application) {
      const fetchTimeSlots = async () => {
        try {
          setIsLoadingTimeSlots(true);
          const response = await api.get("/application/timeSlots", {
            params: {
              id: application.shelterID,
              petID: application.microchipID,
              visitDate: moment(selectedDate).format("YYYY-MM-DD"),
              visitType: visitType,
            },
          });
          console.log(response.data);
          setTimeSlots(response.data.availableTimeSlots);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingTimeSlots(false);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedDate, isDateValid, application]);

  useEffect(() => {
    const canScheduleYet =
      visitType === VisitType.Home
        ? Boolean(application?.status === Status.HomeVisitRequested)
        : Boolean(application?.status === Status.HomeApproved);
    setCanSchedule(canScheduleYet);
    console.log(canScheduleYet);
  }, [application]);

  useEffect(() => {
    setIsDisabled(!isDateValid || !isTimeValid || isLoading);
  }, [isDateValid, isTimeValid, isLoading]);

  const CustomDateInput = (props: any) => (
    <div className="flex flex-row">
      <input {...props} className="flex-grow" />
      <FaRegCalendarAlt color="#ff5363" size={16} className="mr-2" />
    </div>
  );

  const CustomTimeInput = (props: any) => (
    <div className="flex flex-row">
      <input {...props} className="flex-grow" />
      <BiTime color="#ff5363" size={20} className="mr-2" />
    </div>
  );

  const validateDateTime = (date: string | Moment, time: string | Moment) => {
    console.log(time);
    const dateMoment = typeof date === "string" ? moment(date) : date;
    const timeMoment = typeof time === "string" ? moment(time) : time;

    const oneWeekFromEmailSent = emailSentTime
      .clone()
      .add(7, "days")
      .endOf("day");

    const isDateValid =
      dateMoment.isAfter(emailSentTime) &&
      dateMoment.isBefore(oneWeekFromEmailSent);
    const isTimeValid = timeSlots.includes(timeMoment.toString());

    console.log("isDateValid", isDateValid);
    console.log("isTimeValid", isTimeValid);
    return isDateValid && isTimeValid;
  };

  const handleDateChangeValidated = (date: string | Moment) => {
    const isThisDateValid = validateDate(date);
    setDateValid(isThisDateValid);

    if (!isThisDateValid) {
      setTimeSlots([]); // Clear time slots if date is not valid
      setTimeValid(false); // Set time as invalid since the date is invalid
    }

    handleDateChange(date);
  };

  const validateDate = (date: string | Moment) => {
    const dateMoment = typeof date === "string" ? moment(date) : date;
    const oneWeekFromEmailSent = emailSentTime
      .clone()
      .add(7, "days")
      .endOf("day");

    return (
      dateMoment.isAfter(emailSentTime) &&
      dateMoment.isBefore(oneWeekFromEmailSent)
    );
  };

  const handleTimeChangeValidated = (time: string | Moment) => {
    const formattedTime =
      typeof time === "string" ? moment(time, "HH:mm") : time;
    const isThisTimeValid = validateTime(formattedTime);
    setTimeValid(isThisTimeValid);
    handleTimeChange(formattedTime);
  };

  const validateTime = (time: string | Moment) => {
    const timeMoment = typeof time === "string" ? moment(time) : time;
    console.log(time);
    console.log(timeSlots);
    return timeSlots.includes(timeMoment.format("H:mm"));
  };

  // console.log(application);
  const visitScheduled: boolean = application
    ? (visitType === VisitType.Home && Boolean(application.homeVisitDate)) ||
      (visitType === VisitType.Shelter && Boolean(application.shelterVisitDate))
    : false;

  //console.log(visitScheduled);
  const formattedTimeSlots = timeSlots.map((time) => ({
    label: time,
    value: time,
  }));
  console.log(isDisabled);
  console.log(timeSlots);
  console.log(timeSlots.length === 0 && isDateValid);

  if (isLoadingApplication) {
    return (
      <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
        <div className="flex items-center justify-center mb-8">
          <img src={loadingIcon} alt="Loading" className="h-10 w-10" />
        </div>
      </div>
    );
  } else if (!canSchedule && !visitScheduled) {
    return (
      <div className="bg-white mr-4 ml-4 md:ml-12 2xl:ml-12 2xl:mr-12 pt-24 pb-8">
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-12">
          <h2 className="mt-12 text-center text-4xl font-extrabold text-primary mb-12">
            {title}
          </h2>
          <p className="text-gray-700 text-xl font-medium text-center">
            You cannot schedule a visit for this application yet.
          </p>
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
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-red-50 rounded-lg shadow-md px-8 md:px-8 2xl:px-12 p-4 sm:p-12">
          <h2 className="mt-4 sm:mt-12 text-center text-3xl sm:text-4xl font-extrabold text-primary mb-12">
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
                renderInput={CustomDateInput}
                value={selectedDate}
                onChange={handleDateChangeValidated}
                timeFormat={false} // don't need time selection
                closeOnSelect
                inputProps={{ id: "date" }}
                isValidDate={(current) => {
                  const today = moment().startOf("day");
                  const tomorrow = moment().add(1, "days").startOf("day");
                  const emailSentDate = moment(emailSentTime).startOf("day");
                  const oneWeekAfterEmailSent = moment(emailSentDate)
                    .add(7, "days")
                    .endOf("day");

                  const isValidToday = today.isSameOrBefore(
                    oneWeekAfterEmailSent
                  );

                  if (!isValidToday) {
                    // If today's date is more than one week after the emailSentDate,
                    // no dates should be selectable
                    return false;
                  }

                  const isValid =
                    current.isSameOrAfter(tomorrow) &&
                    current.isSameOrAfter(emailSentDate) &&
                    current.isBefore(oneWeekAfterEmailSent);

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
              <Select
                className="w-56 sm:w-52"
                styles={customStyles}
                options={formattedTimeSlots}
                value={formattedTimeSlots.find(
                  (option) =>
                    option.value === (selectedTime && selectedTime.toString())
                )}
                onChange={(selectedOption: any) => {
                  handleTimeChangeValidated(selectedOption.value);
                }}
              />
              {/* <Datetime
                renderInput={CustomTimeInput}
                value={selectedTime}
                onChange={handleTimeChangeValidated}
                dateFormat={false} // don't need date selection
                closeOnSelect
                inputProps={{ id: "time" }}
                className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm cursor-pointer bg-white"
              /> */}
            </div>
            <button
              className={`group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary ${
                isLoading
                  ? "bg-primary text-white cursor-not-allowed items-center"
                  : ""
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={isDisabled}
            >
              {isLoading && (
                <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
              )}
              Schedule Visit
            </button>
            {timeSlots.length === 0 &&
            isDateValid &&
            !isLoading &&
            !isLoadingTimeSlots ? (
              <div className="text-lg text-red-600 mt-4">
                No slots are available for the selected date.
              </div>
            ) : null}
          </form>
        </div>
      </div>
    );
  }
};
