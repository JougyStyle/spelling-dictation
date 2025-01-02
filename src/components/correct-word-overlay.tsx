import { motion } from 'framer-motion';

const CorrectWordOverlay = ({ word }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.5, y: -20 }}
    className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
  >
    <div className="bg-green-500 text-white text-4xl font-bold px-8 py-4 rounded-lg shadow-lg">
      {word}
    </div>
  </motion.div>
);

export default CorrectWordOverlay;
