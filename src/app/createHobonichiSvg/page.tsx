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
  svg.setAttribute('style', 'border: 1px solid black');
  svg.setAttribute("width", `${GRID_BOX_WIDTH_IN_PIXELS * NUMBER_BOXES_PER_PAGE_WIDTH * 2}`);
  svg.setAttribute("height", `${GRID_BOX_WIDTH_IN_PIXELS * NUMBER_BOXES_PER_PAGE_HEIGHT}`);
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );

  return svg;
}
