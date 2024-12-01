"use client";
import * as React from "react";
import { add } from 'date-fns'

const PPI = 96;
const GRID_BOX_WIDTH_IN_INCHES = 0.145669; // 3.7 mm in inches
const GRID_BOX_WIDTH_IN_PIXELS = PPI * GRID_BOX_WIDTH_IN_INCHES;

const NUMBER_BOXES_IN_MARGIN = 2;
const NUMBER_BOXES_IN_HEADER = 2;
const NUMBER_BOXES_PER_PAGE_WIDTH = 40;
const NUMBER_BOXES_PER_PAGE_HEIGHT = 57;

const NUMBER_BOXES_PER_DAY = 9;
const NUMBER_OF_COLUMNS = 4;
const NUMBER_OF_ROWS = 5;

const NUMBER_PIXELS_PER_DAY = NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS;
const NUMBER_PIXELS_PER_MARGIN =
  NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;

export default function HobonichiSvg() {
  const overallContainer = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!overallContainer.current || isLoaded) {
      return;
    }
    const box = createCousinSvg("2024-11");
    overallContainer.current.append(box);
    setIsLoaded(true);
    return () => {
      if (!overallContainer.current) {
        return;
      }
      overallContainer.current.innerHTML = "";
    };
  }, [overallContainer]);

  return (
    <div>
      hi
      <div ref={overallContainer}></div>
    </div>
  );
}

function createSvgElement(name: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function createCousinSvg(yearMonth: string) {
  const svg = createSvgElement("svg");
  svg.setAttribute("style", "border: 1px solid black");
  svg.setAttribute(
    "width",
    `${GRID_BOX_WIDTH_IN_PIXELS * NUMBER_BOXES_PER_PAGE_WIDTH * 2}`
  );
  svg.setAttribute(
    "height",
    `${GRID_BOX_WIDTH_IN_PIXELS * NUMBER_BOXES_PER_PAGE_HEIGHT}`
  );
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );

  const leftStartingX = NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
  const leftStartingY = NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
  const leftPageGrid = createGridsForPage(leftStartingX, leftStartingY);
  const leftPageBoxes = createDates(leftStartingX, leftStartingY, true, yearMonth);

  const rightStartingX =
    NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS +
    NUMBER_BOXES_PER_PAGE_WIDTH * GRID_BOX_WIDTH_IN_PIXELS;
  const rightStartingY = NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
  const rightPageGrid = createGridsForPage(rightStartingX, rightStartingY);
  const rightPageBoxes = createDates(rightStartingX, rightStartingY, false, yearMonth);
  svg.append(leftPageGrid);
  svg.append(leftPageBoxes);
  svg.append(rightPageGrid);
  svg.append(rightPageBoxes);

  return svg;
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
    const y1 = startingY + y * GRID_BOX_WIDTH_IN_PIXELS;
    const x2 =
      startingX +
      NUMBER_BOXES_PER_PAGE_WIDTH * GRID_BOX_WIDTH_IN_PIXELS -
      2 * NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
    const y2 = y1;
    const line = createLine(x1, y1, x2, y2);
    group.append(line);
  }
  for (
    let x = 0;
    x <= NUMBER_BOXES_PER_PAGE_WIDTH - 2 * NUMBER_BOXES_IN_MARGIN;
    x++
  ) {
    const x1 = startingX + x * GRID_BOX_WIDTH_IN_PIXELS;
    const y1 = startingY;
    const x2 = x1;
    const y2 =
      startingY +
      NUMBER_BOXES_PER_PAGE_HEIGHT * GRID_BOX_WIDTH_IN_PIXELS -
      2 * NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
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

  // Create date header row
  const labels = skipFirstColumn
    ? ["", "MON", "TUE", "WED"]
    : ["THU", "FRI", "SAT", "SUN"];
  for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
    const x = startingX + col * NUMBER_PIXELS_PER_DAY;
    const y = startingY;
    const isDouble = skipFirstColumn && col === 0;
    const label = labels[col];
    if (isDouble) {
      const square = createHeaderFill(x, y, isDouble);
      group.append(square);
    } else {
      const square = createDayHeader(x, y, label);
      group.append(square);
    }
  }
  return group;
}

function createDateSquare(startingX: number, startingY: number, dateInfo: { dayNumber: string, isInMonth: boolean }) {
  const group = createSvgElement("g");
  const squareFill = createDaySubheadFill(startingX, startingY, dateInfo);
  group.append(squareFill);
  const square = createSvgElement("rect");
  square.setAttribute(
    "width",
    `${NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS}`
  );
  square.setAttribute(
    "height",
    `${NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS}`
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

function createDayHeader(startingX: number, startingY: number, message: string) {
  const fillGroup = createHeaderFill(startingX, startingY, false);
  const text = createText(message, startingX, startingY, 2, Position.MiddleRight);
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

function createDaySubheadFill(startingX: number, startingY: number,  dateInfo: { dayNumber: string, isInMonth: boolean }) {
  const fillGroup = createFillSvg(startingX, startingY, false, false);
  const text = createText(dateInfo.dayNumber, startingX, startingY, 2, Position.Left);
  fillGroup.append(text);
  return fillGroup;
}

function createFillSvg(
  startingX: number,
  startingY: number,
  isDouble: boolean,
  hasBorder: boolean
) {
  const group = createSvgElement("g");
  const square = createSvgElement("rect");
  const numberBoxesTall = isDouble
    ? 2 * NUMBER_BOXES_IN_HEADER
    : NUMBER_BOXES_IN_HEADER;
  square.setAttribute(
    "width",
    `${NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS}`
  );
  square.setAttribute(
    "height",
    `${numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS}`
  );
  square.setAttribute("x", `${startingX}`);
  square.setAttribute("y", `${startingY}`);
  if (hasBorder) {
    square.setAttribute("stroke", "black");
  }
  square.setAttribute("shape-rendering", "crispEdges");
  square.setAttribute("fill", isDouble ? "gray" : "white");
  //   <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">TEXT</text>
  // const text = createSvgElement("text");
  // const offset = GRID_BOX_WIDTH_IN_PIXELS;
  // text.setAttribute("x", `${startingX + offset}`);
  // text.setAttribute(
  //   "y",
  //   `${startingY + (numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS) / 2 + 1}`
  // );
  // text.setAttribute("height", `${numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS}`);
  // text.setAttribute("dominant-baseline", "middle");
  // text.setAttribute("text-anchor", "middle");
  // text.setAttribute("style", "color: black");
  // text.innerHTML = "25";
  group.append(square);
  // group.append(text);
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
  let offset = GRID_BOX_WIDTH_IN_PIXELS;
  if (position === Position.MiddleRight) {
    offset = GRID_BOX_WIDTH_IN_PIXELS * 5;
  }
  text.setAttribute("x", `${startingX + offset}`);
  text.setAttribute(
    "y",
    `${startingY + (numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS) / 2 + 1}`
  );
  text.setAttribute("height", `${numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS}`);
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("style", "color: black");
  text.innerHTML = message;
  return text;
}

function getDateInfo(row: number, col: number, skipFirstColumn: boolean, yearMonth: string) {
  const [ year, month ] = yearMonth.split('-'); 
  const yearAsNum = parseInt(year);
  const monthAsNum = parseInt(month) - 1;
  const firstDateOfMonth = new Date(yearAsNum, monthAsNum, 1);
  const dayOfFirst = firstDateOfMonth.getDay();
  // dayOfFirst = 3;

  if (skipFirstColumn && col === 0) {
    throw new Error("shouldn't have date info");
  }
  let colOffset = 0;
  if (!skipFirstColumn) {
    colOffset = 4;
  }
  let offsetFromFirstDay = row * 7 - dayOfFirst + col + colOffset;
  const todaysDate = add(firstDateOfMonth, {
    days: offsetFromFirstDay
  })
  const dayNumber = `${todaysDate.getDate()}`;
  const isInMonth = todaysDate.getMonth() === monthAsNum;

  return { dayNumber, isInMonth };
}