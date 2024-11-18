export const validateRegistrationNumber = (regNo: string): { isValid: boolean; error?: string } => {
  // Pattern: YYBBBNNNNN where:
  // YY - Year (2 digits)
  // BBB - Branch code (3 letters)
  // NNNNN - 5 digit unique number
  const pattern = /^(\d{2})[A-Z]{3}\d{5}$/;
  
  if (!pattern.test(regNo)) {
    return {
      isValid: false,
      error: "Registration number must follow the pattern: YY-BBB-NNNNN"
    };
  }

  // Extract year from registration number
  const year = parseInt(regNo.substring(0, 2));
  const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
  
  // Check if year is valid (not in future and not too old)
  if (year > currentYear || year < currentYear - 4) {
    return {
      isValid: false,
      error: "Invalid year in registration number. Year should be between last 4 years and current year."
    };
  }

  return { isValid: true };
};
