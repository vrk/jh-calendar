import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from './ConfirmationDialog.module.css';
import { ClipPathInfo, FullCroppedPhotoInfo } from "@/helpers/calendar-data-types";

type Props = {
  isOpen: boolean;
  title: string;
  cancel: string;
  confirm: string;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  className?: string;
};

const ConfirmationDialog = ({
  title,
  cancel,
  confirm,
  onConfirm,
  onOpenChange,
  isOpen,
  className,
  children
}: React.PropsWithChildren<Props>) => (
  <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange} >
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.AlertDialogOverlay} />
      <AlertDialog.Content className={`${styles.AlertDialogContent} ${className}`}>

        <AlertDialog.Title className={styles.AlertDialogTitle}>
          {title}
        </AlertDialog.Title>

        <AlertDialog.Description></AlertDialog.Description>
        <div className={styles.AlertDialogDescription}>
          {children}
        </div>

        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialog.Cancel asChild>
            <button className={`${styles.Button} ${styles.mauve}`}>{cancel}</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className={`${styles.Button} ${styles.violet}`} onClick={onConfirm}>{confirm}</button>
          </AlertDialog.Action>
        </div>

      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default ConfirmationDialog;
