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
  loadAllImageDataFromDb,
  loadAllImageDataFromDb2,
} from "@/helpers/indexeddb";
import React from "react";

type CalendarFunctions = {
  setPhotoForDate: (
    date: ValidDate,
    photoInfo: FullCroppedPhotoInfo
  ) => Promise<void>;
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
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  const imagesByDateMap = React.useMemo( () => 
     new Map<ValidDate, FullCroppedPhotoInfo>()
  , []);

  const calendarFunctions: CalendarFunctions = {
    setPhotoForDate: async function (
      date: ValidDate,
      fullCroppedPhotoInfo: FullCroppedPhotoInfo
    ) {
      addPhotoToState(date, fullCroppedPhotoInfo);
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



  const addPhotoToState = (
    date: ValidDate,
    fullCroppedPhotoInfo: FullCroppedPhotoInfo
  ) => {
    imagesByDateMap.set(date, fullCroppedPhotoInfo);
    forceUpdate();
  };

  const initializeContext = () => {
  };

  React.useEffect(() => {
    console.log("LOADED", loadedStatus);
    setLoadedStatus(LoadedStatus.Loading);
    if (loadedStatus === LoadedStatus.Loaded) {
      return;
    }
    console.timeEnd();
    console.time();
    console.log('!!!starting request');
    const onImageLoaded = (dayOfMonth: number, image: FullCroppedPhotoInfo) => {
      addPhotoToState(dayOfMonth as ValidDate, image);
    };
    const onFinished = () => {
      console.timeLog();
      console.log('!!!! ending request');
    };

    const controller = new AbortController();
    const promise = loadAllImageDataFromDb(onImageLoaded, onFinished);

    return () => {
      


    }
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
