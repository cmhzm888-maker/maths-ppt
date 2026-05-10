import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Triangle, Star, Circle, Heart, Square, Hexagon } from 'lucide-react';

const SHAPES = {
  triangle: Triangle,
  star: Star,
  circle: Circle,
  heart: Heart,
  square: Square,
  hexagon: Hexagon,
};

type ShapeKey = keyof typeof SHAPES;

const SHAPE_NAMES: Record<ShapeKey, string> = {
  triangle: '三角形',
  star: '星星',
  circle: '圆形',
  heart: '爱心',
  square: '正方形',
  hexagon: '六边形',
};

const NextButton = ({
  onClick,
  children,
  phase,
  colorClass = 'indigo',
}: {
  onClick: () => void,
  children: React.ReactNode,
  phase: string,
  colorClass?: string,
  key?: React.Key,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsReady(false);
    setProgress(0);

    const durationMs = 3000; // 3 seconds to wait
    const startTime = Date.now();
    
    // Check every frame for smooth loading bar
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);
      
      if (elapsed >= durationMs) {
        setIsReady(true);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [phase]);

  const mapColor: Record<string, string> = {
    indigo: 'bg-indigo-500 text-white shadow-indigo-500/30 border-indigo-700',
    emerald: 'bg-emerald-500 text-white shadow-emerald-500/30 border-emerald-700',
    amber: 'bg-amber-500 text-white shadow-amber-500/30 border-amber-700',
    pink: 'bg-pink-500 text-white shadow-pink-500/30 border-pink-700',
    slate: 'bg-slate-500 text-white shadow-slate-500/30 border-slate-700',
    fuchsia: 'bg-fuchsia-500 text-white shadow-fuchsia-500/30 border-fuchsia-700',
    blue: 'bg-blue-500 text-white shadow-blue-500/30 border-blue-700',
    rose: 'bg-rose-500 text-white shadow-rose-500/30 border-rose-700',
    cyan: 'bg-cyan-500 text-white shadow-cyan-500/30 border-cyan-700',
    violet: 'bg-violet-500 text-white shadow-violet-500/30 border-violet-700',
  };

  const hoverColor: Record<string, string> = {
    indigo: 'hover:bg-indigo-600',
    emerald: 'hover:bg-emerald-600',
    amber: 'hover:bg-amber-600',
    pink: 'hover:bg-pink-600',
    slate: 'hover:bg-slate-600',
    fuchsia: 'hover:bg-fuchsia-600',
    blue: 'hover:bg-blue-600',
    rose: 'hover:bg-rose-600',
    cyan: 'hover:bg-cyan-600',
    violet: 'hover:bg-violet-600',
  };

  const colorStyles = mapColor[colorClass] || mapColor.slate;
  const hoverStyles = isReady ? (hoverColor[colorClass] || hoverColor.slate) : '';

  const baseClass = `relative overflow-hidden px-8 py-4 md:px-12 md:py-6 font-black text-xl md:text-3xl rounded-3xl shadow-xl border-b-4 transition-all ${colorStyles} ${hoverStyles}`;
  const readyClass = isReady ? 'active:border-b-0 active:translate-y-1' : 'opacity-80 cursor-not-allowed';

  return (
    <motion.button 
      initial={{scale:0.9, opacity:0}} 
      animate={{scale:1, opacity:1}} 
      exit={{scale:0.9, opacity:0}}
      whileHover={isReady ? { scale: 1.05 } : {}} 
      whileTap={isReady ? { scale: 0.95 } : {}} 
      onClick={isReady ? onClick : undefined}
      className={`${baseClass} ${readyClass}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {!isReady && <span className="opacity-70 text-sm md:text-base font-medium ml-2 font-mono">({Math.ceil(3 - progress/100*3)}s)</span>}
      </span>
      
      {!isReady && (
        <div className="absolute left-0 bottom-0 top-0 bg-white/25 z-0" style={{ width: `${progress}%`, transition: 'width 0.05s linear' }} />
      )}
    </motion.button>
  );
};

function ReverseFractionMode() {
  type Phase = 'intro' | 'cut' | 'zoom' | 'answer' | 'conclusion';
  const [pieces, setPieces] = useState(100);
  const [phase, setPhase] = useState<Phase>('intro');

  useEffect(() => {
    setPhase('intro');
  }, [pieces]);

  const handleNext = () => {
    if (phase === 'intro') setPhase('cut');
    else if (phase === 'cut') setPhase('zoom');
    else if (phase === 'zoom') setPhase('answer');
    else if (phase === 'answer') setPhase('conclusion');
    else if (phase === 'conclusion') setPhase('intro');
  };

  const isGrid = pieces === 100;

  return (
    <div className="flex flex-col items-center pb-40 w-full animate-in fade-in duration-500 min-h-screen bg-slate-50">
      <header className="w-full bg-white shadow-sm border-b border-slate-200 z-10 sticky top-[60px]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-lg md:text-2xl font-medium">
          <span>反向猜谜：1 里面有 <strong className="text-violet-600 bg-violet-100 px-2 py-1 border-2 border-violet-200 rounded-lg">{pieces}</strong> 个</span>
          <div className="flex items-center gap-1 bg-violet-50 border-2 border-violet-200 rounded-lg px-2 py-1">
            <select
              value={pieces}
              onChange={(e) => setPieces(parseInt(e.target.value))}
              className="bg-transparent text-violet-700 outline-none cursor-pointer text-center font-bold"
            >
              {[2, 3, 5, 10, 20, 100].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <span>什么？</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center relative">
        <div className="text-center min-h-[140px] flex flex-col justify-end mb-8 w-full">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="r-intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4">这是一个巨大的 <strong className="text-3xl text-violet-600 bg-violet-100 border-2 border-violet-200 px-4 py-1 rounded-xl shadow-sm">1</strong></p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">你能想象里面藏着 {pieces} 个什么吗？</p>
              </motion.div>
            )}
            {phase === 'cut' && (
              <motion.div key="r-cut" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4">第一步：切切切！ ✂️</p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">因为有 {pieces} 个，所以我们要把它平均切成 <strong className="text-violet-600 font-bold">{pieces}</strong> 份！</p>
              </motion.div>
            )}
            {phase === 'zoom' && (
              <motion.div key="r-zoom" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-xl md:text-2xl text-slate-500 mb-4 font-medium">现在我们单独拿出其中的 <strong className="text-3xl border-b-4 border-amber-400">一小份</strong> 来看</p>
                 <p className="text-2xl md:text-3xl text-slate-700 font-bold">它究竟叫什么名字呢？</p>
              </motion.div>
            )}
            {phase === 'answer' && (
              <motion.div key="r-ans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-emerald-600 font-black mb-4">揭开谜底！ 💡</p>
                 <p className="text-xl md:text-2xl text-slate-600 font-medium">分成 {pieces} 份里的 1 份，名字就叫 <strong className="text-4xl text-white bg-violet-500 border-2 border-violet-600 px-4 py-1 rounded-2xl mx-2 shadow-md">1/{pieces}</strong>！</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Visualizer */}
        <motion.div
          layout
          className={`relative max-w-4xl mx-auto
            ${isGrid ? 'w-full aspect-square max-w-[280px] md:max-w-[400px]' : 'w-full h-24 md:h-40'}
            ${phase === 'intro' ? 'bg-slate-100 shadow-[0_15px_60px_-15px_rgba(139,92,246,0.3)] rounded-3xl md:rounded-[2rem] border-4 border-violet-200' : 'bg-transparent'}
          `}
        >
          {phase === 'intro' ? (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
               className="absolute inset-0 flex items-center justify-center pointer-events-none"
             >
               <span className="text-violet-400 opacity-60 text-8xl font-black drop-shadow-md">完整的 1</span>
             </motion.div>
          ) : (
            <motion.div 
               layout
               className={`w-full h-full align-center justify-center ${isGrid ? 'grid grid-cols-10 grid-rows-10 gap-0.5 md:gap-1' : 'flex gap-1 md:gap-3'}`}
            >
               {Array.from({ length: pieces }).map((_, i) => {
                 const isHighlighted = phase === 'zoom' && i === 0;
                 return (
                   <motion.div
                     layout
                     key={i}
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ 
                       opacity: (phase === 'zoom' && i !== 0) ? 0.3 : 1,
                       scale: isHighlighted ? 1.5 : 1,
                       zIndex: isHighlighted ? 50 : 1,
                       y: isHighlighted ? (isGrid ? -20 : -30) : 0
                     }}
                     transition={{ duration: 0.5 }}
                     className={`relative overflow-hidden
                       ${isGrid ? 'rounded-[1px] md:rounded-sm' : 'flex-1 rounded-md md:rounded-2xl'}
                       ${isHighlighted ? 'bg-amber-400 shadow-2xl ring-4 ring-amber-200' : 'bg-violet-400 shadow-sm'}
                     `}
                   >
                      <AnimatePresence>
                        {phase === 'answer' && (
                           <motion.div
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className={`absolute inset-0 flex items-center justify-center text-white font-bold
                               ${isGrid ? 'text-[8px] md:text-xs scale-75 md:scale-100' : 'text-sm sm:text-base md:text-xl'}
                             `}
                           >
                             1/{pieces}
                           </motion.div>
                        )}
                        {isHighlighted && (
                           <motion.div
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                             className={`absolute inset-0 flex items-center justify-center text-white font-black drop-shadow-md
                               ${isGrid ? 'text-xs' : 'text-2xl'}
                             `}
                           >
                             ?
                           </motion.div>
                        )}
                      </AnimatePresence>
                   </motion.div>
                 )
               })}
            </motion.div>
          )}
        </motion.div>

        {phase === 'answer' && (
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             className="mt-16 text-center bg-violet-50 px-8 py-6 rounded-3xl border-2 border-violet-100 shadow-sm max-w-2xl"
          >
             <p className="text-xl md:text-2xl text-slate-700 font-medium">
               不管问 1 里面有几个多少...<br/>
               <span className="inline-block mt-4 text-violet-700 bg-violet-100 px-4 py-2 rounded-xl">
                 有 <strong className="text-3xl text-violet-600 mx-1">{pieces}</strong> 个，就是 <strong className="text-3xl text-emerald-600 mx-1">1/{pieces}</strong> !
               </span>
             </p>
          </motion.div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 md:py-6 flex justify-center items-center h-24 md:h-32">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
               <NextButton key="btn-r-intro" phase={phase} onClick={handleNext} colorClass="violet">
                 切成 {pieces} 份！ 🔪
               </NextButton>
            )}
            {phase === 'cut' && (
               <NextButton key="btn-r-cut" phase={phase} onClick={handleNext} colorClass="amber">
                 仔细看看其中一块 🔍
               </NextButton>
            )}
            {phase === 'zoom' && (
               <NextButton key="btn-r-zoom" phase={phase} onClick={handleNext} colorClass="emerald">
                 告诉我是什么！ 💡
               </NextButton>
            )}
            {phase === 'answer' && (
               <NextButton key="btn-r-ans" phase={phase} onClick={handleNext} colorClass="pink">
                 找规律 🎓
               </NextButton>
            )}
            {phase === 'conclusion' && (
               <NextButton key="btn-r-con" phase={phase} onClick={handleNext} colorClass="slate">
                 换个数字再挑战！ 🔄
               </NextButton>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Conclusion Overlay */}
      <AnimatePresence>
        {phase === 'conclusion' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.8, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.8 }}
             transition={{ type: "spring", damping: 15 }}
             className="fixed top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center w-[95%] max-w-2xl pointer-events-none"
           >
             <div className="bg-white/95 backdrop-blur-xl px-4 py-8 md:px-10 md:py-10 rounded-[3rem] shadow-2xl shadow-violet-500/20 border-8 border-violet-400 text-center w-full relative overflow-hidden pointer-events-auto">
                <h2 className="text-3xl md:text-4xl font-black text-violet-800 mb-6 md:mb-8 border-b-4 border-violet-100 pb-4 md:pb-6 drop-shadow-sm">
                  找规律大总结 🎓
                </h2>
                
                <div className="text-2xl md:text-4xl text-slate-700 font-bold space-y-4 md:space-y-6">
                  <p className="flex items-center justify-center gap-1 md:gap-2">
                    1 里面有 <strong className="text-violet-600 bg-violet-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-2 border-violet-200">2</strong> 个 <strong className="text-emerald-600 bg-emerald-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-2 border-emerald-200">1/2</strong>
                  </p>
                  <p className="flex items-center justify-center gap-1 md:gap-2">
                    1 里面有 <strong className="text-violet-600 bg-violet-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-2 border-violet-200">3</strong> 个 <strong className="text-emerald-600 bg-emerald-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-2 border-emerald-200">1/3</strong>
                  </p>
                  <div className="flex justify-center my-4 md:my-6">
                    <span className="flex gap-3 md:gap-4">
                      <span className="w-2 h-2 md:w-3 md:h-3 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 md:w-3 md:h-3 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 md:w-3 md:h-3 bg-slate-300 rounded-full animate-bounce delay-300"></span>
                    </span>
                  </div>
                  <p className="flex items-center justify-center gap-1 md:gap-2">
                    1 里面有 <strong className="text-violet-600 bg-violet-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-2 border-violet-200">{pieces}</strong> 个 <strong className="text-emerald-600 bg-emerald-100 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl border-2 border-emerald-200">1/{pieces}</strong>
                  </p>
                </div>
                
                <div className="mt-8 md:mt-10 text-xl md:text-3xl text-slate-800 bg-amber-50 border-4 border-amber-200 p-6 md:p-8 rounded-3xl font-black relative shadow-inner">
                  <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 text-4xl md:text-6xl animate-bounce">💡</div>
                  神仙口诀：<br/>
                  <div className="flex flex-col items-center gap-2 md:gap-4 mt-4 md:mt-6">
                    <span className="text-violet-700 text-2xl md:text-4xl drop-shadow-sm flex items-center">
                      1 里面有 <strong className="text-amber-600 bg-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl border-2 border-amber-300 mx-1 md:mx-2 shadow-sm">几</strong> 个 
                    </span>
                    <span className="text-emerald-600 text-2xl md:text-4xl mt-1 md:mt-2 drop-shadow-sm flex items-center">
                      <strong className="text-amber-600 bg-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl border-2 border-amber-300 mx-1 md:mx-2 shadow-sm">几分之一</strong>
                    </span>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 text-5xl md:text-7xl animate-bounce delay-200">🌟</div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WholeFractionMode() {
  type Phase = 'whole' | 'cut' | 'one_piece' | 'count' | 'done';
  const [denom, setDenom] = useState(10);
  const [phase, setPhase] = useState<Phase>('whole');
  const [count, setCount] = useState(0);

  useEffect(() => {
    setPhase('whole');
    setCount(0);
  }, [denom]);

  const handleNext = () => {
    if (phase === 'whole') setPhase('cut');
    else if (phase === 'cut') {
      setPhase('one_piece');
      setCount(1);
    }
    else if (phase === 'one_piece') setPhase('count');
    else if (phase === 'done') {
      setPhase('whole');
      setCount(0);
    }
  };

  const handleCountPiece = () => {
    const next = count + 1;
    setCount(next);
    if (next === denom) {
      setTimeout(() => setPhase('done'), 800);
    }
  };

  const isUnited = phase === 'whole' || phase === 'done';

  return (
    <div className="flex flex-col items-center pb-40 w-full animate-in fade-in duration-500 min-h-screen bg-slate-50">
      <header className="w-full bg-white shadow-sm border-b border-slate-200 z-10 sticky top-[60px]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-lg md:text-2xl font-medium">
          <span>探秘魔法积木：1 里面有几个</span>
          <div className="flex items-center gap-1 bg-pink-50 border-2 border-pink-200 rounded-lg px-2 py-1">
            <span className="text-pink-600 font-bold ml-1">1</span>
            <span className="text-pink-300 font-light">/</span>
            <select
              value={denom}
              onChange={(e) => setDenom(parseInt(e.target.value))}
              className="bg-transparent text-pink-700 outline-none cursor-pointer text-center font-bold"
            >
              {[2, 3, 4, 5, 6, 8, 10, 12].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <span>？</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center relative">

        {/* Instructor Area */}
        <div className="text-center min-h-[160px] flex flex-col justify-end mb-8 w-full">
          <AnimatePresence mode="wait">
            {phase === 'whole' && (
              <motion.div key="p-whole" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4 tracking-tight">看这条长长的魔法积木！</p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">它是一个完整的，我们把它叫做 <strong className="text-3xl text-pink-600 bg-pink-100 border-2 border-pink-200 px-4 py-1 rounded-xl shadow-sm ml-1">1</strong></p>
              </motion.div>
            )}
            {phase === 'cut' && (
              <motion.div key="p-cut" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4 tracking-tight">咔嚓！变魔术啦！🪄</p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">我们把这个【1】 <strong className="text-white bg-pink-500 px-3 py-1 rounded-lg mx-1 shadow-sm border border-pink-600">平均切成了 {denom} 份</strong>。</p>
              </motion.div>
            )}
            {phase === 'one_piece' && (
              <motion.div key="p-one" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-xl md:text-2xl text-slate-500 mb-4 font-medium">其中单独点亮的这一小块，</p>
                 <p className="text-2xl md:text-3xl text-slate-700 font-bold">就是 {denom} 份里面的 1 份，也就是 <strong className="text-3xl text-white bg-pink-500 px-4 py-2 rounded-xl shadow-md border-2 border-pink-600 ml-1">1/{denom}</strong></p>
              </motion.div>
            )}
            {phase === 'count' && (
              <motion.div key="p-count" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                 <p className="text-2xl md:text-3xl text-slate-700 font-bold mb-4">核心问题来啦 🤔</p>
                 <p className="text-xl md:text-2xl text-slate-500 mb-6">完整的【1】里面，到底可以数出几个 1/{denom} 呢？</p>
                 <div className="text-3xl md:text-5xl font-mono font-bold text-slate-700 flex items-center justify-center">
                     <span className="text-sky-600 bg-sky-50 px-8 py-3 rounded-2xl border-4 border-sky-200 shadow-sm flex items-center gap-4">
                       <span className="text-2xl md:text-3xl text-sky-500 font-sans">已数:</span> 
                       {count} 
                       <span className="text-2xl md:text-3xl text-sky-500 font-sans">个</span>
                     </span>
                 </div>
              </motion.div>
            )}
            {phase === 'done' && (
              <motion.div key="p-done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-emerald-600 font-black mb-4">太聪明啦！🎉</p>
                 <p className="text-xl md:text-2xl text-slate-600 font-medium">原来 <strong className="text-4xl text-white bg-emerald-500 border-2 border-emerald-600 px-4 py-1 rounded-2xl mx-2 shadow-md">{denom}</strong> 个 1/{denom} 拼在一起，就是完整的 1！</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Magic Bar */}
        <motion.div
          layout
          className={`relative flex w-full max-w-4xl h-24 md:h-40 mx-auto mt-4 mb-4 bg-slate-100/50 p-2 md:p-3
            ${isUnited ? 'gap-0 shadow-[0_15px_60px_-15px_rgba(236,72,153,0.4)] rounded-3xl md:rounded-[2rem] border-4 border-pink-100' : 'gap-1 md:gap-3 shadow-inner rounded-3xl border-2 border-slate-200/60'}`}
        >
          {Array.from({ length: denom }).map((_, i) => {
            const isHighlighted =
               phase === 'whole' ||
               phase === 'cut' ||
               phase === 'done' ||
               (phase === 'one_piece' && i === 0) ||
               (phase === 'count' && i < count);

            const showText =
               phase === 'done' ||
               (phase === 'one_piece' && i === 0) ||
               (phase === 'count' && i < count);

            return (
               <motion.div
                 layout
                 key={i}
                 className={`flex-1 flex items-center justify-center relative overflow-hidden transition-all duration-500
                   ${isUnited ? '' : 'rounded-md md:rounded-2xl'}
                   ${isHighlighted ? 'bg-gradient-to-b from-pink-400 to-pink-500 shadow-md transform-gpu' : 'bg-slate-300/60 shadow-inner opacity-70'}
                   ${isUnited && i === 0 ? 'rounded-l-2xl md:rounded-l-[1.5rem]' : ''}
                   ${isUnited && i === denom - 1 ? 'rounded-r-2xl md:rounded-r-[1.5rem]' : ''}
                   ${isUnited && i !== 0 ? 'border-l border-white/20' : ''}
                 `}
               >
                  <AnimatePresence>
                    {showText && !isUnited && (
                       <motion.span
                         initial={{ scale: 0, opacity: 0, y: 10 }}
                         animate={{ scale: 1, opacity: 1, y: 0 }}
                         exit={{ scale: 0, opacity: 0 }}
                         className="text-white font-bold text-sm sm:text-base md:text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] filter"
                       >
                         1/{denom}
                       </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Highlight shine effect */}
                  {isHighlighted && !isUnited && (
                     <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                  )}
               </motion.div>
            )
          })}

          <AnimatePresence>
            {phase === 'whole' && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.1 }}
                 transition={{ duration: 0.4 }}
                 className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
               >
                 <span className="text-white text-6xl md:text-8xl font-black drop-shadow-[0_6px_10px_rgba(200,0,50,0.4)] tracking-widest leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>
                   完整的 1
                 </span>
               </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 md:py-6 flex justify-center items-center h-24 md:h-32">
          <AnimatePresence mode="wait">
            {phase === 'whole' && (
               <NextButton key="btn-whole" phase={phase} onClick={handleNext} colorClass="blue">
                 第一步：切开它！ 🔪
               </NextButton>
            )}
            {phase === 'cut' && (
               <NextButton key="btn-cut" phase={phase} onClick={handleNext} colorClass="violet">
                 第二步：认识一份 🔍
               </NextButton>
            )}
            {phase === 'one_piece' && (
               <NextButton key="btn-one" phase={phase} onClick={handleNext} colorClass="pink">
                 第三步：开始数！ 👆
               </NextButton>
            )}
            {phase === 'count' && (
               <NextButton key={`btn-count-${count}`} phase={`${phase}-${count}`} onClick={handleCountPiece} colorClass="blue">
                 {count === 0 ? "点亮第 1 块 🌟" : count < denom - 1 ? `接着点亮下一块 ${count + 1}` : "✨ 点亮最后一块 ✨"}
               </NextButton>
            )}
            {phase === 'done' && (
               <NextButton key="btn-done" phase={phase} onClick={handleNext} colorClass="emerald">
                 太神奇了！再变一次 🔄
               </NextButton>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Big Conclusion Overlay */}
      <AnimatePresence>
        {phase === 'done' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.6, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.8 }}
             transition={{ type: "spring", damping: 15, delay: 0.1 }}
             className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center w-[95%] max-w-2xl"
           >
             <div className="bg-white/95 backdrop-blur-xl w-full px-8 py-8 md:px-12 md:py-10 rounded-[3rem] shadow-2xl shadow-pink-500/20 border-8 border-pink-400 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-6 drop-shadow-sm">我们得出结论：</h2>
                <div className="text-5xl md:text-7xl font-bold bg-pink-50 px-8 py-6 rounded-3xl border-4 border-pink-100 flex items-center justify-center gap-6 md:gap-8 font-mono shadow-inner text-pink-500 w-full mb-2">
                   <span className="flex flex-col items-center">
                      <span className="border-b-8 border-pink-400 px-4 pb-1 -mb-1 z-10">{denom}</span>
                      <span className="pt-2">{denom}</span>
                   </span>
                   <span className="text-pink-300 leading-none pb-2">=</span>
                   <span className="text-6xl md:text-8xl text-emerald-500 font-sans font-black drop-shadow-md">1</span>
                </div>
                <div className="absolute -top-8 -right-8 text-7xl animate-bounce">🌟</div>
                <div className="absolute -top-6 -left-6 text-6xl animate-bounce delay-100">✨</div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SetFractionMode() {
  const [denominator, setDenominator] = useState(4);
  const [numerator, setNumerator] = useState(3);
  const [total, setTotal] = useState(12);
  const [shapeKey, setShapeKey] = useState<ShapeKey>('triangle');
  const [step, setStep] = useState(0); // 0: initial, 1: group, 2: select, 3: formula

  // Reset step to 0 if parameters change
  useEffect(() => {
    setStep(0);
  }, [denominator, numerator, total, shapeKey]);

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDenom = parseInt(e.target.value);
    setDenominator(newDenom);
    if (numerator >= newDenom) {
      setNumerator(newDenom - 1);
    }
    // Find closest valid multiple for total (up to 36)
    const multiple = Math.max(1, Math.round(total / newDenom));
    setTotal(Math.min(36, multiple * newDenom));
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTotal(parseInt(e.target.value));
  };
  
  const handleNumeratorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumerator(parseInt(e.target.value));
  };

  const ShapeIcon = SHAPES[shapeKey];
  const itemsPerGroup = total / denominator;
  
  // Valid total options for the current denominator
  const totalOptions = Array.from({ length: Math.floor(36 / denominator) }).map((_, i) => (i + 1) * denominator);

  const items = Array.from({ length: total }).map((_, i) => i);
  const groups = Array.from({ length: denominator }).map((_, i) => {
    return items.slice(i * itemsPerGroup, (i + 1) * itemsPerGroup);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center pb-40">
      
      {/* Header and Controls */}
      <header className="w-full bg-white shadow-sm border-b border-slate-200 z-10 sticky top-[60px]">
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-lg md:text-2xl font-medium">
          <span>我想知道</span>
          
          <select 
            value={total} 
            onChange={handleTotalChange}
            className="bg-sky-50 border-2 border-sky-200 text-sky-700 rounded-lg px-2 py-1 outline-none focus:border-sky-500 cursor-pointer transition-colors"
          >
            {totalOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          
          <span>个</span>

          <select 
            value={shapeKey} 
            onChange={(e) => setShapeKey(e.target.value as ShapeKey)}
            className="bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer transition-colors"
          >
            {Object.entries(SHAPE_NAMES).map(([k, name]) => (
              <option key={k} value={k}>{name}</option>
            ))}
          </select>

          <span>的</span>

          <div className="flex items-center gap-1 bg-amber-50 border-2 border-amber-200 rounded-lg px-2 py-1">
            <select 
              value={numerator} 
              onChange={handleNumeratorChange}
              className="bg-transparent text-amber-700 outline-none cursor-pointer text-center font-bold"
            >
              {Array.from({ length: denominator - 1 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span className="text-amber-300 font-light">/</span>
            <select 
              value={denominator} 
              onChange={handleDenominatorChange}
              className="bg-transparent text-amber-700 outline-none cursor-pointer text-center font-bold"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <span>是多少？</span>
        </div>
      </header>

      {/* Main Visualization Area */}
      <main className="flex-1 w-full max-w-5xl px-4 py-12">
        <motion.div layout className="flex flex-wrap justify-center content-center gap-3 min-h-[400px]">
          
          {step === 0 && items.map(id => (
            <motion.div
              layoutId={`item-${id}`}
              key={id}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              className="p-2 border-2 border-slate-100 bg-white shadow-sm rounded-xl"
            >
              <ShapeIcon className="w-12 h-12 md:w-16 md:h-16 fill-sky-400 text-sky-500 drop-shadow-sm" />
            </motion.div>
          ))}

          {step > 0 && groups.map((group, gIndex) => {
            const isSelected = step === 2 && gIndex < numerator;
            return (
              <motion.div
                layout
                key={`group-${gIndex}`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                className={`p-4 md:p-6 border-4 rounded-3xl flex flex-wrap gap-2 justify-center items-center shadow-sm relative overflow-hidden transition-colors duration-500
                  ${isSelected ? 'border-amber-400 bg-amber-50 shadow-amber-100/50' : 'border-slate-200 bg-white'}`}
                style={{ minWidth: "160px", maxWidth: "300px" }}
              >
                {/* Group label */}
                <div className={`absolute top-2 left-3 text-xs font-bold ${isSelected ? 'text-amber-500' : 'text-slate-400'}`}>
                  第 {gIndex + 1} 份
                </div>

                <div className="w-full flex justify-center flex-wrap gap-2 mt-4">
                  {group.map(id => (
                    <motion.div 
                      layoutId={`item-${id}`} 
                      key={id}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    >
                      <ShapeIcon className={`w-10 h-10 md:w-14 md:h-14 transition-colors duration-500 drop-shadow-sm
                        ${isSelected ? 'fill-amber-400 text-amber-500' : 
                          (step === 2 ? 'fill-slate-100 text-slate-200' : 'fill-sky-400 text-sky-500')}`} 
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </main>

      {/* Footer Instructions and Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
        <div className="max-w-5xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-lg md:text-2xl text-slate-700 flex-1">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                  <p>看！这里一共有 <strong className="text-sky-600 text-3xl">{total}</strong> 个{SHAPE_NAMES[shapeKey]}。</p>
                  <p className="text-slate-500 text-base md:text-lg mt-1">请点击右边的按钮，我们一步一步来找答案。</p>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="step1" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                  <p>
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold mr-2 mb-2 align-middle">第 1 步：看分母</span><br/>
                    分母是 <strong>{denominator}</strong>，代表把它们 <strong className="text-purple-600">平均分成 {denominator} 份</strong>。
                  </p>
                  <p className="text-purple-600 font-bold mt-2 font-mono bg-purple-50 p-2 rounded-lg inline-block">
                    {total} ÷ {denominator} = {itemsPerGroup} <span className="text-sm font-sans text-purple-600/70 ml-2">(每份有 {itemsPerGroup} 个)</span>
                  </p>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                  <p>
                    <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold mr-2 mb-2 align-middle">第 2 步：看分子</span><br/>
                    分子是 <strong>{numerator}</strong>，代表要 <strong className="text-amber-600">拿出其中的 {numerator} 份</strong>。
                  </p>
                  <p className="text-amber-600 font-bold mt-2 font-mono bg-amber-50 p-2 rounded-lg inline-block">
                    {numerator} × {itemsPerGroup} = {numerator * itemsPerGroup} <span className="text-sm font-sans text-amber-600/70 ml-2">(一共取出 {numerator * itemsPerGroup} 个)</span>
                  </p>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                  <p>
                    <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold mr-2 mb-2 align-middle">总结规律</span><br/>
                    把刚才的动作连起来，就是神奇的小口诀：<strong className="text-emerald-700">先除以分母，再乘以分子！</strong>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex gap-4 shrink-0">
            {step === 0 && (
              <NextButton phase={`step-${step}`} onClick={() => setStep(1)} colorClass="blue">
                第一步：分一分
              </NextButton>
            )}
            {step === 1 && (
              <NextButton phase={`step-${step}`} onClick={() => setStep(2)} colorClass="violet">
                第二步：取一取
              </NextButton>
            )}
            {step === 2 && (
              <NextButton phase={`step-${step}`} onClick={() => setStep(3)} colorClass="emerald">
                第三步：总结算式
              </NextButton>
            )}
            {step === 3 && (
              <NextButton phase={`step-${step}`} onClick={() => setStep(0)} colorClass="slate">
                重新演示
              </NextButton>
            )}
          </div>
          
        </div>
      </div>
      
      {/* Overlays */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 12, delay: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center"
          >
            <div className="bg-white/95 backdrop-blur-sm px-10 py-6 rounded-3xl shadow-xl shadow-amber-500/20 border-4 border-amber-400 text-center">
              <h2 className="text-3xl font-bold text-amber-600 mb-2">找出来啦！</h2>
              <p className="text-xl md:text-2xl text-slate-700 font-medium">
                一共是 <strong className="text-4xl text-amber-500 mx-2">{numerator * itemsPerGroup}</strong> 个！
              </p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center w-[90%] max-w-4xl"
          >
            <div className="bg-white/95 backdrop-blur-md px-6 py-8 md:px-12 md:py-10 rounded-3xl shadow-2xl border-4 border-emerald-400 text-center w-full relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 via-purple-400 to-amber-400"></div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 border-b-2 border-slate-100 pb-4">
                从图形变算式：找规律！
              </h2>
              
              <div className="flex items-center justify-center gap-1 md:gap-4 text-2xl md:text-5xl font-bold font-mono my-8">
                <div className="flex flex-col items-center">
                   <div className="text-sky-600 bg-sky-50 px-3 md:px-5 py-2 md:py-3 border-2 border-sky-100 rounded-2xl">{total}</div>
                   <div className="text-xs md:text-sm font-sans font-bold text-sky-600 mt-2">总图形数</div>
                </div>
                <div className="text-slate-300 mx-1 md:mx-2">÷</div>
                <div className="flex flex-col items-center">
                   <div className="text-purple-600 bg-purple-50 px-3 md:px-5 py-2 md:py-3 border-2 border-purple-100 rounded-2xl">{denominator}</div>
                   <div className="text-xs md:text-sm font-sans font-bold text-purple-600 mt-2">分母(分几份)</div>
                </div>
                <div className="text-slate-300 mx-1 md:mx-2">×</div>
                <div className="flex flex-col items-center">
                   <div className="text-amber-600 bg-amber-50 px-3 md:px-5 py-2 md:py-3 border-2 border-amber-100 rounded-2xl">{numerator}</div>
                   <div className="text-xs md:text-sm font-sans font-bold text-amber-600 mt-2">分子(取几份)</div>
                </div>
                <div className="text-slate-300 mx-1 md:mx-2">=</div>
                <div className="flex flex-col items-center">
                   <div className="text-emerald-600 bg-emerald-50 px-4 md:px-6 py-2 md:py-3 border-4 border-emerald-300 rounded-2xl shadow-lg shadow-emerald-200/50">{numerator * itemsPerGroup}</div>
                   <div className="text-xs md:text-sm font-sans font-bold text-emerald-600 mt-2">最终结果</div>
                </div>
              </div>
              
              <div className="mt-8 md:mt-12 text-lg md:text-2xl text-slate-700 bg-slate-50 border-2 border-slate-100 p-4 md:p-6 rounded-2xl inline-block font-medium">
                口诀：<strong>总数</strong> 先 <strong className="text-purple-600 bg-purple-100 px-2 rounded">除以分母</strong>，再 <strong className="text-amber-600 bg-amber-100 px-2 rounded">乘以分子</strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}

function UnitFractionMode() {
  type Phase = 'intro' | 'cut' | 'convert' | 'take' | 'done';
  type UnitId = 'meter_dm' | 'meter_cm' | 'yuan_jiao' | 'yuan_fen' | 'kg_g_10' | 'kg_g_4' | 'ton_kg' | 'hour_min' | 'year_month' | 'day_hour';

  const unitConfigs: Record<UnitId, { base: string, sub: string, denom: number, icon: string, label: string, nums: number[], subAmount: number, category: string, totalSubAmount: number }> = {
    meter_dm: { base: '米', sub: '分米', denom: 10, icon: '📏', label: '1米的十分之几 (分米)', nums: [1,2,3,4,5,6,7,8,9], subAmount: 1, category: '长度', totalSubAmount: 10 },
    meter_cm: { base: '米', sub: '厘米', denom: 10, icon: '📏', label: '1米的十分之几 (厘米)', nums: [1,2,3,4,5,6,7,8,9], subAmount: 10, category: '长度', totalSubAmount: 100 },
    yuan_jiao: { base: '元', sub: '角', denom: 10, icon: '🪙', label: '1元的十分之几 (角)', nums: [1,2,3,4,5,6,7,8,9], subAmount: 1, category: '金钱', totalSubAmount: 10 },
    yuan_fen: { base: '元', sub: '分', denom: 10, icon: '💴', label: '1元的十分之几 (分)', nums: [1,2,3,4,5,6,7,8,9], subAmount: 10, category: '金钱', totalSubAmount: 100 },
    kg_g_10: { base: '千克', sub: '克', denom: 10, icon: '⚖️', label: '1千克的十分之几 (克)', nums: [1,2,3,4,5,6,7,8,9], subAmount: 100, category: '重量', totalSubAmount: 1000 },
    kg_g_4: { base: '千克', sub: '克', denom: 4, icon: '⚖️', label: '1千克的四分之几 (克)', nums: [1,2,3], subAmount: 250, category: '重量', totalSubAmount: 1000 },
    ton_kg: { base: '吨', sub: '千克', denom: 5, icon: '🛳️', label: '1吨的五分之几 (千克)', nums: [1,2,3,4], subAmount: 200, category: '重量', totalSubAmount: 1000 },
    hour_min: { base: '小时', sub: '分钟', denom: 4, icon: '⏱️', label: '1小时的四分之几 (分)', nums: [1,2,3], subAmount: 15, category: '时间', totalSubAmount: 60 },
    year_month: { base: '年', sub: '个月', denom: 4, icon: '📅', label: '1年的四分之几 (月)', nums: [1,2,3], subAmount: 3, category: '时间', totalSubAmount: 12 },
    day_hour: { base: '天', sub: '小时', denom: 8, icon: '🌞', label: '1天的八分之几 (小时)', nums: [1,2,3,4,5,6,7], subAmount: 3, category: '时间', totalSubAmount: 24 },
  };

  const [unitType, setUnitType] = useState<UnitId>('meter_dm');
  const [num, setNum] = useState(9);
  const [phase, setPhase] = useState<Phase>('intro');

  const { base, sub, denom, icon, nums, subAmount, totalSubAmount } = unitConfigs[unitType];

  // Make sure num is valid if unitType changes
  useEffect(() => {
    if (!nums.includes(num)) {
      setNum(nums[0]);
    }
  }, [unitType, nums, num]);

  useEffect(() => {
    setPhase('intro');
  }, [unitType, num]);

  const handleNext = () => {
    if (phase === 'intro') setPhase('cut');
    else if (phase === 'cut') setPhase('convert');
    else if (phase === 'convert') setPhase('take');
    else if (phase === 'take') setPhase('done');
    else if (phase === 'done') setPhase('intro');
  };

  const isUnited = phase === 'intro';

  return (
    <div className="flex flex-col items-center pb-40 w-full animate-in fade-in duration-500 min-h-screen bg-slate-50">
      <header className="w-full bg-white shadow-sm border-b border-slate-200 z-10 sticky top-[60px]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-base md:text-2xl font-medium">
          <span>带单位的魔法：1 </span>
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value as UnitId)}
            className="bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-lg px-2 py-1 outline-none cursor-pointer max-w-[200px] md:max-w-max text-sm md:text-xl truncate"
          >
            {Object.entries(unitConfigs).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
          <span> 的 </span>
          <div className="flex items-center gap-1 bg-amber-50 border-2 border-amber-200 rounded-lg px-2 py-1 flex-shrink-0">
            <select
              value={num}
              onChange={(e) => setNum(parseInt(e.target.value))}
              className="bg-transparent text-amber-700 outline-none cursor-pointer text-center font-bold"
            >
              {nums.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-amber-400 font-light px-1">/</span>
            <span className="text-amber-700 font-bold pr-1">{denom}</span>
          </div>
          <span> 是多少？</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center relative">
        <div className="text-center min-h-[160px] flex flex-col justify-end mb-8 w-full">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="u-intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <div className="text-6xl mb-4">{icon}</div>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4">这是一{unitConfigs[unitType].category === '重量' || unitConfigs[unitType].category === '时间' ? '个' : unitConfigs[unitType].category === '长度' ? '条' : '枚'}完整的 <strong className="text-3xl text-indigo-600 bg-indigo-100 px-4 py-1 rounded-xl shadow-sm">1 {base}</strong></p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">看清楚啦，大单位是 <span className="font-bold border-b-4 border-indigo-300">{base}</span> 哦！</p>
              </motion.div>
            )}
            {phase === 'cut' && (
              <motion.div key="u-cut" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4">第一步：看分母，切成 {denom} 份！ ✂️</p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">每一小份叫 <strong className="text-white bg-indigo-500 px-3 py-1 rounded-lg shadow-sm mx-1">1/{denom} {base}</strong>，但是不太好想象它有多大对吧？</p>
              </motion.div>
            )}
            {phase === 'convert' && (
              <motion.div key="u-convert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-emerald-600 font-black mb-4">第二步：施展“单位换算”魔法！ ✨</p>
                 <p className="text-xl md:text-3xl text-slate-700 font-bold bg-emerald-50 inline-block px-6 py-3 rounded-2xl border-2 border-emerald-200">
                   1 {base} = {totalSubAmount} {sub}
                 </p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium mt-4">把 {totalSubAmount} {sub} 分成 {denom} 份，每一小份就是 <strong className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border-2 border-emerald-300 mx-1">{subAmount} {sub}</strong> 啦！是不是清晰多了？</p>
              </motion.div>
            )}
            {phase === 'take' && (
              <motion.div key="u-take" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-slate-800 font-black mb-4">第三步：看分子，拿出 {num} 份！ 👆</p>
                 <p className="text-xl md:text-2xl text-slate-500 font-medium">点亮其中的 {num} 份，准备来算一算……</p>
              </motion.div>
            )}
            {phase === 'done' && (
              <motion.div key="u-done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <p className="text-2xl md:text-4xl text-amber-600 font-black mb-4">大功告成，找到答案咯！ 🎉</p>
                 <p className="text-xl md:text-2xl text-slate-600 font-medium">
                   算出来是 {num} 个 {subAmount} {sub}，所以就是 <strong className="text-4xl text-white bg-amber-500 border-2 border-amber-600 px-4 py-1 rounded-2xl mx-1 shadow-md">{num * subAmount} {sub}</strong>！
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
           layout
           className={`relative flex w-full max-w-4xl h-24 md:h-40 mx-auto mt-4 mb-4 bg-slate-100/50 p-2 md:p-3
             ${isUnited ? 'gap-0 shadow-[0_15px_60px_-15px_rgba(79,70,229,0.3)] rounded-3xl md:rounded-[2rem] border-4 border-indigo-200' : 'gap-1 md:gap-2 shadow-inner rounded-3xl md:rounded-[2rem] border-2 border-slate-200'}`}
        >
           {Array.from({ length: denom }).map((_, i) => {
             const isTaken = (phase === 'take' || phase === 'done') && i < num;
             const isConvert = phase === 'convert' || phase === 'take' || phase === 'done';
             
             let bgClass = 'bg-slate-300 opacity-60 shadow-inner';
             let textClass = 'text-white/80 scale-75 pt-2 md:pt-0';
             
             if (isUnited) {
               bgClass = 'bg-gradient-to-b from-indigo-400 to-indigo-500 border-none';
             } else if (isTaken) {
               bgClass = 'bg-gradient-to-b from-amber-400 to-amber-500 shadow-md ring-2 ring-amber-200 z-10 scale-[1.02] transform-gpu';
               textClass = 'text-white font-black drop-shadow-md';
             } else if (phase === 'cut' || phase === 'convert') {
               bgClass = 'bg-gradient-to-b from-indigo-400 to-indigo-500 opacity-80 shadow-md transform-gpu';
               textClass = 'text-white font-bold drop-shadow-sm';
             }

             return (
               <motion.div
                 layout
                 key={i}
                 className={`flex-1 flex items-center justify-center relative overflow-hidden transition-all duration-500
                   ${isUnited ? '' : 'rounded-lg md:rounded-xl'}
                   ${bgClass}
                   ${isUnited && i === 0 ? 'rounded-l-2xl md:rounded-l-[1.5rem]' : ''}
                   ${isUnited && i === denom - 1 ? 'rounded-r-2xl md:rounded-r-[1.5rem]' : ''}
                   ${isUnited && i !== 0 ? 'border-l border-white/20' : ''}
                 `}
               >
                  <AnimatePresence mode="popLayout">
                    {!isUnited && (
                       <motion.div
                         key={isConvert ? 'sub' : 'base'}
                         initial={{ scale: 0, opacity: 0, y: 10 }}
                         animate={{ scale: 1, opacity: 1, y: 0 }}
                         exit={{ scale: 0, opacity: 0, y: -10 }}
                         className={`flex flex-col items-center justify-center ${textClass}`}
                       >
                         {isConvert ? (
                           <span className="text-xl md:text-3xl lg:text-4xl md:font-black pb-1 md:pb-0">{subAmount}<span className="text-sm md:text-xl lg:text-2xl relative -bottom-0.5 md:-bottom-1 ml-0.5">{sub}</span></span>
                         ) : (
                           <div className="flex flex-col items-center">
                             <span className="text-[10px] sm:text-xs md:text-sm lg:text-lg leading-none border-b border-white/50 px-1 mb-0.5">1</span>
                             <span className="text-[10px] sm:text-xs md:text-sm lg:text-lg leading-none font-sans font-normal pt-0.5">{denom}</span>
                             <span className="text-[10px] sm:text-xs md:text-sm lg:text-xl leading-tight font-sans absolute top-8 sm:top-10 md:top-14">{base}</span>
                           </div>
                         )}
                       </motion.div>
                    )}
                  </AnimatePresence>
                  {isTaken && <div className="absolute inset-0 bg-white/20" />}
               </motion.div>
             )
           })}

           <AnimatePresence>
             {isUnited && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
                >
                  <span className="text-white text-5xl md:text-7xl font-black drop-shadow-lg tracking-widest leading-none">
                    1 {base}
                  </span>
                </motion.div>
             )}
           </AnimatePresence>
        </motion.div>

      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 md:py-6 flex justify-center items-center h-24 md:h-32">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
               <NextButton key="btn-u-intro" phase={phase} onClick={handleNext} colorClass="indigo">
                 切分成 {denom} 份！ 🔪
               </NextButton>
            )}
            {phase === 'cut' && (
               <NextButton key="btn-u-cut" phase={phase} onClick={handleNext} colorClass="emerald">
                 听着别扭？变个魔术！ ✨
               </NextButton>
            )}
            {phase === 'convert' && (
               <NextButton key="btn-u-conv" phase={phase} onClick={handleNext} colorClass="amber">
                 要取出 {num} 份！ ✋
               </NextButton>
            )}
            {phase === 'take' && (
               <NextButton key="btn-u-take" phase={phase} onClick={handleNext} colorClass="pink">
                 大声一起算总共多少 📣
               </NextButton>
            )}
            {phase === 'done' && (
               <NextButton key="btn-u-done" phase={phase} onClick={handleNext} colorClass="slate">
                 再换一个题目试试 🔄
               </NextButton>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {phase === 'done' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.8, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.8 }}
             transition={{ type: "spring", damping: 15 }}
             className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center w-[95%] max-w-2xl pointer-events-none"
           >
             <div className="bg-white/95 backdrop-blur-xl px-4 md:px-6 py-8 md:py-10 rounded-[3rem] shadow-2xl shadow-indigo-500/20 border-8 border-indigo-300 text-center w-full relative overflow-hidden pointer-events-auto">
                <h2 className="text-3xl md:text-4xl font-black text-indigo-700 mb-6 drop-shadow-sm">带单位分数的绝招 📜</h2>
                <div className="text-2xl md:text-5xl font-bold bg-indigo-50 px-4 md:px-6 py-8 rounded-3xl border-4 border-indigo-100 items-center justify-center font-mono shadow-inner text-indigo-600 flex flex-col gap-6">
                   <div className="flex items-center text-xl md:text-4xl text-slate-700 font-sans font-bold">
                     <span>1 {base} 的</span>
                     <span className="flex flex-col items-center mx-2 md:mx-3 font-bold text-amber-500 bg-white px-2 rounded-xl shadow-sm border border-amber-200 leading-tight">
                        <span className="border-b-4 border-amber-400 px-2 pb-1 text-2xl md:text-4xl">{num}</span>
                        <span className="pt-1 text-2xl md:text-4xl">{denom}</span>
                     </span>
                   </div>
                   <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-4xl md:text-6xl text-emerald-500 font-black">
                     <span className="text-slate-300 leading-none mr-2">=</span>
                     <span>{num * subAmount}</span>
                     <span className="bg-emerald-100 border-2 border-emerald-200 text-emerald-600 px-3 py-1 rounded-2xl shadow-sm">{sub}</span>
                   </div>
                </div>
                
                <div className="mt-8 text-lg md:text-2xl text-slate-700 bg-emerald-50 border-4 border-emerald-200 p-6 rounded-3xl leading-relaxed text-left relative shadow-inner">
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 text-4xl md:text-5xl opacity-40">✨</div>
                  <strong className="block mb-2 text-emerald-700">学习秘方：</strong>
                  当分数遇上单位，想不清楚的时候，就把大单位<strong className="text-emerald-600 font-black mx-1 bg-emerald-100 px-2 rounded-lg">换成小单位</strong> (比如 1{base} = {totalSubAmount}{sub})，这样每一份就变成了具体的数字，是不是就闭着眼睛都会算啦！
                </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'whole' | 'set' | 'reverse' | 'unit'>('whole');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex justify-center w-full px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            <button 
              onClick={() => setActiveTab('whole')}
              className={`px-4 md:px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'whole' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              🧱 1里面有几个？
            </button>
            <button 
              onClick={() => setActiveTab('reverse')}
              className={`px-4 md:px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'reverse' ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              🕵️‍♀️ 1里面有多少个什么？
            </button>
            <button 
              onClick={() => setActiveTab('set')}
              className={`px-4 md:px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'set' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              🧩 几个图形之几
            </button>
            <button 
              onClick={() => setActiveTab('unit')}
              className={`px-4 md:px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === 'unit' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
            >
              📏 带单位的几分之几
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        {activeTab === 'set' ? <SetFractionMode /> : activeTab === 'reverse' ? <ReverseFractionMode /> : activeTab === 'unit' ? <UnitFractionMode /> : <WholeFractionMode />}
      </div>
    </div>
  );
}

