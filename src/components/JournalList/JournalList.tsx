import Button from "@/components/Button";
import style from "./journallist.module.css";
import { Journal } from "@/helpers/data-types";

type Props = {
  journals: Array<Journal>
}

function JournalList({journals}: Props) {
  return (
    <div className={style.list}>
      {journals.map((journal) => (
        <Button key={journal.id} href={`/journals/${journal.id}`}>
          Journal {journal.id}
        </Button>
      ))}
    </div>
  );
}

export default JournalList;
