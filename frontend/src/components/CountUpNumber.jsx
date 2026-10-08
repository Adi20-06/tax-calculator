import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function CountUpNumber({ value, prefix = '₹' }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    prefix + Math.round(latest).toLocaleString('en-IN')
  );
  const [display, setDisplay] = useState(prefix + '0');

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: 'easeOut',
    });
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return <motion.span>{display}</motion.span>;
}