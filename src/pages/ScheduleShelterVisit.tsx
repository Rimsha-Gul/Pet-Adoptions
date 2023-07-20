import { ScheduleForm } from "../components/SchedulingComponents/scheduleVisitForm";
import { useScheduleHomeVisit } from "../hooks/useScheduleVisit";
import { VisitType } from "../types/enums";

const ScheduleShelterVisit = () => {
  const {
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    isLoading,
    selectedDate,
    selectedTime,
  } = useScheduleHomeVisit(VisitType.Shelter);

  return (
    <ScheduleForm
      title="Schedule Shelter Visit"
      handleDateChange={handleDateChange}
      handleTimeChange={handleTimeChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
    />
  );
};
export default ScheduleShelterVisit;
