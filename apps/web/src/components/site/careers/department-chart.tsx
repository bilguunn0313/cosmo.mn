import { getTranslations } from "next-intl/server";
import { DEPARTMENT_KEYS, HR_FACTS, totalEmployees } from "@/lib/hr-facts";
import { GrowBar } from "./grow-bar";

const HIGHLIGHTED_DEPARTMENTS = 2;

export async function DepartmentChart() {
  const t = await getTranslations("careers");
  const headcounts = HR_FACTS.departmentHeadcounts;
  const totalPeople = totalEmployees();
  const largest = Math.max(...DEPARTMENT_KEYS.map((key) => headcounts[key]));

  return (
    <section
      aria-labelledby="structure-title"
      className="site-container grid gap-10 pt-20 md:pt-36 lg:grid-cols-12 lg:gap-x-6"
    >
      <div className="grid content-start gap-5 lg:sticky lg:top-30 lg:col-span-4 lg:self-start">
        <h2 id="structure-title" className="type-h2">
          {t("structureTitle", {
            departments: DEPARTMENT_KEYS.length,
            people: totalPeople,
          })}
        </h2>
        <p className="max-w-95 text-base leading-relaxed text-ink-2">
          {t("structureText")}
        </p>
      </div>

      <ul className="grid gap-1 pt-3 lg:col-span-7 lg:col-start-6">
        {DEPARTMENT_KEYS.map((key, index) => (
          <li
            key={key}
            className="grid grid-cols-[minmax(0,1fr)_48px] items-center gap-x-5 gap-y-2 py-3 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_56px]"
          >
            <span className="text-base font-semibold">
              {t(`departments.${key}`)}
            </span>
            <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
              <GrowBar
                percent={(headcounts[key] / largest) * 100}
                className={
                  index < HIGHLIGHTED_DEPARTMENTS ? "bg-brand" : "bg-ink"
                }
              />
            </span>
            <span className="col-start-2 row-start-1 text-right text-lg font-semibold tabular-nums sm:col-start-auto sm:row-start-auto">
              {headcounts[key]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
