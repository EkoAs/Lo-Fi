// ============================================================
// JS-Sky/effect.js - Generator Awan, Hujan, Petir, Bintang & Aurora
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
        
        cloud.style.top = yPos + 'vh';
        cloud.style.transform = `scale(${scale})`;
        cloud.style.opacity = opacity;
        cloud.style.animationDuration = speed + 's';
        
        skyContainer.appendChild(cloud);
        this.activeClouds.push(cloud);
    },

    // 2. GENERATOR HUJAN
    startRain(dropCount, fallSpeed) {
        this.stopRain(); 
        
        for(let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            
            drop.style.left = (Math.random() * 120 - 10) + 'vw'; 
            drop.style.animationDelay = (Math.random() * 2) + 's';
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
        
        this.lightningEl.classList.remove('flash-active');
        void this.lightningEl.offsetWidth; 
        this.lightningEl.classList.add('flash-active');
    },

    // 4. BERSIHKAN LANGIT
    clearClouds() {
        this.activeClouds.forEach(cloud => cloud.remove());
        this.activeClouds = [];
    }, // <-- PERBAIKAN: Tanda koma ditambahkan di sini

    // 5. GENERATOR BINTANG
    createStars(count) {
        for(let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const size = (Math.random() * 1.5 + 1) + 'px';
            star.style.width = size;
            star.style.height = size;
            
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 70 + 'vh'; 
            
            star.style.animationDuration = (Math.random() * 3 + 1) + 's';
            star.style.animationDelay = Math.random() * 2 + 's';
            
            skyContainer.appendChild(star);
        }
    }, // <-- PERBAIKAN: Tanda koma ditambahkan di sini

    // 6. GENERATOR AURORA
    // 6. GENERATOR AURORA (3 LAYER NATURAL)
    createAurora() {
        // Hapus aurora lama jika ada (mencegah penumpukan kalau terpanggil 2x)
        const oldAurora = document.querySelector('.aurora-container');
        if (oldAurora) oldAurora.remove();

        const auroraContainer = document.createElement('div');
        auroraContainer.classList.add('aurora-container');
        
        // Layer Utama (Neon Green)
        const layer1 = document.createElement('div');
        layer1.classList.add('aurora-ribbon', 'layer-1');
        
        // Layer Belakang (Teal / Cyan)
        const layer2 = document.createElement('div');
        layer2.classList.add('aurora-ribbon', 'layer-2');

        // Layer Inti (Super Terang di Bawah)
        const layer3 = document.createElement('div');
        layer3.classList.add('aurora-ribbon', 'layer-3');
        
        auroraContainer.appendChild(layer1);
        auroraContainer.appendChild(layer2);
        auroraContainer.appendChild(layer3);
        
        skyContainer.appendChild(auroraContainer);
    }
};


// 1. Siapkan elemen petir
window.SkyEngine.initLightning();

// 2. Bikin awan (Versi Malam hari)
window.SkyEngine.createCloud(40, 15, 0.8, 0.4); 
window.SkyEngine.createCloud(60, 25, 0.5, 0.2); 
window.SkyEngine.createCloud(30, 45, 1.2, 0.5); 

// 3. Cetak Bintang
window.SkyEngine.createStars(100);

// 4. Tampilkan Aurora
window.SkyEngine.createAurora();