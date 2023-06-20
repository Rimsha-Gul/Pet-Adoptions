export function formatAge(birthDate: string) {
  const updatedBirthDate = new Date(birthDate);
  const now = new Date();

  let years = now.getFullYear() - updatedBirthDate.getFullYear();
  let months = now.getMonth() - updatedBirthDate.getMonth();
  let days = now.getDate() - updatedBirthDate.getDate();

  // Normalize year and month
  if (days < 0) {
    months--;
    days += new Date(
      updatedBirthDate.getFullYear(),
      updatedBirthDate.getMonth() + 1,
      0
    ).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const ageInYears = years;
  const ageInMonths = years * 12 + months;

  if (ageInYears == 1) {
    return `${ageInYears} year old`;
  } else if (ageInYears > 1) {
    return `${ageInYears} years old`;
  } else if (ageInMonths > 1) {
    return `${ageInMonths} months old`;
  } else {
    return "Less than 1 month old";
  }
}
