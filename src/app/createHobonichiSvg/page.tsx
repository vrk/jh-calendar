"use client";
import * as React from "react";

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
const NUMBER_PIXELS_PER_MARGIN = NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;


export default function HobonichiSvg() {
  const overallContainer = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!overallContainer.current || isLoaded) {
      return;
    }
    const box = createCousinSvg();
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

function createCousinSvg() {
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
  const leftPageBoxes = createDates(leftStartingX, leftStartingY, true);

  const rightStartingX =
    NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS +
    NUMBER_BOXES_PER_PAGE_WIDTH * GRID_BOX_WIDTH_IN_PIXELS;
  const rightStartingY = NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
  const rightPageGrid = createGridsForPage(rightStartingX, rightStartingY);
  const rightPageBoxes = createDates(rightStartingX, rightStartingY, false);
  svg.append(leftPageGrid);
  svg.append(leftPageBoxes);
  svg.append(rightPageGrid);
  svg.append(rightPageBoxes);

  return svg;
}

function createGridsForPage(startingX: number, startingY: number) {
  // <line x1="0" y1="3" x2="30" y2="3" stroke-dasharray="4" />
  const group = createSvgElement("g");
  for (let y = 0; y <= NUMBER_BOXES_PER_PAGE_HEIGHT - 2 * NUMBER_BOXES_IN_MARGIN; y++) {
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
  for (let x = 0; x <= NUMBER_BOXES_PER_PAGE_WIDTH - 2 * NUMBER_BOXES_IN_MARGIN; x++) {
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

function createDates(startingX: number, startingY: number, skipFirstColumn: boolean) {
  const group = createSvgElement("g");
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
      if (col === 0 && skipFirstColumn) {
        continue;
      }
      
      const x = startingX + col * NUMBER_PIXELS_PER_DAY; 
      const y = startingY + row * NUMBER_PIXELS_PER_DAY + NUMBER_PIXELS_PER_MARGIN; 
      const dateSquare = createDateSquare(x, y);
      group.append(dateSquare);
    }
  }
  for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
    const x = startingX + col * NUMBER_PIXELS_PER_DAY; 
    const y = startingY;
    const isDouble = skipFirstColumn && col === 0;
    const square = createHeaderFill(x, y, isDouble);
    group.append(square);
  }
  return group;
}

function createDateSquare(startingX: number, startingY: number) {
  const group = createSvgElement("g");
  const squareFill = createDateHeaderFill(startingX, startingY);
  group.append(squareFill);
  const square = createSvgElement("rect");
  square.setAttribute("width", `${NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS}`);
  square.setAttribute("height", `${NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS}`);
  square.setAttribute("x", `${startingX}`)
  square.setAttribute("y", `${startingY}`)
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

function createHeaderFill(startingX: number, startingY: number, isDouble: boolean) {
  return createHeaderFillInside(startingX, startingY, isDouble, true);
}

function createDateHeaderFill(startingX: number, startingY: number) {
  return createHeaderFillInside(startingX, startingY, false, false);
}

function createHeaderFillInside(startingX: number, startingY: number, isDouble: boolean, hasBorder: boolean) {
  const group = createSvgElement("g");
  const square = createSvgElement("rect");
  const numberBoxesTall = isDouble ? 2 * NUMBER_BOXES_IN_HEADER : NUMBER_BOXES_IN_HEADER; 
  square.setAttribute("width", `${NUMBER_BOXES_PER_DAY * GRID_BOX_WIDTH_IN_PIXELS}`);
  square.setAttribute("height", `${numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS}`);
  square.setAttribute("x", `${startingX}`)
  square.setAttribute("y", `${startingY}`)
  if (hasBorder) {
    square.setAttribute("stroke", "black");
  }
  square.setAttribute("shape-rendering", "crispEdges");
  square.setAttribute("fill", isDouble ? "gray" : "white");
  //   <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">TEXT</text>    
  const text = createSvgElement("text");
  const offset = GRID_BOX_WIDTH_IN_PIXELS;
  text.setAttribute("x", `${startingX + offset}`)
  text.setAttribute("y", `${startingY + numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS / 2 + 1}`)
  text.setAttribute("height", `${numberBoxesTall * GRID_BOX_WIDTH_IN_PIXELS}`)
  text.setAttribute("dominant-baseline", 'middle');
  text.setAttribute("text-anchor", 'middle');
  text.setAttribute("style", 'color: black');
  text.innerHTML = "25";
  group.append(square);
  group.append(text);
  return group;
}