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

export function getResizedDimensionsWithinBounds(bounds: PhotoSize, imageElement: HTMLImageElement) {
  const maxWidth = bounds.width;
  const maxHeight = bounds.height;
  const dimensions = {
    height: imageElement.height,
    width: imageElement.width,
  }
  // Scale if too wide
  if (maxWidth < imageElement.width) {
    dimensions.width = maxWidth;
    const scale = maxWidth / imageElement.width;
    dimensions.height = imageElement.height * scale;
  }
  // Scale more if too tall
  if (maxHeight < imageElement.height) {
    dimensions.height = maxHeight;
    const scale = maxHeight / imageElement.height;
    dimensions.width = imageElement.width * scale;
  }
  return dimensions;
}