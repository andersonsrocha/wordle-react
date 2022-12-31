import { createContext } from "react";
import { Board } from "@types";

type ToastProps = (open: boolean, text?: string) => void;

export const AppContext = createContext<Board>({ rows: [], finished: false, word: "", words: [] });

export const ToastContext = createContext<ToastProps>(() => {});
