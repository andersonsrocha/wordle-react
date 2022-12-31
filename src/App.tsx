import { useCallback, useState } from "react";
import { Panel, Keyboard, Toast } from "@components";
import { IconQuestionMark, IconRefresh } from "@tabler/icons";
import { AppContext, ToastContext } from "@contexts";
import { compoundBoard, getAllWords } from "@utils";
import { useMountEffect } from "@hooks";
import { cloneDeep } from "lodash";

import { Board } from "@types";

const initialBoard = { rows: [], finished: false, word: "", words: [] };

export function App() {
  // propriedades do alerta
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  // tabuleiro
  const [board, setBoard] = useState<Board>(initialBoard);

  const onOpenChange = useCallback((open: boolean, text?: string) => {
    setIsToastOpen(open);
    setToastMessage(text);
  }, []);

  const onReset = useCallback(() => {
    setBoard((old) => {
      const { words } = old;
      // pegar uma palavra aleatória da lista
      const word = words[Math.floor(Math.random() * words.length)];
      // compor as linhas e colunas do tabuleiro
      const rows = compoundBoard(6, 5);
      // criar o tabuleiro
      const board: Board = { rows, words, finished: false, word: word };
      // adicionar o tabuleiro
      return board;
    });
  }, []);

  useMountEffect(() => {
    getAllWords().then(function (words) {
      // pegar uma palavra aleatória da lista
      const word = words[Math.floor(Math.random() * words.length)];
      // compor as linhas e colunas do tabuleiro
      const rows = compoundBoard(6, 5);
      // criar o tabuleiro
      const board: Board = { rows, words, finished: false, word: word };
      // adicionar o tabuleiro
      setBoard(board);
    });
  });

  return (
    <AppContext.Provider value={cloneDeep(board)}>
      <ToastContext.Provider value={onOpenChange}>
        <div className="flex flex-col items-center justify-between h-screen p-3 md:py-6 md:px-6 text-white font-black text-xl">
          <div className="flex justify-between items-center w-full">
            <div>
              <button className="flex justify-center items-center w-8 h-8 rounded-full border-2 border-secondary hover:bg-white/5">
                <IconQuestionMark size={18} />
              </button>
            </div>
            <span>PALAVRA</span>
            <div>
              <button
                onClick={onReset}
                className="flex justify-center items-center w-8 h-8 rounded-full border-2 border-secondary hover:bg-white/5"
              >
                <IconRefresh size={18} />
              </button>
            </div>
          </div>

          <Panel reload={setBoard} />

          <Keyboard reload={setBoard} />
        </div>

        <Toast open={isToastOpen} text={toastMessage} />
      </ToastContext.Provider>
    </AppContext.Provider>
  );
}
