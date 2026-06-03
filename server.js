import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser"; 
import multer from "multer";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações Globais e Credenciais http://localhost:3000/backoffice/login
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; 
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || !ADMIN_PASSWORD) {
  console.warn("⚠️  WARNING: Environment variables MONGODB_URI or ADMIN_PASSWORD are missing. Check your .env file.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists once during startup
const UPLOAD_DIR = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Servir o site público v2 (permite omitir o .html nos URLs)
app.use(express.static(path.join(__dirname, "v2"), { extensions: ["html"] }));

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^\+?[0-9\s\-]{9,15}$/; 
const urlRegex = /^(https?:\/\/|\/)[^\s$.?#].[^\s]*$/;

// ==========================================
// MIDDLEWARE DE PROTEÇÃO DE ACESSO
// ==========================================
const checkAdminAuth = (req, res, next) => {
  if (req.cookies.admin_session === ADMIN_PASSWORD) {
    return next();
  }
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(401).json({ 
      success: false, 
      error: "Acesso negado. Sessão de administrador inválida." 
    });
  }
  res.redirect("/backoffice/login");
};

// ==========================================
// MULTER CONFIGURATION (IMAGE UPLOADS)
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Protected static serving for admin views
// Ensures that admin assets/HTML are only accessible to authenticated users
app.use('/backoffice', (req, res, next) => {
  // Allow the login page to load its own assets if they are in this folder
  if (req.path === '/login' || req.path === '/login.html') return next();
  return checkAdminAuth(req, res, next);
}, express.static(path.join(__dirname, 'admin-views')));

// ==========================================
// DATABASE CONNECTION
// ==========================================
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✨ MongoDB conectado com sucesso! O teatro de ópera está pronto."))
  .catch((err) => console.log("🚨 Falha na ligação ao MongoDB:", err));

// ==========================================
// MONGOOSE SCHEMAS & MODELS
// ==========================================
const contactRequestSchema = new mongoose.Schema(
  {
    type: { type: String, required: [true, "Selecione o tipo de contacto"], enum: { values: ["general", "membership"], message: "O tipo selecionado não é válido" } },
    firstName: { type: String, required: [true, "O nome é obrigatório"], trim: true },
    lastName: { type: String, required: [true, "O apelido é obrigatório"], trim: true },
    email: { type: String, required: [true, "O e-mail é obrigatório para podermos responder"], trim: true, lowercase: true, match: [emailRegex, "O formato do e-mail não é válido"] },
    message: { type: String, trim: true, required: [function () { return this.type === "general"; }, "Por favor, escreva a sua mensagem"] },
    documentUrl: { type: String, trim: true, required: [function () { return this.type === "membership"; }, "É necessário o link para o seu portefólio ou currículo"] },
    status: { type: String, enum: ["unread", "processed", "archived"], default: "unread" }
  },
  { timestamps: true }
);

const sessionSubSchema = new mongoose.Schema({
  date: { type: Date, required: [true, "A data da sessão é obrigatória"] },
  time: { type: String, required: [true, "A hora da sessão é obrigatória"], trim: true }, 
  specificLocation: { type: String, required: [true, "Indique a sala ou palco"], trim: true },
  availableTickets: { type: Number, required: [true, "Defina a lotação"], min: [0, "A lotação não pode ser negativa"] },
  status: { type: String, enum: ["available", "unavailable", "sold_out"], default: "available" }
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "O título do espetáculo é obrigatório"], unique: true, trim: true },
    imageUrl: { type: String, required: [true, "O cartaz do evento (imagem) é obrigatório"], match: [urlRegex, "O formato do link da imagem é inválido"] },
    locationSummary: { type: String, required: [true, "A localização geral é obrigatória"], trim: true },
    quote: { type: String, trim: true },
    direction: { type: String, required: [true, "A direção artística é obrigatória"], trim: true },
    duration: { type: String, required: [true, "A duração é obrigatória"], trim: true },
    description: { type: String, required: [true, "A sinopse é obrigatória"], minlength: [30, "A sinopse é demasiado curta (mínimo 30 caracteres)"] },
    sessions: [sessionSubSchema],
    faqs: [{ question: { type: String, required: true }, answer: { type: String, required: true } }],
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "O título da notícia é obrigatório"], trim: true },
    publishDate: { type: Date, required: [true, "A data de publicação é obrigatória"] },
    imageUrl: { type: String, required: [true, "A imagem de miniatura é obrigatória"], match: [urlRegex, "O formato da imagem é inválido"] },
    articleUrl: { type: String, required: [true, "O link para o artigo externo é obrigatório"], match: [urlRegex, "O URL do artigo não é válido"] },
    body: { type: String, required: [true, "O corpo da notícia não pode estar vazio"], trim: true } 
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "Nome do titular obrigatório"], trim: true },
    lastName: { type: String, required: [true, "Apelido do titular obrigatório"], trim: true },
    email: { type: String, required: [true, "E-mail para envio de bilhetes obrigatório"], trim: true, lowercase: true, match: [emailRegex, "E-mail inválido"] },
    phone: { type: String, required: [true, "Contacto telefónico obrigatório"], match: [phoneRegex, "O telefone deve ter entre 9 e 15 dígitos"] },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: [true, "Indique a quantidade"], min: [1, "Mínimo de 1 bilhete"], max: [10, "Máximo de 10 bilhetes por reserva"] },
    observations: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);
const Event = mongoose.model("Event", eventSchema);
const News = mongoose.model("News", newsSchema);
const Ticket = mongoose.model("Ticket", ticketSchema);

// ==========================================
// ROTAS DE NAVEGAÇÃO DO BACKOFFICE
// ==========================================
app.get("/backoffice/login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-views", "login.html"));
});

app.post("/backoffice/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.cookie("admin_session", ADMIN_PASSWORD, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true, path: "/" });
    return res.redirect("/backoffice/dashboard");
  }
  res.redirect("/backoffice/login?error=1");
});

app.get("/backoffice/dashboard", checkAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin-views", "dashboard.html"));
});

app.get("/backoffice/logout", (req, res) => {
  res.clearCookie("admin_session");
  res.redirect("/backoffice/login");
});

// ==========================================
// ENDPOINTS DE CONSULTA HÍBRIDA (PUBLIC / ADMIN)
// ==========================================
app.get("/api/events/gallery", async (req, res) => {
  try {
    const galleryItems = await Event.find({}, "title imageUrl locationSummary").sort({ createdAt: -1 }).limit(6).lean();
    res.json({ success: true, count: galleryItems.length, data: galleryItems });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/events", async (req, res) => {
  try {
    const { featured, search, page, limit } = req.query;
    let buildQuery = {};
    if (featured) buildQuery.isFeatured = featured === "true";
    if (search) buildQuery.title = new RegExp(search, "i");

    // Inteligência Admin: Se não houver paginação explícita, entrega tudo ao Dashboard
    if (!page && !limit) {
      const allEvents = await Event.find(buildQuery).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, data: allEvents });
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const eventsList = await Event.find(buildQuery).sort({ "sessions.date": 1 }).skip(skipIndex).limit(parseInt(limit)).lean();
    const aggregateTotal = await Event.countDocuments(buildQuery);

    res.json({
      success: true,
      meta: { totalItems: aggregateTotal, currentPage: parseInt(page), totalPages: Math.ceil(aggregateTotal / limit) },
      data: eventsList
    });
  } catch (err) { 
    console.error("🔴 Erro Mongoose em GET /api/events:", err.message);
    res.status(500).json({ success: false, error: err.message }); 
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const targetDoc = await Event.findById(req.params.id);
    if (!targetDoc) return res.status(404).json({ success: false, error: "Event profile not found." });
    res.json({ success: true, data: targetDoc });
  } catch (err) { res.status(400).json({ success: false, error: "Malformed ID format." }); }
});

app.get("/api/news", async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (!page && !limit) {
      const allNews = await News.find({}).sort({ publishDate: -1 }).lean();
      return res.json({ success: true, data: allNews });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 4;
    const skipIndex = (pageNum - 1) * limitNum;

    const newsFeed = await News.find({}).sort({ publishDate: -1 }).skip(skipIndex).limit(limitNum).lean();
    const totalNewsDocs = await News.countDocuments({});

    res.json({
      success: true,
      meta: { total: totalNewsDocs, page: pageNum, totalPages: Math.ceil(totalNewsDocs / limitNum) },
      data: newsFeed
    });
  } catch (err) { 
    console.error("🔴 Erro Mongoose em GET /api/news:", err.message);
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// ==========================================
// ENDPOINTS DE SUBMISSÃO PÚBLICA
// ==========================================
app.post("/api/contact-requests", async (req, res) => {
  try {
    const contactDoc = await ContactRequest.create(req.body);
    res.status(201).json({ success: true, data: contactDoc });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

app.post("/api/tickets", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { firstName, lastName, email, phone, eventId, sessionId, quantity, observations } = req.body;
    if (!eventId || !sessionId || !quantity) return res.status(400).json({ success: false, error: "Malformed payload." });

    const targetedEvent = await Event.findById(eventId).session(session);
    if (!targetedEvent) return res.status(404).json({ success: false, error: "Event not located." });

    const targetSubSession = targetedEvent.sessions.id(sessionId);
    if (!targetSubSession) return res.status(404).json({ success: false, error: "Schedule missing." });

    if (targetSubSession.status !== "available" || targetSubSession.availableTickets < quantity) {
      return res.status(400).json({ success: false, error: "Tickets mapping unavailable." });
    }

    targetSubSession.availableTickets -= quantity;
    if (targetSubSession.availableTickets === 0) targetSubSession.status = "sold_out";

    await targetedEvent.save({ session });
    const receipt = await Ticket.create([{ firstName, lastName, email, phone, eventId, sessionId, quantity, observations }], { session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, receipt: receipt[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// ENDPOINTS RESTRITOS (🔒 EXCLUSIVO BACKOFFICE)
// ==========================================

// --- MENSAGENS DOS UTILIZADORES ---
app.get("/api/contact-requests", checkAdminAuth, async (req, res) => {
  try {
    const list = await ContactRequest.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put("/api/contact-requests/:id", checkAdminAuth, async (req, res) => {
  try {
    const updated = await ContactRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Registo não localizado." });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

// --- RESERVAS DE BILHETES ---
app.get("/api/tickets", checkAdminAuth, async (req, res) => {
  try {
    const list = await Ticket.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- OPERAÇÕES MASTER EM EVENTOS ---
app.post("/api/events", checkAdminAuth, upload.single('image'), async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.file) eventData.imageUrl = `/images/${req.file.filename}`;
    
    // Parse sessions if they come as a stringified JSON (from FormData)
    if (eventData.sessions && typeof eventData.sessions === 'string') {
      eventData.sessions = JSON.parse(eventData.sessions);
    }

    const payload = await Event.create(eventData);
    res.status(201).json({ success: true, data: payload });
  } catch (err) {
    console.error("🔴 Erro ao criar evento:", err.message);
    const errorMsg = err.name === 'ValidationError' ? Object.values(err.errors).map(e => e.message).join(". ") : err.message;
    res.status(400).json({ success: false, error: errorMsg });
  }
});

app.put("/api/events/:id", checkAdminAuth, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = `/images/${req.file.filename}`;
    
    if (updateData.sessions && typeof updateData.sessions === 'string') {
      updateData.sessions = JSON.parse(updateData.sessions);
    }

    const modifiedDoc = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!modifiedDoc) return res.status(404).json({ success: false, error: "Missing document." });
    res.json({ success: true, data: modifiedDoc });
  } catch (err) {
    console.error("🔴 Erro ao atualizar evento:", err.message);
    const errorMsg = err.name === 'ValidationError' ? Object.values(err.errors).map(e => e.message).join(". ") : err.message;
    res.status(400).json({ success: false, error: errorMsg });
  }
});

app.delete("/api/events/:id", checkAdminAuth, async (req, res) => {
  try {
    const erased = await Event.findByIdAndDelete(req.params.id);
    if (!erased) return res.status(404).json({ success: false, error: "Absent record." });
    res.json({ success: true, message: "Cleared" });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

// --- OPERAÇÕES MASTER EM NOTÍCIAS ---
app.post("/api/news", checkAdminAuth, upload.single('image'), async (req, res) => {
  try {
    const newsData = { ...req.body };
    if (req.file) newsData.imageUrl = `/images/${req.file.filename}`;

    const snippet = await News.create(newsData);
    res.status(201).json({ success: true, data: snippet });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

app.put("/api/news/:id", checkAdminAuth, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = `/images/${req.file.filename}`;

    const revisedDoc = await News.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!revisedDoc) return res.status(404).json({ success: false, error: "Not found." });
    res.json({ success: true, data: revisedDoc });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

app.delete("/api/news/:id", checkAdminAuth, async (req, res) => {
  try {
    const status = await News.findByIdAndDelete(req.params.id);
    if (!status) return res.status(404).json({ success: false, error: "Absent document." });
    res.json({ success: true, message: "Unlinked." });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "v2", "index.html")); });

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});