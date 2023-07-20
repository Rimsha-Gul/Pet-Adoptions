import Datetime from "react-datetime";
import moment, { Moment } from "moment";
import loadingIcon from "../../assets/loading.gif";

interface ScheduleFormProps {
  title: string;
  handleDateChange: (date: string | Moment) => void;
  handleTimeChange: (time: string | Moment) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
  selectedDate: Date;
  selectedTime: Date;
}

export const ScheduleForm = ({
  title,
  handleDateChange,
  handleTimeChange,
  handleSubmit,
  isLoading,
  selectedDate,
  selectedTime,
}: ScheduleFormProps) => {
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
            <label className="text-gray-700 text-xl font-medium" htmlFor="date">
              Date:
            </label>
            <Datetime
              value={selectedDate}
              onChange={handleDateChange}
              timeFormat={false} // don't need time selection
              closeOnSelect
              inputProps={{ id: "date" }}
              isValidDate={(current) => {
                const today = moment();
                const nextWeek = moment().add(7, "days");
                return current.isAfter(today) && current.isBefore(nextWeek);
              }}
              className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm cursor-pointer bg-white"
            />
          </div>
          <div className="-space-y-px">
            <label className="text-gray-700 text-xl font-medium" htmlFor="time">
              Time:
            </label>
            <Datetime
              value={selectedTime}
              onChange={handleTimeChange}
              dateFormat={false} // don't need date selection
              closeOnSelect
              inputProps={{ id: "time" }}
              isValidDate={(current) => {
                return current.isBefore(moment());
              }}
              className="rounded-md appearance-none relative block w-full mt-2 px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 hover:outline-none hover:ring-primary hover:border-primary hover:z-10 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm cursor-pointer bg-white"
            />
          </div>
          <button
            className={`group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white hover:text-primary bg-primary hover:bg-white hover:ring-2 hover:ring-offset-2 hover:ring-primary ${
              isLoading ? "bg-primary text-white cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            {" "}
            {isLoading && (
              <img src={loadingIcon} alt="Loading" className="mr-2 h-4 w-4" />
            )}
            Schedule Visit
          </button>
        </form>
      </div>
    </div>
  );
};
