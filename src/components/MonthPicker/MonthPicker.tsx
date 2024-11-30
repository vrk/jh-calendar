import * as React from 'react';
import style from './MonthPicker.module.css';
import { JournalContext } from '../JournalContextProvider/JournalContextProvider';

function MonthPicker() {
  const { currentSpreadId, allSpreads, setCurrentSpreadDate } = React.useContext(JournalContext);
  const [ currentSpreadMonthDate, setCurrentSpreadMonthDate ] = React.useState("");
  React.useEffect(() => {
    const currentSpread = allSpreads.find((s) => s.id === currentSpreadId);
    if (!currentSpread) {
      throw new Error("Current Spread not loaded");
    }
    setCurrentSpreadMonthDate(currentSpread.yearMonth);
  }, [currentSpreadId, allSpreads]);

  return <div className={style.container}>
    <input type="month" value={currentSpreadMonthDate} onChange={(event) => {
      setCurrentSpreadDate(event.target.value);
    }}/>
  </div>;
}

export default MonthPicker;
