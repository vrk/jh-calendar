"use client";
import ShortUniqueId from "short-unique-id";
import {
  Journal,
  JournalImage,
  DBJournalImage,
  Spread,
  SpreadItem,
  FabricJsMetadata,
  PrintItem,
  PrintPage,
} from "./data-types";
import { YearMonthInfo } from "./calendar-data-types";
import { getYearMonthInfo } from "./calendar-helpers";

//
// IndexedDB constants
//
const DATABASE_NAME = "December2024CalendarHelperDb";

const FULL_IMAGE_STORE_NAME = "FullImages";
const CROPPED_PHOTO_STORE_NAME = "CroppedDatePhoto";

const CROPPED_TO_FULL_INDEX_NAME = "CroppedToFull";

const FULL_INDEX_KEY_NAME = "fullImageId";

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

      db.createObjectStore(FULL_IMAGE_STORE_NAME, { keyPath: "id" });

      const croppedStore = db.createObjectStore(CROPPED_PHOTO_STORE_NAME, {
        keyPath: "dayOfMonth",
      });
      croppedStore.createIndex(CROPPED_TO_FULL_INDEX_NAME, FULL_INDEX_KEY_NAME, {
        unique: false,
      });
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
  });
}
