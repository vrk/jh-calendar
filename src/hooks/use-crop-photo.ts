import React from "react";
import {
  Canvas,
  Rect,
  FabricImage,
  FabricObject,
  ImageFormat,
  util,
} from "fabric";
import {
  ClipPathInfo,
  CroppedPhotoMetadata,
} from "@/helpers/calendar-data-types";
import { createImageElementWithSrc } from "@/helpers/file-input";

function useCropPhoto(
  fabricCanvas: Canvas | null,
  fabricImage: FabricImage | null,
  aspectRatio: number,
  setCroppedImage: (img: HTMLImageElement, clipaPathInfo: ClipPathInfo) => void,
  startingCropMetadata: CroppedPhotoMetadata | null
) {
  const [cropRect] = React.useState(createCropRectangle(startingCropMetadata))

  const updateCroppedImageData = async () => {
    if (!fabricCanvas) {
      return;
    }
    const format: ImageFormat = "png";
    const options = {
      name: "New Image",
      format,
      quality: 1,
      width: cropRect.getScaledWidth(),
      height: cropRect.getScaledHeight(),
      left: cropRect.left,
      top: cropRect.top,
      multiplier: 1,
      filter: (object: any) => {
        return object !== cropRect;
      },
    };
    const dataUrl = fabricCanvas.toDataURL(options);
    const img = await createImageElementWithSrc(dataUrl);

    setCroppedImage(img, {
      top: cropRect.top,
      left: cropRect.left,
      height: cropRect.getScaledHeight(),
      width: cropRect.getScaledWidth(),
    });
  };

  React.useEffect(() => {
    if (!fabricCanvas || !fabricImage) {
      return;
    }
    const scale = util.findScaleToFit(fabricImage, fabricCanvas);
    fabricImage.scale(scale);
    fabricCanvas.add(fabricImage);
    fabricCanvas.centerObject(fabricImage);
    fabricCanvas.add(cropRect);
    cropRect.setCoords();
    if (!startingCropMetadata?.clipPathInfo) {
      updateCropToAspectRatio(fabricCanvas, fabricImage, cropRect, aspectRatio);
    }
    fabricCanvas.setActiveObject(cropRect);
    fabricCanvas.requestRenderAll();

    updateCroppedImageData();

    const onObjectModified = async (e: any) => {
      if (e.target !== cropRect) {
        return;
      }
      clampSizeToBounds(fabricImage, cropRect);
      clampLocationToBounds(fabricImage, cropRect);
      await updateCroppedImageData();
      fabricCanvas.requestRenderAll();
    };

    fabricCanvas.on("object:modified", onObjectModified);
    const onMove = async (e: any) => {
      if (e.target !== cropRect) {
        return;
      }
      clampLocationToBounds(fabricImage, cropRect);
      fabricCanvas.requestRenderAll();
    };
    fabricCanvas.on("object:moving", onMove);

    return () => {
      fabricCanvas.remove(fabricImage);
      fabricCanvas.remove(cropRect);
      fabricCanvas.off("object:moving", onMove);
      fabricCanvas.off("object:scaling", onObjectModified);
    };
  }, [fabricCanvas, fabricImage]);

  React.useEffect(() => {
    if (!fabricCanvas || !fabricImage) {
      return;
    }
    updateCropToAspectRatio(fabricCanvas, fabricImage, cropRect, aspectRatio);
    updateCroppedImageData();
  }, [aspectRatio])
}

function createCropRectangle(startingCropMetadata: CroppedPhotoMetadata | null) {
  const rectangle = new Rect({
    fill: "transparent",
    strokeUniform: true,
    noScaleCache: false,
    stroke: "black",
    strokeWidth: 2,
    cornerStyle: "circle",
    lockScalingFlip: true,
    lockRotation: true,
    lockSkewingX: true,
    lockSkewingY: true,
    transparentCorners: false,
    visible: true,
    height: startingCropMetadata?.clipPathInfo?.height,
    width: startingCropMetadata?.clipPathInfo?.width,
    top: startingCropMetadata?.clipPathInfo?.top,
    left: startingCropMetadata?.clipPathInfo?.left,
  });
  rectangle.id = "--crop-rectangle--";
  rectangle.controls.mt.setVisibility(false, "", rectangle);
  rectangle.controls.ml.setVisibility(false, "", rectangle);
  rectangle.controls.mb.setVisibility(false, "", rectangle);
  rectangle.controls.mr.setVisibility(false, "", rectangle);
  return rectangle;
}

function updateCropToAspectRatio(
  fabricCanvas: Canvas,
  fabricImage: FabricImage,
  rectangle: FabricObject,
  aspectRatio: number
) {
  console.log('updating', aspectRatio);
  const cropRectStartingWidth = fabricImage.getScaledWidth();
  const cropRectStartingHeight = (1 / aspectRatio) * cropRectStartingWidth;
  rectangle.width = cropRectStartingWidth;
  rectangle.height = cropRectStartingHeight;
  rectangle.setCoords();
  clampSizeToBounds(fabricImage, rectangle);
  fabricCanvas.centerObject(rectangle);
  fabricCanvas.requestRenderAll()
}

function clampSizeToBounds(bounds: FabricImage, movingObject: FabricObject) {
  const maxWidth = bounds.getScaledWidth();
  const maxHeight = bounds.getScaledHeight();

  // TODO check whether scaling happened - seems like a FabricJS bug

  const widthToCheck =
    movingObject.scaleX === 1
      ? movingObject.width
      : movingObject.getScaledWidth();
  const heightToCheck =
    movingObject.scaleY === 1
      ? movingObject.height
      : movingObject.getScaledHeight();

  if (heightToCheck > maxHeight) {
    movingObject.scaleToHeight(maxHeight);
    console.log(
      "scaling height",
      heightToCheck,
      maxHeight,
      bounds.getScaledHeight(),
      movingObject.getScaledHeight()
    );
  }
  if (widthToCheck > maxWidth) {
    movingObject.scaleToWidth(maxWidth);
    console.log(
      "scaling width",
      bounds.getScaledWidth(),
      movingObject.getScaledWidth()
    );
  }
  movingObject.setCoords();
}

function clampLocationToBounds(
  bounds: FabricImage,
  movingObject: FabricObject
) {
  const maxWidth = bounds.getScaledWidth();
  const maxHeight = bounds.getScaledHeight();
  const topOffset = bounds.top;
  const leftOffset = bounds.left;
  // top-left  corner
  if (movingObject.top < topOffset) {
    movingObject.top = topOffset;
  }
  if (movingObject.left < leftOffset) {
    movingObject.left = leftOffset;
  }
  // Bottom right corner
  const objBottom = movingObject.top + movingObject.getScaledHeight();
  if (objBottom > maxHeight + topOffset) {
    movingObject.top = topOffset + (maxHeight - movingObject.getScaledHeight());
  }
  const objRight = movingObject.left + movingObject.getScaledWidth();
  if (objRight > maxWidth + leftOffset) {
    movingObject.left = leftOffset + (maxWidth - movingObject.getScaledWidth());
  }

  movingObject.setCoords();
}

export default useCropPhoto;
