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
};

// Inisialisasi elemen petir ke DOM
window.SkyEngine.initLightning();

// Bikin awan default (Cerah)
// Parameter: (Speed, Posisi Y, Skala/Besar, Opacity)
window.SkyEngine.createCloud(40, 10, 0.8, 1);
window.SkyEngine.createCloud(60, 25, 0.5, 0.6); // Awan jauh (lebih lambat & kecil)
window.SkyEngine.createCloud(30, 45, 1.2, 0.9); // Awan dekat