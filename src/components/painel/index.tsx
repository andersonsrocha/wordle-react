import { useCallback, useContext } from "react";
import { AppContext } from "@contexts";
import { containsLetter, equalsLetter, skipCol } from "@utils";
import classNames from "classnames";

import { Board } from "@types";

type Props = {
  reload: (value: Board) => void;
};

export function Panel({ reload }: Props) {
  const board = useContext(AppContext);

  const onBoardClicked = useCallback(
    (rowPos: number, colPos: number) => {
      // pegar a linha
      const row = board.rows.find((row) => row.position === rowPos);
      // se a linha não estiver ativa ou o jogo já tiver terminado
      if (!row || !row.active || board.finished) return;
      // pula para a coluna selecionada
      skipCol(row, colPos);
      // altera o tabuleiro com a mudança
      reload(board);
    },
    [board, reload]
  );

  const addClassnameHelper = useCallback(
    (value: string, rowPos: number, colPos: number) => {
      const { word, rows } = board;
      const row = rows.find((row) => row.position === rowPos);
      const success = equalsLetter(word, value, colPos);
      const warning = containsLetter(word, value, colPos);

      if (row && row.finished) {
        if (!warning && success) return "bg-success";
        if (warning && !success) return "bg-warning";
        if (!warning && !success) return "bg-secondary";
      }

      return "";
    },
    [board]
  );

  const delayAnimation = useCallback((value: number, ...classList: Array<string>) => {
    switch (value) {
      case 0:
        classList.push("animate-delay-[0ms]");
        break;
      case 1:
        classList.push("animate-delay-[200ms]");
        break;
      case 2:
        classList.push("animate-delay-[400ms]");
        break;
      case 3:
        classList.push("animate-delay-[600ms]");
        break;
      case 4:
        classList.push("animate-delay-[800ms]");
        break;
      default:
        classList.push("animate-delay-[0ms]");
        break;
    }

    return classList.join(" ");
  }, []);

  const onRowAnimationEnd = useCallback(
    (pos: number) => {
      const row = board.rows.find((row) => row.position === pos);
      if (!row) return;

      row.animate = false;
      reload(board);
    },
    [board, reload]
  );

  const onColAnimationEnd = useCallback(
    (pos: Number) => {
      const row = board.rows.find((row) => row.active);
      if (!row) return;

      const col = row.cols.find((col) => col.position === pos);
      if (!col) return;

      col.animate = false;
      reload(board);
    },
    [board, reload]
  );

  return (
    <div className="grid grid-rows-6 gap-1">
      {board.rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          onAnimationEnd={() => onRowAnimationEnd(rowIndex)}
          className={classNames("grid grid-cols-5 gap-1 animate-duration-700", {
            "animate-headShake": !board.finished && row.animate,
            "animate-delay-[1.5s] animate-tada": board.finished && row.active,
          })}
        >
          {row.cols.map((col, index) => (
            <div
              key={index}
              onAnimationEnd={() => onColAnimationEnd(index)}
              onClick={() => onBoardClicked(rowIndex, index)}
              className={classNames(
                "h-12 w-12 flex justify-center items-center rounded-md border-2 border-secondary cursor-pointer",
                {
                  [addClassnameHelper(col.value, rowIndex, index)]: true,
                  "bg-primary hover:bg-white/5": !row.finished && row.active,
                  "bg-key-disabled": !row.active && !row.finished,
                  "border-b-6 transition-all": col.active,
                  "animate-duration-200 animate-pulse": !row.finished && col.animate,
                  [delayAnimation(index, "animate-duration-700", "animate-flipY")]:
                    row.finished && col.animate,
                }
              )}
            >
              {col.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
