"use client";

import { toast as sonnerToast } from "sonner";

export interface Toast {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = (props: Toast) => {
    if (props.variant === "destructive") {
      sonnerToast.error(props.title || "Error", {
        description: props.description,
      });
    } else {
      sonnerToast.success(props.title || "Success", {
        description: props.description,
      });
    }
  };

  return { toast };
}
