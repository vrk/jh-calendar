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
  getImageFromFile,
  PhotoSelectionType,
} from "@/helpers/file-input";

const STATIC_CONTENT_ID = "static-conten";

function CalendarView() {
  const { yearMonthInfo } = React.useContext(CalendarContext);
  const svgRoot = React.useRef<SVGSVGElement>(null);
  const totalRoot = React.useRef<HTMLDivElement>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState<HTMLImageElement|null>(null);

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
    setIsCropDialogOpen(true);
    const files = await getFileFromFilePicker(PhotoSelectionType.Single);
    console.log(files);
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const loadedData = await getImageFromFile(file);
    setImageToCrop(loadedData.imageElement);
    console.log('setting new image elemen');
  };
  return (
    <div className={style.container} ref={totalRoot}>
      <CropModal
        isOpen={isCropDialogOpen}
        onConfirm={() => {}}
        onOpenChange={(isOpen) => {
          setIsCropDialogOpen(isOpen);
        }}
        imageToCrop={imageToCrop}
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
