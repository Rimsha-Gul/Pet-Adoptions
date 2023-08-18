import { FormEvent, useState } from "react";
import moment, { Moment } from "moment";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccessAlert } from "../utils/alert";
import { VisitType } from "../types/enums";

export const useScheduleHomeVisit = (visitType: VisitType) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(moment().toDate());
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
          ? "/application/scheduleHomeVisit"
          : "/application/scheduleShelterVisit";
      const response = await api.post(endpoint, {
        visitDate: dateTimeInUTC,
        id: id,
      });
      showSuccessAlert(response.data.message, undefined, () =>
        navigate(`/view/application/${id}`)
      );
    } catch (error) {
      console.error("Error scheduling visit:", error);
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
