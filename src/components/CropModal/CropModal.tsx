import * as React from "react";
import styles from "./CropModal.module.css";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/image";
import hobonichiCousinimage from "@/components/JournalCanvas/images/hobonichi-cousin-spread.png";
import ConfirmationDialog from "../ConfirmationDialog";

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
  <ConfirmationDialog
    className={styles.dialog}
    isOpen={isOpen}
    onConfirm={onConfirm}
    onOpenChange={onOpenChange}
    title="Crop image"
    confirm="Crop"
    cancel="Cancel"
  >
    <div className={styles.container}>
      <div className={styles.canvas}></div>
      <div className={styles.controls}></div>
    </div>
  </ConfirmationDialog>
);

export default CropModal;
