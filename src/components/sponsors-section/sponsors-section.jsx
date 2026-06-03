import './sponsors-section.css';

const groups = [
  {
    label: 'Apoio Institucional',
    items: ['Câmara do Porto', 'DGArtes'],
  },
  {
    label: 'Mecenas Principal',
    items: ['Fundação BPI'],
  },
  {
    label: 'Parceiros Media',
    items: ['Antena 2', 'RTP'],
  },
];

function SponsorsSection() {
  return (
    <section className="sponsors" data-navbar-theme="light">
      <div className="sponsors__inner">
        <div className="sponsors__grid">
          {groups.map((group) => (
            <div key={group.label} className="sponsors__group">
              <span className="sponsors__label">{group.label}</span>
              <ul className="sponsors__list">
                {group.items.map((item) => (
                  <li key={item} className="sponsors__item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
