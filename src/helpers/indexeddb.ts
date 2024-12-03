"use client";
import { croppedPhotoToRawData, FullCroppedPhotoInfo, YearMonthInfo } from "./calendar-data-types";
import { getYearMonthInfo } from "./calendar-helpers";

//
// IndexedDB constants
//
const DATABASE_NAME = "December2024CalendarHelperDb";

const CALENDAR_IMAGE_STORE_NAME = "FullImages";

//
// Other constants
//

const LOCAL_STORAGE_CALENDAR_KEY = "LastLoadedYearMonth";

const ID_LENGTH = 10;

export function loadYearMonthInfo(): YearMonthInfo | null {
  if (!window) {
    return null;
  }
  const lastYearMonth = window.localStorage.getItem(LOCAL_STORAGE_CALENDAR_KEY);
  if (!lastYearMonth) {
    return null;
  }
  return getYearMonthInfo(lastYearMonth);
}

export function saveYearMonthInfo(yearMonth: string) {
  window.localStorage.setItem(LOCAL_STORAGE_CALENDAR_KEY, yearMonth);
}

export async function getDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1 /** version */);
    request.onerror = (event) => {
      const reason = "An error occurred with IndexedDb";
      console.error(reason, event);
      reject(reason);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      db.createObjectStore(CALENDAR_IMAGE_STORE_NAME, { keyPath: "id" });
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
  });
}

export async function saveImageDataForDateDb(dayOfMonth: number, imageData: FullCroppedPhotoInfo): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(CALENDAR_IMAGE_STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(CALENDAR_IMAGE_STORE_NAME);

    const rawImageData = croppedPhotoToRawData(imageData);

    const request = objectStore.add({
      id: dayOfMonth,
      rawImageData
    });
    request.onerror = () => {
      reject(`Could not create object with id: ${dayOfMonth}`);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}
