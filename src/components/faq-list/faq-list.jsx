import { useState } from 'react';
import './faq-list.css';

function FaqList({ items = [] }) {
  // First item open by default to echo the mockup.
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(index) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <ul className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <li
            key={item.question}
            className={`faq-list__item ${isOpen ? 'faq-list__item--open' : ''}`}
          >
            <button
              type="button"
              className="faq-list__trigger"
              aria-expanded={isOpen}
              onClick={() => toggle(index)}
            >
              <span className="faq-list__question">{item.question}</span>
              <span className="faq-list__icon" aria-hidden="true">
                {isOpen ? '–' : '+'}
              </span>
            </button>

            <div
              className="faq-list__answer-wrap"
              role="region"
              hidden={!isOpen}
            >
              <p className="faq-list__answer">{item.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default FaqList;
