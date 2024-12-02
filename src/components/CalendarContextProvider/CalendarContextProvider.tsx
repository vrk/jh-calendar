"use client";
import {
  ClipPathInfo,
  CroppedPhotoMetadata,
  FullCroppedPhotoInfo,
  FullImage,
  ValidDate,
  YearMonthInfo,
} from "@/helpers/calendar-data-types";
import { getTodaysYearMonthInfo, getYearMonthInfo } from "@/helpers/calendar-helpers";
import { loadYearMonthInfo, saveYearMonthInfo } from "@/helpers/indexeddb";
import React from "react";

type CalendarFunctions = {
  setPhotoForDate: (
      date: ValidDate,
      photoInfo: FullCroppedPhotoInfo
  ) => void;
  getCroppedPhotoInfoForDate: (date: ValidDate) => CroppedPhotoMetadata | null;
  removePhotoForDate: (date: ValidDate) => void;

  setYearMonth: (yearMonth: string) => void;

  clearCalendar: () => void;
};

type CalendarContextProvider = {
  loadedStatus: LoadedStatus;
  yearMonthInfo: YearMonthInfo;
  croppedDateImages: Map<ValidDate, HTMLImageElement>;

  calendarFunctions: CalendarFunctions;
};

export enum LoadedStatus {
  Uninitialized,
  Loading,
  Loaded,
}

export const CalendarContext = React.createContext<CalendarContextProvider>({
  loadedStatus: LoadedStatus.Uninitialized,
  yearMonthInfo: getTodaysYearMonthInfo(),
  croppedDateImages: new Map<ValidDate, HTMLImageElement>(),
  calendarFunctions: {
    setPhotoForDate: function (date: ValidDate, photoInfo: FullCroppedPhotoInfo): void {
      throw new Error("Function not implemented.");
    },
    getCroppedPhotoInfoForDate: function (date: ValidDate): CroppedPhotoMetadata | null {
      throw new Error("Function not implemented.");
    },
    removePhotoForDate: function (date: ValidDate): void {
      throw new Error("Function not implemented.");
    },
    setYearMonth: function (yearMonth: string): void {
      throw new Error("Function not implemented.");
    },
    clearCalendar: function (): void {
      throw new Error("Function not implemented.");
    }
  },
});

const CalendarContextProvider = ({ children }: React.PropsWithChildren) => {
  const [loadedStatus, setLoadedStatus] = React.useState(
    LoadedStatus.Uninitialized
  );
  const loadedInfo = loadYearMonthInfo();
  const [yearMonthInfo, setYearMonthInfoState] = React.useState(
    loadedInfo ? loadedInfo : getTodaysYearMonthInfo()
  );

  const [croppedDateImages, setCroppedDateImages] = React.useState(
    new Map<ValidDate, HTMLImageElement>()
  );

  console.log('creating new map');

  const calendarFunctions: CalendarFunctions = {
    setPhotoForDate: function (
      date: ValidDate,
      fullCroppedPhotoInfo: FullCroppedPhotoInfo
    ): void {
      const newMap = new Map(croppedDateImages).set(date, fullCroppedPhotoInfo.croppedImage);
      setCroppedDateImages(newMap);
    },
    getCroppedPhotoInfoForDate: function (
      date: ValidDate
    ): CroppedPhotoMetadata | null {
      throw new Error("Function not implemented.");
    },
    removePhotoForDate: function (date: ValidDate): void {
      throw new Error("Function not implemented.");
    },
    setYearMonth: function (yearMonth: string): void {
      saveYearMonthInfo(yearMonth);
      setYearMonthInfoState(getYearMonthInfo(yearMonth));
    },
    clearCalendar: function (): void {
      throw new Error("Function not implemented.");
    },
  };

  const initializeContext = async () => {

  };

  React.useEffect(() => {
    setLoadedStatus(LoadedStatus.Loading);
    initializeContext().then(() => {
      setLoadedStatus(LoadedStatus.Loaded);
    });
  }, []);
  return (
    <CalendarContext.Provider
      value={{
        loadedStatus,
        yearMonthInfo,
        croppedDateImages,
        calendarFunctions,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
