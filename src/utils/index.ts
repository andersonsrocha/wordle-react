import { WORDS_DATA_REPO_URL_V2 } from "@constants";

export const getAllWords = async (len = 5) => {
  const response = await fetch(WORDS_DATA_REPO_URL_V2);
  const words = (await response.text()).split("\n");

  return words.filter((word) => word.length === len);
};

export const getRandomWord = async () => {
  const words = await getAllWords();
  return words[Math.floor(Math.random() * words.length)];
};

export const normalize = (word: string) => {
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
