import { FormEvent, useState } from "react";
import moment, { Moment } from "moment";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";
import { VisitType } from "../types/enums";

export const useScheduleHomeVisit = (visitType: VisitType) => {
  const { applicationID } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    moment().add(1, "days").toDate()
  );
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleDateChange = (date: string | Moment) => {
    if (moment.isMoment(date)) setSelectedDate(date.toDate());
  };

  const handleTimeChange = (time: string | Moment) => {
    if (moment.isMoment(time)) setSelectedTime(time.toDate());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const dateStr = moment(selectedDate).format("YYYY-MM-DD");
    const timeStr = moment(selectedTime).format("HH:mm");
    const dateTimeStr = `${dateStr}T${timeStr}`;
    const dateTimeInUTC = moment(dateTimeStr).utc().format();

    try {
      setIsLoading(true);
      const endpoint =
        visitType === VisitType.Home
          ? `/applications/${applicationID}/homeVisit`
          : `/applications/${applicationID}/shelterVisit`;
      const response = await api.post(endpoint, {
        visitDate: dateTimeInUTC,
      });
      showSuccessAlert(response.data.message, undefined, () =>
        navigate(`/view/application/${applicationID}`)
      );
    } catch (error: any) {
      console.error("Error scheduling visit:", error);
      showErrorAlert(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    isLoading,
    selectedDate,
    selectedTime,
  };
};
