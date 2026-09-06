// ============================================================
// JS/main.js - API Cuaca, Screen Wake Lock & Mesin Fisika Angin
// ============================================================

// ----------------------------------------------------
// 1. BLOK KONFIGURASI MESIN FISIKA (UTAK-ATIK DI SINI)
// ----------------------------------------------------
const config = {
    // Kecepatan berjalannya waktu (memengaruhi seberapa cepat angin berubah arah). 
    // Default 0.02. Semakin besar angkanya, angin makin bergetar/kencang.
    timeSpeed: 0.02, 
    
    // Pengali dari data API cuaca.
    apiWindMultiplier: 0.05,
    
    // Limit rotasi ekstrem. Ubah jika ingin pohon bisa rebah seperti ditiup badai.
    maxRotateDown: 25,  // Derajat ke bawah/kanan
    maxRotateUp: -15,   // Derajat ke atas/kiri
    
    // Sensitivitas hembusan acak (Turbulensi)
    gustIntensity: 1.5,
    
    // Default kecepatan angin jika sedang offline atau API gagal
    defaultOfflineWind: 2.5 
};

// ----------------------------------------------------
// 2. FETCH DATA CUACA REAL-TIME (OPEN-METEO)
// ----------------------------------------------------
const windSpeedEl = document.getElementById('wind-speed');
const windStatusEl = document.getElementById('wind-status');

let currentWindSpeed = 2;
let baseWindForce = 0; 

// Menggunakan koordinat Purwakarta (-6.55, 107.44)[cite: 2]
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=-6.55&longitude=107.44&current_weather=true";

async function fetchWeather() {
    try {
        const response = await fetch(weatherApiUrl);
        const data = await response.json();
        
        // Mendapatkan kecepatan angin (km/h) dari API[cite: 2]
        currentWindSpeed = data.current_weather.windspeed;
        
        // Update UI Text[cite: 2]
        windSpeedEl.innerText = `${currentWindSpeed} km/h`;
        
        // Klasifikasi status cuaca[cite: 2]
        if(currentWindSpeed < 5) windStatusEl.innerText = "Angin Sepoi-sepoi 🍃";
        else if(currentWindSpeed < 15) windStatusEl.innerText = "Angin Sedang 💨";
        else if(currentWindSpeed < 30) windStatusEl.innerText = "Angin Kencang 🌪️";
        else windStatusEl.innerText = "Badai! ⚠️";

        // Konversi angin dunia nyata ke tenaga fisika mesin kita[cite: 2]
        baseWindForce = currentWindSpeed * config.apiWindMultiplier; 

    } catch (error) {
        console.error("Gagal mengambil data cuaca, menggunakan fallback lokal:", error);
        windSpeedEl.innerText = "Gagal (pakai data lokal)";
        windStatusEl.innerText = "Mode Offline";
        baseWindForce = config.defaultOfflineWind * config.apiWindMultiplier; 
    }
}

// Panggil pertama kali dan set interval 15 menit[cite: 2]
fetchWeather();
setInterval(fetchWeather, 15 * 60 * 1000);

// ----------------------------------------------------
// 3. FITUR SCREEN WAKE LOCK (Tahan Layar Nyala)
// ----------------------------------------------------
let wakeLock = null;
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            statusText.innerText = "Layar: ON (Tetap Menyala)";
            startBtn.style.display = 'none'; // Sembunyikan tombol setelah aktif
            
            wakeLock.addEventListener('release', () => {
                statusText.innerText = "Layar: Normal (Bisa Mati)";
                startBtn.style.display = 'block';
            });
        } else {
            statusText.innerText = "Browser tidak mendukung Wake Lock";
        }
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
        statusText.innerText = "Akses Wake Lock ditolak";
    }
}

startBtn.addEventListener('click', () => {
    requestWakeLock();
});

// Jika tab ditinggalkan lalu kembali, coba aktifkan Wake Lock lagi jika sebelumnya sudah aktif
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

// ----------------------------------------------------
// 4. MESIN FISIKA (SPRING & NOISE GENERATOR)
// ----------------------------------------------------
let time = 0; 

// Fungsi Pseudo-Random untuk membuat gelombang angin natural[cite: 2]
function getWindNoise(t, offset) {
    let noise = Math.sin(t * 0.5 + offset) * 0.5;
    noise += Math.sin(t * 1.2 + offset * 2) * 0.3;
    noise += Math.sin(t * 0.2 + offset) * 0.2;
    return noise; // Output bervariasi dari -1.0 hingga 1.0[cite: 2]
}

function animatePhysics() {
    const currentGlobalWind = (baseWindForce > 0) ? baseWindForce : 0.2;

    // Pergerakan waktu sesuai config
    time += config.timeSpeed; 

    // window.treeBranches ditarik dari JS/effect.js
    if (window.treeBranches && window.treeBranches.length > 0) {
        window.treeBranches.forEach(b => {
            // Kalkulasi hembusan angin ke dahan ini[cite: 2]
            const randomGust = getWindNoise(time, b.windOffset) * (currentGlobalWind * config.gustIntensity);
            const totalWindPush = (currentGlobalWind * 0.8) + randomGust;

            // Rumus Pegas (Hooke's Law dengan Damping)[cite: 2]
            const springForce = -b.stiffness * b.angle;
            const totalForce = totalWindPush + springForce;

            b.acceleration = totalForce / b.mass;
            b.velocity += b.acceleration;
            b.velocity *= b.damping;
            b.angle += b.velocity;

            // Membatasi rotasi agar tidak melintir atau melipat seperti kain jemuran[cite: 2]
            b.angle = Math.max(config.maxRotateUp, Math.min(config.maxRotateDown, b.angle));

            // Terapkan ke DOM
            b.element.style.transform = `rotate(${b.angle}deg)`;
        });
    }

    requestAnimationFrame(animatePhysics);
}

// Mulai Loop Animasi!
animatePhysics();