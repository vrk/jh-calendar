"use client";
import {
  ClipPathInfo,
  FullCroppedPhotoInfo,
  FullImage,
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
  getCroppedPhotoInfoForDate: (date: ValidDate) => FullCroppedPhotoInfo | null;
  removePhotoForDate: (date: ValidDate) => void;

  setYearMonth: (yearMonth: string) => void;

  clearCalendar: () => void;
};

type CalendarContextProvider = {
  loadedStatus: LoadedStatus;
  yearMonthInfo: YearMonthInfo;
  thumbnailsOfFullImages: Map<string, ImageData>;
  croppedDateImages: Map<ValidDate, ResizedImage>;

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
  thumbnailsOfFullImages: new Map<string, ImageData>(),
  croppedDateImages: new Map<ValidDate, ResizedImage>(),
  calendarFunctions: {
    addFullImage: function (data: string): void {
      throw new Error("Function not implemented.");
    },
    removeFullImage: function (id: string): void {
      throw new Error("Function not implemented.");
    },
    setPhotoForDate: function (
      date: ValidDate,
      fullImageId: string,
      clipPathInfo: ClipPathInfo,
      fullCroppedImageData: ImageData
    ): void {
      throw new Error("Function not implemented.");
    },
    getCroppedPhotoInfoForDate: function (
      date: ValidDate
    ): FullCroppedPhotoInfo | null {
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
    },
  },
});

const CalendarContextProvider = ({ children }: React.PropsWithChildren) => {
  const [loadedStatus, setLoadedStatus] = React.useState(
    LoadedStatus.Uninitialized
  );
  const [yearMonthInfo, setYearMonthInfo] = React.useState(
    getTodaysYearMonthInfo()
  );
  const [thumbnailsOfFullImages, setThumbnailsOfFullImages] = React.useState(
    new Map<string, ImageData>()
  );

  const [croppedDateImages, setCroppedDateImages] = React.useState(
    new Map<ValidDate, ResizedImage>()
  );

  const calendarFunctions: CalendarFunctions = {
    addFullImage: function (data: string): void {
      throw new Error("Function not implemented.");
    },
    removeFullImage: function (id: string): void {
      throw new Error("Function not implemented.");
    },
    setPhotoForDate: function (
      date: ValidDate,
      fullImageId: string,
      clipPathInfo: ClipPathInfo,
      fullCroppedImageData: ImageData
    ): void {
      throw new Error("Function not implemented.");
    },
    getCroppedPhotoInfoForDate: function (
      date: ValidDate
    ): FullCroppedPhotoInfo | null {
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
    },
  };

  const initializeContext = async () => {};

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
        thumbnailsOfFullImages,
        croppedDateImages,
        calendarFunctions,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
