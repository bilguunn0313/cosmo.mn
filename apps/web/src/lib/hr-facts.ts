import { JOB_DEPARTMENTS, type JobDepartment } from "@cosmo/shared";

export const DEPARTMENT_KEYS = JOB_DEPARTMENTS;

export type DepartmentKey = JobDepartment;

export const HR_FACTS = {
  womenPercent: 34,
  departmentHeadcounts: {
    warehouse: 48,
    sales: 31,
    administration: 21,
    finance: 11,
    management: 5,
    businessDevelopment: 5,
    marketing: 5,
    it: 4,
  } satisfies Record<DepartmentKey, number>,
};

export function totalEmployees() {
  return DEPARTMENT_KEYS.reduce(
    (sum, key) => sum + HR_FACTS.departmentHeadcounts[key],
    0,
  );
}
