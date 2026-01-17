let allProperties = [];
let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    fetchProperties();
});

// 1. جلب البيانات من البايثون
async function fetchProperties() {
    try {
        const res = await fetch('/api/properties');
        allProperties = await res.json();
        renderProperties(allProperties);
    } catch (err) {
        console.error("Failed to load properties", err);
    }
}

// 2. رسم الكروت
function renderProperties(props) {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = '';

    props.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-aos', 'fade-up');
        card.innerHTML = `
            <div class="card-image" style="background-image: url('/${prop.img}');" onclick="openImage('/${prop.img}')">
                <div class="card-actions">
                    <button class="icon-btn" onclick="openMap(${prop.id}, event)"><i class="fas fa-map-marker-alt"></i></button>
                    <button class="icon-btn" onclick="openTour(${prop.id}, event)"><i class="fas fa-cube"></i></button>
                </div>
            </div>
            <div class="card-info">
                <h3>${prop.title}</h3>
                <p style="color:#888; font-size:0.8rem; margin-bottom:10px;"><i class="fas fa-map-pin"></i> ${prop.location}</p>
                <div class="price-row">
                    <span class="price">${prop.price}</span>
                    <button class="btn-main" style="padding:5px 15px; font-size:0.8rem">Details</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. الفلترة
function filterProperties(type) {
    if (type === 'all') renderProperties(allProperties);
    else renderProperties(allProperties.filter(p => p.type === type));
}

// 4. الشات بوت
async function handleChat(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const msg = input.value;
        const box = document.getElementById('chat-messages');

        box.innerHTML += `<div style="text-align:right; margin:5px; color:#d4af37">You: ${msg}</div>`;
        input.value = '';

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        box.innerHTML += `<div style="text-align:left; margin:5px;">Bot: ${data.response}</div>`;
        box.scrollTop = box.scrollHeight;
    }
}
function toggleChat() {
    const body = document.getElementById('chat-body');
    body.style.display = body.style.display === 'none' ? 'flex' : 'none';
}

// 5. تعدد اللغات
const translations = {
    en: { heroTitle: "Invest in Your Legacy", heroDesc: "Exclusive collection of premium residences.", btn: "Explore Units" },
    ar: { heroTitle: "استثمر في مستقبلك", heroDesc: "مجموعة حصرية من أرقى العقارات في الإمارات.", btn: "تصفح الوحدات" }
};

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = currentLang === 'ar' ? 'Cairo, sans-serif' : 'Montserrat, sans-serif';

    // تبديل النصوص
    document.getElementById('hero-title').innerText = translations[currentLang].heroTitle;
    document.getElementById('hero-desc').innerText = translations[currentLang].heroDesc;
    document.getElementById('hero-btn').innerText = translations[currentLang].btn;

    // تبديل القائمة
    document.querySelectorAll('.nav-link').forEach(link => {
        link.innerText = link.getAttribute(`data-${currentLang}`);
    });

    document.getElementById('lang-btn').innerText = currentLang === 'en' ? '🇦🇪 العربية' : '🇺🇸 English';
}

// 6. المودال (الصور، الخريطة، 360)
let map;
function openImage(src) {
    document.getElementById('lightbox-modal').style.display = 'flex';
    document.getElementById('lightbox-img').src = src;
}
function openMap(id, event) {
    event.stopPropagation();
    const prop = allProperties.find(p => p.id === id);
    document.getElementById('map-modal').style.display = 'flex';
    if (map) map.remove();
    setTimeout(() => {
        map = L.map('map-container').setView(prop.coords, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker(prop.coords).addTo(map).bindPopup(prop.title).openPopup();
    }, 200);
}
function openTour(id, event) {
    event.stopPropagation();
    const prop = allProperties.find(p => p.id === id);
    document.getElementById('tour-modal').style.display = 'flex';
    setTimeout(() => {
        pannellum.viewer('panorama', { type: 'equirectangular', panorama: prop.panorama, autoLoad: true });
    }, 200);
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if (id === 'tour-modal') document.getElementById('panorama').innerHTML = '';
}