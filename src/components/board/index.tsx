import { useCallback, useContext } from "react";
import { AppContext } from "@contexts";
import classNames from "classnames";

import { Row } from "@types";

type Props = {
  reload: (value: object) => void;
};

export function Board({ reload }: Props) {
  const { rows, word } = useContext(AppContext);

  const onBoardClicked = useCallback((row: Row, colPos: number) => {
    if (!row.active) return;

    row.activate(colPos);
    reload({});
  }, []);

  return (
    <div className="grid grid-rows-6 gap-1">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={classNames("grid grid-cols-5 gap-1", { "row-active": row.active })}
        >
          {row.cols.map((col, index) => (
            <div
              key={index}
              onClick={() => onBoardClicked(row, index)}
              className={classNames(
                "h-12 w-12 flex justify-center items-center rounded-md border-2 border-secondary cursor-pointer transition-transform",
                {
                  "bg-success": row.finished && col.correct(word),
                  "bg-warning": row.finished && !col.correct(word) && col.approximate(word),
                  "bg-primary board-cell hover:bg-white/5": !row.finished && row.active,
                  "bg-secondary": row.finished && !(col.correct(word) || col.approximate(word)),
                  "bg-key-disabled": !row.active && !row.finished,
                  "border-b-6 active": col.active,
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
