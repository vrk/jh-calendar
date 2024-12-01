import * as React from "react";
import style from "./CalendarNav.module.css";
import NavBar from "../NavBar";
import Button from "../Button";
import MonthPicker from "../MonthPicker";

function CalendarNav() {
  return (
    <NavBar>
      <div className={style.controls}>
        <Button>Clear</Button>
        <MonthPicker></MonthPicker>
      </div>
      <Button>
        Ready to print
      </Button>
    </NavBar>
  );
}

export default CalendarNav;
