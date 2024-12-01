"use client";
import * as React from "react";
import style from "./CalendarScreen.module.css";
import { createJournal, getAllJournals } from "@/helpers/indexdb";
import CalendarView from "../CalendarView";
import { loadYearMonthInfo } from "@/helpers/indexeddb";

function CalendarScreen() {

  return (
    <div className={style.container}>
      <CalendarView></CalendarView>
    </div>
  );
}

export default CalendarScreen;
