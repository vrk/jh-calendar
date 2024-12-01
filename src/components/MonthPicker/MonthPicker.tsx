import * as React from 'react';
import style from './MonthPicker.module.css';
import { CalendarContext } from '../CalendarContextProvider/CalendarContextProvider';
import { getTodaysYearMonthInfo, getYearMonthString } from '@/helpers/calendar-helpers';

function MonthPicker() {
  const { yearMonthInfo, calendarFunctions } = React.useContext(CalendarContext);
  const [ currentSpreadMonthDate, setCurrentSpreadMonthDate ] = React.useState("");
  React.useEffect(() => {
    console.log(yearMonthInfo);
    setCurrentSpreadMonthDate(getYearMonthString(yearMonthInfo));
  }, [yearMonthInfo]);

  return <div className={style.container}>
    <input type="month" value={currentSpreadMonthDate} onChange={(event) => {
      if (event.target.value && event.target.value.length === 7) {
        calendarFunctions.setYearMonth(event.target.value);
      } else {
        calendarFunctions.setYearMonth(getYearMonthString(getTodaysYearMonthInfo()));
      }
    }}/>
  </div>;
}

export default MonthPicker;
