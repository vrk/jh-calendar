import PhotoTray from "@/components/PhotoTray";
import { createImageElementWithSrc } from "./file-input";

export type YearMonthInfo = {
  calMonth: number; // 0-index based
  calYear: number;
  firstDateOfMonth: Date;
};

export type FullImage = {
  id: string;
  imageData: RawImageData;
};

export type RawImageData = {
  data: string;
  height: number;
  width: number;
};

export type BoundingBoxValue = "square" | "writable-space";

export type FullCroppedPhotoInfo = {
  fullImage: HTMLImageElement;
  croppedImage: HTMLImageElement;
  metadata: CroppedPhotoMetadata;
};

export type FullCroppedPhotoRawData = {
  fullImageData: RawImageData;
  croppedImageData: RawImageData;
  metadata: CroppedPhotoMetadata;
};

function elementToData(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("can't get context");
  }
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  context.drawImage(img, 0, 0);
  return canvas.toDataURL();
}

export function croppedPhotoToRawData(
  photoInfo: FullCroppedPhotoInfo
): FullCroppedPhotoRawData {
  const converted: FullCroppedPhotoRawData = {
    fullImageData: {
      data: elementToData(photoInfo.fullImage),
      height: photoInfo.fullImage.height,
      width: photoInfo.fullImage.width,
    },
    croppedImageData: {
      data: elementToData(photoInfo.croppedImage),
      height: photoInfo.croppedImage.height,
      width: photoInfo.croppedImage.width,
    },
    metadata: { ...photoInfo.metadata },
  };
  return converted;
}

export function rawDataToCroppedPhoto(
  rawData: FullCroppedPhotoRawData
) {
  const fullImage = new Image();
  fullImage.src = rawData.fullImageData.data;
  const croppedImage = new Image();
  croppedImage.src = rawData.croppedImageData.data;
  
  const converted: FullCroppedPhotoInfo = {
    fullImage,
    croppedImage,
    metadata: { ...rawData.metadata },
  };
  return converted;
}

export type CroppedPhotoMetadata = {
  clipPathInfo: ClipPathInfo;
  boundingBox: BoundingBoxValue;
  squaresWide: number;
  squaresTall: number;
};

export type ClipPathInfo = {
  top: number;
  left: number;
  height: number;
  width: number;
};

export type ValidDate =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;
