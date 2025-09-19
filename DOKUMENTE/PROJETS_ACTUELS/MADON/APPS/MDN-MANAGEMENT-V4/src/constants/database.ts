export const DATABASE_TABLES = {
  EMPLOYEES: 'employees',
  PROJECTS: 'projects',
  SALES: 'sales',
  DELIVERIES: 'deliveries',
  STOCKS: 'stocks',
  FINANCES: 'finances',
  MARKETING: 'marketing_campaigns'
} as const;

export const DATABASE_VIEWS = {
  DASHBOARD_EMPLOYEE_STATUS: 'dashboard_employee_status',
  EMPLOYEE_SALARY_DETAILS: 'employee_salary_details',
  SALES_PERFORMANCE: 'sales_performance',
  DELIVERY_METRICS: 'delivery_metrics'
} as const; 