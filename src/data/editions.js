const editions = [
  {
    year: '2026',
    subtitle: 'Edição Atual',
    theme: 'navy',
    hasImage: true,
    events: [],
    press: [],
  },
  {
    year: '2025',
    subtitle: 'Ópera à Moda do Porto',
    theme: 'orange',
    hasImage: false,
    events: [
      {
        id: 1,
        day: '09',
        month: 'junho',
        title: 'ópera sobre (corpos) refugiados',
        time: '21H00',
        place: 'Teatro Nacional de São João',
        price: '15,00€',
      },
      {
        id: 2,
        day: '12',
        month: 'junho',
        title: 'ópera e o porto',
        time: '21H00',
        place: 'Teatro Nacional de São João',
        price: '15,00€',
      },
      {
        id: 3,
        day: '12',
        month: 'junho',
        title: 'ópera e o porto',
        time: '21H00',
        place: 'Teatro Nacional de São João',
        price: '15,00€',
      },
    ],
    press: [
      {
        id: 1,
        day: '09',
        date: 'maio, 2025',
        title: 'A ópera desce à rua e toma conta do Porto',
      },
      {
        id: 2,
        day: '12',
        date: 'maio, 2025',
        title: 'Quando a cidade se torna um teatro de ópera imersivo',
      },
      {
        id: 3,
        day: '14',
        date: 'maio, 2025',
        title: 'FIATO transforma o mercado do Bolhão num palco lírico',
      },
      {
        id: 4,
        day: '15',
        date: 'maio, 2025',
        title: 'O projeto que está a democratizar a música clássica',
      },
    ],
  },
  {
    year: '2024',
    subtitle: 'Primeira edição do FIATO',
    theme: 'navy',
    hasImage: false,
    events: [],
    press: [],
  },
];

export default editions;