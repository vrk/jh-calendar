import * as React from "react";
import style from "./CalendarView.module.css";
import { CalendarContext } from "../CalendarContextProvider/CalendarContextProvider";
import { createCousinCalendarSvg, ClickableDate } from "@/helpers/hobonichi-generator";
import { getYearMonthString } from "@/helpers/calendar-helpers";

const STATIC_CONTENT_ID = "static-conten";

function CalendarView() {
  const { yearMonthInfo } = React.useContext(CalendarContext);
  const svgRoot = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRoot.current) {
      return;
    }
    const staticContents = createCousinCalendarSvg(svgRoot.current, getYearMonthString(yearMonthInfo));
    staticContents.id = STATIC_CONTENT_ID;
    svgRoot.current.prepend(staticContents);
    return () => {
      if (!svgRoot.current) {
        return;
      }
      const added = svgRoot.current.querySelector(`#${STATIC_CONTENT_ID}`);
      added?.remove();
    };
  }, [svgRoot, yearMonthInfo]);
  return (
    <div className={style.container}>
      <div className={style.svgContainer}>
        <svg ref={svgRoot}>
          <ClickableDate dayInMonth={1} yearMonthInfo={yearMonthInfo}></ClickableDate>
        </svg>
      </div>;
    </div>
  );
}

export default CalendarView;
