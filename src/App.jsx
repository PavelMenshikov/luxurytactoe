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

  useEffect(() => {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#ffffff');
    }
  }, []);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleBlockClick = (i) => {
    if (board[i] || winner || isBotThinking) return;
    const nextBoard = [...board];
    nextBoard[i] = 'X';
    setBoard(nextBoard);
    
    try { window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}

    const gameWinner = checkWinner(nextBoard);
    if (gameWinner) finishGame(gameWinner);
    else if (!nextBoard.includes(null)) setWinner('Draw');
    else {
      setIsBotThinking(true);
      setTimeout(() => botMove(nextBoard), 500);
    }
  };

  const botMove = (currentBoard) => {
    const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return;
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    currentBoard[randomIndex] = 'O';
    setBoard([...currentBoard]);
    setIsBotThinking(false);
    const gameWinner = checkWinner(currentBoard);
    if (gameWinner) finishGame(gameWinner);
  };

  const finishGame = async (result) => {
    setWinner(result);
    const status = result === 'X' ? 'win' : 'loss';
    
    if (status === 'win') {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      try { window.Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
    }

    
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    
    
    const payload = { 
        result: status,
        username: tgUser?.username || tgUser?.first_name || "Anonymous",
        user_id: tgUser?.id || "Locahost-Dev" 
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-50 overflow-hidden relative">
      
      {/* ФОНОВЫЙ ЛЮКС (Пятна) */}
      <div className="absolute top-[-50px] left-[-50px] w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 drop-shadow-sm mb-2 tracking-tight">
          Tic-Tac-Toe
        </h1>
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 border border-white backdrop-blur shadow-sm">
           <p className="text-violet-900 font-bold tracking-[0.2em] text-[10px] uppercase">
             ТЯЖЁЛЫЙ ЛЮКС 💄
           </p>
        </div>
      </motion.div>

      {/* ПОЛЕ С ЖИРНЫМИ БОРДЕРАМИ */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="grid grid-cols-3 gap-3 p-4 bg-white/40 backdrop-blur-xl border-2 border-white rounded-[30px] shadow-[0_20px_50px_-12px_rgba(124,58,237,0.25)] z-10"
      >
        {board.map((cell, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBlockClick(i)}
            // ВОТ ТУТ ГЛАВНЫЕ ИЗМЕНЕНИЯ КОНТРАСТА:
            // bg-white (чистый белый)
            // border-2 (толстая рамка 2px)
            // border-indigo-100 (цвет рамки)
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center cursor-pointer border-2 border-indigo-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-purple-300"
          >
            <AnimatePresence>
              {cell === 'X' && (
                <motion.span 
                  initial={{ rotate: -45, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  // Яркий градиент для крестика
                  className="text-4xl font-black bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent filter drop-shadow"
                >
                  X
                </motion.span>
              )}
              {cell === 'O' && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-slate-300"
                >
                  O
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* МОДАЛКА ПОБЕДЫ */}
      <AnimatePresence>
        {winner && (
          <div className="fixed inset-0 bg-violet-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
               className="bg-white/90 p-8 rounded-[35px] text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] max-w-xs w-full border border-white"
             >
                <h2 className="text-3xl font-black text-slate-800 mb-2">
                  {winner === 'X' ? 'Ты Великолепна! ✨' : 'Попробуй снова!'}
                </h2>
                
                {promo && (
                   <motion.div 
                     initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                     className="my-6 p-4 bg-fuchsia-50 border border-fuchsia-200 rounded-2xl"
                   >
                      <div className="text-[10px] font-bold text-fuchsia-400 mb-1 uppercase tracking-widest">Твой Код</div>
                      <div className="text-2xl font-black text-fuchsia-600 tracking-wider font-mono">
                        {promo}
                      </div>
                   </motion.div>
                )}

                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition shadow-lg"
                >
                  Играть Ещё раз
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App