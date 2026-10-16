export const DEPARTMENT_KEYS = [
  "warehouse",
  "sales",
  "administration",
  "finance",
  "management",
  "businessDevelopment",
  "marketing",
  "it",
] as const;

export type DepartmentKey = (typeof DEPARTMENT_KEYS)[number];

export const HR_FACTS = {
  averageTenureYears: 6.1,
  averageAge: 36.7,
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
  jobChannels: {
    zangia: "https://www.zangia.mn",
    unegui: "https://www.unegui.mn",
  },
};

export function totalEmployees() {
  return DEPARTMENT_KEYS.reduce(
    (sum, key) => sum + HR_FACTS.departmentHeadcounts[key],
    0,
  );
}
