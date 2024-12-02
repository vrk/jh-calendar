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

// Starts at 0, so 0 => week 1
export function getWeekNumber(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  let offset = firstDayOfMonth.getDay() - 1;
  if (offset === -1) {
    offset = 6;
  }
  const zeroIndexedDate = date.getDate() - 1;
  const weekNumber = Math.floor((zeroIndexedDate + offset) / 7);
  return weekNumber;
}