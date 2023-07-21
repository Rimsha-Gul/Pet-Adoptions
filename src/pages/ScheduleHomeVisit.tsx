import { ScheduleForm } from "../components/SchedulingComponents/scheduleVisitForm";
import { useScheduleHomeVisit } from "../hooks/useScheduleVisit";
import { VisitType } from "../types/enums";

const ScheduleHomeVisit = () => {
  const {
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    isLoading,
    selectedDate,
    selectedTime,
  } = useScheduleHomeVisit(VisitType.Home);

  return (
    <ScheduleForm
      title="Schedule Home Visit"
      handleDateChange={handleDateChange}
      handleTimeChange={handleTimeChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      visitType={VisitType.Home}
    />
  );
};
export default ScheduleHomeVisit;
