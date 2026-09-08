// ============================================================
// JS-Sky/effect.js - Generator Awan, Hujan & Sistem Petir
// ============================================================

const skyContainer = document.getElementById('sky-container');

// Objek global agar bisa dipanggil dari JS-Sky/main.js nanti
window.SkyEngine = {
    activeRain: [],
    activeClouds: [],

    // 1. GENERATOR AWAN
    createCloud(speed, yPos, scale, opacity) {
        const cloud = document.createElement('div');
        cloud.classList.add('pixel-cloud');
        
        // Posisi tinggi rendah awan secara vertikal
        cloud.style.top = yPos + 'vh';
        
        // Awan yang jauh dibuat lebih kecil dan transparan (Parallax Ilusion)
        cloud.style.transform = `scale(${scale})`;
        cloud.style.opacity = opacity;
        
        // Kecepatan gerak awan (berdasarkan angin nanti)
        cloud.style.animationDuration = speed + 's';
        
        skyContainer.appendChild(cloud);
        this.activeClouds.push(cloud);
    },

    // 2. GENERATOR HUJAN
    startRain(dropCount, fallSpeed) {
        this.stopRain(); // Bersihkan hujan lama jika ada
        
        for(let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            
            // Sebar hujan secara acak di lebar layar
            drop.style.left = (Math.random() * 120 - 10) + 'vw'; 
            
            // Delay acak agar jatuhnya tidak barengan
            drop.style.animationDelay = (Math.random() * 2) + 's';
            
            // Kecepatan jatuh
            drop.style.animationDuration = (Math.random() * 0.3 + fallSpeed) + 's';
            
            skyContainer.appendChild(drop);
            this.activeRain.push(drop);
        }
    },

    stopRain() {
        this.activeRain.forEach(drop => drop.remove());
        this.activeRain = [];
    },

    // 3. GENERATOR PETIR
    initLightning() {
        this.lightningEl = document.createElement('div');
        this.lightningEl.classList.add('lightning-flash');
        skyContainer.appendChild(this.lightningEl);
    },

    triggerLightning() {
        if (!this.lightningEl) return;
        
        // Trik mereset animasi CSS agar bisa diputar berulang-ulang
        this.lightningEl.classList.remove('flash-active');
        void this.lightningEl.offsetWidth; 
        this.lightningEl.classList.add('flash-active');
    },

    // 4. BERSIHKAN LANGIT
    clearClouds() {
        this.activeClouds.forEach(cloud => cloud.remove());
        this.activeClouds = [];
    }

    // Di dalam window.SkyEngine = { ... }, tambahkan ini:

    // 5. GENERATOR BINTANG
    createStars(count) {
        for(let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Ukuran acak (1px - 2.5px)
            const size = (Math.random() * 1.5 + 1) + 'px';
            star.style.width = size;
            star.style.height = size;
            
            // Posisi acak (Fokus di langit bagian atas/tengah)
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 70 + 'vh'; 
            
            // Kecepatan kelap-kelip acak (1 - 4 detik)
            star.style.animationDuration = (Math.random() * 3 + 1) + 's';
            // Delay acak agar kelap-kelipnya tidak berbarengan
            star.style.animationDelay = Math.random() * 2 + 's';
            
            skyContainer.appendChild(star);
        }
    }
};

// Inisialisasi elemen petir ke DOM
window.SkyEngine.initLightning();

// Bikin awan default (Cerah)
// Parameter: (Speed, Posisi Y, Skala/Besar, Opacity)
window.SkyEngine.createCloud(40, 10, 0.8, 1);
window.SkyEngine.createCloud(60, 25, 0.5, 0.6); // Awan jauh (lebih lambat & kecil)
window.SkyEngine.createCloud(30, 45, 1.2, 0.9); // Awan dekat

// Inisialisasi elemen petir ke DOM
window.SkyEngine.initLightning();

// Bikin awan default (Malam)
window.SkyEngine.createCloud(40, 15, 0.8, 0.4); // Opacity awan diturunkan agar lebih gelap di malam hari
window.SkyEngine.createCloud(60, 25, 0.5, 0.2); 
window.SkyEngine.createCloud(30, 45, 1.2, 0.5); 

// CETAK 100 BINTANG DI LANGIT!
window.SkyEngine.createStars(100);