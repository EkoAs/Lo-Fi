// ============================================================
// JS-Sky/main.js - Otak Pengendali Warna Langit, Hujan & Petir
// ============================================================

const skyContainerDOM = document.getElementById('sky-container');

// Menggunakan API Open-Meteo (Koordinat Purwakarta)[cite: 2]
// Catatan: Kamu bisa mengganti URL ini atau menambahkan parameter &hourly=weathercode 
// jika nanti ingin mendeteksi Hujan Asli dari API, bukan sekadar dari kecepatan angin.
const skyApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=-6.55&longitude=107.44&current_weather=true";

let lightningInterval = null; // Variabel penyimpan timer petir

async function updateSkyConditions() {
    try {
        const response = await fetch(skyApiUrl);
        const data = await response.json();
        
        // Ambil data kecepatan angin[cite: 2]
        const windSpeed = data.current_weather.windspeed; 

        // 1. Bersihkan class tema cuaca sebelumnya
        skyContainerDOM.className = '';
        
        // 2. Matikan timer petir (jika sebelumnya badai dan sekarang sudah reda)
        if (lightningInterval) {
            clearInterval(lightningInterval);
            lightningInterval = null;
        }

        // 3. LOGIKA KONDISI CUACA BERDASARKAN KECEPATAN ANGIN
        if (windSpeed < 5) {
            console.log("Langit: Cerah");
            skyContainerDOM.classList.add('sky-clear');
            window.SkyEngine.stopRain();
            
        } else if (windSpeed < 15) {
            console.log("Langit: Berawan");
            skyContainerDOM.classList.add('sky-cloudy');
            window.SkyEngine.stopRain();

        } else if (windSpeed < 30) {
            console.log("Langit: Mendung & Hujan Sedang");
            skyContainerDOM.classList.add('sky-overcast');
            
            // Panggil generator hujan dari JS-Sky/effect.js
            // Parameter: (Jumlah rintik, Kecepatan jatuh dalam detik)
            window.SkyEngine.startRain(40, 0.7); 
            
        } else {
            console.log("Langit: Badai & Petir!");
            skyContainerDOM.classList.add('sky-storm');
            
            // Hujan lebat & cepat
            window.SkyEngine.startRain(100, 0.4); 
            
            // Nyalakan loop petir (dievaluasi setiap 4 detik)
            lightningInterval = setInterval(() => {
                // Peluang 50% petir menyambar setiap interval
                if (Math.random() > 0.5) {
                    window.SkyEngine.triggerLightning();
                }
            }, 4000);
        }

    } catch (error) {
        console.error("Gagal mengambil data langit, menggunakan cuaca default.", error);
        skyContainerDOM.classList.add('sky-clear');
        window.SkyEngine.stopRain();
    }
}

// Jalankan saat file diload
updateSkyConditions();

// Sinkronkan update langit setiap 15 menit (sama dengan interval update pohon)
setInterval(updateSkyConditions, 15 * 60 * 1000);