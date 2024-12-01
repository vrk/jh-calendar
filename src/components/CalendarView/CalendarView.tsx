import * as React from "react";
import style from "./CalendarView.module.css";
import { CalendarContext } from "../CalendarContextProvider/CalendarContextProvider";
import { createCousinCalendarSvg } from "@/helpers/hobonichi-generator";
import { getYearMonthString } from "@/helpers/calendar-helpers";

function CalendarView() {
  const { yearMonthInfo } = React.useContext(CalendarContext);
  const svgContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!svgContainer.current) {
      return;
    }
    const box = createCousinCalendarSvg(getYearMonthString(yearMonthInfo));
    svgContainer.current.append(box);
    return () => {
      if (!svgContainer.current) {
        return;
      }
      svgContainer.current.innerHTML = "";
    };
  }, [svgContainer, yearMonthInfo]);
  return (
    <div className={style.container}>
      <div className={style.svgContainer} ref={svgContainer}></div>;
    </div>
  );
}

export default CalendarView;
