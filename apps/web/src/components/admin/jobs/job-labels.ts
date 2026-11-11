import type { EmploymentType, JobDepartment, JobStage } from "@cosmo/shared";

export const DEPARTMENT_LABELS: Record<JobDepartment, string> = {
  warehouse: "Агуулах, түгээлтийн алба",
  sales: "Борлуулалтын алба",
  administration: "Захиргаа, хүний нөөцийн алба",
  finance: "Санхүү, бүртгэлийн алба",
  management: "Удирдлага",
  businessDevelopment: "Бизнес хөгжлийн алба",
  marketing: "Маркетингийн алба",
  it: "Мэдээлэл, технологийн алба",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Бүтэн цаг",
  PART_TIME: "Хагас цаг",
  SHIFT: "Ээлжийн ажил",
  CONTRACT: "Гэрээт",
  INTERNSHIP: "Дадлага",
};

export const STAGE_LABELS: Record<JobStage, string> = {
  OPEN: "1. Анкет авч байна",
  INTERVIEW: "2. Ярилцлага",
  DECIDED: "3. Шийдвэр гарсан",
};
