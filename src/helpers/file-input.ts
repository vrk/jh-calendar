import { RawImageData } from "./calendar-data-types";
import { getMaxReasonablePhotoSizeHobonichiCousin } from "./print-helpers";

export enum PhotoSelectionType {
  Single,
  Multi,
}

export async function getFileFromFilePicker(
  type: PhotoSelectionType
): Promise<FileList | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = type === PhotoSelectionType.Multi;
    input.addEventListener("change", () => {
      const { files } = input;
      if (!files) {
        resolve(null);
        return;
      }
      resolve(files);
    });
    input.click();
  });
}

async function createImageElement(file: File): Promise<HTMLImageElement> {
  return createImageElementWithSrc(URL.createObjectURL(file));
}

export async function createImageElementWithSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", function () {
      resolve(image);
    });
    image.src = src;
  });
}

type LoadedImage = {
  imageElement: HTMLImageElement;
  rawData: RawImageData;
};
export async function getImageFromFile(file: File): Promise<LoadedImage> {
  const fullsizeImageElement = await createImageElement(file);
  const { width, height } = getMaxReasonablePhotoSizeHobonichiCousin();
  const scaledImage = resizeImage(fullsizeImageElement, width, height);
  if (!scaledImage) {
    throw new Error(`Could not load image from file: ${file.name}`);
  }
  const resizedImageElement = await createImageElementWithSrc(scaledImage.data);
  return {
    imageElement: resizedImageElement,
    rawData: scaledImage,
  };
}

function resizeImage(
  imageElement: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): RawImageData | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  // Start out unscaled
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;

  // Scale if too wide
  if (maxWidth < imageElement.width) {
    canvas.width = maxWidth;
    const scale = maxWidth / imageElement.width;
    canvas.height = imageElement.height * scale;
  }
  // Scale more if too tall
  if (maxHeight < imageElement.height) {
    canvas.height = maxHeight;
    const scale = maxHeight / imageElement.height;
    canvas.width = imageElement.width * scale;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  return {
    data: canvas.toDataURL("image/png"),
    height: canvas.height,
    width: canvas.width,
  };
}
