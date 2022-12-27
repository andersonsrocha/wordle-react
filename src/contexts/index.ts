import { createContext } from "react";
import { Board } from "@types";

export const AppContext = createContext<Board>(new Board([]));
