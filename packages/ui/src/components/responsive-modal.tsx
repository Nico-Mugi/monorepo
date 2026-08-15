import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "../utils/cn";

const Modal = DialogPrimitive.Root;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

function ModalTrigger({ render }: { render: ReactElement }) {
  return <DialogPrimitive.Trigger render={render} />;
}

function ModalOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        "data-open:animate-in data-closed:animate-out",
        "data-closed:fade-out-0 data-open:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

const modalVariants = cva(
  cn(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
    "data-open:animate-in data-closed:animate-out",
    "data-closed:duration-300 data-open:duration-500 overflow-y-auto",
    "lg:left-[50%] lg:top-[50%] lg:w-full lg:max-w-lg lg:translate-x-[-50%] lg:translate-y-[-50%]",
    "lg:border lg:duration-200 lg:data-open:animate-in lg:data-closed:animate-out",
    "lg:data-closed:fade-out-0 lg:data-open:fade-in-0",
    "lg:data-closed:zoom-out-95 lg:data-open:zoom-in-95 lg:rounded-xl",
  ),
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b rounded-b-xl max-h-[80dvh] lg:h-fit data-closed:slide-out-to-top data-open:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t lg:h-fit max-h-[80dvh] rounded-t-xl data-closed:slide-out-to-bottom data-open:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full lg:h-fit w-3/4 border-r rounded-r-xl data-closed:slide-out-to-left data-open:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full lg:h-fit w-3/4 border-l rounded-l-xl data-closed:slide-out-to-right data-open:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  },
);

type ModalContentProps = DialogPrimitive.Popup.Props &
  VariantProps<typeof modalVariants> &
  Pick<DialogPrimitive.Portal.Props, "container">;

/**
 * `container` mirrors popover.tsx's own fix (Pass 2): without it, this always portals to
 * document.body, which native fullscreen only ever paints the fullscreen element's own
 * subtree over - anything portalled outside it is invisible even though it's still in
 * the DOM. Optional and harmless outside fullscreen (falls back to Base UI's own
 * document.body default when omitted).
 */
function ModalContent({
  side = "bottom",
  className,
  children,
  container,
  ...props
}: ModalContentProps) {
  return (
    <ModalPortal container={container}>
      <ModalOverlay />
      <DialogPrimitive.Popup
        aria-describedby="responsive-modal-description"
        className={cn(modalVariants({ side }), className)}
        {...props}
      >
        {children}
        <ModalClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-open:bg-secondary">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </ModalClose>
      </DialogPrimitive.Popup>
    </ModalPortal>
  );
}

function ModalHeader(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("flex flex-col space-y-2 text-center sm:text-left", props.className)}
    />
  );
}

function ModalFooter(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        props.className,
      )}
    />
  );
}

function ModalTitle(props: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn("text-lg font-semibold text-foreground", props.className)}
    />
  );
}

function ModalDescription(props: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cn("text-sm text-muted-foreground", props.className)}
    />
  );
}

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
