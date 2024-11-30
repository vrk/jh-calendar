import CalendarScreen from "@/components/CalendarScreen";
import styles from "./page.module.css";

export default async function Home() {
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CalendarScreen></CalendarScreen>
      </main>
    </div>
  );
}
