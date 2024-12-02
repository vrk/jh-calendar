import * as React from "react";
import styles from "./CropModal.module.css";
import { Canvas } from "fabric";
import useCropPhoto from "@/hooks/use-crop-photo";
import ConfirmationDialog from "../ConfirmationDialog";
import {
  DateSquare,
  DateSquarePreview,
  getDateSquareBoundsForDate,
} from "@/helpers/hobonichi-generator";
import {
  BoundingBoxValue,
  ClipPathInfo,
  CroppedPhotoMetadata,
  YearMonthInfo,
} from "@/helpers/calendar-data-types";
import DropdownSelect from "../DropdownSelect";

type Props = {
  isOpen: boolean;
  dateNumber: number | null;
  yearMonthInfo: YearMonthInfo;
  onConfirm: (
    croppedImage: HTMLImageElement,
    fullCroppedPhotoInfo: CroppedPhotoMetadata
  ) => void;
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
  const [boundingBox, setBoundingBox] =
    React.useState<BoundingBoxValue>("writable-space");
  const [previewImage, setPreviewImage] =
    React.useState<HTMLImageElement | null>(null);
  const [clipPathInfo, setClipPathInfo] = React.useState<ClipPathInfo | null>(
    null
  );

  const selectedDate = new Date(
    yearMonthInfo.calYear,
    yearMonthInfo.calMonth,
    dateNumber || 1
  );
  const bounds = getDateSquareBoundsForDate(selectedDate);

  const [cropNumberBoxesWide, setCropNumberBoxesWide] = React.useState(
    bounds.totalBoxesWide
  );
  const [cropNumberBoxesTall, setCropNumberBoxesTall] = React.useState(
    bounds.totalBoxesTallWritable
  );

  const onDialogConfirmed = () => {
    if (!previewImage || !clipPathInfo) {
      return;
    }
    const photoInfo: CroppedPhotoMetadata = {
      clipPathInfo,
      boundingBox: boundingBox,
      squaresWide: cropNumberBoxesWide,
      squaresTall: cropNumberBoxesTall,
    };
    onConfirm(previewImage, photoInfo);
  };

  return (
    <ConfirmationDialog
      className={styles.dialog}
      isOpen={isOpen}
      onConfirm={onDialogConfirmed}
      onOpenChange={onOpenChange}
      title="Crop image"
      confirm="Crop"
      cancel="Cancel"
    >
      <CanvasWrapper
        imageToCrop={imageToCrop}
        aspectRatio={cropNumberBoxesWide / cropNumberBoxesTall}
        startingClipPathInfo={null}
        setPreviewImage={(image, clipPathInfo) => {
          setPreviewImage(image);
          setClipPathInfo(clipPathInfo);
        }}
      ></CanvasWrapper>
      <div className={styles.dateContainer}>
        <DateSquare dateNumber={dateNumber} yearMonthInfo={yearMonthInfo}>
          <DateSquarePreview
            dateNumber={dateNumber}
            yearMonthInfo={yearMonthInfo}
            previewImage={previewImage}
            boundingBox={boundingBox}
            cropNumberBoxesTall={cropNumberBoxesTall}
            cropNumberBoxesWide={cropNumberBoxesWide}
            uniqueid="modal-preview"
          ></DateSquarePreview>
        </DateSquare>
        <DropdownSelect<BoundingBoxValue>
          title="Bounding box"
          defaultValue={"writable-space"}
          value={boundingBox}
          onValueChanged={function (value: BoundingBoxValue): void {
            setBoundingBox(value);
          }}
          optionList={[
            {
              value: "square",
              title: "Whole Square",
            },
            {
              value: "writable-space",
              title: "Writable Space",
            },
          ]}
        ></DropdownSelect>
        <label>
          Number boxes wide:
          <input
            type="range"
            step="0.5"
            min={2}
            max={bounds.totalBoxesWide}
            value={cropNumberBoxesWide}
            onChange={(e) => {
              setCropNumberBoxesWide(parseInt(e.target.value));
            }}
          ></input>
        </label>
        <label>
          Number boxes tall:
          <input
            type="range"
            step="0.5"
            min={2}
            max={
              boundingBox === "square"
                ? bounds.totalBoxesTallWholeSquare
                : bounds.totalBoxesTallWritable
            }
            value={cropNumberBoxesTall}
            onChange={(e) => {
              setCropNumberBoxesTall(parseInt(e.target.value));
            }}
          ></input>
        </label>
      </div>
    </ConfirmationDialog>
  );
};

type WrapperProps = {
  imageToCrop: HTMLImageElement | null;
  aspectRatio: number;
  startingClipPathInfo: ClipPathInfo | null;
  setPreviewImage: (
    image: HTMLImageElement,
    clipPathInfo: ClipPathInfo
  ) => void;
};

function CanvasWrapper({
  imageToCrop,
  aspectRatio,
  startingClipPathInfo,
  setPreviewImage,
}: React.PropsWithRef<WrapperProps>) {
  const htmlCanvas = React.useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = React.useState<Canvas | null>(null);
  useCropPhoto(
    fabricCanvas,
    imageToCrop,
    aspectRatio,
    setPreviewImage,
    startingClipPathInfo
  );
  React.useEffect(() => {
    if (!htmlCanvas.current) {
      return;
    }
    const newlyMadeCanvas = new Canvas(htmlCanvas.current, {
      controlsAboveOverlay: true,
      renderOnAddRemove: false,
      width: htmlCanvas.current.offsetWidth,
      height: htmlCanvas.current.offsetHeight,
      uniformScaling: true,
      uniScaleKey: null,
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
