import * as React from "react";
import style from "./CalendarView.module.css";
import { CalendarContext } from "../CalendarContextProvider/CalendarContextProvider";
import { createCousinCalendarSvg } from "@/helpers/hobonichi-generator";
import { getYearMonthString } from "@/helpers/calendar-helpers";

function CalendarView() {
  const { yearMonthInfo } = React.useContext(CalendarContext);
  const overallContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!overallContainer.current) {
      return;
    }
    const box = createCousinCalendarSvg(getYearMonthString(yearMonthInfo));
    overallContainer.current.append(box);
    return () => {
      if (!overallContainer.current) {
        return;
      }
      overallContainer.current.innerHTML = "";
    };
  }, [overallContainer, yearMonthInfo]);
  return <div className={style.container} ref={overallContainer}></div>;
}

export default CalendarView;
