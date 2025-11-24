// src/components/PageTransition.jsx
import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PageTransition = ({ children, className }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeOut" }} // Chỉnh tốc độ mượt ở đây
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;