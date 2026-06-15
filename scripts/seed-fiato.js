import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Run with `npm run seed` after configuring .env.");
  process.exit(1);
}

const urlRegex = /^(https?:\/\/|\/)[^\s$.?#].[^\s]*$/;

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true },
  specificLocation: { type: String, required: true, trim: true },
  availableTickets: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["available", "unavailable", "sold_out"], default: "available" }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  imageUrl: { type: String, required: true, match: urlRegex },
  locationSummary: { type: String, required: true, trim: true },
  quote: { type: String, trim: true },
  direction: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  description: { type: String, required: true, minlength: 30 },
  price: { type: String, trim: true },
  sessions: [sessionSchema],
  faqs: [{ question: { type: String, required: true }, answer: { type: String, required: true } }],
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const arquivoSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  title: { type: String, trim: true, default: "Edição Especial" },
  description: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true, match: urlRegex }
}, { timestamps: true });

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  publishDate: { type: Date, required: true },
  imageUrl: { type: String, required: true, match: urlRegex },
  articleUrl: { type: String, required: true, match: urlRegex },
  body: { type: String, required: true, trim: true }
}, { timestamps: true });

const aboutPageSchema = new mongoose.Schema({
  heroDescription: String,
  heroCtaLinks: [{ label: String, url: String }],
  manifestoEyebrow: String,
  manifestoTitle: String,
  manifestoBodyLeft: String,
  manifestoBodyRight: String,
  marqueeItems: [{ text: String }],
  editionEyebrow: String,
  editionYearTop: String,
  editionYearBottom: String,
  editionDescription: String,
  editionCtaLabel: String,
  editionCtaUrl: String,
  editionImageUrl: String,
  teamEyebrow: String,
  teamHeading: String,
  teamMembers: [{ name: String, photoUrl: String, order: Number }],
  faqEyebrow: String,
  faqHeading: String,
  faqItems: [{ question: String, answer: String, order: Number }]
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
const Arquivo = mongoose.model("Arquivo", arquivoSchema);
const News = mongoose.model("News", newsSchema);
const AboutPage = mongoose.model("AboutPage", aboutPageSchema);

const img = {
  stageWide: "/images/1780513909126-621278202.jpg",
  stageTall: "/images/1780514560349-522433335.jpg",
  solo: "/images/1780860602657-419560448.jpg",
  portrait1: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait2: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait3: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait4: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait5: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait6: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait7: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=900",
  portrait8: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=900"
};

const events = [
  {
    title: "Ópera no Jardim",
    imageUrl: img.solo,
    locationSummary: "Jardins do Palácio de Cristal",
    quote: "A natureza como palco e a ópera como banda sonora de um jardim encantado.",
    direction: "Rui Carvalho",
    duration: "1H00M",
    description: "Ópera no Jardim levou a música lírica aos Jardins do Palácio de Cristal, com pequenas estações de performance espalhadas pelos recantos do parque. O público foi convidado a descobrir cada momento musical num percurso livre e intimista.",
    price: "8",
    isFeatured: false,
    sessions: [
      { date: new Date("2024-06-15T16:00:00.000Z"), time: "17H00", specificLocation: "Jardins do Palácio de Cristal", availableTickets: 0, status: "sold_out" },
      { date: new Date("2024-06-16T16:00:00.000Z"), time: "17H00", specificLocation: "Jardins do Palácio de Cristal", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "O evento realiza-se ao ar livre?", answer: "Sim, nos Jardins do Palácio de Cristal. Recomenda-se roupa confortável." }
    ]
  },
  {
    title: "Vozes no Mercado (Edição Fundadora)",
    imageUrl: img.stageTall,
    locationSummary: "Mercado do Bolhão",
    quote: "A primeira ocupação lírica do Bolhão abriu caminho para uma nova relação entre ópera e quotidiano.",
    direction: "Luís Carvalho",
    duration: "55M",
    description: "A edição fundadora de Vozes no Mercado apresentou pequenas intervenções vocais no Mercado do Bolhão, aproximando intérpretes, comerciantes e visitantes. A proposta estabeleceu o modelo de proximidade que viria a marcar a identidade do FIATO.",
    price: "",
    isFeatured: true,
    sessions: [
      { date: new Date("2024-09-08T10:30:00.000Z"), time: "11H30", specificLocation: "Mercado do Bolhão", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "A entrada é gratuita?", answer: "Sim, mas a reserva é recomendada para garantir acompanhamento no percurso." }
    ]
  },
  {
    title: "Cantata para a Cidade",
    imageUrl: img.stageWide,
    locationSummary: "Praça de Gomes Teixeira",
    quote: "Uma criação coral para uma cidade que se reconhece na voz coletiva.",
    direction: "Inês Tavares",
    duration: "1H05M",
    description: "Cantata para a Cidade reuniu coro comunitário, solistas convidados e ensemble de câmara numa criação apresentada ao ar livre. O espetáculo partiu de histórias recolhidas no Porto e transformou-as numa partitura acessível, luminosa e participada.",
    price: "",
    isFeatured: false,
    sessions: [
      { date: new Date("2024-05-18T17:30:00.000Z"), time: "18H30", specificLocation: "Praça de Gomes Teixeira", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "Foi um espetáculo participativo?", answer: "Sim. A criação contou com participantes de oficinas vocais realizadas nos meses anteriores." }
    ]
  },
  {
    title: "Oficina de Voz e Espaço Público",
    imageUrl: img.solo,
    locationSummary: "Biblioteca Municipal Almeida Garrett",
    quote: "Uma sessão prática para descobrir como a voz muda quando encontra a cidade.",
    direction: "Clara Santos",
    duration: "2H00M",
    description: "A Oficina de Voz e Espaço Público apresentou ferramentas simples de respiração, projeção e escuta para participantes sem formação musical obrigatória. A atividade ligou prática vocal, mediação cultural e preparação para espetáculos em espaços não convencionais.",
    price: "",
    isFeatured: false,
    sessions: [
      { date: new Date("2024-10-12T09:00:00.000Z"), time: "10H00", specificLocation: "Biblioteca Municipal Almeida Garrett", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "Era necessária experiência musical?", answer: "Não. A oficina foi desenhada para participantes curiosos, com ou sem prática vocal." }
    ]
  },
  {
    title: "Ecos do Douro",
    imageUrl: img.stageWide,
    locationSummary: "Cais da Ribeira",
    quote: "O Douro encontra a ópera numa comunhão entre a paisagem e a voz humana.",
    direction: "Marta Menezes",
    duration: "1H20M",
    description: "Ecos do Douro é um espetáculo imersivo que percorre as margens do rio Douro, combinando canto lírico, música instrumental e sonoridades da natureza. O público acompanha o percurso a pé entre pontos emblemáticos da Ribeira, com paragens para performances site-specific.",
    price: "12",
    isFeatured: true,
    sessions: [
      { date: new Date("2025-07-12T19:00:00.000Z"), time: "20H00", specificLocation: "Cais da Ribeira", availableTickets: 80, status: "available" },
      { date: new Date("2025-07-13T19:00:00.000Z"), time: "20H00", specificLocation: "Cais da Ribeira", availableTickets: 80, status: "sold_out" }
    ],
    faqs: [
      { question: "O percurso é acessível?", answer: "O percurso inclui zonas planas e escadas. Recomenda-se calçado confortável." }
    ]
  },
  {
    title: "Fados sem Fronteiras",
    imageUrl: img.stageTall,
    locationSummary: "Teatro Nacional São João",
    quote: "O fado cruza a ópera num diálogo entre géneros e emoções.",
    direction: "Sofia Bernardo",
    duration: "1H15M",
    description: "Fados sem Fronteiras propõe um encontro inédito entre o fado e a ópera, com vozes convidadas de ambos os universos musicais. A direção musical cruza repertório tradicional português com peças de ópera clássica, revelando afinidades surpreendentes entre as duas formas de expressão.",
    price: "15",
    isFeatured: false,
    sessions: [
      { date: new Date("2025-09-05T21:00:00.000Z"), time: "21H00", specificLocation: "Teatro Nacional São João", availableTickets: 120, status: "available" }
    ],
    faqs: [
      { question: "O espetáculo é recomendado para quem não conhece ópera?", answer: "Sim. A programação foi pensada para aproximar públicos de diferentes origens musicais." }
    ]
  },
  {
    title: "Noites Líricas no Bonfim",
    imageUrl: img.solo,
    locationSummary: "Auditório da Junta de Freguesia do Bonfim",
    quote: "Recitais de curta duração para abrir portas a repertórios raramente escutados fora das grandes salas.",
    direction: "Tiago Rocha",
    duration: "1H10M",
    description: "Noites Líricas no Bonfim apresentou um ciclo de recitais comentados com árias, canções portuguesas e encomendas breves. Cada sessão incluiu uma conversa inicial para aproximar o público das escolhas musicais e da história das obras.",
    price: "6",
    isFeatured: false,
    sessions: [
      { date: new Date("2025-05-24T20:00:00.000Z"), time: "21H00", specificLocation: "Auditório da Junta de Freguesia do Bonfim", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "O recital teve conversa introdutória?", answer: "Sim. A mediação foi integrada no início da sessão para contextualizar o repertório." }
    ]
  },
  {
    title: "Recital das Pontes",
    imageUrl: img.stageWide,
    locationSummary: "Museu do Carro Elétrico",
    quote: "Um programa sobre travessias, memória industrial e ligações afetivas entre margens.",
    direction: "Rita Almeida",
    duration: "1H00M",
    description: "Recital das Pontes juntou voz e piano num programa dedicado a poemas, cartas e paisagens sonoras ligadas ao rio. A apresentação decorreu em formato intimista, com lotação reduzida e forte relação entre repertório e espaço.",
    price: "10",
    isFeatured: false,
    sessions: [
      { date: new Date("2025-11-08T18:00:00.000Z"), time: "19H00", specificLocation: "Museu do Carro Elétrico", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "A lotação foi limitada?", answer: "Sim. A sessão teve lotação reduzida para preservar a proximidade acústica." }
    ]
  },
  {
    title: "A Vida do Grande Camilo",
    imageUrl: img.stageWide,
    locationSummary: "Teatro Nacional São João",
    quote: "Uma celebração lírica da palavra, da cidade e das paixões que atravessam a obra de Camilo.",
    direction: "Marta Menezes",
    duration: "1H30M",
    description: "A Vida do Grande Camilo cruza ópera, narração e movimento numa leitura contemporânea do imaginário camiliano. A cidade surge como palco vivo, aproximando o público da música clássica através de uma linguagem clara, intensa e acessível.",
    price: "15",
    isFeatured: true,
    sessions: [
      { date: new Date("2026-07-18T20:30:00.000Z"), time: "21H30", specificLocation: "Teatro Nacional São João", availableTickets: 64, status: "available" },
      { date: new Date("2026-07-19T17:30:00.000Z"), time: "18H30", specificLocation: "Teatro Nacional São João", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "O espetáculo é adequado a novos públicos?", answer: "Sim. A dramaturgia foi pensada para quem conhece ópera e também para quem se aproxima pela primeira vez." },
      { question: "Existe lugar marcado?", answer: "As reservas confirmadas recebem indicação de zona e acesso antes da sessão." }
    ]
  },
  {
    title: "Vozes no Mercado",
    imageUrl: img.stageTall,
    locationSummary: "Mercado do Bolhão",
    quote: "A voz humana ocupa o quotidiano e transforma o mercado numa caixa de ressonância.",
    direction: "Luís Carvalho",
    duration: "55M",
    description: "Um percurso musical pelo Mercado do Bolhão, com pequenas intervenções vocais entre bancas, corredores e varandas interiores. A proposta privilegia proximidade, surpresa e escuta atenta.",
    price: "",
    isFeatured: true,
    sessions: [
      { date: new Date("2026-08-08T10:30:00.000Z"), time: "11H30", specificLocation: "Mercado do Bolhão", availableTickets: 40, status: "available" }
    ],
    faqs: [
      { question: "A entrada é gratuita?", answer: "Sim, mas a reserva é recomendada para garantir acompanhamento no percurso." }
    ]
  },
  {
    title: "Cartas de Água e Pedra",
    imageUrl: img.solo,
    locationSummary: "Jardins do Palácio de Cristal",
    quote: "Um recital ao ar livre onde a paisagem responde a cada frase musical.",
    direction: "Inês Tavares",
    duration: "1H10M",
    description: "Recital encenado para voz, piano e desenho de luz natural nos Jardins do Palácio de Cristal. O programa junta repertório português e europeu em torno da memória, da água e da cidade.",
    price: "12",
    isFeatured: false,
    sessions: [
      { date: new Date("2026-09-12T18:00:00.000Z"), time: "19H00", specificLocation: "Concha Acústica", availableTickets: 0, status: "sold_out" }
    ],
    faqs: [
      { question: "O evento realiza-se com chuva?", answer: "Em caso de mau tempo, a organização comunica alternativa ou reagendamento aos participantes." }
    ]
  },
  {
    title: "A Queda de um Anjo",
    imageUrl: img.stageWide,
    locationSummary: "Cais da Ribeira",
    quote: "A sátira social de Camilo ganha corpo numa ópera com humor, ritmo e proximidade urbana.",
    direction: "Rui Carvalho",
    duration: "1H15M",
    description: "A Queda de um Anjo adapta o olhar satírico de Camilo Castelo Branco a uma criação musical pensada para o centro histórico do Porto. A encenação usa a paisagem da Ribeira como espaço de jogo entre política, desejo e ironia.",
    price: "10",
    isFeatured: false,
    sessions: [
      { date: new Date("2026-07-20T20:00:00.000Z"), time: "21H00", specificLocation: "Cais da Ribeira", availableTickets: 120, status: "available" }
    ],
    faqs: [
      { question: "O espetáculo é ao ar livre?", answer: "Sim. A equipa recomenda chegada antecipada e roupa adequada ao fim de tarde junto ao rio." }
    ]
  },
  {
    title: "La Traviata Portuense",
    imageUrl: img.solo,
    locationSummary: "Estação de São Bento",
    quote: "Verdi encontra a intimidade acústica de um dos espaços mais reconhecidos do Porto.",
    direction: "Sofia Bernardo",
    duration: "1H45M",
    description: "Uma leitura de La Traviata em formato de proximidade, centrada na voz, no gesto e na arquitetura da Estação de São Bento. O público acompanha a ação em zonas assinaladas, com mediação antes da sessão.",
    price: "18",
    isFeatured: false,
    sessions: [
      { date: new Date("2026-09-21T20:00:00.000Z"), time: "21H00", specificLocation: "Átrio Central da Estação de São Bento", availableTickets: 200, status: "available" }
    ],
    faqs: [
      { question: "O espaço tem acessibilidade?", answer: "Sim, o percurso previsto é plano e tem acesso para mobilidade reduzida." }
    ]
  },
  {
    title: "Carmen no Mercado",
    imageUrl: img.stageTall,
    locationSummary: "Mercado do Bolhão",
    quote: "Bizet ganha uma escala nova entre pregões, escadas e circulação quotidiana.",
    direction: "Miguel Gonçalves",
    duration: "1H30M",
    description: "Carmen no Mercado transforma o Mercado do Bolhão num palco vivo para uma versão compacta e intensa da ópera de Bizet. A proposta valoriza a proximidade entre intérpretes e público sem comprometer a clareza musical.",
    price: "12",
    isFeatured: false,
    sessions: [
      { date: new Date("2026-09-22T20:00:00.000Z"), time: "21H00", specificLocation: "Mercado do Bolhão", availableTickets: 100, status: "available" }
    ],
    faqs: [
      { question: "Há lugares sentados?", answer: "Existem zonas sentadas limitadas e lugares em pé para acompanhamento do percurso." }
    ]
  },
  {
    title: "\u00D3pera \u00e0 Moda do Porto",
    imageUrl: img.stageWide,
    locationSummary: "Passos Manuel",
    quote: "O manifesto FIATO cruza repertório, rua e imaginário portuense.",
    direction: "Marta Menezes",
    duration: "1H30M",
    description: "Ópera à Moda do Porto é o projeto-manifesto do FIATO: uma criação que aproxima a música lírica da energia urbana, combinando repertório clássico, encomendas contemporâneas e participação de artistas locais.",
    price: "",
    isFeatured: true,
    sessions: [
      { date: new Date("2026-12-20T20:00:00.000Z"), time: "20H00", specificLocation: "Passos Manuel", availableTickets: 150, status: "available" }
    ],
    faqs: [
      { question: "A reserva é obrigatória?", answer: "A entrada é gratuita, mas a reserva ajuda a gerir a lotação e o acolhimento do público." }
    ]
  }
];

const archives = [
  {
    year: 2026,
    title: "FIATO 2026",
    description: "Edição dedicada a aproximar a ópera da cidade, com espetáculos em teatros, mercados, jardins e espaços de circulação quotidiana.",
    imageUrl: img.stageWide
  },
  {
    year: 2025,
    title: "FIATO 2025",
    description: "Uma edição de consolidação, marcada por residências artísticas, mediação cultural e novas encomendas para pequenos formatos.",
    imageUrl: img.stageTall
  },
  {
    year: 2024,
    title: "FIATO 2024",
    description: "A edição que lançou as bases para a internacionalização do festival, com parcerias além-fronteiras e uma programação diversificada.",
    imageUrl: img.solo
  }
];

const news = [
  {
    title: "FIATO anuncia programa de verão no Porto",
    publishDate: new Date("2026-06-01T09:00:00.000Z"),
    imageUrl: img.stageWide,
    articleUrl: "https://www.publico.pt/",
    body: "A nova programação reforça a presença da ópera em espaços públicos e em equipamentos culturais da cidade."
  },
  {
    title: "Ópera aproxima novos públicos através da cidade",
    publishDate: new Date("2026-05-14T09:00:00.000Z"),
    imageUrl: img.solo,
    articleUrl: "https://www.rtp.pt/",
    body: "O festival aposta em formatos de proximidade, mediação e cruzamento entre repertório clássico e criação contemporânea."
  },
  {
    title: "FIATO abre reservas para espetáculos de verão",
    publishDate: new Date("2026-04-22T09:00:00.000Z"),
    imageUrl: img.stageTall,
    articleUrl: "https://www.timeout.pt/porto/",
    body: "As primeiras reservas da edição de 2026 destacam projetos no Mercado do Bolhão, na Ribeira e nos Jardins do Palácio de Cristal."
  },
  {
    title: "Criação contemporânea ganha palco no FIATO 2026",
    publishDate: new Date("2026-03-18T10:30:00.000Z"),
    imageUrl: img.stageWide,
    articleUrl: "https://www.jpn.up.pt/",
    body: "A programação de 2026 cruza repertório clássico, novas encomendas e formatos de curta duração pensados para espaços de proximidade."
  },
  {
    title: "FIATO 2025: balanço positivo de uma edição histórica",
    publishDate: new Date("2025-10-01T10:00:00.000Z"),
    imageUrl: img.stageTall,
    articleUrl: "https://www.publico.pt/",
    body: "A edição de 2025 do FIATO superou as expectativas, com mais de 5000 espectadores e uma cobertura mediática internacional."
  },
  {
    title: "Ecos do Douro: a ópera que nasceu do rio",
    publishDate: new Date("2025-07-01T09:00:00.000Z"),
    imageUrl: img.stageWide,
    articleUrl: "https://www.rtp.pt/",
    body: "O espetáculo Ecos do Douro marcou o verão do Porto ao transformar as margens do rio num palco de ópera ao ar livre."
  },
  {
    title: "Residências artísticas aproximam criadores e comunidades",
    publishDate: new Date("2025-04-12T09:30:00.000Z"),
    imageUrl: img.solo,
    articleUrl: "https://www.jpn.up.pt/",
    body: "Durante a preparação da edição de 2025, artistas do FIATO desenvolveram sessões abertas com associações locais e grupos corais amadores."
  },
  {
    title: "FIATO apresenta ciclo de mediação no Bonfim",
    publishDate: new Date("2025-03-06T11:00:00.000Z"),
    imageUrl: img.stageTall,
    articleUrl: "https://www.timeout.pt/porto/",
    body: "O novo ciclo combinou conversas, ensaios abertos e recitais comentados para tornar a linguagem lírica mais próxima de públicos diversos."
  },
  {
    title: "FIATO 2024: o ano da internacionalização",
    publishDate: new Date("2024-11-15T09:00:00.000Z"),
    imageUrl: img.solo,
    articleUrl: "https://www.publico.pt/",
    body: "Com artistas de seis países e parcerias com festivais europeus, o FIATO 2024 afirmou o Porto como destino cultural de referência."
  },
  {
    title: "Bolhão recebe primeira intervenção vocal do FIATO",
    publishDate: new Date("2024-09-09T09:00:00.000Z"),
    imageUrl: img.stageTall,
    articleUrl: "https://www.rtp.pt/",
    body: "A apresentação fundadora no Mercado do Bolhão mostrou como a ópera pode ocupar espaços quotidianos sem perder rigor musical."
  },
  {
    title: "Coro comunitário estreia Cantata para a Cidade",
    publishDate: new Date("2024-05-20T08:30:00.000Z"),
    imageUrl: img.stageWide,
    articleUrl: "https://www.jpn.up.pt/",
    body: "A primeira criação participativa do FIATO reuniu moradores, estudantes e intérpretes profissionais numa apresentação pública no centro do Porto."
  },
  {
    title: "FIATO lança programa piloto de oficinas vocais",
    publishDate: new Date("2024-03-14T10:00:00.000Z"),
    imageUrl: img.solo,
    articleUrl: "https://www.timeout.pt/porto/",
    body: "O programa piloto apresentou oficinas de voz, respiração e escuta para preparar a relação entre público, intérpretes e espaços urbanos."
  }
];

const aboutPage = {
  heroDescription: "O FIATO aproxima a ópera da cidade do Porto através de experiências de escuta, criação e encontro em espaços convencionais e inesperados.",
  heroCtaLinks: [
    { label: "Programação", url: "agenda.html" },
    { label: "Arquivo", url: "arquivo.html" },
    { label: "Contactos", url: "contactos.html" }
  ],
  manifestoEyebrow: "Ópera em contacto direto com a cidade.",
  manifestoTitle: "Nascemos para abrir a arte lírica a novos lugares, corpos e escutas.",
  manifestoBodyLeft: "O FIATO trabalha com artistas, mediadores e parceiros locais para criar espetáculos que respeitam a tradição sem a fechar numa sala. Cada edição procura uma relação clara entre repertório, território e público.",
  manifestoBodyRight: "A programação combina produções, recitais, percursos, oficinas e momentos de conversa. O objetivo é tornar a ópera mais acessível, mais próxima e mais presente na vida cultural do Porto.",
  marqueeItems: [
    { text: "A opera desce a rua" },
    { text: "Escuta partilhada" },
    { text: "Cidade em palco" }
  ],
  editionEyebrow: "Edição atual",
  editionYearTop: "20",
  editionYearBottom: "26",
  editionDescription: "A edição de 2026 ocupa teatros, mercados e jardins com propostas que cruzam voz, palavra e cidade.",
  editionCtaLabel: "Consultar Arquivo",
  editionCtaUrl: "arquivo.html",
  editionImageUrl: img.stageWide,
  teamEyebrow: "A equipa por trás das cortinas",
  teamHeading: "Uma disrupção necessária ao serviço da democratização cultural.",
  teamMembers: [
    { name: "Marta Menezes, direção artística", photoUrl: img.portrait1, order: 1 },
    { name: "Luís Carvalho, produção executiva", photoUrl: img.portrait2, order: 2 },
    { name: "Inês Tavares, mediação cultural", photoUrl: img.portrait3, order: 3 },
    { name: "Rita Almeida, comunicação", photoUrl: img.portrait4, order: 4 },
    { name: "Tiago Rocha, programação", photoUrl: img.portrait5, order: 5 },
    { name: "Clara Santos, parcerias", photoUrl: img.portrait6, order: 6 },
    { name: "Miguel Nunes, produção técnica", photoUrl: img.portrait7, order: 7 },
    { name: "Beatriz Costa, mediação e públicos", photoUrl: img.portrait8, order: 8 }
  ],
  faqEyebrow: "Informação útil",
  faqHeading: "Perguntas\nFrequentes",
  faqItems: [
    { question: "Os espetáculos são acessíveis a novos públicos?", answer: "Sim. A programação inclui notas de contexto, mediação e formatos pensados para diferentes níveis de familiaridade com ópera.", order: 1 },
    { question: "Onde decorrem os eventos?", answer: "Em teatros, espaços públicos e locais parceiros da cidade do Porto, sempre indicados na página de cada evento.", order: 2 },
    { question: "Como posso reservar?", answer: "Cada evento indica se permite compra, reserva ou apenas consulta de informação.", order: 3 }
  ]
};

await mongoose.connect(MONGODB_URI);

await Event.deleteOne({ title: "Cartas de Agua e Pedra" });

for (const event of events) {
  await Event.findOneAndUpdate({ title: event.title }, { $set: event }, { upsert: true, new: true, runValidators: true });
}

for (const archive of archives) {
  await Arquivo.findOneAndUpdate({ year: archive.year }, { $set: archive }, { upsert: true, new: true, runValidators: true });
}

for (const item of news) {
  await News.findOneAndUpdate({ title: item.title }, { $set: item }, { upsert: true, new: true, runValidators: true });
}

await AboutPage.findOneAndUpdate({}, { $set: aboutPage }, { upsert: true, new: true, runValidators: true });

await mongoose.disconnect();
console.log("FIATO seed completed: events, archive, news and about page are up to date.");
