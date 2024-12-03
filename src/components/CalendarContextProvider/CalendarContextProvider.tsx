"use client";
import {
  ClipPathInfo,
  CroppedPhotoMetadata,
  FullCroppedPhotoInfo,
  FullImage,
  ValidDate,
  YearMonthInfo,
} from "@/helpers/calendar-data-types";
import {
  getTodaysYearMonthInfo,
  getYearMonthInfo,
} from "@/helpers/calendar-helpers";
import {
  loadYearMonthInfo,
  saveYearMonthInfo,
  saveImageDataForDateDb,
} from "@/helpers/indexeddb";
import React from "react";

type CalendarFunctions = {
  setPhotoForDate: (date: ValidDate, photoInfo: FullCroppedPhotoInfo) => Promise<void>;
  removePhotoForDate: (date: ValidDate) => Promise<void>;

  setYearMonth: (yearMonth: string) => void;

  clearCalendar: () => Promise<void>;
};

type CalendarContextProvider = {
  loadedStatus: LoadedStatus;
  yearMonthInfo: YearMonthInfo;
  imagesByDateMap: Map<ValidDate, FullCroppedPhotoInfo>;

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
  imagesByDateMap: new Map<ValidDate, FullCroppedPhotoInfo>(),
  calendarFunctions: {
    setPhotoForDate: async function (
      date: ValidDate,
      photoInfo: FullCroppedPhotoInfo
    ): Promise<void> {
      throw new Error("Function not implemented.");
    },
    removePhotoForDate: async function (date: ValidDate) {
      throw new Error("Function not implemented.");
    },
    setYearMonth: function (yearMonth: string): void {
      throw new Error("Function not implemented.");
    },
    clearCalendar: async function () {
      throw new Error("Function not implemented.");
    },
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

  const [imagesByDateMap, setImagesByDateMap] = React.useState(
    new Map<ValidDate, FullCroppedPhotoInfo>()
  );

  const calendarFunctions: CalendarFunctions = {
    setPhotoForDate: async function (
      date: ValidDate,
      fullCroppedPhotoInfo: FullCroppedPhotoInfo
    ) {
      const newMap = new Map(imagesByDateMap).set(date, fullCroppedPhotoInfo);
      setImagesByDateMap(newMap);

      return saveImageDataForDateDb(date, fullCroppedPhotoInfo);
    },
    removePhotoForDate: async function (date: ValidDate) {
      throw new Error("Function not implemented.");
    },
    setYearMonth: function (yearMonth: string): void {
      saveYearMonthInfo(yearMonth);
      setYearMonthInfoState(getYearMonthInfo(yearMonth));
    },
    clearCalendar: async function () {
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
        imagesByDateMap,
        calendarFunctions,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
