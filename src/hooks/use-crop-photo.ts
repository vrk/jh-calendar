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

    fabricCanvas.on("object:modified", function (e: any) {
      var obj = e.target;
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (
        obj.getBoundingRect().top + obj.getBoundingRect().height >
          obj.canvas.height ||
        obj.getBoundingRect().left + obj.getBoundingRect().width >
          obj.canvas.width
      ) {
        obj.top = Math.min(
          obj.top,
          obj.canvas.height -
            obj.getBoundingRect().height +
            obj.top -
            obj.getBoundingRect().top
        );
        obj.left = Math.min(
          obj.left,
          obj.canvas.width -
            obj.getBoundingRect().width +
            obj.left -
            obj.getBoundingRect().left
        );
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
