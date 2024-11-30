"use client";
import * as React from "react";
import styles from "./journalid.module.css";
import JournalContextProvider from "@/components/JournalContextProvider/JournalContextProvider";
import JournalLayoutNav from "@/components/JournalLayoutNav";
import JournalPageNav from "@/components/JournalPageNav";
import DragAndDropProvider from "@/components/DragAndDropProvider";
import JournalToolbar from "@/components/JournalToolbar";
import JournalSpreadView from "@/components/JournalSpreadView";
import { PreviouslyLoadedCalendarKey } from "@/helpers/data-types";

export default function JournalPage({
  params,
}: {
  params: { journalId: string };
}) {
  // Save as the currently loaded calendar
  window.localStorage.setItem(PreviouslyLoadedCalendarKey, params.journalId);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <JournalContextProvider journalId={params.journalId}>
          <JournalLayoutNav journalId={params.journalId}></JournalLayoutNav>
          <DragAndDropProvider>
            <div className={styles.inner}>
              <JournalToolbar></JournalToolbar>
              <JournalSpreadView></JournalSpreadView>
            </div>
          </DragAndDropProvider>
          <JournalPageNav></JournalPageNav>
        </JournalContextProvider>
      </main>
    </div>
  );
}
