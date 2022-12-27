import { useCallback, useContext, useEffect, useMemo } from "react";
import { IconBackspace, IconCornerDownLeft } from "@tabler/icons";
import classNames from "classnames";
import { AppContext } from "@contexts";
import { equals, normalize } from "@utils";

type Props = {
  reload: (value: object) => void;
};

export function Keyboard({ reload }: Props) {
  const board = useContext(AppContext);

  const delay = (value: number) => {
    switch (value) {
      case 0:
        return "delay-0";
      case 1:
        return "delay-200";
      case 2:
        return "delay-400";
      case 3:
        return "delay-600";
      case 4:
        return "delay-800";
      default:
        return "delay-0";
    }
  };

  const onKeyClicked = (key: string) => {
    const row = board.rows.find((row) => row.active);
    if (!row) return;

    const col = row.cols.find((col) => col.active);
    if (!col) return;

    const elements = Array.from(document.querySelectorAll(".board-cell"));
    for (const element of elements) {
      setTimeout(() => element.classList.remove("animate-touch"), 1);
      if (element.classList.contains("active")) {
        setTimeout(() => element.classList.add("animate-touch"), 2);
      }
    }

    col.setValue(key);
    row.activate(col.position + 1);

    reload({});
  };

  const onArrowClicked = (placement: "ARROWLEFT" | "ARROWRIGHT") => {
    const row = board.rows.find((row) => row.active);
    if (!row) return;

    const col = row.cols.find((col) => col.active);
    if (!col) return;

    switch (placement) {
      case "ARROWLEFT":
        row.activate(col.position - 1);
        break;
      case "ARROWRIGHT":
        row.activate(col.position + 1);
        break;
    }

    reload({});
  };

  const onBackspaceClicked = () => {
    const row = board.rows.find((row) => row.active);
    if (!row) return;

    const col = row.cols.find((col) => col.active);
    if (!col) return;

    if (col.value) {
      col.setValue("");
    } else {
      row.activate(col.position - 1);

      const prev = row.cols.find((col) => col.active);
      if (!prev) return;

      prev.setValue("");
    }

    reload({});
  };

  const onEnterClicked = () => {
    const { word, words, rows } = board;

    const row = rows.find((row) => row.active);
    if (!row) return;

    const { valid, message } = row.valid(words);
    const element = document.querySelector(".row-active");
    if (!valid && element) {
      element.classList.add("animate-shake");

      board.setToast({ open: true, text: message });
      setTimeout(() => element.classList.remove("animate-shake"), 200);

      reload({});
      return;
    }

    const elements = Array.from(document.querySelectorAll(".board-cell"));
    for (const index in elements) {
      const element = elements[index];
      setTimeout(
        () => element.classList.add("duration-700", "animate-flip", delay(Number(index))),
        1
      );
    }

    row.setFinished(true);
    row.setActive(false);
    row.clear();

    const won = equals(word, row.cols.map((c) => c.value).join(""));
    if (won) board.setToast({ open: true, text: "Uhuu, Você acertou! 🎉" });

    if (!won) {
      const next = board.rows[row.position + 1];
      if (next) {
        next.setActive(true);
        next.activate(0);
        board.setRow(next, row.position + 1);
      } else {
        board.setToast({ open: true, text: `A palavra correta era: ${word} 🥲` });
      }
    }

    reload({});
  };

  const isUsed = (key: string) => {
    const rows = board.rows.filter((row) => row.finished);
    const cols = rows.map((row) => row.cols).flat();
    const keys = [...new Set(cols.map((col) => normalize(col.value)))];
    return keys.includes(normalize(key));
  };

  const isCorrect = (key: string) => {
    const rows = board.rows.filter((row) => row.finished);
    const cols = rows
      .map((row) => row.cols)
      .flat()
      .filter((x) => equals(x.value, key));

    const finished = rows.some((row) => row.finished);
    return finished && cols.some((col) => col.correct(board.word));
  };

  const generateButtonRender = (key: string) => {
    const letters = Object.keys(keys).filter((l) => !["ENTER", "BACKSPACE"].includes(l));

    if (letters.includes(key)) {
      return (
        <button
          key={key}
          onClick={() => onKeyClicked(key)}
          className={classNames(
            "w-full h-9 md:w-11 md:h-11 border-2 border-secondary rounded-md shadow-md shadow-black/20",
            {
              "bg-key-primary": !isUsed(key),
              "bg-key-disabled": isUsed(key) && !isCorrect(key),
              "bg-success": isCorrect(key),
            }
          )}
        >
          {key}
        </button>
      );
    }

    if (key === "ENTER") {
      return (
        <button
          key="ENTER"
          onClick={onEnterClicked}
          className="bg-key-primary border-2 border-secondary col-span-3 flex justify-center items-center rounded-md shadow-md shadow-black/20"
        >
          <IconCornerDownLeft />
        </button>
      );
    }

    if (key === "BACKSPACE") {
      return (
        <button
          key="BACKSPACE"
          onClick={onBackspaceClicked}
          className="bg-key-primary w-full h-9 md:w-11 md:h-11 border-2 border-secondary flex justify-center items-center rounded-md shadow-md shadow-black/20"
        >
          <IconBackspace />
        </button>
      );
    }
  };

  const keys = useMemo<Record<string, Function>>(
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
          keys[key]?.(key);
      }
    },
    [keys, onKeyClicked]
  );

  useEffect(() => {
    document.addEventListener("keyup", listenerKeyup);

    return () => document.removeEventListener("keyup", listenerKeyup);
  }, [listenerKeyup]);

  return (
    <div className="font-bold text-xs md:text-xl grid grid-cols-10 gap-1 max-w-xs md:max-w-[490px]">
      {Object.keys(keys).map((key) => generateButtonRender(key))}
    </div>
  );
}
