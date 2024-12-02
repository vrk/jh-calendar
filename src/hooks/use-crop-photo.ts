import React from "react";
import {
  Canvas,
  Rect,
  FabricImage,
  FabricObject,
  ImageFormat,
  TPointerEventInfo,
  util,
} from "fabric";
import { useHotkeys } from "react-hotkeys-hook";
import { RawImageData } from "@/helpers/calendar-data-types";
import { createImageElementWithSrc } from "@/helpers/file-input";

function useCropPhoto(
  fabricCanvas: Canvas | null,
  imageToCrop: HTMLImageElement | null,
  aspectRatio: number,
  setCroppedImage: (img: HTMLImageElement) => void
) {
  React.useEffect(() => {
    console.log("hi hi");
    if (!fabricCanvas || !imageToCrop) {
      console.log("returning because", fabricCanvas, imageToCrop);
      return;
    }
    const fabricImage = new FabricImage(imageToCrop, {
      selectable: false,
    });
    const scale = util.findScaleToFit(fabricImage, fabricCanvas);
    fabricImage.scale(scale);
    fabricCanvas.add(fabricImage);
    fabricCanvas.centerObject(fabricImage);

    const cropRectStartingWidth = fabricImage.getScaledWidth();
    const cropRectStartingHeight = (1 / aspectRatio) * cropRectStartingWidth;

    const rectangle = new Rect({
      fill: "transparent",
      width: cropRectStartingWidth,
      height: cropRectStartingHeight,
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
    });
    rectangle.controls.mt.setVisibility(false, "", rectangle);
    rectangle.controls.ml.setVisibility(false, "", rectangle);
    rectangle.controls.mb.setVisibility(false, "", rectangle);
    rectangle.controls.mr.setVisibility(false, "", rectangle);
    fabricCanvas.add(rectangle);
    fabricCanvas.centerObject(rectangle);
    fabricCanvas.setActiveObject(rectangle);
    fabricCanvas.requestRenderAll();

    const onObjectModified = async (e: any) => {
      if (e.target !== rectangle) {
        return;
      }
      clampSizeToBounds(fabricImage, rectangle);
      clampLocationToBounds(fabricImage, rectangle);

      const format: ImageFormat = "png";
      const options = {
        name: "New Image",
        format,
        quality: 1,
        width: rectangle.getScaledWidth(),
        height: rectangle.getScaledHeight(),
        left: rectangle.left,
        top: rectangle.top,
        multiplier: 1,
        filter: (object: any) => {
          return object !== rectangle;
        }
      };
      const dataUrl = fabricCanvas.toDataURL(options);
      const img = await createImageElementWithSrc(dataUrl);
      setCroppedImage(img);

      fabricCanvas.requestRenderAll();
    };

    fabricCanvas.on("object:modified", onObjectModified);
    const onMove = async (e: any) => {
      if (e.target !== rectangle) {
        return;
      }
      clampLocationToBounds(fabricImage, rectangle);
      fabricCanvas.requestRenderAll();
    };
    fabricCanvas.on("object:moving", onMove);

    return () => {
      fabricCanvas.remove(fabricImage);
      fabricCanvas.remove(rectangle);
      fabricCanvas.off("object:moving", onMove);
      fabricCanvas.off("object:scaling", onObjectModified);
    };
  }, [fabricCanvas, imageToCrop, aspectRatio]);
}

function clampSizeToBounds(bounds: FabricImage, movingObject: FabricObject) {
  const maxWidth = bounds.getScaledWidth();
  const maxHeight = bounds.getScaledHeight();
  if (movingObject.getScaledHeight() > maxHeight) {
    movingObject.scaleToHeight(maxHeight);
    console.log("scaling height");
  }
  if (movingObject.getScaledWidth() > maxWidth) {
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

function getClientPosition(e: any) {
  const positionSource = e.touches ? e.touches[0] : e;
  const { clientX, clientY } = positionSource;
  return {
    clientX,
    clientY,
  };
}

export default useCropPhoto;
