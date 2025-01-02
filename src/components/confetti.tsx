import { motion } from 'framer-motion';

const Confetti = () => (
  <motion.div 
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5 }}
  >
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-3 h-3 bg-yellow-400 rounded-full"
        initial={{ x: "50%", y: "50%" }}
        animate={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          scale: 0
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    ))}
  </motion.div>
);

export default Confetti;
