import { Key } from "./keyboard";

export type Col = {
  value: Key | "";
  position: number;
  active: boolean;
  animate: boolean;
};

export type Row = {
  cols: Array<Col>;
  active: boolean;
  finished: boolean;
  position: number;
  animate: boolean;
};

export type Board = {
  rows: Array<Row>;
  word: string;
  words: Array<string>;
  finished: boolean;
};

export * from "./keyboard";
