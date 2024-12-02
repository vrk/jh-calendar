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
  getFabricImageFromElement,
  getFabricImageFromFile,
  getFileFromFilePicker as getFileFromFilePicker,
  PhotoSelectionType,
} from "@/helpers/file-input";
import {
  ClipPathInfo,
  CroppedPhotoMetadata,
  FullPhotoInfo,
  ValidDate,
} from "@/helpers/calendar-data-types";
import { FabricImage } from "fabric";

const STATIC_CONTENT_ID = "static-conten";

function CalendarView() {
  const { yearMonthInfo, calendarFunctions, croppedImagesByDateMap } =
    React.useContext(CalendarContext);
  const svgRoot = React.useRef<SVGSVGElement>(null);
  const totalRoot = React.useRef<HTMLDivElement>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = React.useState(false);
  const [startingCropMetadata, setStartingCropMetadata] =
    React.useState<CroppedPhotoMetadata | null>(null);
  const [imageToCrop, setImageToCrop] = React.useState<FabricImage | null>(
    null
  );
  const [selectedDayNumber, setSelectedDayNumber] = React.useState<
    number | null
  >(null);

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
  const daysInMonth: Array<ValidDate> = [];
  for (let i = 1; i <= numberDaysInMonth; i++) {
    daysInMonth.push(i as ValidDate);
  }

  const getFileForDay = async (dayInMonth: ValidDate) => {
    setIsCropDialogOpen(true);

    const fullInfo = await calendarFunctions.getFullCroppedPhotoInfoForDate(
      dayInMonth
    );
    const cropped = croppedImagesByDateMap.get(dayInMonth);

    if (fullInfo && cropped) {
      const fabricImage = await getFabricImageFromElement(fullInfo.fullImage);
      setImageToCrop(fabricImage);
      setStartingCropMetadata(cropped.metadata);
    } else {
      const files = await getFileFromFilePicker(PhotoSelectionType.Single);
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      const fabricImage = await getFabricImageFromFile(file);
      setImageToCrop(fabricImage);
    }
    setSelectedDayNumber(dayInMonth);
  };

  return (
    <div className={style.container} ref={totalRoot}>
      <CropModal
        isOpen={isCropDialogOpen}
        dateNumber={selectedDayNumber}
        yearMonthInfo={yearMonthInfo}
        startingCropMetadata={startingCropMetadata}
        onConfirm={(croppedImage, croppedPhotoMetadata) => {
          if (!selectedDayNumber || !imageToCrop) {
            return;
          }
          calendarFunctions.setPhotoForDate(
            selectedDayNumber as ValidDate,
            croppedImage,
            croppedPhotoMetadata
          );
          calendarFunctions.saveFullPhotoForDate(
            selectedDayNumber as ValidDate,
            imageToCrop._element as HTMLImageElement
          );
        }}
        onOpenChange={(isOpen) => {
          setIsCropDialogOpen(isOpen);
          if (!isOpen) {
            setImageToCrop(null);
            setSelectedDayNumber(null);
            setStartingCropMetadata(null);
          }
        }}
        imageToCrop={imageToCrop}
      ></CropModal>
      <div className={style.svgContainer}>
        <svg ref={svgRoot}>
          {daysInMonth.map((today) => {
            const loaded = croppedImagesByDateMap.get(today);
            return (
              <HobonichiCousinClickableDate
                key={today}
                dayInMonth={today}
                yearMonthInfo={yearMonthInfo}
                croppedImage={loaded?.croppedImage}
                metadata={loaded?.metadata}
                onClick={() => {
                  getFileForDay(today as ValidDate);
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
