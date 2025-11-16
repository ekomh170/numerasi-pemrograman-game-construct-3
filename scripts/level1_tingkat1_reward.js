// ========================================
// LEVEL 1 TINGKAT 1 REWARD - LOGIKA HALAMAN
// Halaman Reward dengan Score & Star Rating
// Pengembang: Eko Muchamad Haryono & Anang Febryan Sutarja
// Tanggal: 12 November 2025
// ========================================

// Referensi runtime
let lvl1t1reward_runtime = null;

// Data reward (akan diterima dari level sebelumnya)
let lvl1t1reward_score = 0;
let lvl1t1reward_stars = 0;
let lvl1t1reward_timeRemaining = 0;

// ========================================
// FUNGSI INISIALISASI REWARD
// ========================================

// Fungsi untuk set data reward dari level sebelumnya
function lvl1t1reward_setData(score, stars, timeRemaining) {
	lvl1t1reward_score = score || 0;
	lvl1t1reward_stars = stars || 0;
	lvl1t1reward_timeRemaining = timeRemaining || 0;
	
	console.log('🎁 [L1T1 Reward] Data diterima:');
	console.log('   Score:', lvl1t1reward_score);
	console.log('   Bintang:', lvl1t1reward_stars);
	console.log('   Sisa Waktu:', lvl1t1reward_timeRemaining, 'detik');
}

// ========================================
// FUNGSI TAMPILAN REWARD
// ========================================

// Fungsi untuk tampilkan bintang sesuai rating
function lvl1t1reward_showStars(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	if (!rt) return;
	
	// Cari objek reward_bintang (sprite dengan multiple frames untuk 1-3 bintang)
	const bintangObj = rt.objects.reward_bintang;
	if (bintangObj) {
		const instances = bintangObj.getAllInstances();
		if (instances.length > 0) {
			const bintangSprite = instances[0];
			
			// Set animation frame sesuai jumlah bintang
			// Frame 0 = 1 bintang, Frame 1 = 2 bintang, Frame 2 = 3 bintang
			const frameIndex = Math.max(0, Math.min(2, lvl1t1reward_stars - 1));
			bintangSprite.animationFrame = frameIndex;
			bintangSprite.isVisible = true;
			
			console.log('⭐ [L1T1 Reward] Menampilkan', lvl1t1reward_stars, 'bintang (frame:', frameIndex, ')');
		}
	} else {
		console.warn('⚠️ [L1T1 Reward] Objek reward_bintang tidak ditemukan');
	}
}

// Fungsi untuk update tampilan score
function lvl1t1reward_updateScoreDisplay(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	if (!rt) return;
	
	// Update text score jika ada
	const txtScore = rt.objects.txtRewardScore;
	if (txtScore) {
		const instances = txtScore.getAllInstances();
		if (instances.length > 0) {
			instances[0].text = `Score: ${lvl1t1reward_score}`;
		}
	}
	
	console.log('💰 [L1T1 Reward] Score ditampilkan:', lvl1t1reward_score);
}

// Fungsi untuk update semua tampilan reward
function lvl1t1reward_updateDisplay(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	lvl1t1reward_showStars(rt);
	lvl1t1reward_updateScoreDisplay(rt);
}

// ========================================
// FUNGSI NAVIGASI TOMBOL
// ========================================

// Fungsi untuk tombol HOME (kembali ke main menu)
function lvl1t1reward_onHomeClick(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	if (!rt) return;
	
	console.log('🏠 [L1T1 Reward] Tombol Home diklik - Kembali ke MainMenu');
	rt.goToLayout("MainMenu");
}

// Fungsi untuk tombol COBA LAGI (restart level dari awal)
function lvl1t1reward_onCobaLagiClick(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	if (!rt) return;
	
	console.log('🔄 [L1T1 Reward] Tombol Coba Lagi diklik - Reset progress & Restart Level1_Tingkat1');
	
	// RESET PROGRESS DULU sebelum restart
	if (typeof lvl1t1_resetProgress === 'function') {
		lvl1t1_resetProgress();
		console.log('✅ [L1T1 Reward] Progress di-reset!');
	}
	
	// Restart level
	rt.goToLayout("Level1_Tingkat1");
}

// Fungsi untuk tombol NEXT GAME (lanjut ke level berikutnya)
function lvl1t1reward_onNextGameClick(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	if (!rt) return;
	
	console.log('▶️ [L1T1 Reward] Tombol Next Game diklik - Lanjut ke Level1_Tingkat2');
	rt.goToLayout("Level1_Tingkat2");
}

// ========================================
// FUNGSI PESAN MOTIVASI
// ========================================

// Fungsi untuk tampilkan pesan motivasi berdasarkan bintang
function lvl1t1reward_showMotivationalMessage(runtime) {
	const rt = runtime || lvl1t1reward_runtime;
	if (!rt) return;
	
	let message = '';
	
	switch (lvl1t1reward_stars) {
		case 3:
			message = '🌟 SEMPURNA! Kamu hebat sekali!';
			break;
		case 2:
			message = '⭐ BAGUS! Kamu hampir sempurna!';
			break;
		case 1:
			message = '⭐ LUMAYAN! Coba lagi untuk hasil lebih baik!';
			break;
		default:
			message = '💪 Jangan menyerah! Coba lagi!';
	}
	
	// Update text motivasi jika ada
	const txtMotivasi = rt.objects.txtMotivasi;
	if (txtMotivasi) {
		const instances = txtMotivasi.getAllInstances();
		if (instances.length > 0) {
			instances[0].text = message;
		}
	}
	
	console.log('💬 [L1T1 Reward] Pesan motivasi:', message);
}

// ========================================
// INISIALISASI
// ========================================

runOnStartup(async runtime =>
{
	// Simpan referensi runtime
	lvl1t1reward_runtime = runtime;
	
	// Ekspor fungsi ke global scope
	globalThis.lvl1t1reward_setData = lvl1t1reward_setData;
	globalThis.lvl1t1reward_updateDisplay = () => lvl1t1reward_updateDisplay(runtime);
	globalThis.lvl1t1reward_onHomeClick = () => lvl1t1reward_onHomeClick(runtime);
	globalThis.lvl1t1reward_onCobaLagiClick = () => lvl1t1reward_onCobaLagiClick(runtime);
	globalThis.lvl1t1reward_onNextGameClick = () => lvl1t1reward_onNextGameClick(runtime);
	globalThis.lvl1t1reward_showStars = () => lvl1t1reward_showStars(runtime);
	globalThis.lvl1t1reward_showMotivationalMessage = () => lvl1t1reward_showMotivationalMessage(runtime);
	
	console.log('✅ [L1T1 Reward] Semua fungsi reward sudah didaftarkan ke global scope');
	console.log('📦 lvl1t1reward_setData(score, stars, time) - Set data reward');
	console.log('📦 lvl1t1reward_onHomeClick() - Tombol Home diklik');
	console.log('📦 lvl1t1reward_onCobaLagiClick() - Tombol Coba Lagi diklik');
	console.log('📦 lvl1t1reward_onNextGameClick() - Tombol Next Game diklik');
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart_L1T1Reward(runtime));
});

async function OnBeforeProjectStart_L1T1Reward(runtime)
{
	// Inisialisasi halaman reward saat layout dimulai
	runtime.addEventListener("beforelayoutstart", (e) => {
		// Hanya dijalankan untuk layout Level1_Tingkat1_Reward
		if (e.layout.name !== "Level1_Tingkat1_Reward") return;
		
		console.log('=================================');
		console.log('🎁 [L1T1 Reward] HALAMAN REWARD INITIALIZED');
		console.log('=================================');
		
		// Ambil data dari localStorage jika ada (fallback)
		try {
			const savedScore = localStorage.getItem('lvl1t1_finalScore');
			const savedStars = localStorage.getItem('lvl1t1_finalStars');
			const savedTime = localStorage.getItem('lvl1t1_finalTime');
			
			if (savedScore && savedStars) {
				lvl1t1reward_setData(
					parseInt(savedScore),
					parseInt(savedStars),
					parseInt(savedTime || 0)
				);
			}
		} catch (e) {
			console.warn('⚠️ [L1T1 Reward] Tidak bisa load data dari localStorage:', e.message);
		}
		
		// Update tampilan reward
		setTimeout(() => {
			lvl1t1reward_updateDisplay(runtime);
			lvl1t1reward_showMotivationalMessage(runtime);
		}, 100);
		
		console.log('🎉 [L1T1 Reward] Halaman reward siap!');
	});
}
