export type YearMonthInfo = {
  calMonth: number;
  calYear: number;
  firstDateOfMonth: Date;
};

export type FullImage = {
  id: string;
  imageData: ImageData;
};

export type ImageData = {
  data: string;
  height: number;
  width: number;
}

export type ResizedImage = {
  fromFullImageId: string;
  imageData: ImageData;
};

export type FullCroppedPhotoInfo = {
  fullImage: FullImage;
  clipPathInfo: ClipPathInfo
};

export type ClipPathInfo = {
  top: number;
  left: number;
  height: number;
  width: number;
}

export type IdToFullImageMap = Map<string, FullImage>;
export type DayToImageMap = Map<ValidDate, ResizedImage>;

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
