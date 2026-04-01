// ======================== ETHIOPIAN REGIONS & CITIES DATA ========================
const ethiopianRegions = {
    "Addis Ababa": ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    "Afar": ["Semera", "Asayita", "Awash", "Dubti", "Mille", "Chifra"],
    "Amhara": ["Bahir Dar", "Gondar", "Dessie", "Debre Markos", "Debre Tabor", "Lalibela", "Woldia", "Kombolcha", "Bati", "Sekota"],
    "Benishangul-Gumuz": ["Asosa", "Metekel", "Assosa", "Kurmuk", "Dibate"],
    "Dire Dawa": ["Dire Dawa City", "Gende Kore", "Melka Jebdu", "Haramaya Area"],
    "Gambela": ["Gambela", "Itang", "Akobo", "Gog", "Jor"],
    "Harari": ["Harar", "Jugol", "Aboker", "Dire Teyara"],
    "Oromia": ["Adama", "Jimma", "Bishoftu", "Ambo", "Shashamane", "Nekemte", "Bale Robe", "Assela", "Metehara", "Burayu", "Dembi Dolo", "Gimbi"],
    "Sidama": ["Hawassa", "Yirgalem", "Aleta Wondo", "Wendo Genet", "Bona", "Daye"],
    "Somali": ["Jijiga", "Dollo", "Gode", "Kebri Dahar", "Warder", "Degahbur"],
    "South West Ethiopia": ["Bonga", "Mizan Aman", "Tepi", "Bench Maji", "Kaffa"],
    "Tigray": ["Mekelle", "Adigrat", "Axum", "Shire", "Adwa", "Humera", "Wukro", "Maychew"],
    "Central Ethiopia": ["Hosaena", "Worabe", "Butajira", "Gubre", "Sodo"],
    "South Ethiopia": ["Arba Minch", "Jinka", "Konso", "Dilla", "Wolaita Sodo", "Boditi"]
};

// ======================== GLOBAL VARIABLES ========================
let students = [];
let adminEmail = "duladagn25@gmail.com";
let adminPhone = "0715806962";
let adminPasswordHash = null;
let uploadedFiles = [];
let uploadedVideos = [];
let currentPage = "dashboard";

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Load all data from localStorage
    loadData();
    
    // Check if admin password exists
    checkAdminSetup();
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const loginError = document.getElementById('loginError');
            
            // Check if admin exists
            const savedAdmin = localStorage.getItem('adminAccount');
            if (!savedAdmin) {
                loginError.style.display = 'block';
                loginError.innerHTML = '<i class="fas fa-exclamation-circle"></i> No admin account found. Please setup first!';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
                return;
            }
            
            const adminAccount = JSON.parse(savedAdmin);
            
            // Check credentials
            if (email === adminAccount.email && password === adminAccount.password) {
                // Login successful
                adminEmail = adminAccount.email;
                adminPhone = adminAccount.phone;
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('dashboardContainer').style.display = 'block';
                updateAdminEmailDisplay();
                initNavigation();
                renderCurrentPage();
                showNotification('Login successful! Welcome Admin', 'success');
            } else {
                // Login failed
                loginError.style.display = 'block';
                loginError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Invalid email or password!';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Setup button
    const showSetupBtn = document.getElementById('showSetupBtn');
    if (showSetupBtn) {
        showSetupBtn.addEventListener('click', function() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('setupPage').style.display = 'flex';
        });
    }
    
    // Back to login button
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function() {
            document.getElementById('setupPage').style.display = 'none';
            document.getElementById('loginPage').style.display = 'flex';
        });
    }
    
    // Setup form submission
    const setupForm = document.getElementById('setupForm');
    if (setupForm) {
        setupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('setupEmail').value.trim();
            const password = document.getElementById('setupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const phone = document.getElementById('setupPhone').value.trim();
            const setupError = document.getElementById('setupError');
            
            if (password.length < 4) {
                setupError.style.display = 'block';
                setupError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Password must be at least 4 characters!';
                setTimeout(() => {
                    setupError.style.display = 'none';
                }, 3000);
                return;
            }
            
            if (password !== confirmPassword) {
                setupError.style.display = 'block';
                setupError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match!';
                setTimeout(() => {
                    setupError.style.display = 'none';
                }, 3000);
                return;
            }
            
            // Save admin account
            const adminAccount = {
                email: email,
                password: password,
                phone: phone
            };
            localStorage.setItem('adminAccount', JSON.stringify(adminAccount));
            adminEmail = email;
            adminPhone = phone;
            
            showNotification('Admin account created successfully! Please login.', 'success');
            
            // Go back to login
            document.getElementById('setupPage').style.display = 'none';
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('loginForm').reset();
            setupForm.reset();
        });
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('dashboardContainer').style.display = 'none';
            showNotification('Logged out successfully', 'success');
        });
    }
});

// Check if admin is already setup
function checkAdminSetup() {
    const savedAdmin = localStorage.getItem('adminAccount');
    if (savedAdmin) {
        // Admin exists, show login only
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('setupPage').style.display = 'none';
    } else {
        // No admin, show setup
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('setupPage').style.display = 'none';
        // Show setup info
        const loginInfo = document.querySelector('#loginPage .login-info');
        if (loginInfo) {
            loginInfo.innerHTML = '<p><i class="fas fa-info-circle"></i> <strong>First Time:</strong> Click "Setup Admin Password" to create your account</p><button type="button" id="showSetupBtn" class="setup-btn"><i class="fas fa-cog"></i> Setup Admin Password</button>';
            const newSetupBtn = document.getElementById('showSetupBtn');
            if (newSetupBtn) {
                newSetupBtn.addEventListener('click', function() {
                    document.getElementById('loginPage').style.display = 'none';
                    document.getElementById('setupPage').style.display = 'flex';
                });
            }
        }
    }
}

// Load data from localStorage
function loadData() {
    const savedStudents = localStorage.getItem('students');
    const savedFiles = localStorage.getItem('uploadedFiles');
    const savedVideos = localStorage.getItem('uploadedVideos');
    
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    } else {
        // Seed demo data
        students = [
            { fullName: "Biruk Tadesse", email: "biruk@ethio.dev", phone: "0912345678", region: "Addis Ababa", city: "Bole", course: "Frontend Development" },
            { fullName: "Hana Girmay", email: "hana@edu.et", phone: "0923456789", region: "Tigray", city: "Mekelle", course: "Full Stack JS" },
            { fullName: "Abdi Mohammed", email: "abdi@oromia.com", phone: "0934567890", region: "Oromia", city: "Adama", course: "React & UI" }
        ];
        saveData();
    }
    
    if (savedFiles) {
        uploadedFiles = JSON.parse(savedFiles);
    } else {
        uploadedFiles = [];
    }
    
    if (savedVideos) {
        uploadedVideos = JSON.parse(savedVideos);
    } else {
        uploadedVideos = [];
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
}

// Helper Functions
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getCitiesForRegion(region) {
    return ethiopianRegions[region] || ["Main City", "Town Center"];
}

function populateCities(region, citySelectElem) {
    if (!citySelectElem) return;
    const cities = getCitiesForRegion(region);
    citySelectElem.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelectElem.appendChild(option);
    });
}

function showNotification(msg, type = "success") {
    const notif = document.createElement('div');
    notif.className = `notification ${type === 'error' ? 'error' : ''}`;
    notif.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function updateAdminEmailDisplay() {
    const span = document.getElementById("adminEmailDisplay");
    if (span) span.innerText = adminEmail;
}

// Page Renderers
function renderDashboard() {
    const total = students.length;
    const regionsCount = Object.keys(ethiopianRegions).length;
    const totalCities = Object.values(ethiopianRegions).flat().length;
    const recent = [...students].reverse().slice(0, 5);
    const totalFiles = uploadedFiles.length;
    const totalVideos = uploadedVideos.length;
    
    return `
        <div class="card">
            <h2><i class="fas fa-chalkboard-user"></i> Welcome Admin</h2>
            <p style="margin: 10px 0 20px;">You have full control over student registrations, Ethiopian regions/cities, and admin credentials.</p>
            <div class="stats-grid">
                <div class="stat-card"><i class="fas fa-user-graduate"></i><h3>${total}</h3><p>Total Students</p></div>
                <div class="stat-card"><i class="fas fa-map-marker-alt"></i><h3>${regionsCount}</h3><p>Regions</p></div>
                <div class="stat-card"><i class="fas fa-city"></i><h3>${totalCities}</h3><p>Cities</p></div>
                <div class="stat-card"><i class="fas fa-file-upload"></i><h3>${totalFiles}</h3><p>Files</p></div>
                <div class="stat-card"><i class="fas fa-video"></i><h3>${totalVideos}</h3><p>Videos</p></div>
            </div>
