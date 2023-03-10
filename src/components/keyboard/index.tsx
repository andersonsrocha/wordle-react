import { useCallback, useContext, useEffect, useMemo } from "react";
import { IconBackspace, IconCornerDownLeft } from "@tabler/icons";
import { MSG_EMPTY_BOX, MSG_LOSE, MSG_WON, MSG_WORD_NOT_VALID } from "@constants";
import { AppContext, ToastContext } from "@contexts";
import { equals, equalsLetter, normalize, skipCol } from "@utils";
import classNames from "classnames";

import { Button } from "..";

import { Board, Col, Key } from "@types";

type Props = {
  reload: (value: Board) => void;
};

export function Keyboard({ reload }: Props) {
  const board = useContext(AppContext);
  const onOpenChange = useContext(ToastContext);

  const onKeyClicked = useCallback(
    (key: Key) => {
      const row = board.rows.find((row) => row.active);
      if (!row) return;

      const col = row.cols.find((col) => col.active);
      if (!col) return;

      col.value = key;
      col.animate = true;
      // pular para a próxima coluna
      skipCol(row, col.position + 1);
      // atualiza o tabuleiro com a mudança
      reload(board);
    },
    [board, reload]
  );

  const onArrowClicked = useCallback(
    (placement: "ARROWLEFT" | "ARROWRIGHT") => {
      const row = board.rows.find((row) => row.active);
      if (!row) return;

      const col = row.cols.find((col) => col.active);
      if (!col) return;
      // se for seta para esquerda ou seta para direita,
      // move uma casa para esquerda ou para a direita
      if (["ARROWLEFT", "ARROWRIGHT"].includes(placement)) {
        skipCol(row, col.position + (placement === "ARROWLEFT" ? -1 : +1));
        reload(board);
      }
    },
    [board, reload]
  );

  const onBackspaceClicked = useCallback(() => {
    const row = board.rows.find((row) => row.active);
    if (!row) return;

    const col = row.cols.find((col) => col.active);
    if (!col) return;

    if (col.value) {
      col.value = "";
    } else {
      skipCol(row, col.position - 1);
      const prev = row.cols.find((col) => col.active);
      if (!prev) return;

      prev.value = "";
    }

    reload(board);
  }, [board, reload]);

  const onEnterClicked = useCallback(() => {
    if (board.finished) return;
    // fecha caso esteja sendo exibida uma mensagem
    onOpenChange(false);

    const row = board.rows.find((row) => row.active);
    if (!row) return;

    const values = row.cols.map((c) => c.value);
    const rowWord = values.join("").toLowerCase();
    const normalized = board.words.map((word) => normalize(word));

    // remove a animação
    row.animate = false;

    // verifica se a linha é válida
    if (row.cols.some((x) => x.value.length === 0)) {
      onOpenChange(true, MSG_EMPTY_BOX);
      row.animate = true;

      return reload(board);
    } else if (!normalized.includes(rowWord)) {
      onOpenChange(true, MSG_WORD_NOT_VALID);
      row.animate = true;

      return reload(board);
    }

    row.finished = true;

    const index = normalized.findIndex((x) => x === rowWord);
    const letters = board.words[index].toUpperCase().split("") as Array<Key>;
    row.cols = letters.map<Col>((letter, index) => {
      return { active: false, value: letter, position: index, animate: true };
    });

    const concluded = equals(board.word, row.cols.map((c) => c.value).join(""));
    if (concluded) {
      board.finished = concluded;
      onOpenChange(true, MSG_WON);
    } else {
      row.active = false;
      const next = board.rows[row.position + 1];
      if (next) {
        next.active = true;
        // ativa a primera celula do tabuleiro
        skipCol(next, 0);
      } else {
        onOpenChange(true, MSG_LOSE(board.word));
      }
    }

    reload(board);
  }, [board, reload, onOpenChange]);

  const generateButtonRender = (key: Key) => {
    const letters = Object.keys(keys).filter((l) => !["ENTER", "BACKSPACE"].includes(l));

    if (letters.includes(key)) {
      return <Button key={key} value={key} onKeyClicked={onKeyClicked} />;
    } else if (key === "ENTER") {
      return <Button.Enter key="ENTER" onKeyClicked={onEnterClicked} />;
    } else if (key === "BACKSPACE") {
      return <Button.Backspace key="BACKSPACE" onKeyClicked={onBackspaceClicked} />;
    }
  };

  const keys = useMemo<Record<Key, Function>>(
    () => ({
      Q: onKeyClicked,
      W: onKeyClicked,
      E: onKeyClicked,
      R: onKeyClicked,
      T: onKeyClicked,
      Y: onKeyClicked,
      U: onKeyClicked,
      I: onKeyClicked,
      O: onKeyClicked,
      P: onKeyClicked,
      A: onKeyClicked,
      S: onKeyClicked,
      D: onKeyClicked,
      F: onKeyClicked,
      G: onKeyClicked,
      H: onKeyClicked,
      J: onKeyClicked,
      K: onKeyClicked,
      L: onKeyClicked,
      BACKSPACE: onBackspaceClicked,
      Z: onKeyClicked,
      X: onKeyClicked,
      C: onKeyClicked,
      V: onKeyClicked,
      B: onKeyClicked,
      N: onKeyClicked,
      M: onKeyClicked,
      ENTER: onEnterClicked,
    }),
    [onKeyClicked, onEnterClicked, onBackspaceClicked]
  );

  const listenerKeyup = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      switch (key) {
        case "ENTER":
        case "BACKSPACE":
          keys[key]();
          break;
        case "ARROWLEFT":
        case "ARROWRIGHT":
          onArrowClicked(key);
          break;
        default:
          keys[key as Key]?.(key);
      }
    },
    [keys]
  );

  useEffect(() => {
    document.addEventListener("keyup", listenerKeyup);

    return () => document.removeEventListener("keyup", listenerKeyup);
  }, [listenerKeyup]);

  return (
    <div className="font-bold text-xs md:text-xl grid grid-cols-10 gap-1 w-full md:max-w-[490px]">
      {(Object.keys(keys) as Array<Key>).map((key) => generateButtonRender(key))}
    </div>
  );
}
