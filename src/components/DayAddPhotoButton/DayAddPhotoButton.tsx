import * as React from "react";
import style from "./DayAddPhotoButton.module.css";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
};

function DayAddPhotoButton({ x, y, width, height, onClick }: Props) {
  return (
    <g>
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
