"use client";
import * as React from "react";
import style from "./CalendarScreen.module.css";
import CreateNewJournalButton from "@/components/CreateNewJournalButton";
import JournalList from "@/components/JournalList";
import { createJournal, getAllJournals } from "@/helpers/indexdb";
import { Journal, PreviouslyLoadedCalendarKey } from "@/helpers/data-types";
import { useRouter } from 'next/navigation';

function CalendarScreen() {
  const router = useRouter();
  const [journals, setJournals] = React.useState<Array<Journal>>([]);

  // Auto-load the previously loaded calendar
  const onLoad = async () => {
    const journals = await getAllJournals();
    setJournals([...journals]);
    const lastCalendarId = window.localStorage.getItem(
      PreviouslyLoadedCalendarKey
    );
    const canLoadLastJournal = lastCalendarId && journals.find((j) => {
      j.id === lastCalendarId;
    }) !== undefined;

    if (lastCalendarId && canLoadLastJournal) {
      router.push(`/journals/${lastCalendarId}`);
    } else {
      window.localStorage.setItem(PreviouslyLoadedCalendarKey, "");
      const { journal } = await createJournal();
      router.push(`/journals/${journal.id}`);
    }
  };

  React.useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className={style.container}>
      <h1>Open Previous Calendar:</h1>
      <JournalList journals={journals}></JournalList>
      <hr></hr>
      <CreateNewJournalButton></CreateNewJournalButton>
    </div>
  );
}

export default CalendarScreen;
