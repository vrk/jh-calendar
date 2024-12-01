import * as React from 'react';
import style from './MonthPicker.module.css';
import { CalendarContext } from '../CalendarContextProvider/CalendarContextProvider';
import { getYearMonthString } from '@/helpers/calendar-helpers';

function MonthPicker() {
  const { yearMonthInfo, calendarFunctions } = React.useContext(CalendarContext);
  const [ currentSpreadMonthDate, setCurrentSpreadMonthDate ] = React.useState("");
  React.useEffect(() => {
    setCurrentSpreadMonthDate(getYearMonthString(yearMonthInfo));
  }, [yearMonthInfo]);

  return <div className={style.container}>
    <input type="month" value={currentSpreadMonthDate} onChange={(event) => {
      calendarFunctions.setYearMonth(event.target.value);
    }}/>
  </div>;
}

export default MonthPicker;
