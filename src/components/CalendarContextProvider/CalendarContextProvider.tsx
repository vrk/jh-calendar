"use client";
import {
  ClipPathInfo,
  CroppedPhotoMetadata,
  FullPhotoInfo,
  FullImage,
  ValidDate,
  YearMonthInfo,
  CroppedPhotoInfo,
} from "@/helpers/calendar-data-types";
import {
  getTodaysYearMonthInfo,
  getYearMonthInfo,
} from "@/helpers/calendar-helpers";
import {
  loadYearMonthInfo,
  saveYearMonthInfo,
  saveCroppedImageDataForDateDb,
  loadAllCroppedDataFromDb,
} from "@/helpers/indexeddb";
import React from "react";

type CalendarFunctions = {
  setPhotoForDate: (
    date: ValidDate,
    croppedImage: HTMLImageElement,
    metadata: CroppedPhotoMetadata
  ) => Promise<void>;
  removePhotoForDate: (date: ValidDate) => Promise<void>;

  getFullCroppedPhotoInfoForDate: (date: ValidDate) => Promise<FullPhotoInfo>;

  setYearMonth: (yearMonth: string) => void;

  clearCalendar: () => Promise<void>;
};

type CalendarContextProvider = {
  loadedStatus: LoadedStatus;
  yearMonthInfo: YearMonthInfo;
  croppedImagesByDateMap: Map<ValidDate, CroppedPhotoInfo>;

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
  croppedImagesByDateMap: new Map<ValidDate, CroppedPhotoInfo>(),
  calendarFunctions: {
    setPhotoForDate: async function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    getFullCroppedPhotoInfoForDate: () => {
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
  const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const croppedImagesByDateMap = React.useMemo(
    () => new Map<ValidDate, CroppedPhotoInfo>(),
    []
  );
  const imagesByDateMap = React.useMemo(
    () => new Map<ValidDate, FullPhotoInfo>(),
    []
  );

  const calendarFunctions: CalendarFunctions = {
    setPhotoForDate: async function (
      date: ValidDate,
      croppedPhoto: HTMLImageElement,
      metadata: CroppedPhotoMetadata
    ) {
      addPhotoToState(date, croppedPhoto, metadata);
      return saveCroppedImageDataForDateDb(date, croppedPhoto, metadata);
    },
    getFullCroppedPhotoInfoForDate: async function (date: ValidDate) {
      throw new Error("not implemented");
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
    croppedImage: HTMLImageElement,
    metadata: CroppedPhotoMetadata
  ) => {
    croppedImagesByDateMap.set(date, {
      croppedImage,
      metadata,
    });
    forceUpdate();
  };

  const initializeContext = () => {};

  React.useEffect(() => {
    console.log("LOADED", loadedStatus);
    setLoadedStatus(LoadedStatus.Loading);
    if (loadedStatus === LoadedStatus.Loaded) {
      return;
    }
    console.timeEnd();
    console.time();
    console.log("!!!starting request");
    const onImageLoaded = (dayOfMonth: number, image: HTMLImageElement, metadata: CroppedPhotoMetadata) => {
      addPhotoToState(dayOfMonth as ValidDate, image, metadata);
    };
    const onFinished = () => {
      console.timeLog();
      console.log("!!!! ending request");
    };

    loadAllCroppedDataFromDb(onImageLoaded, onFinished);
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        loadedStatus,
        yearMonthInfo,
        croppedImagesByDateMap,
        calendarFunctions,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
