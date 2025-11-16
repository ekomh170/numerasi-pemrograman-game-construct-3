
// ========================================
// NUMERI - MAIN SCRIPT
// Educational Counting Game
// Developers: Eko Muchamad Haryono & Anang Febryan Sutarja
// Date: November 10, 2025
// ========================================

// Import level-specific scripts
// Level scripts akan auto-load dari project.c3proj

runOnStartup(async runtime =>
{
	// Simpan runtime ke global scope
	globalThis.g_runtime = runtime;
	
	// Global initialization
	console.log('=================================');
	console.log('NUMERI - Game Starting');
	console.log('Educational Counting Game');
	console.log('Developers: Eko & Anang');
	console.log('=================================');
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Global project initialization
	console.log('Project initialized');
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
	// Code to run every tick (if needed for global logic)
}

// ========================================
// LEVEL 1 TINGKAT 1 REWARD - FUNGSI NAVIGASI
// ========================================

// Data reward (akan diterima dari level sebelumnya)
let lvl1t1reward_score = 0;
let lvl1t1reward_stars = 0;
let lvl1t1reward_timeRemaining = 0;

// Fungsi untuk tombol HOME (kembali ke main menu)
function lvl1t1reward_onHomeClick() {
	const runtime = globalThis.g_runtime;
	if (!runtime) return;
	
	console.log('🏠 [L1T1 Reward] Tombol Home diklik - Kembali ke MainMenu');
	runtime.goToLayout("MainMenu");
}

// Fungsi untuk tombol COBA LAGI (restart level)
function lvl1t1reward_onCobaLagiClick() {
	const runtime = globalThis.g_runtime;
	if (!runtime) return;
	
	console.log('🔄 [L1T1 Reward] Tombol Coba Lagi diklik - Restart Level1_Tingkat1');
	runtime.goToLayout("Level1_Tingkat1");
}

// Fungsi untuk tombol NEXT GAME (lanjut ke level berikutnya)
function lvl1t1reward_onNextGameClick() {
	const runtime = globalThis.g_runtime;
	if (!runtime) return;
	
	console.log('▶️ [L1T1 Reward] Tombol Next Game diklik - Lanjut ke Level1_Tingkat2');
	runtime.goToLayout("Level1_Tingkat2");
}

// Ekspor fungsi ke global scope
globalThis.lvl1t1reward_onHomeClick = lvl1t1reward_onHomeClick;
globalThis.lvl1t1reward_onCobaLagiClick = lvl1t1reward_onCobaLagiClick;
globalThis.lvl1t1reward_onNextGameClick = lvl1t1reward_onNextGameClick;

