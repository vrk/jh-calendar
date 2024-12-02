import { add, format } from "date-fns";
import { YearMonthInfo } from "@/helpers/calendar-data-types";
import { getYearMonthInfo } from "@/helpers/calendar-helpers";
import style from "./hobonichi-generator.module.css";

const PPI = 96;
const GRID_BOX_WIDTH_IN_INCHES = 0.145669; // 3.7 mm in inches
const NUMBER_PIXELS_PER_GRID_BOX = PPI * GRID_BOX_WIDTH_IN_INCHES;

const NUMBER_BOXES_IN_MARGIN = 2;
const NUMBER_BOXES_IN_HEADER = 2;
const NUMBER_BOXES_PER_PAGE_WIDTH = 40;
const NUMBER_BOXES_PER_PAGE_HEIGHT = 57;

const NUMBER_BOXES_PER_DAY = 9;
const NUMBER_BOXES_PER_SIXTH_ROW_DAY = 6;
const NUMBER_OF_COLUMNS = 4;
const NUMBER_OF_ROWS = 5;

const NUMBER_PIXELS_PER_DAY = NUMBER_BOXES_PER_DAY * NUMBER_PIXELS_PER_GRID_BOX;
const NUMBER_PIXELS_PER_MARGIN =
  NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX;

function createSvgElement(name: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

export function createCousinCalendarSvg(svg: SVGSVGElement, yearMonth: string) {
  const graphicWidth =
    NUMBER_PIXELS_PER_GRID_BOX * NUMBER_BOXES_PER_PAGE_WIDTH * 2;
  const graphicHeight =
    NUMBER_PIXELS_PER_GRID_BOX * NUMBER_BOXES_PER_PAGE_HEIGHT;
  svg.setAttribute("viewBox", `0 0 ${graphicWidth} ${graphicHeight}`);
  svg.setAttribute("style", "border: 1px solid gainsboro");
  svg.setAttribute("preserveAspectRatio", "xMinYMin");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "auto");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );

  const staticContentsGroup = createSvgElement("g");

  const leftStartingX = NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX;
  const leftStartingY = NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX;
  const leftPageGrid = createGridsForPage(leftStartingX, leftStartingY);
  const leftPageBoxes = createDates(
    leftStartingX,
    leftStartingY,
    true,
    yearMonth
  );

  const rightStartingX =
    NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX +
    NUMBER_BOXES_PER_PAGE_WIDTH * NUMBER_PIXELS_PER_GRID_BOX;
  const rightStartingY = NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX;
  const rightPageGrid = createGridsForPage(rightStartingX, rightStartingY);
  const rightPageBoxes = createDates(
    rightStartingX,
    rightStartingY,
    false,
    yearMonth
  );
  staticContentsGroup.append(leftPageGrid);
  staticContentsGroup.append(leftPageBoxes);
  staticContentsGroup.append(rightPageGrid);
  staticContentsGroup.append(rightPageBoxes);

  return staticContentsGroup;
}

function createGridsForPage(startingX: number, startingY: number) {
  // <line x1="0" y1="3" x2="30" y2="3" stroke-dasharray="4" />
  const group = createSvgElement("g");
  for (
    let y = 0;
    y <= NUMBER_BOXES_PER_PAGE_HEIGHT - 2 * NUMBER_BOXES_IN_MARGIN;
    y++
  ) {
    const x1 = startingX;
    const y1 = startingY + y * NUMBER_PIXELS_PER_GRID_BOX;
    const x2 =
      startingX +
      NUMBER_BOXES_PER_PAGE_WIDTH * NUMBER_PIXELS_PER_GRID_BOX -
      2 * NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX;
    const y2 = y1;
    const line = createLine(x1, y1, x2, y2);
    group.append(line);
  }
  for (
    let x = 0;
    x <= NUMBER_BOXES_PER_PAGE_WIDTH - 2 * NUMBER_BOXES_IN_MARGIN;
    x++
  ) {
    const x1 = startingX + x * NUMBER_PIXELS_PER_GRID_BOX;
    const y1 = startingY;
    const x2 = x1;
    const y2 =
      startingY +
      NUMBER_BOXES_PER_PAGE_HEIGHT * NUMBER_PIXELS_PER_GRID_BOX -
      2 * NUMBER_BOXES_IN_MARGIN * NUMBER_PIXELS_PER_GRID_BOX;
    const line = createLine(x1, y1, x2, y2);
    group.append(line);
  }
  return group;
}

function createDates(
  startingX: number,
  startingY: number,
  skipFirstColumn: boolean,
  yearMonth: string
) {
  const group = createSvgElement("g");

  // Create all dates
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
      if (col === 0 && skipFirstColumn) {
        continue;
      }
      const dateInfo = getDateInfo(row, col, skipFirstColumn, yearMonth);

      const x = startingX + col * NUMBER_PIXELS_PER_DAY;
      const y =
        startingY + row * NUMBER_PIXELS_PER_DAY + NUMBER_PIXELS_PER_MARGIN;
      const dateSquare = createDateSquare(x, y, dateInfo);
      group.append(dateSquare);
    }
  }

  // Check if we've got 6 rows
  let sixthRowColumn = 1;
  let sixthRowDateInfo = getDateInfo(
    NUMBER_OF_ROWS,
    sixthRowColumn,
    skipFirstColumn,
    yearMonth
  );
  while (sixthRowDateInfo.isInMonth) {
    console.log("IS IN MONTH");
    const x = startingX + sixthRowColumn * NUMBER_PIXELS_PER_DAY;
    const y =
      startingY +
      NUMBER_OF_ROWS * NUMBER_PIXELS_PER_DAY +
      NUMBER_PIXELS_PER_MARGIN;
    const dateSquare = createSixthRowDateSquare(x, y, sixthRowDateInfo);
    group.append(dateSquare);
    sixthRowColumn++;
    sixthRowDateInfo = getDateInfo(
      NUMBER_OF_ROWS,
      sixthRowColumn,
      skipFirstColumn,
      yearMonth
    );
  }

  // Create date header row
  const labels = skipFirstColumn
    ? ["", "MON", "TUE", "WED"]
    : ["THU", "FRI", "SAT", "SUN"];
  const yearMonthInfo = getYearMonthInfo(yearMonth);
  for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
    const x = startingX + col * NUMBER_PIXELS_PER_DAY;
    const y = startingY;
    const isDouble = skipFirstColumn && col === 0;
    const label = labels[col];
    if (isDouble) {
      const square = createMonthHeader(x, y, yearMonthInfo);
      group.append(square);
    } else {
      const square = createDayHeader(x, y, label);
      group.append(square);
    }
  }
  return group;
}

function createDateSquare(
  startingX: number,
  startingY: number,
  dateInfo: DateInfo
) {
  const group = createSvgElement("g");
  const squareFill = createDaySubheadFill(startingX, startingY, dateInfo);
  group.append(squareFill);
  const square = createSvgElement("rect");
  square.setAttribute(
    "width",
    `${NUMBER_BOXES_PER_DAY * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  square.setAttribute(
    "height",
    `${NUMBER_BOXES_PER_DAY * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  square.setAttribute("x", `${startingX}`);
  square.setAttribute("y", `${startingY}`);
  square.setAttribute("stroke", "black");
  square.setAttribute("shape-rendering", "crispEdges");
  square.setAttribute("fill", "transparent");
  group.append(square);
  return group;
}

function createSixthRowDateSquare(
  startingX: number,
  startingY: number,
  dateInfo: DateInfo
) {
  const group = createSvgElement("g");
  const squareFill = createDaySubheadFill(startingX, startingY, dateInfo);
  group.append(squareFill);
  const square = createSvgElement("rect");
  square.setAttribute(
    "width",
    `${NUMBER_BOXES_PER_DAY * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  square.setAttribute(
    "height",
    `${NUMBER_BOXES_PER_SIXTH_ROW_DAY * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  square.setAttribute("x", `${startingX}`);
  square.setAttribute("y", `${startingY}`);
  square.setAttribute("stroke", "black");
  square.setAttribute("shape-rendering", "crispEdges");
  square.setAttribute("fill", "transparent");
  group.append(square);
  return group;
}

function createLine(x1: number, y1: number, x2: number, y2: number) {
  const line = createSvgElement("line");
  line.setAttribute("x1", `${x1}`);
  line.setAttribute("y1", `${y1}`);
  line.setAttribute("x2", `${x2}`);
  line.setAttribute("y2", `${y2}`);
  line.setAttribute("stroke-dasharray", "2");
  line.setAttribute("stroke", "gainsboro");
  line.setAttribute("shape-rendering", "crispEdges");
  return line;
}

function createDayHeader(
  startingX: number,
  startingY: number,
  message: string
) {
  const fillGroup = createHeaderFill(startingX, startingY, false);
  const text = createText(
    message,
    startingX,
    startingY,
    2,
    Position.MiddleRight
  );
  fillGroup.append(text);
  return fillGroup;
}

function createHeaderFill(
  startingX: number,
  startingY: number,
  isDouble: boolean
) {
  return createFillSvg(startingX, startingY, isDouble, true);
}

function createMonthHeader(
  startingX: number,
  startingY: number,
  yearMonthInfo: YearMonthInfo
) {
  const fillGroup = createHeaderFill(startingX, startingY, true);
  const monthLabel = format(
    yearMonthInfo.firstDateOfMonth,
    "MMM"
  ).toUpperCase();
  const monthOffset = 10;
  const monthX = NUMBER_PIXELS_PER_DAY + NUMBER_PIXELS_PER_MARGIN - monthOffset;
  const monthY =
    NUMBER_BOXES_IN_HEADER * 2 * NUMBER_PIXELS_PER_GRID_BOX +
    NUMBER_PIXELS_PER_MARGIN -
    monthOffset;
  const monthText = createTextAtSize(monthLabel, monthX, monthY, 28);
  monthText.setAttribute("dominant-baseline", "bottom");
  monthText.setAttribute("text-anchor", "end");
  fillGroup.append(monthText);

  const yearLabel = `${yearMonthInfo.calYear}`;
  const yearOffset = 5;
  const yearX = NUMBER_PIXELS_PER_MARGIN + yearOffset;
  const yearY = NUMBER_PIXELS_PER_MARGIN + yearOffset;
  const yearText = createTextAtSize(yearLabel, yearX, yearY, 12);
  yearText.setAttribute("dominant-baseline", "text-before-edge");
  yearText.setAttribute("text-anchor", "start");
  fillGroup.append(yearText);
  return fillGroup;
}

function createDaySubheadFill(
  startingX: number,
  startingY: number,
  dateInfo: DateInfo
) {
  const fillGroup = createFillSvg(startingX, startingY, false, false, dateInfo);
  const text = createDateText(dateInfo, startingX, startingY);
  fillGroup.append(text);
  return fillGroup;
}

function createFillSvg(
  startingX: number,
  startingY: number,
  isDouble: boolean,
  hasBorder: boolean,
  dateInfo?: DateInfo
) {
  const group = createSvgElement("g");
  const square = createSvgElement("rect");
  const numberBoxesTall = isDouble
    ? 2 * NUMBER_BOXES_IN_HEADER
    : NUMBER_BOXES_IN_HEADER;
  square.setAttribute(
    "width",
    `${NUMBER_BOXES_PER_DAY * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  square.setAttribute(
    "height",
    `${numberBoxesTall * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  square.setAttribute("x", `${startingX}`);
  square.setAttribute("y", `${startingY}`);
  if (hasBorder) {
    square.setAttribute("stroke", "black");
  }
  square.setAttribute("shape-rendering", "crispEdges");
  square.setAttribute("fill", isDouble ? "gray" : "white");
  if (dateInfo && dateInfo.isInMonth) {
    if (dateInfo.dayOfWeek === 6) {
      square.setAttribute("fill", "gainsboro");
    } else if (dateInfo.dayOfWeek === 0) {
      square.setAttribute("fill", "pink");
    }
  }
  group.append(square);
  return group;
}

enum Position {
  Left,
  MiddleRight,
}

function createText(
  message: string,
  startingX: number,
  startingY: number,
  numberBoxesTall: number,
  position: Position
) {
  const text = createSvgElement("text");
  let offset = NUMBER_PIXELS_PER_GRID_BOX;
  if (position === Position.MiddleRight) {
    offset = NUMBER_PIXELS_PER_GRID_BOX * 5;
  }
  text.setAttribute("x", `${startingX + offset}`);
  text.setAttribute(
    "y",
    `${startingY + (numberBoxesTall * NUMBER_PIXELS_PER_GRID_BOX) / 2 + 1}`
  );
  text.setAttribute(
    "height",
    `${numberBoxesTall * NUMBER_PIXELS_PER_GRID_BOX}`
  );
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "black");
  text.innerHTML = message;
  return text;
}

function createTextAtSize(
  message: string,
  startingX: number,
  startingY: number,
  size: number
) {
  const text = createSvgElement("text");
  text.setAttribute("x", `${startingX}`);
  text.setAttribute("y", `${startingY}`);
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "white");
  text.setAttribute("style", `font-size: ${size}px; letter-spacing: 1px;`);
  text.innerHTML = message;
  return text;
}

function createDateText(
  dateInfo: DateInfo,
  startingX: number,
  startingY: number
) {
  const text = createText(
    `${dateInfo.dateNumber}`,
    startingX,
    startingY,
    2,
    Position.Left
  );
  if (!dateInfo.isInMonth) {
    text.setAttribute("opacity", "50%");
  }
  if (dateInfo.dayOfWeek === 0) {
    text.setAttribute("fill", "red");
  }
  return text;
}

type DateInfo = {
  dateNumber: number;
  dayOfWeek: number;
  isInMonth: boolean;
};

function getDateInfo(
  row: number,
  col: number,
  skipFirstColumn: boolean,
  yearMonth: string
): DateInfo {
  const { calMonth, firstDateOfMonth } = getYearMonthInfo(yearMonth);
  let dayOfFirst = firstDateOfMonth.getDay();
  if (dayOfFirst === 0) {
    dayOfFirst = 7;
  }
  if (skipFirstColumn && col === 0) {
    throw new Error("shouldn't have date info");
  }
  let colOffset = 0;
  if (!skipFirstColumn) {
    colOffset = 4;
  }
  let offsetFromFirstDay = row * 7 - dayOfFirst + col + colOffset;
  const todaysDate = add(firstDateOfMonth, {
    days: offsetFromFirstDay,
  });
  const dateNumber = todaysDate.getDate();
  const isInMonth = todaysDate.getMonth() === calMonth;
  const dayOfWeek = todaysDate.getDay();

  return {
    dateNumber,
    isInMonth,
    dayOfWeek,
  };
}

type ClickableDateProps = {
  dayInMonth: number;
  yearMonthInfo: YearMonthInfo;
};

export function ClickableDate({
  dayInMonth,
  yearMonthInfo,
}: ClickableDateProps) {
  const itemWidth = 80;
  const itemHeight = 30;

  const today = new Date(
    yearMonthInfo.calYear,
    yearMonthInfo.calMonth,
    dayInMonth
  );

  let todaysDay = today.getDay();
  if (todaysDay === 0) {
    todaysDay = 7;
  }
  let margin = NUMBER_PIXELS_PER_MARGIN;
  if (todaysDay > 3) {
    margin *= 3;
  }

  // Remap offsets to have a Monday start - that means day - 1, but change -1 (sunday) to 6 (last)
  let offset = yearMonthInfo.firstDateOfMonth.getDay() - 1;
  if (offset === -1) {
    offset = 6;
  }
  const zeroIndexedDate = today.getDate() - 1;
  const weekNumber = Math.floor((zeroIndexedDate + offset) / 7);

  const widthDelta = NUMBER_PIXELS_PER_DAY - itemWidth;
  const x = margin + todaysDay * NUMBER_PIXELS_PER_DAY + widthDelta / 2;

  const heightOfMyBox =
    weekNumber === 5
      ? NUMBER_BOXES_PER_SIXTH_ROW_DAY * NUMBER_PIXELS_PER_GRID_BOX
      : NUMBER_PIXELS_PER_DAY;

  const heightDelta = heightOfMyBox - itemHeight;
  let y =
    weekNumber * NUMBER_PIXELS_PER_DAY +
    NUMBER_PIXELS_PER_MARGIN * 2 +
    heightDelta / 2;
    
  return (
    <g>
      {/* <circle cx={cx} cy={cy} r={itemWidth / 2} fill="lightgreen" stroke="green" strokeWidth={2}></circle>
      <Line path={path1}></Line>
      <Line path={path2}></Line> */}
      <foreignObject
        className={style.plusButtonContainer}
        x={x}
        y={y}
        width={itemWidth}
        height={itemHeight}
      >
        <div className={style.plusButton}>
          <span className={style.plus}>+</span>{" "}
          <span className={style.add}>Photo</span>
        </div>
      </foreignObject>
    </g>
  );
}

function Line({ path }: { path: string }) {
  return (
    <path
      d={path}
      stroke="gray"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
