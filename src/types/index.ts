import { ToastProps } from "@components";
import { containsLetter, equalsLetter } from "@utils";

export class Board {
  rows: Array<Row>;
  word: string;
  words: Array<string>;
  toast: ToastProps;

  constructor(rows: Array<Row>, word = "") {
    this.rows = rows;
    this.word = word;
    this.words = [];
    this.toast = { open: false };
  }

  setWord(word: string) {
    this.word = word;
  }

  setRow(row: Row, pos: number) {
    this.rows.splice(pos, 1, row);
  }

  setToast(toast: ToastProps) {
    this.toast = toast;
  }

  setWords(words: Array<string>) {
    this.words = words;
  }
}

export class Row {
  position: number;
  active: boolean;
  finished: boolean;
  cols: Array<Col>;

  constructor(position: number, active = false, length = 5) {
    this.position = position;
    this.active = active;
    this.cols = [];
    this.finished = false;
    // preencher a lista com itens vazios
    for (const i of Array.from(Array(length).keys())) {
      const col = new Col(i, "", i === 0 && this.active);
      this.cols.push(col);
    }
  }

  activate(next: number) {
    if (next > 4) next = 0;
    if (next < 0) next = 4;

    for (const i in this.cols) {
      const col = this.cols[i];
      col.setActive(Number(i) === next);
    }
  }

  clear() {
    this.cols.forEach((col) => col.setActive(false));
  }

  valid(words: Array<string>) {
    const values = this.cols.map((c) => c.value);
    const word = values.join("").toLowerCase();
    const normalize = words.map((word) => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

    if (this.cols.some((x) => x.value.length === 0)) {
      return { valid: false, message: "Preencha todas as caixas. 😡" };
    } else if (!normalize.includes(word)) {
      return { valid: false, message: "Palavra não é válida. 🎯" };
    }

    const index = normalize.findIndex((x) => x === word);
    const letters = words[index].split("");
    this.cols = letters.map((letter, index) => {
      const col = this.cols[index];
      return new Col(index, letter.toUpperCase(), col.active);
    });

    return { valid: true };
  }

  setActive(active: boolean) {
    this.active = active;
  }

  setFinished(finished: boolean) {
    this.finished = finished;
  }
}

export class Col {
  value: string;
  position: number;
  active: boolean;

  constructor(position: number, value = "", active = false) {
    this.value = value;
    this.active = active;
    this.position = position;
  }

  correct(word: string) {
    return equalsLetter(word, this.value, this.position);
  }

  approximate(word: string) {
    return containsLetter(word, this.value, this.position);
  }

  setValue(value: string) {
    this.value = value;
  }

  setActive(active = false) {
    this.active = active;
  }
}
