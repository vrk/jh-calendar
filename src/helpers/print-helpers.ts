export const PRINT_PPI = 300;

export type PhotoSize = {
  width: number;
  height: number;
};

export function getMaxReasonablePhotoSize(
  pageWidthInInches: number,
  pageHeightInInches: number
): PhotoSize {
  return {
    width: pageWidthInInches * PRINT_PPI,
    height: pageHeightInInches * PRINT_PPI,
  };
}

export function getMaxReasonablePhotoSizeHobonichiCousin(): PhotoSize {
  return getMaxReasonablePhotoSize(
    5.8 * 2,
    8.3
  )
}