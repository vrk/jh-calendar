"use client";
import {
  croppedPhotoToRawData,
  FullCroppedPhotoInfo,
  FullCroppedPhotoRawData,
  rawDataToCroppedPhoto,
  YearMonthInfo,
} from "./calendar-data-types";
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

export async function saveImageDataForDateDb(
  dayOfMonth: number,
  imageData: FullCroppedPhotoInfo
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(CALENDAR_IMAGE_STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(CALENDAR_IMAGE_STORE_NAME);

    const rawImageData = croppedPhotoToRawData(imageData);

    const request = objectStore.put({
      id: dayOfMonth,
      rawImageData,
    });
    request.onerror = (error) => {
      console.log(error);
      reject(`Could not create object with id: ${dayOfMonth}`);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}

export async function loadAllImageDataFromDb(
  onImageLoaded: (dayOfMonth: number, image: FullCroppedPhotoInfo) => void,
  onFinished: () => void
) {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(CALENDAR_IMAGE_STORE_NAME);
    const objectStore = transaction.objectStore(CALENDAR_IMAGE_STORE_NAME);
    const request = objectStore.openCursor();
    request.onsuccess = async () => {
      const cursor = request.result;
      if (cursor) {
        const rawImageData: FullCroppedPhotoRawData = cursor.value.rawImageData;
        console.log(cursor.value.id);
        const image = rawDataToCroppedPhoto(rawImageData);
        onImageLoaded(cursor.value.id, image);
        cursor.continue();
      } else {
        onFinished();
      }
    };
    request.onerror = () => {
      reject("Could not get all journals");
    };
  });
}

export async function loadAllImageDataFromDb2(
  onImageLoaded: (dayOfMonth: number, image: FullCroppedPhotoInfo) => void,
  onFinished: () => void
) {
  let count = 0;
  const executor = async (resolve: any, reject: any) => {
    const db = await getDatabase();
    const transaction = db.transaction(CALENDAR_IMAGE_STORE_NAME);
    const objectStore = transaction.objectStore(CALENDAR_IMAGE_STORE_NAME);
    const request = objectStore.getAll();
    request.onsuccess = () => {
      for (const result of request.result) {
        console.log('hello', count++);
        const rawImageData: FullCroppedPhotoRawData = result.rawImageData;
        const image = rawDataToCroppedPhoto(rawImageData);
        onImageLoaded(result.id, image);
      }
      onFinished();
    };
    request.onerror = () => {
      reject("Could not get all journals");
    };
    resolve(transaction);
  };
  return new Promise(executor);
}
