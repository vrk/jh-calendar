import React from "react";
import {
  Canvas,
  Rect,
  FabricImage,
  FabricObject,
  TPointerEventInfo,
  util,
} from "fabric";
import { useHotkeys } from "react-hotkeys-hook";
import { RawImageData } from "@/helpers/calendar-data-types";

function useCropPhoto(
  fabricCanvas: Canvas | null,
  imageToCrop: HTMLImageElement | null,
  aspectRatio: number
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
    const rectangle = new Rect({
      fill: "transparent",
      width: 100,
      height: 100,
      strokeUniform: true,
      noScaleCache: false,
      stroke: "black",
      strokeWidth: 2,
      cornerStyle: "circle",
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

    const onScaleMove = (e: any) => {
      if (e.target !== rectangle) {
        return;
      }
      const maxWidth = fabricImage.getScaledWidth();
      const maxHeight = fabricImage.getScaledHeight();
      if (rectangle.getScaledHeight() > maxHeight) {
        const maxScaleRatio = maxHeight / rectangle.height;
        rectangle.scaleY = maxScaleRatio;
      }
      if (rectangle.getScaledWidth() > maxWidth) {
        const maxScaleRatio = maxWidth / rectangle.width;
        rectangle.scaleX = maxScaleRatio;
      }
      clampToBounds(fabricImage, rectangle);
    };

    fabricCanvas.on("object:scaling", onScaleMove);
    const onMove = (e: any) => {
      if (e.target !== rectangle) {
        return;
      }
      clampToBounds(fabricImage, rectangle);
    };
    fabricCanvas.on("object:moving", onMove);

    return () => {
      fabricCanvas.remove(fabricImage);
      fabricCanvas.remove(rectangle);
      fabricCanvas.off("object:moving", onMove);
      fabricCanvas.off("object:scaling", onScaleMove);
    };
  }, [fabricCanvas, imageToCrop, aspectRatio]);
}

function clampToBounds(bounds: FabricImage, movingObject: FabricObject) {
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
