import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import './App.css'

const API_URL = "/api/game-over";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [winner, setWinner] = useState(null)
  const [promo, setPromo] = useState(null)
  const [isBotThinking, setIsBotThinking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [isLoadingPromo, setIsLoadingPromo] = useState(false)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#ffffff');
    }
  }, []);

  const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  const checkWinner = (squares) => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const minimax = (tempBoard, depth, isMaximizing) => {
    const result = checkWinner(tempBoard);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (!tempBoard.includes(null)) return 0;
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'O';
          let score = minimax(tempBoard, depth + 1, false);
          tempBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'X';
          let score = minimax(tempBoard, depth + 1, true);
          tempBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const botMove = (currentBoard) => {
    let move;
    if (difficulty === 'easy') {
      const moves = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
      move = moves[Math.floor(Math.random() * moves.length)];
    } else if (difficulty === 'hard') {
      for (let line of winningLines) {
        const [a, b, c] = line;
        const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
        if (vals.filter(v => v === 'O').length === 2 && vals.filter(v => v === null).length === 1) move = line[vals.indexOf(null)];
      }
      if (move === undefined) {
        for (let line of winningLines) {
          const [a, b, c] = line;
          const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
          if (vals.filter(v => v === 'X').length === 2 && vals.filter(v => v === null).length === 1) move = line[vals.indexOf(null)];
        }
      }
      if (move === undefined) {
        const moves = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
        move = moves[Math.floor(Math.random() * moves.length)];
      }
    } else {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'O';
          let score = minimax(currentBoard, 0, false);
          currentBoard[i] = null;
          if (score > bestScore) { bestScore = score; move = i; }
        }
      }
    }

    if (move !== undefined) {
      currentBoard[move] = 'O';
      setBoard([...currentBoard]);
      setIsBotThinking(false);
      const gameWinner = checkWinner(currentBoard);
      if (gameWinner) finishGame(gameWinner);
    }
  };

  const handleBlockClick = (i) => {
    if (board[i] || winner || isBotThinking) return;
    const nextBoard = [...board];
    nextBoard[i] = 'X';
    setBoard(nextBoard);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    const gameWinner = checkWinner(nextBoard);
    if (gameWinner) finishGame(gameWinner);
    else if (!nextBoard.includes(null)) setWinner('Draw');
    else {
      setIsBotThinking(true);
      setTimeout(() => botMove(nextBoard), 500);
    }
  };

  const finishGame = async (result) => {
    setWinner(result);
    if (result === 'X') {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      setIsLoadingPromo(true);
      
      const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
      const payload = { 
          result: 'win',
          name: user ? `${user.first_name} ${user.last_name || ''}`.trim() : "Браузер (Тест)",
          username: user?.username ? `@${user.username}` : "нет юзернейма",
          user_id: user?.id || "Dev-Local",
          diff: difficulty
      };

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload) 
        });
        const data = await response.json();
        if (data.promo) setPromo(data.promo);
      } catch (error) { console.error(error); }
      setIsLoadingPromo(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-50 overflow-hidden">
      <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[60%] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[60%] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 text-center mb-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 drop-shadow-sm mb-2 tracking-tight italic">Tic-Tac-Toe</h1>
        <p className="text-violet-900 font-bold tracking-[0.2em] text-[9px] uppercase bg-white/40 inline-block px-3 py-1 rounded-full border border-white">ТЯЖЁЛЫЙ ЛЮКС 💄</p>
      </motion.div>

      <div className="z-10 mb-8 flex bg-white/40 backdrop-blur-md p-1 rounded-2xl border border-white shadow-inner">
        {['easy', 'hard', 'impossible'].map((level) => (
          <button key={level} onClick={() => board.every(c => c === null) && setDifficulty(level)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${difficulty === level ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
            {level === 'easy' ? 'Easy' : level === 'hard' ? 'Hard' : 'God Mode'}
          </button>
        ))}
      </div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid grid-cols-3 gap-3 p-4 bg-white/40 backdrop-blur-xl border-2 border-white rounded-[30px] shadow-[0_20px_50px_-12px_rgba(124,58,237,0.25)] z-10">
        {board.map((cell, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => handleBlockClick(i)} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center cursor-pointer border-2 border-indigo-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-purple-300">
            <AnimatePresence>
              {cell === 'X' && <motion.span initial={{ rotate: -45, scale: 0 }} animate={{ rotate: 0, scale: 1 }} className="text-4xl font-black bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent filter drop-shadow">X</motion.span>}
              {cell === 'O' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl font-black text-slate-300">O</motion.span>}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {winner && (
          <div className="fixed inset-0 bg-violet-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white/90 p-8 rounded-[35px] text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] max-w-xs w-full border border-white relative">
                <h2 className="text-3xl font-black text-slate-800 mb-2">{winner === 'X' ? 'Ты Великолепна! ✨' : winner === 'Draw' ? 'Ничья! 🤝' : 'Поражение...'}</h2>
                <p className="text-gray-500 text-[11px] mb-6 uppercase tracking-widest font-bold">Уровень: {difficulty}</p>
                
                {isLoadingPromo && <p className="text-violet-500 animate-pulse text-xs">Генерация приза...</p>}

                {promo && winner === 'X' && (
                   <motion.div whileTap={{ scale: 0.98 }} onClick={() => { navigator.clipboard.writeText(promo); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                     className="my-6 p-4 bg-fuchsia-50 border border-fuchsia-200 rounded-2xl cursor-pointer">
                      <div className="text-[10px] font-bold text-fuchsia-400 mb-1 uppercase tracking-widest">{copied ? '✅ СКОПИРОВАНО!' : 'Нажми, чтобы скопировать'}</div>
                      <div className="text-3xl font-black text-fuchsia-600 tracking-widest font-mono">{promo}</div>
                   </motion.div>
                )}

                <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition shadow-lg">Играть Ещё раз</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App