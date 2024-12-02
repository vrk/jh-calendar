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
}

export type BoundingBoxValue = "square" | "writable-space";

export type FullCroppedPhotoInfo = {
  fullImage: HTMLImageElement,
  croppedImage: HTMLImageElement,
  metadata: CroppedPhotoMetadata
}

export type CroppedPhotoMetadata = {
  clipPathInfo: ClipPathInfo
  boundingBox: BoundingBoxValue;
  squaresWide: number;
  squaresTall: number;
};

export type ClipPathInfo = {
  top: number;
  left: number;
  height: number;
  width: number;
}

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
