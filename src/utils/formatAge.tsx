export function formatAge(birthDate: string) {
  const updatedbirthDate = new Date(birthDate);
  const ageInMilliseconds = Date.now() - updatedbirthDate.getTime();
  const ageDate = new Date(ageInMilliseconds);
  const ageInYears = Math.abs(ageDate.getUTCFullYear() - 1970);
  const ageInMonths = Math.floor(
    ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44)
  );

  if (ageInYears > 1) {
    return `${ageInYears} years old`;
  } else if (ageInMonths > 1) {
    return `${ageInMonths} months old`;
  } else {
    return "Less than 1 month old";
  }
}
