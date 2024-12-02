import * as React from "react";
import styles from "./CropModal.module.css";
import { Canvas } from "fabric";
import useCropPhoto from "@/hooks/use-crop-photo";
import ConfirmationDialog from "../ConfirmationDialog";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  imageToCrop: HTMLImageElement|null;
};

const CropModal = ({
  isOpen,
  onConfirm,
  onOpenChange,
  imageToCrop
}: React.PropsWithChildren<Props>) => {
  return (
    <ConfirmationDialog
      className={styles.dialog}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
      title="Crop image"
      confirm="Crop"
      cancel="Cancel"
    >
      <CanvasWrapper imageToCrop={imageToCrop}></CanvasWrapper>
    </ConfirmationDialog>
  );
};

type WrapperProps = {
  imageToCrop: HTMLImageElement|null;
}

function CanvasWrapper({imageToCrop}: React.PropsWithRef<WrapperProps>) {
  const htmlCanvas = React.useRef<HTMLCanvasElement>(null);
  const [ fabricCanvas, setFabricCanvas] = React.useState<Canvas|null>(null);
  useCropPhoto(fabricCanvas, imageToCrop);
  React.useEffect(() => {
    if (!htmlCanvas.current) {
      return;
    }
    const newlyMadeCanvas = new Canvas(htmlCanvas.current, {
      controlsAboveOverlay: true,
      renderOnAddRemove: false,
      width: htmlCanvas.current.offsetWidth,
      height: htmlCanvas.current.offsetHeight,
    });
    setFabricCanvas(newlyMadeCanvas);
    return () => {
      newlyMadeCanvas.dispose();
    }
  }, [htmlCanvas]);
  return (
    <>
      <canvas ref={htmlCanvas} className={styles.canvas}></canvas>
    </>
  );
}

export default CropModal;

//  // set to the event when the user pressed the mouse button down
//  var mouseDown;
//  // only allow one crop. turn it off after that
//  var disabled = false;
//  var rectangle = new fabric.Rect({
//      fill: 'transparent',
//      stroke: '#ccc',
//      strokeDashArray: [2, 2],
//      visible: false
//  });
//  var container = document.getElementById('canvas').getBoundingClientRect();
//  var canvas = new fabric.Canvas('canvas');
//  canvas.add(rectangle);
//  var image;
//  fabric.util.loadImage("http://fabricjs.com/lib/pug.jpg", function(img) {
//      image = new fabric.Image(img);
//      image.selectable = false;
//      canvas.setWidth(image.getWidth());
//      canvas.setHeight(image.getHeight());
//      canvas.add(image);
//      canvas.centerObject(image);
//      canvas.renderAll();
//  });
//  // capture the event when the user clicks the mouse button down
//  canvas.on("mouse:down", function(event) {
//      if(!disabled) {
//          rectangle.width = 2;
//          rectangle.height = 2;
//          rectangle.left = event.e.pageX - container.left;
//          rectangle.top = event.e.pageY - container.top;
//          rectangle.visible = true;
//          mouseDown = event.e;
//          canvas.bringToFront(rectangle);
//      }
//  });
//  // draw the rectangle as the mouse is moved after a down click
//  canvas.on("mouse:move", function(event) {
//      if(mouseDown && !disabled) {
//          rectangle.width = event.e.pageX - mouseDown.pageX;
//          rectangle.height = event.e.pageY - mouseDown.pageY;
//          canvas.renderAll();
//      }
//  });
//  // when mouse click is released, end cropping mode
//  canvas.on("mouse:up", function() {
//      mouseDown = null;
//  });
//  $('#cropB').on('click', function() {
//      image.clipTo = function(ctx) {
//          // origin is the center of the image
//          var x = rectangle.left - image.getWidth() / 2;
//          var y = rectangle.top - image.getHeight() / 2;
//          ctx.rect(x, y, rectangle.width, rectangle.height);
//      };
//      image.selectable = true;
//      disabled = true;
//      rectangle.visible = false;
//      canvas.renderAll();
//  });
