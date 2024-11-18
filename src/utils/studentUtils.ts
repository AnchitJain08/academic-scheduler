interface ParsedRegistration {
  joiningYear: number;
  branch: string;
  uniqueId: string;
  currentYear: number;
}

const BRANCH_CODES: { [key: string]: string } = {
  'BCE': 'B.Tech Computer Engineering',
  'BCS': 'B.Tech Computer Science',
  'BEC': 'B.Tech Electronics and Communication',
  'BEE': 'B.Tech Electrical and Electronics',
  'BME': 'B.Tech Mechanical Engineering',
  'BCV': 'B.Tech Civil Engineering',
  'BAI': 'B.Tech Artificial Intelligence',
  'BIT': 'B.Tech Information Technology',
  // Add more branch codes as needed
};

export const parseRegistrationNumber = (regNo: string): ParsedRegistration | null => {
  // Check if the registration number matches the expected format
  const regex = /^(\d{2})(B[A-Z]{2})\d{5}$/;
  const match = regNo.match(regex);

  if (!match) return null;

  const [_, yearCode, branchCode] = match;
  const joiningYear = 2000 + parseInt(yearCode);
  const currentYear = new Date().getFullYear() - joiningYear + 1;

  return {
    joiningYear,
    branch: BRANCH_CODES[branchCode] || 'Unknown Branch',
    uniqueId: regNo.slice(-5),
    currentYear: Math.min(Math.max(currentYear, 1), 4) // Ensure year is between 1 and 4
  };
};

export const getCurrentAcademicYear = (joiningYear: number): string => {
  const currentYear = new Date().getFullYear() - joiningYear + 1;
  const yearSuffix = getYearSuffix(currentYear);
  return `${currentYear}${yearSuffix} Year`;
};

const getYearSuffix = (year: number): string => {
  switch (year) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};
