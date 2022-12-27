import { ReactNode } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

export type ToastProps = {
  text?: ReactNode;
  open?: boolean;
  onOpenChange?: () => void;
};

export function Toast({ open, onOpenChange, text }: ToastProps) {
  return (
    <ToastPrimitive.Provider swipeDirection="up">
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className="bg-secondary rounded-md shadow-md px-4 py-3"
      >
        <ToastPrimitive.Description className="text-white text-xs">
          {text}
        </ToastPrimitive.Description>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed top-14 left-1/2 -translate-x-1/2" />
    </ToastPrimitive.Provider>
  );
}
