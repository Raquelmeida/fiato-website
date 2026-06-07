let appState = {
    events: [],
    news: [],
    contacts: [],
    tickets: [],
    instagram: [],
    arquivo: []
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
            appState[schema] = Array.isArray(json.data) ? json.data : [];
            renderTable(schema, appState[schema]);
        } else {
            console.warn(`Aviso do Servidor: ${json.error}`);
            renderTable(schema, []);
        }
    } catch (err) {
        console.error(`Erro crítico de rede ao ler dados de ${schema}:`, err);
        renderTable(schema, []);
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
    const prefix = schema === 'events' ? 'event' : schema === 'news' ? 'news' : schema === 'instagram' ? 'instagram' : schema === 'arquivo' ? 'arquivo' : null;
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
    const prefix = schema === 'events' ? 'event' : schema === 'news' ? 'news' : schema === 'arquivo' ? 'arquivo' : 'instagram';
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