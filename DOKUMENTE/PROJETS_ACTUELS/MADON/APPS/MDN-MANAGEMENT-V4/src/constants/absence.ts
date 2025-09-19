export const ABSENCE_TYPES = {
  vacation: 'Congés payés',
  sick: 'Maladie',
  personal: 'Personnel',
  other: 'Autre'
} as const;

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800'
} as const;

export const ANNUAL_LEAVE_DAYS = 30; 