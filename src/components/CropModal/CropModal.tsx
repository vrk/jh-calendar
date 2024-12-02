import * as React from "react";
import styles from "./CropModal.module.css";
import { Canvas } from "fabric";
import useCropPhoto from "@/hooks/use-crop-photo";
import ConfirmationDialog from "../ConfirmationDialog";
import { DateSquare, DateSquarePreview } from "@/helpers/hobonichi-generator";
import { YearMonthInfo } from "@/helpers/calendar-data-types";

type Props = {
  isOpen: boolean;
  dateNumber: number | null;
  yearMonthInfo: YearMonthInfo;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  imageToCrop: HTMLImageElement | null;
};

const CropModal = ({
  isOpen,
  dateNumber,
  yearMonthInfo,
  onConfirm,
  onOpenChange,
  imageToCrop,
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
      <div className={styles.dateContainer}>
        <DateSquarePreview
          dateNumber={dateNumber}
          yearMonthInfo={yearMonthInfo}
          previewImage={imageToCrop}
        ></DateSquarePreview>
      </div>
    </ConfirmationDialog>
  );
};

type WrapperProps = {
  imageToCrop: HTMLImageElement | null;
};

function CanvasWrapper({ imageToCrop }: React.PropsWithRef<WrapperProps>) {
  const htmlCanvas = React.useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = React.useState<Canvas | null>(null);
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
      backgroundColor: "lightgray",
    });
    setFabricCanvas(newlyMadeCanvas);
    return () => {
      newlyMadeCanvas.dispose();
    };
  }, [htmlCanvas]);
  return (
    <>
      <canvas ref={htmlCanvas} className={styles.canvas}></canvas>
    </>
  );
}

export default CropModal;
