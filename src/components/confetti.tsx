import React, { useEffect, useState } from 'react';

const Confetti = ({ intensity = 'normal' }) => {
  const [pieces] = useState(() => {
    // Plus de confetti pour l'intensité "high"
    const count = intensity === 'high' ? 50 : 20;
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 800, // Plus grande dispersion pour "high"
      dy: (Math.random() - 0.5) * 800,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
      scale: intensity === 'high' ? 0.8 + Math.random() * 0.8 : 1,
      color: [
        'bg-yellow-400',
        'bg-pink-400',
        'bg-blue-400',
        'bg-green-400',
        'bg-purple-400',
        'bg-red-400'
      ][Math.floor(Math.random() * (intensity === 'high' ? 6 : 4))]
    }))
  });

  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-full opacity-0`}
          style={{
            left: '50%',
            top: '50%',
            animation: `confetti-piece-${piece.id} 2s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
      <style>{`
        ${pieces.map(piece => `
          @keyframes confetti-piece-${piece.id} {
            0% { 
              opacity: 1;
              transform: translate(-50%, -50%) rotate(0deg) scale(${piece.scale});
            }
            100% { 
              opacity: 0;
              transform: 
                translate(
                  calc(-50% + ${piece.dx}px),
                  calc(-50% + ${piece.dy}px)
                )
                rotate(${piece.rotation + piece.rotationSpeed}deg)
                scale(${piece.scale});
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
};

export default Confetti;