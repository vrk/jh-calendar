import React from "react";
import { Canvas, Rect, FabricImage, FabricObject, TPointerEventInfo, util } from "fabric";
import { useHotkeys } from "react-hotkeys-hook";
import { RawImageData } from "@/helpers/calendar-data-types";

function useCropPhoto(fabricCanvas: Canvas | null, imageToCrop: HTMLImageElement | null) {
  React.useEffect(() => {
    console.log('hi hi');
    if (!fabricCanvas || !imageToCrop) {
      console.log('returning because', fabricCanvas, imageToCrop);
      return;
    }
    const rectangle = new Rect({
      fill: "black",
      stroke: "#ccc",
      strokeDashArray: [2, 2],
      visible: false,
    });
    fabricCanvas.add(rectangle);
    const fabricImage = new FabricImage(imageToCrop, {
      selectable: false
    });
    const scale = util.findScaleToFit(fabricImage, fabricCanvas);
    fabricImage.scale(scale);
    fabricCanvas.add(fabricImage);
    fabricCanvas.centerObject(fabricImage);
    fabricCanvas.requestRenderAll();
    console.log('hi')
    return () => {
      fabricCanvas.remove(fabricImage);
      fabricCanvas.remove(rectangle);
    }
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
