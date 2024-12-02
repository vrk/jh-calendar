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
  imageToCrop: HTMLImageElement | null
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
      stroke: "black",
      strokeWidth: 2,
      cornerStyle: "circle",
      transparentCorners: false,
      visible: true,
    });
    fabricCanvas.add(rectangle);
    fabricCanvas.centerObject(rectangle);
    fabricCanvas.setActiveObject(rectangle);
    fabricCanvas.requestRenderAll();

    fabricCanvas.on("object:modified", (e: any) => {
      const maxWidth = fabricImage.getScaledWidth();
      const maxHeight = fabricImage.getScaledHeight();
      const topOffset = fabricImage.top;
      const leftOffset = fabricImage.left;
      var obj = e.target as Rect;
      // top-left  corner
      if (obj.top < topOffset) {
        obj.top = topOffset;
      }
      if (obj.left < leftOffset) {
        obj.left = leftOffset;
      }
      // Bottom right corner
      if (obj.top > maxHeight + topOffset) {
        obj.top = topOffset + (maxHeight - obj.getScaledHeight());
      }
      if (obj.left > maxWidth + leftOffset) {
        obj.left = leftOffset + (maxWidth - obj.getScaledWidth());
      }

      obj.setCoords();
      fabricCanvas.requestRenderAll();
    });

    return () => {
      fabricCanvas.remove(fabricImage);
      fabricCanvas.remove(rectangle);
    };
  }, [fabricCanvas, imageToCrop]);
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
