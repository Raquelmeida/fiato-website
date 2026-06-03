import './press-list.css';

const defaultArticles = [
  {
    id: 1,
    day: '09',
    month: 'maio',
    year: '2026',
    title: 'A ópera desce à rua e toma conta do Porto',
  },
  {
    id: 2,
    day: '12',
    month: 'maio',
    year: '2026',
    title: 'Quando a cidade se torna um teatro de ópera imersivo',
  },
  {
    id: 3,
    day: '14',
    month: 'maio',
    year: '2026',
    title: 'FIATO transforma o mercado do Bolhão num palco lírico',
  },
  {
    id: 4,
    day: '15',
    month: 'maio',
    year: '2026',
    title: 'O projeto que está a democratizar a música clássica',
  },
];

function PressList({ articles = defaultArticles }) {
  return (
    <section className="press" data-navbar-theme="blue">
      <div className="press__inner">
        <header className="press__header">
          <h2 className="press__heading">Na Imprensa</h2>

          <a href="#" className="press__more">
            MAIS NOTÍCIAS <span aria-hidden="true">↗</span>
          </a>
        </header>

        <ul className="press__list">
          {articles.map((article) => (
            <li key={article.id} className="press__row">
              <a href="#" className="press__link">
                <div className="press__date">
                  <span className="press__day">{article.day}</span>
                  <span className="press__month">
                    {article.month}, {article.year}
                  </span>
                </div>

                <div className="press__thumb ph" aria-hidden="true"></div>

                <h3 className="press__title">{article.title}</h3>

                <span className="press__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PressList;
