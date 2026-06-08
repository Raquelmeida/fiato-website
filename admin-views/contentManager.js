let appState = {
    events: [],
    news: [],
    contacts: [],
    tickets: [],
    instagram: [],
    arquivo: [],
    about: null
};

let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
    initTabSystem();
    loadTabContent("events"); 
});

// ==========================================
// MOTOR NAVEGACIONAL ENTRE ABAS
// ==========================================
function initTabSystem() {
    const tabs = document.querySelectorAll(".tab-link");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("is-active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("is-active"));
            
            tab.classList.add("is-active");
            const targetSchema = tab.getAttribute("data-tab");
            document.getElementById(targetSchema).classList.add("is-active");
            
            loadTabContent(targetSchema);
        });
    });
}

async function loadTabContent(schema) {
    let endpoint = "";
    if (schema === "events") endpoint = "/api/events";
    if (schema === "news") endpoint = "/api/news";
    if (schema === "contacts") endpoint = "/api/contact-requests";
    if (schema === "tickets") endpoint = "/api/tickets";
    if (schema === "instagram") endpoint = "/api/instagram";
    if (schema === "arquivo") endpoint = "/api/arquivos";
    if (schema === "about") endpoint = "/api/about-page";

    try {
        const response = await fetch(endpoint);
        
        // Proteção Estrita contra respostas em formato HTML de Erros 404/500
        if (!response.ok) {
            console.error(`🚨 Servidor devolveu erro ${response.status} para a rota ${endpoint}`);
            renderTable(schema, []);
            return;
        }

        const json = await response.json();
        
        if (json.success) {
            if (schema === "about") {
                appState.about = json.data || {};
                renderAboutCards(appState.about);
            } else {
                appState[schema] = Array.isArray(json.data) ? json.data : [];
                renderTable(schema, appState[schema]);
            }
        } else {
            if (schema === "about") {
                appState.about = {};
                renderAboutCards({});
            } else {
                renderTable(schema, []);
            }
        }
    } catch (err) {
        console.error(`Erro crítico de rede ao ler dados de ${schema}:`, err);
        if (schema === "about") {
            renderAboutCards({});
        } else {
            renderTable(schema, []);
        }
    }
}

// ==========================================
// PESQUISA EM TEMPO REAL
// ==========================================
function filterData(schema) {
    const query = document.getElementById(`search-${schema}`).value.toLowerCase();
    
    const filtered = appState[schema].filter(item => {
        if (schema === "events") {
            return item.title.toLowerCase().includes(query) || item.locationSummary.toLowerCase().includes(query);
        }
        if (schema === "news") {
            return item.title.toLowerCase().includes(query);
        }
        if (schema === "arquivo") {
            return item.year.toString().includes(query) || item.description.toLowerCase().includes(query);
        }
        if (schema === "instagram") {
            return item.caption.toLowerCase().includes(query);
        }
        if (schema === "contacts" || schema === "tickets") {
            const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
            return fullName.includes(query) || item.email.toLowerCase().includes(query);
        }
        return true;
    });

    renderTable(schema, filtered);
}

// ==========================================
// RENDERIZADORES DADOS HTML
// ==========================================
function renderTable(schema, dataset) {
    const tbody = document.getElementById(`table-body-${schema}`);
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!dataset || dataset.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="has-text-centered has-text-grey py-5"><i class="fas fa-folder-open mr-2"></i>Nenhum registo localizado nesta coleção.</td></tr>`;
        return;
    }

    dataset.forEach(item => {
        let row = document.createElement("tr");

        if (schema === "events") {
            row.innerHTML = `
                <td><strong style="color: var(--fiato-dark); font-weight:600;">${item.title}</strong></td>
                <td><span style="color:#64748b; font-size:0.9rem;"><i class="fas fa-map-marker-alt mr-2"></i>${item.locationSummary}</span></td>
                <td>${item.direction}</td>
                <td><span class="tag is-light" style="font-weight:500;">${item.duration}</span></td>
                <td class="has-text-centered">${item.isFeatured ? '<span class="tag is-warning" style="background-color:#fef3c7; color:#d97706; font-weight:600; border-radius:6px;">Destaque</span>' : '<span class="tag is-light" style="border-radius:6px; color:#94a3b8;">Standard</span>'}</td>
                <td class="has-text-right">
                    <button class="button is-small is-white" style="color:#0284c7;" onclick="openEditEvent('${item._id}')"><i class="fas fa-pen"></i></button>
                    <button class="button is-small is-white" style="color:#ef4444;" onclick="deleteResource('events', '${item._id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        } 
        else if (schema === "arquivo") {
            row.innerHTML = `
                <td><strong style="color: var(--fiato-dark);">${item.year}</strong></td>
                <td><span class="has-text-grey" style="font-size:0.9rem;">${item.description}</span></td>
                <td class="has-text-centered"><div style="width: 40px; height: 40px; margin: 0 auto; border-radius: 6px; background-image: url('${item.imageUrl}'); background-size: cover; background-position: center;"></div></td>
                <td class="has-text-right">
                    <button class="button is-small is-white" style="color:#0284c7;" onclick="openEditArquivo('${item._id}')"><i class="fas fa-pen"></i></button>
                    <button class="button is-small is-white" style="color:#ef4444;" onclick="deleteResource('arquivos', '${item._id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        }
        else if (schema === "news") {
            const dateFormatted = new Date(item.publishDate).toLocaleDateString('pt-PT');
            row.innerHTML = `
                <td><span style="font-weight:500; color:var(--fiato-dark);">${item.title}</span></td>
                <td><span class="has-text-grey" style="font-size:0.9rem;">${dateFormatted}</span></td>
                <td><a href="${item.articleUrl}" target="_blank" style="color:var(--fiato-coral); font-size:0.85rem; font-weight:500;" class="text-break">${item.articleUrl} <i class="fas fa-external-link-alt ml-1" style="font-size:0.75rem;"></i></a></td>
                <td class="has-text-right">
                    <button class="button is-small is-white" style="color:#0284c7;" onclick="openEditNews('${item._id}')"><i class="fas fa-pen"></i></button>
                    <button class="button is-small is-white" style="color:#ef4444;" onclick="deleteResource('news', '${item._id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        }
        else if (schema === "contacts") {
            const statusTags = { 
                unread: 'background-color: #fee2e2; color: #ef4444; font-weight:600;', 
                processed: 'background-color: #dcfce7; color: #16a34a; font-weight:600;', 
                archived: 'background-color: #f1f5f9; color: #64748b;' 
            };
            row.innerHTML = `
                <td><strong style="color: var(--fiato-dark);">${item.firstName} ${item.lastName}</strong></td>
                <td style="color:#475569; font-size:0.9rem;">${item.email}</td>
                <td><span class="tag is-white" style="border: 1px solid var(--fiato-border); color:var(--fiato-dark); font-weight:500; border-radius:6px;">${item.type ? item.type.toUpperCase() : 'GERAL'}</span></td>
                <td><span class="tag" style="border-radius:6px; ${statusTags[item.status] || ''}">${item.status === 'unread' ? 'Pendente' : item.status === 'processed' ? 'Tratado' : 'Arquivado'}</span></td>
                <td class="has-text-right">
                    <button class="button is-small is-dark" style="border-radius:8px; font-weight:600; background-color: var(--fiato-dark);" onclick="openViewContact('${item._id}')"><i class="fas fa-envelope-open mr-2"></i> Abrir</button>
                </td>
            `;
        }
        else if (schema === "tickets") {
            row.innerHTML = `
                <td><strong style="color: var(--fiato-dark);">${item.firstName} ${item.lastName}</strong></td>
                <td style="color:#475569; font-size:0.9rem;">${item.email}</td>
                <td style="font-size:0.9rem;">${item.phone}</td>
                <td class="has-text-centered"><span class="tag is-dark" style="background-color:var(--fiato-dark); font-weight:600; border-radius:6px; padding: 0 0.75rem;">${item.quantity} un</span></td>
                <td><p class="has-text-grey" style="font-size:0.85rem; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.observations || '<span class="has-text-grey-light">Sem observações</span>'}</p></td>
            `;
        }
        else if (schema === "instagram") {
            const dateFormatted = item.date ? new Date(item.date).toLocaleDateString('pt-PT') : '';
            const previewStyle = item.mediaUrl ? `background-image: url('${item.mediaUrl.replace(/'/g, '%27')}'); background-size: cover; background-position: center;` : 'background-color: #e2e8f0;';
            const typeIcon = item.mediaType === 'video' ? '<i class="fas fa-video mr-1"></i>' : '<i class="fas fa-image mr-1"></i>';
            const statusTag = item.isPublished
                ? '<span class="tag is-success" style="background-color: #dcfce7; color: #16a34a; font-weight: 600; border-radius: 6px;">Publicado</span>'
                : '<span class="tag is-light" style="border-radius: 6px; color: #94a3b8;">Rascunho</span>';

            row.innerHTML = `
                <td><div style="width: 50px; height: 50px; border-radius: 8px; ${previewStyle}"></div></td>
                <td><span style="color: var(--fiato-dark); font-weight: 500;">${(item.caption || '').substring(0, 50)}${item.caption && item.caption.length > 50 ? '…' : ''}</span></td>
                <td><span style="color: #64748b;">${typeIcon}${item.mediaType === 'video' ? 'Vídeo' : 'Imagem'}</span></td>
                <td><span style="color: #64748b; font-size: 0.9rem;">${dateFormatted}</span></td>
                <td><span class="tag is-light" style="border-radius: 6px; font-weight: 500;">${item.order || 0}</span></td>
                <td>${statusTag}</td>
                <td class="has-text-right">
                    <button class="button is-small is-white" style="color:#0284c7;" onclick="openEditInstagram('${item._id}')"><i class="fas fa-pen"></i></button>
                    <button class="button is-small is-white" style="color:#ef4444;" onclick="deleteResource('instagram', '${item._id}')"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        }

        tbody.appendChild(row);
    });
}

// ==========================================
// GESTÃO DE JANELAS MODAIS
// ==========================================
function clearFormErrors(schema) {
    const prefix = schema === 'events' ? 'event' : schema === 'news' ? 'news' : schema === 'instagram' ? 'instagram' : schema === 'arquivo' ? 'arquivo' : schema === 'about' ? 'about' : null;
    if (!prefix) return;
    const banner = document.getElementById(`${prefix}-error-banner`);
    if (banner) {
        banner.innerText = "";
        banner.classList.add("is-hidden");
    }
}

function openCreateModal(schema) {
    currentEditId = null;
    document.getElementById(`form-${schema}`).reset();
    clearFormErrors(schema);
    
    if (schema === "events") {
        document.getElementById("dynamic-sessions-wrapper").innerHTML = "";
        addSessionRow(); // Começa com uma linha em branco por conveniência
    }
    if (schema === "instagram") {
        document.getElementById("instagram-preview-wrapper").classList.add("is-hidden");
        document.getElementById("instagram-isPublished").checked = true;
        document.getElementById("instagram-order").value = "0";
        document.getElementById("instagram-date").value = new Date().toISOString().substring(0, 10);
    }
    if (schema === "arquivo") {
        document.getElementById("arquivo-preview-wrapper").classList.add("is-hidden");
        document.getElementById("arquivo-year").value = new Date().getFullYear();
    }
    
    const titles = {
        events: "Criar Novo Evento",
        news: "Publicar Nova Notícia",
        instagram: "Adicionar Publicação Instagram",
        arquivo: "Novo Registo de Arquivo"
    };
    document.getElementById(`modal-${schema}-title`).innerText = titles[schema] || "Criar Registo";
    document.getElementById(`modal-${schema}`).classList.add("is-active");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("is-active");
}

// ==========================================
// CONTROLADOR COMPLETO: EVENTOS
// ==========================================

// Injeta uma nova linha de sessão no formulário (vazia ou pré-preenchida)
function addSessionRow(data = null) {
    const wrapper = document.getElementById("dynamic-sessions-wrapper");
    const rowId = 'session_' + Math.random().toString(36).substring(2, 9);

    const dateVal = data && data.date ? data.date.substring(0, 10) : "";
    const timeVal = data && data.time ? data.time : "";
    const locVal = data && data.specificLocation ? data.specificLocation : "";
    const tktVal = data && data.availableTickets !== undefined ? data.availableTickets : 100;
    const statusVal = data && data.status ? data.status : "available";

    const sessionBox = document.createElement("div");
    sessionBox.className = "box session-item-row p-3 mb-3";
    sessionBox.id = rowId;
    sessionBox.style = "border: 1px solid var(--fiato-border); background-color: #fafbfc; border-radius: 12px; position: relative;";

    sessionBox.innerHTML = `
        <div class="columns is-multiline is-mobile">
            <div class="column is-6-mobile is-3-tablet">
                <label class="label" style="font-size:0.75rem; color:#64748b;">Dia</label>
                <input type="date" class="input is-small session-date" value="${dateVal}" required>
            </div>
            <div class="column is-6-mobile is-2-tablet">
                <label class="label" style="font-size:0.75rem; color:#64748b;">Hora Local</label>
                <input type="time" class="input is-small session-time" value="${timeVal}" required>
            </div>
            <div class="column is-12-mobile is-4-tablet">
                <label class="label" style="font-size:0.75rem; color:#64748b;">Sala / Palco Específico</label>
                <input type="text" class="input is-small session-location" placeholder="Ex: Grande Auditório" value="${locVal}" required>
            </div>
            <div class="column is-6-mobile is-2-tablet">
                <label class="label" style="font-size:0.75rem; color:#64748b;">Bilhetes</label>
                <input type="number" class="input is-small session-tickets" min="0" value="${tktVal}" required>
            </div>
            <input type="hidden" class="session-status" value="${statusVal}">
            <div class="column is-6-mobile is-1-tablet is-flex is-align-items-flex-end is-justify-content-center">
                <button type="button" class="button is-small is-danger is-light" onclick="removeSessionRow('${rowId}')" style="border-radius:8px; height:2.1rem; width:100%;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
    wrapper.appendChild(sessionBox);
}

function removeSessionRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.remove();
}


function openEditEvent(id) {
    currentEditId = id;
    const item = appState.events.find(e => e._id === id);
    if (!item) return;
    clearFormErrors("events");

    document.getElementById("event-title").value = item.title || "";
    document.getElementById("event-direction").value = item.direction || "";
    document.getElementById("event-duration").value = item.duration || "";
    document.getElementById("event-locationSummary").value = item.locationSummary || "";
    document.getElementById("event-imageFile").value = ""; // Reset file input
    document.getElementById("event-quote").value = item.quote || "";
    document.getElementById("event-description").value = item.description || "";
    document.getElementById("event-isFeatured").checked = !!item.isFeatured;

    // Repovoar as sessões guardadas
    const wrapper = document.getElementById("dynamic-sessions-wrapper");
    wrapper.innerHTML = "";
    if (item.sessions && item.sessions.length > 0) {
        item.sessions.forEach(session => addSessionRow(session));
    } else {
        addSessionRow();
    }

    document.getElementById("modal-events-title").innerText = "Editar Ficha de Evento";
    document.getElementById("modal-events").classList.add("is-active");
}

async function saveEvent() {
    // Recolha e mapeamento de todas as caixas de sessões geradas no HTML
    clearFormErrors("events");
    const banner = document.getElementById("event-error-banner");
    
    const imageInput = document.getElementById("event-imageFile");
    const sessionElements = document.querySelectorAll(".session-item-row");
    const sessionsArray = [];

    for (let sBox of sessionElements) {
        const dateStr = sBox.querySelector(".session-date").value;
        const timeStr = sBox.querySelector(".session-time").value;
        const locationStr = sBox.querySelector(".session-location").value;
        const ticketsStr = sBox.querySelector(".session-tickets").value;
        const statusStr = sBox.querySelector(".session-status").value;
        
        sBox.style.borderColor = "var(--fiato-border)"; // Reset visual

        if (!dateStr || !timeStr || !locationStr || !ticketsStr) {
            sBox.style.borderColor = "#ef4444";
            
            // Construção de mensagem específica para o utilizador
            let msg = "Existem campos incompletos na sessão.";
            if (!timeStr) msg = "A hora da sessão é obrigatória e não pode estar vazia.";
            else if (!dateStr) msg = "A data da sessão é obrigatória.";
            
            displayFormError("events", msg);
            return;
        }

        sessionsArray.push({
            date: dateStr,
            time: timeStr,
            specificLocation: locationStr,
            availableTickets: parseInt(ticketsStr, 10),
            status: statusStr
        });
    }

    const formData = new FormData();
    formData.append("title", document.getElementById("event-title").value);
    formData.append("direction", document.getElementById("event-direction").value);
    formData.append("duration", document.getElementById("event-duration").value);
    formData.append("locationSummary", document.getElementById("event-locationSummary").value);
    formData.append("quote", document.getElementById("event-quote").value);
    formData.append("description", document.getElementById("event-description").value);
    formData.append("isFeatured", document.getElementById("event-isFeatured").checked);
    formData.append("sessions", JSON.stringify(sessionsArray));

    // Only append image if a new one is selected
    if (imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    const url = currentEditId ? `/api/events/${currentEditId}` : "/api/events";
    const method = currentEditId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            closeModal("modal-events");
            loadTabContent("events");
        } else {
            displayFormError("events", result.error);
        }
    } catch (err) { 
        console.error(err);
        displayFormError("events", "Erro de ligação ao servidor.");
    }
}

// ==========================================
// CONTROLADOR COMPLETO: NOTÍCIAS
// ==========================================
function openEditNews(id) {
    currentEditId = id;
    const item = appState.news.find(n => n._id === id);
    if (!item) return;
    clearFormErrors("news");

    document.getElementById("news-title").value = item.title || "";
    document.getElementById("news-publishDate").value = item.publishDate ? item.publishDate.substring(0, 10) : "";
    document.getElementById("news-imageFile").value = ""; // Reset file input
    document.getElementById("news-articleUrl").value = item.articleUrl || "";
    document.getElementById("news-body").value = item.body || ""; // 👈 CARREGA O CORPO NO FORMULÁRIO

    // Mostrar pré-visualização da imagem atual
    if (item.imageUrl) {
        const previewImg = document.getElementById("news-preview-img");
        previewImg.src = item.imageUrl;
        document.getElementById("news-preview-wrapper").classList.remove("is-hidden");
    }

    document.getElementById("modal-news-title").innerText = "Editar Artigo de Imprensa";
    document.getElementById("modal-news").classList.add("is-active");
}

async function saveNews() {
    const imageInput = document.getElementById("news-imageFile");
    const formData = new FormData();
    
    formData.append("title", document.getElementById("news-title").value);
    formData.append("publishDate", document.getElementById("news-publishDate").value);
    formData.append("articleUrl", document.getElementById("news-articleUrl").value);
    formData.append("body", document.getElementById("news-body").value);

    // Apenas anexa a imagem se um novo ficheiro for selecionado
    if (imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    const url = currentEditId ? `/api/news/${currentEditId}` : "/api/news";
    const method = currentEditId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            closeModal("modal-news");
            loadTabContent("news");
        } else {
            displayFormError("news", result.error);
        }
    } catch (err) { 
        console.error(err);
        displayFormError("news", "Erro de ligação ao servidor.");
    }
}

// Função auxiliar para exibir erros no banner e no pop-up (alert)
function openEditArquivo(id) {
    currentEditId = id;
    const item = appState.arquivo.find(a => a._id === id);
    if (!item) return;
    clearFormErrors("arquivo");

    document.getElementById("arquivo-year").value = item.year || "";
    document.getElementById("arquivo-description").value = item.description || "";
    document.getElementById("arquivo-imageFile").value = "";

    if (item.imageUrl) {
        const previewImg = document.getElementById("arquivo-preview-img");
        previewImg.src = item.imageUrl;
        document.getElementById("arquivo-preview-wrapper").classList.remove("is-hidden");
    }

    document.getElementById("modal-arquivo-title").innerText = "Editar Registo de Arquivo";
    document.getElementById("modal-arquivo").classList.add("is-active");
}

async function saveArquivo() {
    const imageInput = document.getElementById("arquivo-imageFile");
    const formData = new FormData();
    
    formData.append("year", document.getElementById("arquivo-year").value);
    formData.append("description", document.getElementById("arquivo-description").value);

    if (imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    } else if (!currentEditId) {
        displayFormError("arquivo", "É obrigatório fazer upload de uma imagem de capa.");
        return;
    }

    const url = currentEditId ? `/api/arquivos/${currentEditId}` : "/api/arquivos";
    const method = currentEditId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            closeModal("modal-arquivo");
            loadTabContent("arquivo");
        } else {
            displayFormError("arquivo", result.error);
        }
    } catch (err) { 
        console.error(err);
        displayFormError("arquivo", "Erro de ligação ao servidor.");
    }
}

function displayFormError(schema, message) {
    const prefix = schema === 'events' ? 'event' : schema === 'news' ? 'news' : schema === 'arquivo' ? 'arquivo' : schema === 'instagram' ? 'instagram' : 'about';
    const banner = document.getElementById(`${prefix}-error-banner`);
    const cleanMsg = message || "Erro desconhecido ao processar dados.";
    
    if (banner) {
        banner.innerHTML = `<strong>Erro de Validação:</strong><br>${cleanMsg}`;
        banner.classList.remove("is-hidden");
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Também exibe no pop-up para garantir que o utilizador vê
    alert("Verifique o formulário:\n" + cleanMsg);
}

// ==========================================
// CONTROLADOR COMPLETO: CONTACTOS
// ==========================================
function openViewContact(id) {
    currentEditId = id;
    const item = appState.contacts.find(c => c._id === id);
    if (!item) return;

    document.getElementById("view-contact-name").innerText = `${item.firstName} ${item.lastName}`;
    document.getElementById("view-contact-email").innerText = item.email;
    document.getElementById("view-contact-type").innerText = item.type ? item.type.toUpperCase() : 'GENERAL';
    document.getElementById("view-contact-status").value = item.status || "unread";

    if (item.type === "general") {
        document.getElementById("view-contact-message").innerText = item.message || "";
        document.getElementById("wrapper-view-message").classList.remove("is-hidden");
        document.getElementById("wrapper-view-document").classList.add("is-hidden");
    } else {
        document.getElementById("view-contact-docUrl").setAttribute("href", item.documentUrl || "#");
        document.getElementById("wrapper-view-document").classList.remove("is-hidden");
        document.getElementById("wrapper-view-message").classList.add("is-hidden");
    }

    document.getElementById("modal-contacts").classList.add("is-active");
}

async function updateContactStatus() {
    const newStatus = document.getElementById("view-contact-status").value;
    try {
        const response = await fetch(`/api/contact-requests/${currentEditId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        const result = await response.json();
        if (result.success) {
            closeModal("modal-contacts");
            loadTabContent("contacts");
        } else {
            alert("Erro ao salvar triagem: " + result.error);
        }
    } catch (err) { console.error(err); }
}

// ==========================================
// ELIMINAÇÃO MASTER DE RECURSOS
// ==========================================
async function deleteResource(schema, id) {
    if (!confirm("Pretendes eliminar permanentemente este registo na base de dados Cloud?")) return;
    
    try {
        const response = await fetch(`/api/${schema}/${id}`, { method: "DELETE" });
        const result = await response.json();
        if (result.success) {
            loadTabContent(schema);
        } else {
            alert("Não foi possível processar a remoção: " + result.error);
        }
    } catch (err) { console.error(err); }
}

// ==========================================
// CONTROLADOR COMPLETO: INSTAGRAM
// ==========================================
function openEditInstagram(id) {
    currentEditId = id;
    const item = appState.instagram.find(p => p._id === id);
    if (!item) return;
    clearFormErrors("instagram");

    document.getElementById("instagram-caption").value = item.caption || "";
    document.getElementById("instagram-mediaType").value = item.mediaType || "image";
    document.getElementById("instagram-mediaFile").value = "";
    document.getElementById("instagram-mediaUrl").value = item.mediaUrl || "";
    document.getElementById("instagram-postUrl").value = item.postUrl || "";
    document.getElementById("instagram-date").value = item.date ? item.date.substring(0, 10) : "";
    document.getElementById("instagram-isPublished").checked = !!item.isPublished;
    document.getElementById("instagram-order").value = item.order || 0;

    if (item.mediaUrl) {
        const previewImg = document.getElementById("instagram-preview-img");
        previewImg.src = item.mediaUrl;
        document.getElementById("instagram-preview-wrapper").classList.remove("is-hidden");
    } else {
        document.getElementById("instagram-preview-wrapper").classList.add("is-hidden");
    }

    document.getElementById("modal-instagram-title").innerText = "Editar Publicação Instagram";
    document.getElementById("modal-instagram").classList.add("is-active");
}

async function saveInstagram() {
    clearFormErrors("instagram");
    const banner = document.getElementById("instagram-error-banner");

    const mediaInput = document.getElementById("instagram-mediaFile");
    const formData = new FormData();

    formData.append("caption", document.getElementById("instagram-caption").value);
    formData.append("mediaType", document.getElementById("instagram-mediaType").value);
    formData.append("postUrl", document.getElementById("instagram-postUrl").value);
    formData.append("isPublished", document.getElementById("instagram-isPublished").checked);
    formData.append("order", document.getElementById("instagram-order").value);
    formData.append("date", document.getElementById("instagram-date").value || new Date().toISOString().substring(0, 10));

    const mediaUrlValue = document.getElementById("instagram-mediaUrl").value;

    if (mediaInput.files[0]) {
        formData.append("media", mediaInput.files[0]);
    } else if (mediaUrlValue) {
        formData.append("mediaUrl", mediaUrlValue);
    } else if (!currentEditId) {
        displayFormError("instagram", "Faz upload de um ficheiro ou insere um URL de media.");
        return;
    }

    const url = currentEditId ? `/api/instagram/${currentEditId}` : "/api/instagram";
    const method = currentEditId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            closeModal("modal-instagram");
            loadTabContent("instagram");
        } else {
            displayFormError("instagram", result.error);
        }
    } catch (err) {
        console.error(err);
        displayFormError("instagram", "Erro de ligação ao servidor.");
    }
}

// ==========================================
// CONTROLADOR COMPLETO: SOBRE NÓS (ABOUT PAGE)
// ==========================================

var defaultAboutData = {
    heroDescription: "Desde 2014, transformando a cidade do Porto num palco cultural vivo através de performances inovadoras em espaços não convencionais.",
    heroCtaLinks: [
        { label: "Programação", url: "agenda.html" },
        { label: "Edições", url: "edicoes.html" },
        { label: "Contactos", url: "contactos.html" }
    ],
    manifestoEyebrow: "Um encontro singular entre tradição e inovação.",
    manifestoTitle: "Nascemos da vontade de trazer a arte lírica e performativa para o coração da cidade.",
    manifestoBodyLeft: "Ao longo das suas edições, o Fiato reuniu artistas nacionais e internacionais em palcos icónicos do Porto, celebrando a riqueza cultural da cidade e do país. Uma experiência imersiva que convida o público a descobrir, sentir e partilhar a força da ópera.",
    manifestoBodyRight: "Com raízes profundas na identidade portuense, projecta-se para além fronteiras, colocando o Porto no mapa dos grandes festivais europeus de artes performativas. Uma celebração da voz humana, da música e do movimento — ano após ano, edição após edição.",
    marqueeItems: [
        { text: "A Ópera Desce à Rua" },
        { text: "Ocupação Lírica" }
    ],
    editionEyebrow: "O FIATO é para todos",
    editionYearTop: "20",
    editionYearBottom: "26",
    editionDescription: "Uma edição revolucionária que transforma a cidade numa galeria viva de expressão operática contemporânea.",
    editionCtaLabel: "Consultar Arquivo",
    editionCtaUrl: "edicoes.html",
    editionImageUrl: "",
    teamEyebrow: "A equipa por trás das cortinas",
    teamHeading: "Uma disrupção necessária ao serviço da democratização cultural.",
    teamMembers: [],
    faqEyebrow: "O Fiato é para todos",
    faqHeading: "Perguntas \\nFrequentes",
    faqItems: [
        { question: "Os espectáculos são acessíveis a todos os públicos?", answer: "Sim, a nossa programação inclui propostas para diferentes idades e níveis de familiaridade com a ópera. Dos 6 meses aos 100 anos.", order: 0 },
        { question: "Onde decorrem os eventos?", answer: "Em espaços icónicos do Porto, desde teatros históricos a locais ao ar livre.", order: 1 },
        { question: "Como posso comprar bilhetes?", answer: "Através do nosso site oficial ou nas bilheteiras dos espaços parceiros.", order: 2 },
        { question: "É necessário conhecer ópera para assistir?", answer: "Não. Os nossos espectáculos são pensados para acolher tanto os mais experientes como quem descobre a ópera pela primeira vez.", order: 3 }
    ]
};

let aboutRowCounters = { heroCta: 0, marquee: 0, team: 0, faq: 0 };

function clearAboutFormErrors() {
    const banner = document.getElementById("about-error-banner");
    if (banner) { banner.innerText = ""; banner.classList.add("is-hidden"); }
}

let currentAboutSection = null;

function editAboutSection(section) {
    clearAboutFormErrors();
    currentAboutSection = section || null;
    const data = (appState.about && Object.keys(appState.about).length > 0) ? appState.about : defaultAboutData;

    // Toggle section visibility
    document.querySelectorAll('.about-section-fields').forEach(function(el) {
        el.style.display = (!section || el.getAttribute('data-about-section') === section) ? '' : 'none';
    });

    var titles = {
        hero: 'Hero / Editorial',
        manifesto: 'Manifesto',
        marquee: 'Marquee',
        edition: 'Bloco 2026',
        team: 'Equipa / Bastidores',
        faq: 'FAQ'
    };
    document.getElementById('modal-about-title').innerText = section
        ? 'Editar: ' + (titles[section] || section)
        : 'Editar Página "Sobre Nós"';

    // Populate all fields
    document.getElementById("about-heroDescription").value = data.heroDescription || "";
    document.getElementById("about-manifestoEyebrow").value = data.manifestoEyebrow || "";
    document.getElementById("about-manifestoTitle").value = data.manifestoTitle || "";
    document.getElementById("about-manifestoBodyLeft").value = data.manifestoBodyLeft || "";
    document.getElementById("about-manifestoBodyRight").value = data.manifestoBodyRight || "";
    document.getElementById("about-editionEyebrow").value = data.editionEyebrow || "";
    document.getElementById("about-editionYearTop").value = data.editionYearTop || "";
    document.getElementById("about-editionYearBottom").value = data.editionYearBottom || "";
    document.getElementById("about-editionDescription").value = data.editionDescription || "";
    document.getElementById("about-editionCtaLabel").value = data.editionCtaLabel || "";
    document.getElementById("about-editionCtaUrl").value = data.editionCtaUrl || "";
    document.getElementById("about-editionImageUrl").value = data.editionImageUrl || "";
    document.getElementById("about-teamEyebrow").value = data.teamEyebrow || "";
    document.getElementById("about-teamHeading").value = data.teamHeading || "";
    document.getElementById("about-faqEyebrow").value = data.faqEyebrow || "";
    document.getElementById("about-faqHeading").value = data.faqHeading || "";

    // Reset and populate dynamic rows
    document.getElementById("about-hero-ctas-wrapper").innerHTML = "";
    document.getElementById("about-marquee-wrapper").innerHTML = "";
    document.getElementById("about-team-wrapper").innerHTML = "";
    document.getElementById("about-faq-wrapper").innerHTML = "";
    aboutRowCounters = { heroCta: 0, marquee: 0, team: 0, faq: 0 };

    if (data.heroCtaLinks && Array.isArray(data.heroCtaLinks)) {
        data.heroCtaLinks.forEach(function(cta) { addHeroCtaRow(cta); });
    }
    if (data.marqueeItems && Array.isArray(data.marqueeItems)) {
        data.marqueeItems.forEach(function(item) { addMarqueeRow(item); });
    }
    if (data.teamMembers && Array.isArray(data.teamMembers)) {
        data.teamMembers.forEach(function(m) { addTeamMemberRow(m); });
    }
    if (data.faqItems && Array.isArray(data.faqItems)) {
        data.faqItems.forEach(function(faq) { addFaqRow(faq); });
    }

    document.getElementById("modal-about").classList.add("is-active");
}

function renderAboutCards(data) {
    var container = document.getElementById('about-cards-container');
    if (!container) return;
    var d = data || {};

    function filled(val) { return !!(val && (typeof val === 'string' ? val.trim() : (Array.isArray(val) ? val.length : val))); }
    function preview(str, maxLen) {
        if (!str) return '<span class="has-text-grey-light"><em>Vazio</em></span>';
        var s = str.replace(/\\n/g, ' ');
        maxLen = maxLen || 100;
        return '<span class="has-text-grey">' + escHtml(s.substring(0, maxLen)) + (s.length > maxLen ? '…' : '') + '</span>';
    }
    function count(arr) { return (arr && Array.isArray(arr)) ? arr.length : 0; }

    var sections = [
        {
            icon: 'fa-star', title: 'Hero / Editorial',
            preview: function() {
                var c = count(d.heroCtaLinks);
                return preview(d.heroDescription, 80) + '<br><span class="tag is-small is-light mt-2">' + c + ' CTA link(s)</span>';
            },
            status: function() { return filled(d.heroDescription) || count(d.heroCtaLinks) > 0; },
            key: 'hero'
        },
        {
            icon: 'fa-quote-right', title: 'Manifesto',
            preview: function() {
                var h = '';
                if (d.manifestoEyebrow) h += '<div class="has-text-grey-light" style="font-size:0.75rem;text-transform:uppercase;">' + escHtml(d.manifestoEyebrow) + '</div>';
                h += preview(d.manifestoTitle, 80);
                return h;
            },
            status: function() { return filled(d.manifestoEyebrow) || filled(d.manifestoTitle); },
            key: 'manifesto'
        },
        {
            icon: 'fa-arrows-alt-h', title: 'Marquee',
            preview: function() {
                var c = count(d.marqueeItems);
                var h = '<span class="tag is-small is-light">' + c + ' item(ns)</span>';
                if (c > 0) {
                    h += '<div class="mt-2" style="font-size:0.85rem;">';
                    d.marqueeItems.slice(0, 2).forEach(function(item) {
                        h += '<div class="has-text-grey">• ' + escHtml(item.text || '') + '</div>';
                    });
                    if (c > 2) h += '<div class="has-text-grey-light">…</div>';
                    h += '</div>';
                }
                return h;
            },
            status: function() { return count(d.marqueeItems) > 0; },
            key: 'marquee'
        },
        {
            icon: 'fa-calendar', title: 'Bloco 2026',
            preview: function() {
                var h = '';
                if (d.editionEyebrow) h += '<div class="has-text-grey-light" style="font-size:0.75rem;text-transform:uppercase;">' + escHtml(d.editionEyebrow) + '</div>';
                var yearParts = (d.editionYearTop || '') + (d.editionYearBottom ? '/' + d.editionYearBottom : '');
                if (yearParts) h += '<div class="has-text-weight-bold" style="font-size:1.2rem;">' + escHtml(yearParts) + '</div>';
                h += preview(d.editionDescription, 60);
                if (d.editionCtaLabel) h += '<br><span class="tag is-small is-light mt-2">' + escHtml(d.editionCtaLabel) + '</span>';
                return h;
            },
            status: function() { return filled(d.editionEyebrow) || filled(d.editionDescription); },
            key: 'edition'
        },
        {
            icon: 'fa-users', title: 'Equipa / Bastidores',
            preview: function() {
                var h = preview(d.teamEyebrow, 60) + '<br>' + preview(d.teamHeading, 60);
                var c = count(d.teamMembers);
                h += '<br><span class="tag is-small is-light mt-2">' + c + ' membro(s)</span>';
                return h;
            },
            status: function() { return filled(d.teamEyebrow) || filled(d.teamHeading) || count(d.teamMembers) > 0; },
            key: 'team'
        },
        {
            icon: 'fa-question-circle', title: 'FAQ',
            preview: function() {
                var h = preview(d.faqEyebrow, 60) + '<br>' + preview(d.faqHeading, 60);
                var c = count(d.faqItems);
                h += '<br><span class="tag is-small is-light mt-2">' + c + ' pergunta(s)</span>';
                return h;
            },
            status: function() { return filled(d.faqEyebrow) || filled(d.faqHeading) || count(d.faqItems) > 0; },
            key: 'faq'
        }
    ];

    var html = '';
    sections.forEach(function(s) {
        var isFilled = s.status();
        var btnLabel = s.title.split(' / ')[0];
        html += '<div class="column is-6">' +
            '<div class="factory-card p-4" style="height:100%;display:flex;flex-direction:column;">' +
            '<div class="is-flex is-justify-content-space-between is-align-items-start mb-3">' +
            '<h5 class="title is-6 mb-0" style="color:var(--fiato-dark);">' +
            '<span class="icon has-text-grey mr-2"><i class="fas ' + s.icon + '"></i></span>' + s.title +
            '</h5>' +
            '<span class="tag is-small ' + (isFilled ? 'is-success is-light' : 'is-light') + '">' +
            (isFilled ? 'preenchido' : 'vazio') +
            '</span></div>' +
            '<div class="mb-3" style="flex:1;">' + s.preview() + '</div>' +
            '<div><button class="button is-small is-dark" onclick="editAboutSection(\'' + s.key + '\')" style="border-radius:8px;font-weight:600;">Editar ' + btnLabel + '</button></div>' +
            '</div></div>';
    });

    container.innerHTML = html;
}

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Hero CTA rows ---
function addHeroCtaRow(data) {
    const wrapper = document.getElementById("about-hero-ctas-wrapper");
    const id = 'hero_cta_' + (aboutRowCounters.heroCta++);
    const labelVal = data && data.label ? data.label : "";
    const urlVal = data && data.url ? data.url : "";

    const box = document.createElement("div");
    box.className = "box session-item-row p-3 mb-3";
    box.id = id;
    box.style = "border: 1px solid var(--fiato-border); background-color: #fafbfc; border-radius: 12px; position: relative;";
    box.innerHTML = `
        <div class="columns is-mobile">
            <div class="column is-5">
                <input type="text" class="input is-small hero-cta-label" placeholder="Label (ex: Programação)" value="${labelVal.replace(/"/g, '&quot;')}">
            </div>
            <div class="column is-5">
                <input type="text" class="input is-small hero-cta-url" placeholder="URL (ex: agenda.html)" value="${urlVal.replace(/"/g, '&quot;')}">
            </div>
            <div class="column is-2 is-flex is-align-items-center">
                <button type="button" class="button is-small is-danger is-light" onclick="removeAboutRow('${id}')" style="border-radius:8px; width:100%;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>`;
    wrapper.appendChild(box);
}

// --- Marquee rows ---
function addMarqueeRow(data) {
    const wrapper = document.getElementById("about-marquee-wrapper");
    const id = 'marquee_' + (aboutRowCounters.marquee++);
    const textVal = data && data.text ? data.text : "";

    const box = document.createElement("div");
    box.className = "box session-item-row p-3 mb-3";
    box.id = id;
    box.style = "border: 1px solid var(--fiato-border); background-color: #fafbfc; border-radius: 12px; position: relative;";
    box.innerHTML = `
        <div class="columns is-mobile">
            <div class="column is-10">
                <input type="text" class="input is-small marquee-text" placeholder="Texto do marquee" value="${textVal.replace(/"/g, '&quot;')}">
            </div>
            <div class="column is-2 is-flex is-align-items-center">
                <button type="button" class="button is-small is-danger is-light" onclick="removeAboutRow('${id}')" style="border-radius:8px; width:100%;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>`;
    wrapper.appendChild(box);
}

// --- Team Member rows ---
function addTeamMemberRow(data) {
    const wrapper = document.getElementById("about-team-wrapper");
    const id = 'team_' + (aboutRowCounters.team++);
    const nameVal = data && data.name ? data.name : "";
    const photoVal = data && data.photoUrl ? data.photoUrl : "";
    const orderVal = data && data.order !== undefined ? data.order : 0;

    const box = document.createElement("div");
    box.className = "box session-item-row p-3 mb-3";
    box.id = id;
    box.style = "border: 1px solid var(--fiato-border); background-color: #fafbfc; border-radius: 12px; position: relative;";
    box.innerHTML = `
        <div class="columns is-mobile">
            <div class="column is-4">
                <input type="text" class="input is-small team-name" placeholder="Nome do membro" value="${nameVal.replace(/"/g, '&quot;')}">
            </div>
            <div class="column is-4">
                <input type="text" class="input is-small team-photo-url" placeholder="URL da foto" value="${photoVal.replace(/"/g, '&quot;')}">
            </div>
            <div class="column is-2">
                <input type="number" class="input is-small team-order" placeholder="Ordem" value="${orderVal}">
            </div>
            <div class="column is-2 is-flex is-align-items-center">
                <button type="button" class="button is-small is-danger is-light" onclick="removeAboutRow('${id}')" style="border-radius:8px; width:100%;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>`;
    wrapper.appendChild(box);
}

// --- FAQ rows ---
function addFaqRow(data) {
    const wrapper = document.getElementById("about-faq-wrapper");
    const id = 'faq_' + (aboutRowCounters.faq++);
    const questionVal = data && data.question ? data.question : "";
    const answerVal = data && data.answer ? data.answer : "";
    const orderVal = data && data.order !== undefined ? data.order : 0;

    const box = document.createElement("div");
    box.className = "box session-item-row p-3 mb-3";
    box.id = id;
    box.style = "border: 1px solid var(--fiato-border); background-color: #fafbfc; border-radius: 12px; position: relative;";
    box.innerHTML = `
        <div class="columns is-mobile">
            <div class="column is-5">
                <input type="text" class="input is-small faq-question" placeholder="Pergunta" value="${questionVal.replace(/"/g, '&quot;')}">
            </div>
            <div class="column is-5">
                <textarea class="textarea is-small faq-answer" placeholder="Resposta" rows="2">${answerVal.replace(/"/g, '&quot;')}</textarea>
            </div>
            <div class="column is-2 is-flex is-align-items-center">
                <button type="button" class="button is-small is-danger is-light" onclick="removeAboutRow('${id}')" style="border-radius:8px; width:100%;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>`;
    wrapper.appendChild(box);
}

function removeAboutRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.remove();
}

// --- Save About Section ---
async function saveAboutSection() {
    clearAboutFormErrors();
    const section = currentAboutSection;

    const existing = (appState.about && Object.keys(appState.about).length > 0)
        ? JSON.parse(JSON.stringify(appState.about))
        : JSON.parse(JSON.stringify(defaultAboutData));

    const payload = {};

    function shouldCollect(s) { return !section || section === s; }

    if (shouldCollect('hero')) {
        payload.heroDescription = document.getElementById("about-heroDescription").value;
        payload.heroCtaLinks = collectHeroCtas();
    }

    if (shouldCollect('manifesto')) {
        payload.manifestoEyebrow = document.getElementById("about-manifestoEyebrow").value;
        payload.manifestoTitle = document.getElementById("about-manifestoTitle").value;
        payload.manifestoBodyLeft = document.getElementById("about-manifestoBodyLeft").value;
        payload.manifestoBodyRight = document.getElementById("about-manifestoBodyRight").value;
    }

    if (shouldCollect('marquee')) {
        payload.marqueeItems = collectMarqueeItems();
    }

    if (shouldCollect('edition')) {
        payload.editionEyebrow = document.getElementById("about-editionEyebrow").value;
        payload.editionYearTop = document.getElementById("about-editionYearTop").value;
        payload.editionYearBottom = document.getElementById("about-editionYearBottom").value;
        payload.editionDescription = document.getElementById("about-editionDescription").value;
        payload.editionCtaLabel = document.getElementById("about-editionCtaLabel").value;
        payload.editionCtaUrl = document.getElementById("about-editionCtaUrl").value;
        payload.editionImageUrl = document.getElementById("about-editionImageUrl").value;
    }

    if (shouldCollect('team')) {
        payload.teamEyebrow = document.getElementById("about-teamEyebrow").value;
        payload.teamHeading = document.getElementById("about-teamHeading").value;
        payload.teamMembers = collectTeamMembers();
    }

    if (shouldCollect('faq')) {
        payload.faqEyebrow = document.getElementById("about-faqEyebrow").value;
        payload.faqHeading = document.getElementById("about-faqHeading").value;
        payload.faqItems = collectFaqItems();
    }

    const merged = Object.assign({}, existing, payload);

    try {
        const response = await fetch("/api/about-page", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(merged)
        });
        const result = await response.json();
        if (result.success) {
            appState.about = result.data || {};
            closeModal("modal-about");
            renderAboutCards(appState.about);
        } else {
            displayFormError("about", result.error || "Erro ao guardar.");
        }
    } catch (err) {
        console.error(err);
        displayFormError("about", "Erro de ligação ao servidor.");
    }
}

function collectHeroCtas() {
    const items = [];
    document.querySelectorAll("#about-hero-ctas-wrapper .hero-cta-label").forEach(function(el, i) {
        const urlEl = document.querySelectorAll("#about-hero-ctas-wrapper .hero-cta-url")[i];
        items.push({ label: el.value, url: urlEl ? urlEl.value : "" });
    });
    return items;
}

function collectMarqueeItems() {
    const items = [];
    document.querySelectorAll("#about-marquee-wrapper .marquee-text").forEach(function(el) {
        items.push({ text: el.value });
    });
    return items;
}

function collectTeamMembers() {
    const items = [];
    const nameEls = document.querySelectorAll("#about-team-wrapper .team-name");
    const photoEls = document.querySelectorAll("#about-team-wrapper .team-photo-url");
    const orderEls = document.querySelectorAll("#about-team-wrapper .team-order");
    nameEls.forEach(function(el, i) {
        items.push({
            name: el.value,
            photoUrl: photoEls[i] ? photoEls[i].value : "",
            order: orderEls[i] ? parseInt(orderEls[i].value, 10) || 0 : 0
        });
    });
    return items;
}

function collectFaqItems() {
    const items = [];
    const questionEls = document.querySelectorAll("#about-faq-wrapper .faq-question");
    const answerEls = document.querySelectorAll("#about-faq-wrapper .faq-answer");
    questionEls.forEach(function(el, i) {
        items.push({
            question: el.value,
            answer: answerEls[i] ? answerEls[i].value : "",
            order: i
        });
    });
    return items;
}