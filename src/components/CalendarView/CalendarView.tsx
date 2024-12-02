import * as React from "react";
import style from "./CalendarView.module.css";
import { CalendarContext } from "../CalendarContextProvider/CalendarContextProvider";
import {
  createCousinCalendarSvg,
  HobonichiCousinClickableDate,
} from "@/helpers/hobonichi-generator";
import { getYearMonthString } from "@/helpers/calendar-helpers";
import { getDaysInMonth } from "date-fns";
import CropModal from "../CropModal";
import {
  getFileFromFilePicker as getFileFromFilePicker,
  getRawImageDataFromFile,
  PhotoSelectionType,
} from "@/helpers/file-input";

const STATIC_CONTENT_ID = "static-conten";

function CalendarView() {
  const { yearMonthInfo } = React.useContext(CalendarContext);
  const svgRoot = React.useRef<SVGSVGElement>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!svgRoot.current) {
      return;
    }
    const staticContents = createCousinCalendarSvg(
      svgRoot.current,
      getYearMonthString(yearMonthInfo)
    );
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
  const numberDaysInMonth = getDaysInMonth(yearMonthInfo.firstDateOfMonth);
  const daysInMonth = [];
  for (let i = 1; i <= numberDaysInMonth; i++) {
    daysInMonth.push(i);
  }

  const getFileForDay = async (dayInMonth: number) => {
    const files = await getFileFromFilePicker(PhotoSelectionType.Single);
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const rawImageData = await getRawImageDataFromFile(file);
    setIsCropDialogOpen(true);
  };
  return (
    <div className={style.container}>
      <CropModal
        isOpen={isCropDialogOpen}
        onConfirm={() => {}}
        onOpenChange={(isOpen) => {
          setIsCropDialogOpen(isOpen);
        }}
      ></CropModal>
      <div className={style.svgContainer}>
        <svg ref={svgRoot}>
          {daysInMonth.map((dayInMonth) => (
            <HobonichiCousinClickableDate
              key={dayInMonth}
              dayInMonth={dayInMonth}
              yearMonthInfo={yearMonthInfo}
              onClick={() => {
                getFileForDay(dayInMonth);
              }}
            ></HobonichiCousinClickableDate>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default CalendarView;
