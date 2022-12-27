import { useEffect, useState } from "react";
import { Board as Component, Keyboard, Toast } from "@components";
import { AppContext } from "@contexts";
import { getAllWords } from "@utils";

import { Board, Row } from "@types";

const rows = Array.from(Array(6).keys()).map((pos) => new Row(pos, pos === 0));
const board = new Board(rows);

export function App() {
  const [_, setReload] = useState({});

  useEffect(() => {
    getAllWords().then(function (words) {
      board.setWord(words[Math.floor(Math.random() * words.length)]);
      board.setWords(words);
    });
  }, []);

  return (
    <AppContext.Provider value={board}>
      <div className="flex flex-col items-center justify-between h-screen py-6 text-white font-black text-xl">
        <span>PALAVRA</span>

        <Component reload={setReload} />

        <Keyboard reload={setReload} />
      </div>

      <Toast {...board.toast} />
    </AppContext.Provider>
  );
}
