"use client";
import * as React from "react";

const PPI = 96;
const GRID_BOX_WIDTH_IN_INCHES = 0.145669; // 3.7 mm in inches
const GRID_BOX_WIDTH_IN_PIXELS = PPI * GRID_BOX_WIDTH_IN_INCHES;

const NUMBER_BOXES_IN_MARGIN = 2;
const NUMBER_BOXES_PER_PAGE_WIDTH = 40;
const NUMBER_BOXES_PER_PAGE_HEIGHT = 57;

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

  const rightStartingX =
    NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS +
    NUMBER_BOXES_PER_PAGE_WIDTH * GRID_BOX_WIDTH_IN_PIXELS;
  const rightStartingY = NUMBER_BOXES_IN_MARGIN * GRID_BOX_WIDTH_IN_PIXELS;
  const rightPageGrid = createGridsForPage(rightStartingX, rightStartingY);
  svg.append(leftPageGrid);
  svg.append(rightPageGrid);

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

function createLine(x1: number, y1: number, x2: number, y2: number) {
  const line = createSvgElement("line");
  line.setAttribute("x1", `${x1}`);
  line.setAttribute("y1", `${y1}`);
  line.setAttribute("x2", `${x2}`);
  line.setAttribute("y2", `${y2}`);
  line.setAttribute("stroke-dasharray", "2");
  line.setAttribute("stroke", "gainsboro");
  return line;
}
