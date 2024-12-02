import * as React from 'react';
import styles from './CropModal.module.css';
import * as AlertDialog from "@radix-ui/react-alert-dialog";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
};

const CropModal = ({
  isOpen,
  onConfirm,
  onOpenChange,
}: React.PropsWithChildren<Props>) => (
  <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.AlertDialogOverlay} />
      <AlertDialog.Content className={styles.AlertDialogContent}>
        <AlertDialog.Title className={styles.AlertDialogTitle}>
          title
        </AlertDialog.Title>
        <AlertDialog.Description className={styles.AlertDialogDescription}>
          description
        </AlertDialog.Description>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialog.Cancel asChild>
            <button className={`${styles.Button} ${styles.mauve}`}>Cancel</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className={`${styles.Button} ${styles.red}`} onClick={onConfirm}>Confirm</button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default CropModal;
