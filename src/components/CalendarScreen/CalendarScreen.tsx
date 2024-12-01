"use client";
import * as React from "react";
import style from "./CalendarScreen.module.css";
import CalendarView from "../CalendarView";
import CalendarContextProvider from "../CalendarContextProvider/CalendarContextProvider";
import CalendarNav from "../CalendarNav";
import DragAndDropProvider from "../DragAndDropProvider";
import CalendarToolbar from "../CalendarToolbar";

function CalendarScreen() {

  return (
    <div className={style.container}>
      <CalendarContextProvider>
        <CalendarNav></CalendarNav>
        <DragAndDropProvider>
          <div className={style.inner}>
            <CalendarToolbar></CalendarToolbar>
            <CalendarView></CalendarView>
          </div>
        </DragAndDropProvider>
      </CalendarContextProvider>
    </div>
  );
}

export default CalendarScreen;
