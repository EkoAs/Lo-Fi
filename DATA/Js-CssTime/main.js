// ============================================================
// DATA/Js-CssTime/main.js - Logika Jam Real-Time
// ============================================================

function updateClock() {
    const now = new Date();

    // 1. Format Waktu (Jam:Menit:Detik)
    // padStart(2, '0') berfungsi agar angka di bawah 10 ditambahkan angka 0 di depannya
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // 2. Format Tanggal (Contoh: Rabu, 9 Sep 2026)
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${dayName}, ${date} ${monthName} ${year}`;

    // 3. Masukkan data ke dalam elemen HTML
    const clockEl = document.getElementById('pixel-clock');
    const dateEl = document.getElementById('pixel-date');

    if (clockEl && dateEl) {
        clockEl.textContent = timeString;
        dateEl.textContent = dateString;
    }
}

// Jalankan fungsi saat web pertama kali dibuka agar tidak menunggu 1 detik
updateClock();

// Perbarui jam setiap 1000 milidetik (1 detik)
setInterval(updateClock, 1000);