import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div className="faq-item" key={i}>
          <button
            type="button"
            className="faq-question"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <motion.span
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="faq-icon"
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p className="faq-answer">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}