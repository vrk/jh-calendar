import { YearMonthInfo } from "./calendar-data-types";

export function getYearMonthInfo(yearMonth: string): YearMonthInfo {
  const [year, month] = yearMonth.split("-");
  const yearAsNum = parseInt(year);
  const monthAsNum = parseInt(month) - 1;
  const firstDateOfMonth = new Date(yearAsNum, monthAsNum, 1);
  return { calMonth: monthAsNum, calYear: yearAsNum, firstDateOfMonth };
}

export function getYearMonthString(yearMonthInfo: YearMonthInfo): string {
  return `${yearMonthInfo.calYear}-${(yearMonthInfo.calMonth + 1).toString().padStart(2, '0')}`
}

export function getTodaysYearMonthInfo(): YearMonthInfo {
  const today = new Date();
  const todaysYear = today.getFullYear();
  const todaysMonth = today.getMonth();
  return {
    calMonth: todaysMonth,
    calYear: todaysYear,
    firstDateOfMonth: new Date(todaysYear, todaysMonth, 1)
  }
}