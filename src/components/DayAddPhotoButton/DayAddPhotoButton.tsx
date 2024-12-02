import * as React from "react";
import style from "./DayAddPhotoButton.module.css";
import { getFileFromFilePicker as getFileFromFilePicker, getRawImageDataFromFile, PhotoSelectionType } from "@/helpers/file-input";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  dayInMonth: number;
};

function DayAddPhotoButton({ x, y, width, height, dayInMonth }: Props) {
  const onClick = async () => {
    const files = await getFileFromFilePicker(PhotoSelectionType.Single);
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const rawImageData = await getRawImageDataFromFile(file);
  };
  return (
    <g>
      {/* <circle cx={cx} cy={cy} r={itemWidth / 2} fill="lightgreen" stroke="green" strokeWidth={2}></circle>
      <Line path={path1}></Line>
      <Line path={path2}></Line> */}
      <foreignObject
        className={style.plusButtonContainer}
        x={x}
        y={y}
        width={width}
        height={height}
        onClick={onClick}
      >
        <div className={style.plusButton}>
          <span className={style.plus}>+</span>{" "}
          <span className={style.add}>Photo</span>
        </div>
      </foreignObject>
    </g>
  );
}

export default DayAddPhotoButton;
