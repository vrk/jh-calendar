"use client"
import * as React from "react";
import {
  JournalContext,
  JournalLoadedStatus,
} from "../JournalContextProvider/JournalContextProvider";
import JournalCanvas from "../JournalCanvas";

function JournalSpreadView() {
  const {
    allSpreads,
    currentSpreadId,
    journalLoadedStatus,
    currentSpreadItems,
    loadedImages,
  } = React.useContext(JournalContext);
  if (!currentSpreadId || journalLoadedStatus !== JournalLoadedStatus.Loaded) {
    return <></>;
  }
  const currentSpread = allSpreads.find(s => s.id === currentSpreadId);
  if (!currentSpread) {
    return <></>
  }
  return (
    <JournalCanvas
      key={currentSpreadId}
      currentYearMonth={currentSpread.yearMonth}
      currentSpreadId={currentSpreadId}
      currentSpreadItems={currentSpreadItems}
      loadedImages={loadedImages}
    ></JournalCanvas>
  );
}

export default JournalSpreadView;
