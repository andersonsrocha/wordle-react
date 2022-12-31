import { CSSProperties, useCallback, useContext } from "react";
import { IconBackspace, IconCornerDownLeft } from "@tabler/icons";
import { AppContext } from "@contexts";
import { equals, equalsLetter, normalize } from "@utils";
import classNames from "classnames";

import { Key } from "@types";

type ButtonProps = {
  value: Key;
  style?: CSSProperties;
  correct?: boolean;
  used?: boolean;
  almost?: boolean;
  onKeyClicked?: (key: Key) => void;
};

type OtherButtonProps = {
  onKeyClicked?: () => void;
};

function Button({ value, onKeyClicked, ...rest }: ButtonProps) {
  const board = useContext(AppContext);

  const isUsed = useCallback(
    (key: Key) => {
      const rows = board.rows.filter((row) => row.finished);
      const cols = rows.map((row) => row.cols).flat();
      const keys = [...new Set(cols.map((col) => normalize(col.value)))];
      return keys.includes(normalize(key));
    },
    [board]
  );

  const isCorrect = useCallback(
    (key: Key) => {
      const rows = board.rows.filter((row) => row.finished);
      const cols = rows
        .map((row) => row.cols)
        .flat()
        .filter((x) => equals(x.value, key));

      const finished = rows.some((row) => row.finished);
      return finished && cols.some((col) => equalsLetter(board.word, col.value, col.position));
    },
    [board]
  );

  return (
    <button
      onClick={() => onKeyClicked?.(value)}
      style={rest.style}
      className={classNames(
        "font-bold w-full max-w-[36px] h-9 md:w-11 md:h-11 md:max-w-[44px] border-2 border-secondary rounded-md shadow-md shadow-black/20 focus:outline-none",
        {
          "bg-key-primary": !isUsed(value),
          "bg-key-disabled": (isUsed(value) && !isCorrect(value)) || rest.used,
          "bg-success": isCorrect(value) || rest.correct,
          "bg-warning": rest.almost,
        }
      )}
    >
      {value}
    </button>
  );
}

function Enter({ onKeyClicked }: OtherButtonProps) {
  return (
    <button
      onClick={onKeyClicked}
      className="bg-key-primary border-2 border-secondary col-span-3 flex justify-center items-center rounded-md shadow-md shadow-black/20"
    >
      <IconCornerDownLeft />
    </button>
  );
}

function Backspace({ onKeyClicked }: OtherButtonProps) {
  return (
    <button
      onClick={onKeyClicked}
      className="bg-key-primary w-full h-9 md:w-11 md:h-11 border-2 border-secondary flex justify-center items-center rounded-md shadow-md shadow-black/20"
    >
      <IconBackspace />
    </button>
  );
}

Button.Enter = Enter;
Button.Backspace = Backspace;

export { Button };
