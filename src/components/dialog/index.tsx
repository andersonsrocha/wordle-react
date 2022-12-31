import { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons";

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
};

export function Dialog({ open, onOpenChange, ...restProps }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-black/90 fixed inset-0 animate-duration-700 animate-fadeIn" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-200">
          <DialogPrimitive.Content className="bg-primary rounded-md shadow-md w-[90vw] max-w-md max-h-[85vh] p-6 animate-duration-700 animate-bounceIn focus:outline-none">
            <DialogPrimitive.Title className="m-0 font-medium text-lg text-center">
              {restProps.title}
            </DialogPrimitive.Title>
            <div className="mt-3 mb-5 text-sm">{restProps.description}</div>

            <DialogPrimitive.Close asChild>
              <button
                aria-label="Close"
                className="inline-flex items-center justify-center rounded-full h-5 w-5 absolute top-2.5 right-2.5 font-black border-2 border-white hover:scale-110"
              >
                <IconX stroke={4} size={10} />
              </button>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
