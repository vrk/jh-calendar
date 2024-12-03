"use client";
import {
  elementToData,
  FullPhotoInfo,
  FullCroppedPhotoRawData,
  YearMonthInfo,
  ValidDate,
  CroppedImageRawData,
  CroppedPhotoMetadata,
} from "./calendar-data-types";
import { getYearMonthInfo } from "./calendar-helpers";

//
// IndexedDB constants
//
const DATABASE_NAME = "December2024CalendarHelperDb";

const CROPPED_IMAGE_STORE_NAME = "CroppedImageStore";
const FULL_IMAGE_STORE_NAME = "FullImageStore";

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

      db.createObjectStore(CROPPED_IMAGE_STORE_NAME, { keyPath: "id" });
      db.createObjectStore(FULL_IMAGE_STORE_NAME, { keyPath: "id" });
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
  });
}

export async function saveCroppedImageDataForDateDb(
  dayOfMonth: ValidDate,
  croppedImage: HTMLImageElement,
  metadata: CroppedPhotoMetadata
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(CROPPED_IMAGE_STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(CROPPED_IMAGE_STORE_NAME);

    const data = elementToData(croppedImage);
    const height = croppedImage.naturalHeight;
    const width = croppedImage.naturalWidth;
    const newItem: CroppedImageRawData = {
      id: dayOfMonth,
      croppedImageData: {
        data,
        height,
        width,
      },
      metadata: { ...metadata },
    };
    const request = objectStore.put(newItem);
    request.onerror = (error) => {
      console.log(error);
      reject(`Could not create object with id: ${dayOfMonth}`);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}

export async function saveFullImageDataForDateDb(
  dayOfMonth: ValidDate,
  imageData: FullPhotoInfo
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(FULL_IMAGE_STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(FULL_IMAGE_STORE_NAME);

    const data = elementToData(imageData.fullImage);
    const height = imageData.fullImage.naturalHeight;
    const width = imageData.fullImage.naturalWidth;
    const newItem: FullCroppedPhotoRawData = {
      id: dayOfMonth,
      fullImageData: {
        data,
        height,
        width,
      },
    };
    const request = objectStore.put(newItem);
    request.onerror = (error) => {
      console.log(error);
      reject(`Could not create object with id: ${dayOfMonth}`);
    };
    request.onsuccess = () => {
      resolve();
    };
  });
}

export async function loadAllCroppedDataFromDb(
  onImageLoaded: (
    dayOfMonth: number,
    image: HTMLImageElement,
    metadata: CroppedPhotoMetadata
  ) => void,
  onFinished: () => void
) {
  return new Promise<void>(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(CROPPED_IMAGE_STORE_NAME);
    const objectStore = transaction.objectStore(CROPPED_IMAGE_STORE_NAME);
    const request = objectStore.openCursor();
    request.onsuccess = async () => {
      const cursor = request.result;
      if (cursor) {
        const rawImageData = cursor.value as CroppedImageRawData;
        console.log(cursor.value.id);
        const image = new Image();
        image.src = rawImageData.croppedImageData.data;
        onImageLoaded(cursor.value.id, image, rawImageData.metadata);
        cursor.continue();
      } else {
        onFinished();
      }
    };
    request.onerror = () => {
      reject("Could not get all data");
    };
    resolve();
  });
}

export async function loadFullImageForDateDb(
  dayOfMonth: ValidDate
): Promise<FullPhotoInfo | undefined> {
  return new Promise(async (resolve, reject) => {
    const db = await getDatabase();
    const transaction = db.transaction(FULL_IMAGE_STORE_NAME);
    const objectStore = transaction.objectStore(FULL_IMAGE_STORE_NAME);
    const request = objectStore.get(dayOfMonth);
    request.onsuccess = () => {
      const item: FullCroppedPhotoRawData = request.result;
      if (!item) {
        resolve(undefined);
      } else {
        const image = new Image();
        image.src = item.fullImageData.data;
        image.width = item.fullImageData.width;
        image.height = item.fullImageData.height;
        const retrieved: FullPhotoInfo = {
          fullImage: image,
        };
        resolve(retrieved);
      }
    };
    request.onerror = () => {
      reject("Could not get all data");
    };
  });
}
