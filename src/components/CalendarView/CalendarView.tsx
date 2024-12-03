import * as React from "react";
import style from "./CalendarView.module.css";
import { CalendarContext } from "../CalendarContextProvider/CalendarContextProvider";
import {
  createCousinCalendarSvg,
  HobonichiCousinClickableDate,
} from "@/helpers/hobonichi-generator";
import { getYearMonthString } from "@/helpers/calendar-helpers";
import { getDaysInMonth, setDay } from "date-fns";
import CropModal from "../CropModal";
import {
  getFabricImageFromFile,
  getFileFromFilePicker as getFileFromFilePicker,
  PhotoSelectionType,
} from "@/helpers/file-input";
import { FullCroppedPhotoInfo, ValidDate } from "@/helpers/calendar-data-types";
import { FabricImage } from "fabric";

const STATIC_CONTENT_ID = "static-conten";

function CalendarView() {
  const { yearMonthInfo, calendarFunctions } =
    React.useContext(CalendarContext);
  const svgRoot = React.useRef<SVGSVGElement>(null);
  const totalRoot = React.useRef<HTMLDivElement>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState<FabricImage | null>(
    null
  );
  const [selectedDayNumber, setSelectedDayNumber] = React.useState<
    number | null
  >(null);

  const [loadedImagesCache, setLoadedImagesCache] = React.useState(
    new Map<number, FullCroppedPhotoInfo>()
  );

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
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const fabricImage = await getFabricImageFromFile(file);
    setImageToCrop(fabricImage);
    setSelectedDayNumber(dayInMonth);
  };

  return (
    <div className={style.container} ref={totalRoot}>
      <CropModal
        isOpen={isCropDialogOpen}
        dateNumber={selectedDayNumber}
        yearMonthInfo={yearMonthInfo}
        onConfirm={(croppedImage, croppedPhotoMetadata) => {
          if (!selectedDayNumber || !imageToCrop) {
            return;
          }
          const fullCroppedPhotoInfo: FullCroppedPhotoInfo = {
            fullImage: imageToCrop._element as HTMLImageElement,
            croppedImage: croppedImage,
            metadata: croppedPhotoMetadata,
          };
          calendarFunctions.setPhotoForDate(
            selectedDayNumber as ValidDate,
            fullCroppedPhotoInfo
          );
          setLoadedImagesCache(
            new Map(loadedImagesCache).set(
              selectedDayNumber,
              fullCroppedPhotoInfo
            )
          );
          console.log(loadedImagesCache);
        }}
        onOpenChange={(isOpen) => {
          setIsCropDialogOpen(isOpen);
          if (!isOpen) {
            setImageToCrop(null);
            setSelectedDayNumber(null);
          }
        }}
        imageToCrop={imageToCrop}
      ></CropModal>
      <div className={style.svgContainer}>
        <svg ref={svgRoot}>
          {daysInMonth.map((today) => {
            const loaded = loadedImagesCache.get(today);
            console.log("rerendering");

            return (
              <HobonichiCousinClickableDate
                key={today}
                dayInMonth={today}
                yearMonthInfo={yearMonthInfo}
                fullCroppedPhotoInfo={loaded ? { ...loaded } : null}
                onClick={() => {
                  getFileForDay(today);
                }}
              ></HobonichiCousinClickableDate>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default CalendarView;
