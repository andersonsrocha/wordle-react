import { WORDS_DATA_REPO_URL_V2 } from "@constants";

import { Board, Col, Row } from "@types";

export const getAllWords = async (len = 5) => {
  const response = await fetch(WORDS_DATA_REPO_URL_V2);
  const words = (await response.text()).split("\n");

  return words.filter((word) => word.length === len);
};

export const getRandomWord = async () => {
  const words = await getAllWords();
  return words[Math.floor(Math.random() * words.length)];
};

export const normalize = (word: string = "") => {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const equalsLetter = (word: string, value: string, col: number) => {
  const correctPosition = Math.floor(col > 5 ? col / 6 : col);
  const normalized = normalize(word.toLowerCase());
  const valueNormalized = normalize(value.toLowerCase());

  return normalized[correctPosition] === valueNormalized;
};

export const containsLetter = (word: string, value: string, col: number) => {
  const correctPosition = Math.floor(col > 5 ? col / 6 : col);
  const normalized = normalize(word.toLowerCase());
  const valueNormalized = normalize(value.toLowerCase());

  return normalized.includes(valueNormalized) && normalized[correctPosition] !== valueNormalized;
};

export const equals = (word: string, value: string) => {
  return normalize(word.toLowerCase()) === normalize(value.toLowerCase());
};

export const compoundBoard = (rows: number = 6, cols: number = 5) => {
  return Array.from(Array(rows).keys()).map<Row>((row) => ({
    active: row === 0,
    animate: false,
    finished: false,
    position: row,
    cols: Array.from(Array(cols).keys()).map<Col>((col) => ({
      active: col === 0 && row === 0,
      animate: false,
      position: col,
      value: "",
    })),
  }));
};

export const skipCol = (row: Row, pos: number) => {
  const { cols } = row;

  if (pos > 4) pos = 0;
  if (pos < 0) pos = 4;

  for (const i in cols) {
    const col = cols[i];
    col.active = Number(i) === pos;
  }

  return row;
};
