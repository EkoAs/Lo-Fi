// ============================================================
// JS/effect.js - Generator Pohon (Batang, Dahan, Daun)
// ============================================================

const container = document.getElementById('tree-container');

// ----------------------------------------------------
// KONFIGURASI UKURAN & WARNA
// ----------------------------------------------------
const pixelSize = 10;
const step = 6; 

// Palet Warna Dasar
const trunkColors = ['#3e2723', '#4e342e', '#5d4037'];
const leafColors = ['#1b4332', '#2d6a4f', '#40916c', '#52b788'];

// Variabel global untuk menyimpan data fisika dahan yang akan ditarik ke main.js
window.treeBranches = [];

// ----------------------------------------------------
// FUNGSI PENCETAK 1 PIXEL KOTAK
// ----------------------------------------------------
function createPixel(parentEl, x, y, colors, type) {
    const el = document.createElement('div');
    el.classList.add('pixel');
    
    // Klasifikasi untuk penerapan z-index dan shadow dari CSS
    if (type === 'leaf') el.classList.add('leaf');
    else if (type === 'wood') el.classList.add('wood');
    
    el.style.left = x + 'px';
    el.style.bottom = y + 'px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    parentEl.appendChild(el);
}

// ----------------------------------------------------
// 1. GENERATE BATANG POHON UTAMA (STATIS)
// ----------------------------------------------------
function buildTrunk() {
    for (let y = 0; y <= 170; y += step) {
        for (let x = -15; x <= 15; x += step) {
            // Efek gerigi acak di tepi batang
            if (Math.abs(x) >= 10 && Math.random() > 0.6) continue;
            createPixel(container, x, y, trunkColors, 'wood');
        }
    }
}

// ----------------------------------------------------
// 2. GENERATE DAHAN & DEDAUNAN (BERGERAK)
// ----------------------------------------------------
function buildBranches() {
    // cx/cy = pusat rimbunan daun. px/py = titik engsel dahan menempel di batang
    const branchesData = [
        { cx: 0,   cy: 240, r: 90, px: 0,   py: 160 }, // Pucuk Tengah
        { cx: -65, cy: 190, r: 85, px: -10, py: 130 }, // Kiri Bawah
        { cx: 65,  cy: 190, r: 85, px: 10,  py: 130 }, // Kanan Bawah
        { cx: -50, cy: 270, r: 70, px: -5,  py: 160 }, // Kiri Atas
        { cx: 50,  cy: 270, r: 70, px: 5,   py: 160 }  // Kanan Atas
    ];

    branchesData.forEach(b => {
        // Kontainer per-dahan
        const branchEl = document.createElement('div');
        branchEl.className = 'branch-group';
        branchEl.style.left = b.px + 'px';
        branchEl.style.bottom = b.py + 'px';
        container.appendChild(branchEl);

        const localCx = b.cx - b.px;
        const localCy = b.cy - b.py;

        // A. Cetak Kayu Penghubung
        const segments = 15; 
        for(let i = 0; i <= segments; i++) {
            let wx = (localCx / segments) * i;
            let wy = (localCy / segments) * i;
            for(let w_off = -step; w_off <= step; w_off += step) {
                if(Math.random() > 0.3) {
                    createPixel(branchEl, wx + w_off, wy, trunkColors, 'wood');
                }
            }
        }

        // B. Cetak Rimbunan Daun
        for (let y = localCy - b.r; y <= localCy + b.r; y += step) {
            for (let x = localCx - b.r; x <= localCx + b.r; x += step) {
                const distSq = Math.pow(x - localCx, 2) + Math.pow(y - localCy, 2);
                if (distSq <= b.r * b.r) {
                    if (Math.random() > 0.25) {
                        createPixel(branchEl, x, y, leafColors, 'leaf');
                    }
                }
            }
        }

        // C. Daftarkan Data Fisika Pegas untuk Mesin Angin JS
        window.treeBranches.push({
            element: branchEl,
            angle: 0,
            velocity: 0,
            acceleration: 0,
            mass: 1.5 + Math.random(),
            stiffness: 0.08 + (Math.random() * 0.5), 
            damping: 0.85 + (Math.random() * 0.05),
            windOffset: Math.random() * 1000
        });
    });
}

// ----------------------------------------------------
// INISIALISASI PEMBANGUNAN
// ----------------------------------------------------
function initTreeGenerator() {
    buildTrunk();
    buildBranches();
}

// Eksekusi fungsi saat DOM sudah ter-load
initTreeGenerator();