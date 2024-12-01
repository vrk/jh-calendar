"use client";
import {
  ClipPathInfo,
  DayToImageMap,
  FullCroppedPhotoInfo,
  FullImage,
  IdToFullImageMap,
  ResizedImage,
  ValidDate,
  YearMonthInfo,
} from "@/helpers/calendar-data-types";
import { getTodaysYearMonthInfo } from "@/helpers/calendar-helpers";
import React from "react";

type CalendarFunctions = {
  addFullImage: (data: string) => void;
  removeFullImage: (id: string) => void;

  setPhotoForDate: (
    date: ValidDate,
    fullImageId: string,
    clipPathInfo: ClipPathInfo,
    fullCroppedImageData: ImageData
  ) => void;
  getCroppedPhotoInfoForDate: (date: ValidDate) => FullCroppedPhotoInfo|null;
  removePhotoForDate: (date: ValidDate) => void;

  setYearMonth: (yearMonth: string) => void;

  clearCalendar: () => void;
};

type CalendarContextProvider = {
  yearMonthInfo: YearMonthInfo;
  thumbnailsOfFullImages: IdToFullImageMap;
  croppedDateImages: DayToImageMap;

  calendarFunctions: CalendarFunctions;
};

export enum LoadedStatus {
  Uninitialized,
  Loading,
  Loaded,
}

export const CalendarContext = React.createContext<CalendarContextProvider>({
  yearMonthInfo: getTodaysYearMonthInfo(),
  thumbnailsOfFullImages: new Map<string, FullImage>(),
  croppedDateImages: new Map<ValidDate, ResizedImage>(),
  calendarFunctions: {
    addFullImage: function (data: string): void {
      throw new Error("Function not implemented.");
    },
    removeFullImage: function (id: string): void {
      throw new Error("Function not implemented.");
    },
    setPhotoForDate: function (date: ValidDate, fullImageId: string, clipPathInfo: ClipPathInfo, fullCroppedImageData: ImageData): void {
      throw new Error("Function not implemented.");
    },
    getCroppedPhotoInfoForDate: function (date: ValidDate): FullCroppedPhotoInfo | null {
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
  }
});

const CalendarContextProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <CalendarContext.Provider value={{}}>{children}</CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
