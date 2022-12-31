import { useCallback, useMemo, useState } from "react";
import { Panel, Keyboard, Toast, Dialog, Button } from "@components";
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
  // propriedades do modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // tabuleiro
  const [board, setBoard] = useState<Board>(initialBoard);

  const onDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  const onToastOpenChange = useCallback((open: boolean, text?: string) => {
    setIsToastOpen(open);
    setToastMessage(text);
  }, []);

  const onReset = useCallback(() => {
    setIsToastOpen(false);
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

  const howToPlay = useMemo(
    () => (
      <div className="flex flex-col gap-3 text-center text-xs">
        <span>
          Adivinhe a palavra em 6 tentativas. Após cada palpite, a cor dos ladrilhos mudará para
          mostrar o quão próximo seu palpite foi da palavra.
        </span>

        <div>
          <div className="flex justify-center gap-1 mb-1">
            <Button value="T" correct />
            <Button value="E" />
            <Button value="M" />
            <Button value="P" />
            <Button value="O" />
          </div>
          <span>
            A letra <Button style={{ width: 32, height: 32 }} value="T" correct /> está na palavra e
            no local correto.
          </span>
        </div>

        <div>
          <div className="flex justify-center gap-1 mb-1">
            <Button value="A" />
            <Button value="N" />
            <Button value="E" almost />
            <Button value="X" />
            <Button value="O" />
          </div>
          <span>
            A letra <Button style={{ width: 32, height: 32 }} value="E" almost /> está na palavra,
            mas no lugar errado.
          </span>
        </div>

        <div>
          <div className="flex justify-center gap-1 mb-1">
            <Button value="G" />
            <Button value="L" />
            <Button value="O" />
            <Button value="B" used />
            <Button value="O" />
          </div>
          <span>
            A letra <Button style={{ width: 32, height: 32 }} value="B" used /> não está na palavra
            em nenhum lugar.
          </span>
        </div>

        <div>
          <span>
            Os acentos são preenchidos de maneira automática e são substituídos por suas respectivas
            letras.
          </span>
        </div>

        <div>
          <span>
            Esta é uma versão de código aberto do jogo de adivinhação de palavras wordle -{" "}
            <a
              className="underline underline-offset-2"
              href="https://github.com/andersonsrocha/wordle-react"
            >
              confira o código
            </a>{" "}
            ❤️
          </span>
        </div>
      </div>
    ),
    []
  );

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
      <ToastContext.Provider value={onToastOpenChange}>
        <div className="flex flex-col items-center justify-between h-screen p-3 md:py-6 md:px-6 text-white font-black text-xl">
          <div className="flex justify-between items-center w-full">
            <div>
              <button
                onClick={() => onDialogOpenChange(true)}
                className="flex justify-center items-center w-8 h-8 rounded-full border-2 border-secondary hover:bg-white/5"
              >
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

        <Dialog
          title="Como jogar"
          open={isDialogOpen}
          onOpenChange={onDialogOpenChange}
          description={howToPlay}
        />
      </ToastContext.Provider>
    </AppContext.Provider>
  );
}
