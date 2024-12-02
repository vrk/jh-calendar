import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./CanvasConfirmationDialog.module.css";

type Props = {
  isOpen: boolean;
  title: string;
  cancel: string;
  confirm: string;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
  className?: string;
  imageToCrop: HTMLImageElement | null;
};

const CanvasConfirmationDialog = ({
  title,
  cancel,
  confirm,
  onConfirm,
  onOpenChange,
  isOpen,
  className,
  children,
}: React.PropsWithChildren<Props>) => {
  const htmlCanvas = React.useRef<HTMLCanvasElement>(null);
  const htmlElement = React.useRef<HTMLDivElement>(null);
  // const [ fabricCanvas, setFabricCanvas] = React.useState<Canvas|null>(null);
  // useCropPhoto(fabricCanvas, imageToCrop);

  React.useEffect(() => {
    console.log("canvas changed", htmlElement.current);
  }, [htmlElement]);
  const loaded = () => {
    console.log("loaded", htmlCanvas.current);
    return <></>;
  };

  // const myOnOpenChange = (isOpen: boolean) => {
  //   console.log('open changed');
  //   if (isOpen) {
  //     if (!htmlCanvas.current) {
  //       return;
  //     }
  //     const newlyMadeCanvas = new Canvas(htmlCanvas.current, {
  //       controlsAboveOverlay: true,
  //       renderOnAddRemove: false,
  //     });
  //     console.log("creating canvas");
  //     setFabricCanvas(newlyMadeCanvas)
  //   } else {
  //     setFabricCanvas(null);
  //   }

  //   onOpenChange(isOpen);
  // }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.AlertDialogOverlay} />
        <AlertDialog.Content
          className={`${styles.AlertDialogContent} ${className}`}
          forceMount={true}
          ref={htmlElement}
        >
          {loaded()}
          <AlertDialog.Title className={styles.AlertDialogTitle}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description></AlertDialog.Description>

          <div className={styles.AlertDialogDescription}>
            <div className={styles.container}>
              <CanvasWrapper></CanvasWrapper>
              <div className={styles.controls}></div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
            <AlertDialog.Cancel asChild>
              <button className={`${styles.Button} ${styles.mauve}`}>
                {cancel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className={`${styles.Button} ${styles.violet}`}
                onClick={onConfirm}
              >
                {confirm}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

function CanvasWrapper() {
  const htmlCanvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    console.log("trick canvas", htmlCanvas);
  }, [htmlCanvas]);
  return (
    <div>
      <canvas ref={htmlCanvas} className={styles.canvas}></canvas>
    </div>
  );
}

export default CanvasConfirmationDialog;
