// =========================================================================
// FIATO FESTIVAL - Content Management Client-Side Script
// Ready-to-use CRUD and UI Render pipelines for Events, News, and Requests.
// =========================================================================

const API_BASE_URL = 'http://localhost:3000/api';

// ==========================================
// 1. EVENT MANAGEMENT PIPELINES (CRUD)
// ==========================================

// --- READ ALL EVENTS ---
function fetchEvents() {
    fetch(`${API_BASE_URL}/events`)
        .then(function(response) {
            if (!response.ok) throw new Error('Network error fetching events.');
            return response.json();
        })
        .then(function(result) {
            updateEventsList(result.data); // Matches backend structure: result.data array
        })
        .catch(function(error) {
            console.error('🚨 Error fetching event array:', error);
        });
}

// --- CREATE NEW PERFORMANCE EVENT ---
function createEvent() {
    const newEventMock = {
        title: "Ópera à Moda do Porto",
        imageUrl: "/assets/images/opera_porto.jpg",
        locationSummary: "R. Santa Catarina, 148",
        quote: "Quebrando as fronteiras tradicionais da música clássica.",
        direction: "Camilo Castelo Branco",
        duration: "1h30 m",
        description: "O festival que cruza o cânone operático com a crueza da rua. Um manifesto de disrupção cultural na cidade do Porto.",
        isFeatured: true,
        sessions: [
            { date: "2026-03-20T21:30:00.000Z", specificLocation: "Passos Manuel, Porto", availableTickets: 120 },
            { date: "2026-03-21T21:30:00.000Z", specificLocation: "Praça da Liberdade, Porto", availableTickets: 250 }
        ],
        faqs: [
            { question: "Os espetáculos têm custo de entrada?", answer: "A entrada é livre mas carece de reserva prévia de bilhete." }
        ]
    };

    fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEventMock)
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        console.log('✨ Event generated successfully:', result);
        fetchEvents(); // Refresh view
    })
    .catch(function(error) { console.error('🚨 Creation failed:', error); });
}

// --- UPDATE AN EXISTING EVENT ---
function updateEvent(eventId) {
    const updatedPayload = {
        duration: "1h45 m", // Remastered layout extension
        isFeatured: false
    };

    fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload)
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        console.log('🎚️ Event updated like a remastered track:', result);
        fetchEvents();
    })
    .catch(function(error) { console.error('🚨 Update failed:', error); });
}

// --- DELETE AN EVENT ---
function deleteEvent(eventId) {
    fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE'
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        console.log('🗑️ Event removed from the schedule playlist:', result);
        fetchEvents();
    })
    .catch(function(error) { console.error('🚨 Deletion failed:', error); });
}

// ==========================================
// 2. PRESS & NEWS PIPELINES (NA IMPRENSA)
// ==========================================

// --- READ ALL NEWS ARTICLES ---
function fetchNewsFeed() {
    fetch(`${API_BASE_URL}/news`)
        .then(function(response) { return response.json(); })
        .then(function(result) {
            updateNewsContainer(result.data);
        })
        .catch(function(error) { console.error('🚨 News stream sync issue:', error); });
}

// --- CREATE NEWS ARTICLE ENTRY ---
function createNewsItem() {
    const mockNews = {
        title: "Quando a cidade se torna um teatro de ópera imersivo",
        publishDate: "2026-03-12",
        imageUrl: "/assets/images/press-thumbnail.jpg",
        articleUrl: "https://www.publico.pt/fiato-festival-porto"
    };

    fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNews)
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        console.log('📰 Article indexed successfully into the press layout:', result);
        fetchNewsFeed();
    })
    .catch(function(error) { console.error('🚨 Press logging aborted:', error); });
}


// ==========================================
// 3. DYNAMIC DOM RENDER LAYOUT BLOCKS
// ==========================================

function updateEventsList(events) {
    let container = document.getElementById('events-cms-container');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < events.length; i++) {
        let item = events[i];
        let div = document.createElement('div');
        div.className = 'card mb-4 padded-box-style';
        
        div.innerHTML = 
            '<div class="card-content">' +
                '<p class="title is-4">🎭 ' + item.title + '</p>' +
                '<p class="subtitle is-6"><b>Direção:</b> ' + item.direction + ' | ⏳ ' + item.duration + '</p>' +
                '<p class="is-size-7">' + item.description + '</p>' +
                '<div class="tags mt-2">' +
                    '<span class="tag is-dark">📍 ' + item.locationSummary + '</span>' +
                    '<span class="tag is-warning">' + (item.isFeatured ? '🔥 Featured' : 'Standard') + '</span>' +
                '</div>' +
                '<div class="buttons mt-3">' +
                    '<button class="button is-small is-info" onclick="updateEvent(\'' + item._id + '\')">Test Modification</button>' +
                    '<button class="button is-small is-danger" onclick="deleteEvent(\'' + item._id + '\')">Remove Event</button>' +
                '</div>' +
            '</div>';
            
        container.appendChild(div);
    }
}

function updateNewsContainer(newsList) {
    let container = document.getElementById('news-cms-container');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < newsList.length; i++) {
        let item = newsList[i];
        let dateObj = new Date(item.publishDate);
        let formattedDate = dateObj.getDate() + '/' + (dateObj.getMonth() + 1);

        let div = document.createElement('div');
        div.className = 'columns is-mobile is-vcentered mb-3 border-bottom-separator';

        div.innerHTML = 
            '<div class="column is-2 text-center">' +
                '<h2 class="title is-4 mb-0">' + formattedDate + '</h2>' +
            '</div>' +
            '<div class="column is-8">' +
                '<p class="has-text-weight-semibold">' + item.title + '</p>' +
                '<a class="is-size-7 link-hover-effect" href="' + item.articleUrl + '" target="_blank">Read External Piece ↗️</a>' +
            '</div>';

        container.appendChild(div);
    }
}

function renderContactRequestsDashboard(requests) {
    let container = document.getElementById('contacts-cms-container');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < requests.length; i++) {
        let entry = requests[i];
        let div = document.createElement('div');
        div.className = 'box card-notification-skin mb-2';

        let badgeStyle = entry.type === 'membership' ? 'is-danger' : 'is-link';
        let accessoryDetails = entry.type === 'membership' 
            ? '<p class="is-size-7">📎 <b>Document Path Reference:</b> <a href="' + entry.documentUrl + '">' + entry.documentUrl + '</a></p>'
            : '<p class="is-size-7">💬 <b>Message Content:</b> ' + entry.message + '</p>';

        div.innerHTML = 
            '<div class="tags has-addons mb-1">' +
                '<span class="tag is-dark">' + entry.firstName + ' ' + entry.lastName + '</span>' +
                '<span class="tag ' + badgeStyle + '">' + entry.type.toUpperCase() + '</span>' +
            '</div>' +
            '<p class="is-size-7">📧 <b>Email Context:</b> ' + entry.email + '</p>' +
            accessoryDetails;

        container.appendChild(div);
    }
}

// ==========================================
// 5. RUNTIME BOOTSTRAP INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Fire structural sync queries immediately on view allocation
    fetchEvents();
    fetchNewsFeed();
    fetchContactRequests();
});