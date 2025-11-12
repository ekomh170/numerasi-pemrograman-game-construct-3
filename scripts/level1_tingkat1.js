
// ========================================
// LEVEL 1 TINGKAT 1 - LOGIKA GAME
// Kamar Tidur - Game Menghitung Benda
// Pengembang: Eko Muchamad Haryono & Anang Febryan Sutarja
// Tanggal: 10 November 2025
// ========================================

// Referensi runtime (akan di-set di runOnStartup)
let lvl1t1_runtime = null;

// Variabel state game
let lvl1t1_currentItem = 0;  // Item yang sedang dihitung (0-4)
let lvl1t1_score = 0;        // Skor pemain
let lvl1t1_itemsCompleted = 0; // Jumlah item yang sudah selesai
let lvl1t1_isProcessing = false; // Mencegah double klik
let lvl1t1_clickSequence = []; // Array untuk melacak urutan klik (index mulai 0)

// Konfigurasi item
// name = nama benda (untuk tampilan)
// detailName = objek detail untuk pop-up (reward jika benar)
// correctCount = JAWABAN BENAR (hardcoded, bukan dari jumlah instance)
const lvl1t1_items = [
	{ name: 'Selimut', detailName: '1selimutdetaillvl1', correctCount: 1 },
	{ name: 'Bantal',  detailName: '2bantaldetaillvl1',  correctCount: 2 },
	{ name: 'Boneka',  detailName: '3bonekadetaillvl1',  correctCount: 3 },
	{ name: 'Baju',    detailName: '4bajudetaillvl1',    correctCount: 4 },
	{ name: 'Buku',    detailName: '5bukudetaillvl1',    correctCount: 5 }
];

// Konfigurasi kotak jawaban (5 objek terpisah)
const lvl1t1_answerBoxes = [
	'1kotakjawabanlvl1t1', // Kotak angka 1
	'2kotakjawabanlvl1t1', // Kotak angka 2
	'3kotakjawabanlvl1t1', // Kotak angka 3
	'4kotakjawabanlvl1t1', // Kotak angka 4
	'5kotakjawabanlvl1t1'  // Kotak angka 5
];

// Konfigurasi icon benda (5 icon untuk dipindahkan ke kotak)
const lvl1t1_bendaIcons = [
	'benda1lvl1', // Icon Selimut
	'benda2lvl1', // Icon Bantal
	'benda3lvl1', // Icon Boneka
	'benda4lvl1', // Icon Baju
	'benda5lvl1'  // Icon Buku
];

// ========================================
// FUNGSI KOTAK JAWABAN
// ========================================

// Array untuk menyimpan icon benda yang sudah dipindahkan
let lvl1t1_movedBendaIcons = [];

// Fungsi untuk memindahkan icon benda ke dalam kotak
function lvl1t1_moveBendaToBox(itemIndex, numberValue, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	// itemIndex = index item yang diklik (0-4)
	// numberValue = jawaban benar (1-5)
	
	const bendaIconName = lvl1t1_bendaIcons[itemIndex]; // e.g., 'benda1lvl1'
	const targetBoxName = lvl1t1_answerBoxes[numberValue - 1]; // e.g., '1kotakjawabanlvl1t1'
	
	try {
		// Ambil objek icon benda
		const bendaIconObject = rt.objects[bendaIconName];
		if (!bendaIconObject) {
			console.warn('⚠️ [L1T1] Benda icon not found:', bendaIconName);
			return;
		}
		
		const bendaInstances = bendaIconObject.getAllInstances();
		if (bendaInstances.length === 0) {
			console.warn('⚠️ [L1T1] No instances for benda icon:', bendaIconName);
			return;
		}
		
		const bendaIcon = bendaInstances[0];
		
		// Ambil objek kotak target
		const boxObject = rt.objects[targetBoxName];
		if (!boxObject) {
			console.warn('⚠️ [L1T1] Target box not found:', targetBoxName);
			return;
		}
		
		const boxInstances = boxObject.getAllInstances();
		if (boxInstances.length === 0) {
			console.warn('⚠️ [L1T1] No instances for box:', targetBoxName);
			return;
		}
		
		const targetBox = boxInstances[0];
		
		// PINDAHKAN icon benda ke posisi kotak!
		bendaIcon.x = targetBox.x;
		bendaIcon.y = targetBox.y;
		
		// Skala icon agar pas di kotak
		// Simpan ukuran asli dulu
		const originalWidth = bendaIcon.width;
		const originalHeight = bendaIcon.height;
		
		// Ukuran target untuk icon di dalam kotak (lebih kecil)
		const targetSize = 60; // 60 pixels
		
		// Hitung rasio skala berdasarkan dimensi terbesar
		const currentMaxDimension = Math.max(originalWidth, originalHeight);
		const scaleRatio = targetSize / currentMaxDimension;
		
		bendaIcon.width = originalWidth * scaleRatio;
		bendaIcon.height = originalHeight * scaleRatio;
		
		// Set z-elevation lebih tinggi agar icon di atas kotak
		bendaIcon.zElevation = targetBox.zElevation + 10;
		
		// Pastikan icon terlihat
		bendaIcon.isVisible = true;
		bendaIcon.opacity = 1;
		
		// Simpan referensi
		lvl1t1_movedBendaIcons[itemIndex] = {
			icon: bendaIcon,
			originalX: bendaIcon.x,
			originalY: bendaIcon.y,
			originalWidth: originalWidth,
			originalHeight: originalHeight
		};
		
	console.log('✅ [L1T1] Icon', bendaIconName, 'berhasil dipindahkan ke kotak', numberValue);
	console.log('📍 Posisi: (', targetBox.x, ',', targetBox.y, ')');
	console.log('📏 Ukuran:', originalWidth, 'x', originalHeight, '→', bendaIcon.width, 'x', bendaIcon.height);
	console.log('📐 Rasio skala:', scaleRatio.toFixed(2));
		
	} catch (e) {
		console.error('❌ [L1T1] Error moving benda icon:', e.message);
	}
}

// Fungsi untuk update visual kotak jawaban
function lvl1t1_updateAnswerBox(boxIndex, numberValue, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in updateAnswerBox');
		return;
	}
	
	// Pindahkan icon benda ke kotak yang sesuai
	// boxIndex = urutan completion (0-4)
	// numberValue = angka jawaban yang benar (1-5)
	
	// Item index sama dengan urutan completion
	const itemIndex = boxIndex;
	
	lvl1t1_moveBendaToBox(itemIndex, numberValue, rt);
}

// Fungsi untuk reset semua icon benda
function lvl1t1_resetAllBendaIcons() {
	const rt = lvl1t1_runtime;
	if (!rt) return;
	
	lvl1t1_bendaIcons.forEach((bendaIconName, index) => {
		try {
			const bendaIconObject = rt.objects[bendaIconName];
			if (!bendaIconObject) return;
			
			const instances = bendaIconObject.getAllInstances();
			if (instances.length === 0) return;
			
			const icon = instances[0];
			
			// Reset ke posisi asli (di scene)
			// Posisi asli tergantung layout
			// Untuk sekarang, hanya reset visibility
			icon.isVisible = true;
			icon.opacity = 1;
			
		} catch (e) {
			console.warn('⚠️ [L1T1] Error resetting benda icon:', bendaIconName, e.message);
		}
	});
	
	lvl1t1_movedBendaIcons = [];
	console.log('↩️ [L1T1] All benda icons reset');
}

// ========================================
// FUNGSI DETAIL VIEW
// ========================================

// Fungsi untuk menyembunyikan semua detail view
function lvl1t1_hideAllDetailViews(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in hideAllDetailViews');
		return;
	}
	
	// Sembunyikan semua objek detail (sprite detail)
	lvl1t1_items.forEach(item => {
		try {
			const objectClass = rt.objects[item.detailName];
			if (objectClass) {
				const instances = objectClass.getAllInstances();
				instances.forEach(inst => {
					inst.isVisible = false;
				});
			}
		} catch (e) {
			console.warn('⚠️ [L1T1] Could not hide:', item.detailName, e.message);
		}
	});
	
	console.log('👁️ [L1T1] All detail views hidden');
}

// Fungsi untuk menampilkan detail view
function lvl1t1_showDetailView(itemIndex, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in showDetailView');
		return;
	}
	
	const item = lvl1t1_items[itemIndex];
	const detailObjectName = item.detailName; // e.g., '1selimutdetaillvl1'
	
	try {
	// Ambil objek detail (sprite detail sebenarnya)
		const objectClass = rt.objects[detailObjectName];
		
		if (objectClass) {
			const instances = objectClass.getAllInstances();
			if (instances.length > 0) {
				const detailSprite = instances[0];
				
				// Simpan posisi asli untuk restore nanti
				const originalX = detailSprite.x;
				const originalY = detailSprite.y;
				const originalWidth = detailSprite.width;
				const originalHeight = detailSprite.height;
				const originalZElevation = detailSprite.zElevation;
				const originalOpacity = detailSprite.opacity;
				
				// Pindahkan ke tengah layar (640, 360 untuk 1280x720)
				detailSprite.x = 640;
				detailSprite.y = 360;
				
				// Set ukuran FIXED (400x400) bukan pakai skala
				detailSprite.width = 400;
				detailSprite.height = 400;
				
				// Set Z-elevation tinggi agar di atas
				detailSprite.zElevation = 1000;
				
				// Pastikan opacity penuh
				detailSprite.opacity = 1;
				
				// Tampilkan detail
				detailSprite.isVisible = true;
				
				console.log('👁️ [L1T1] Showing pop-up detail:', detailObjectName);
				console.log('📍 Position: (640, 360) | Size: 400x400 | Z: 1000 | Opacity: 1');
				console.log('📐 Original size:', originalWidth, 'x', originalHeight);
				
				// Sembunyikan setelah 3 detik dan restore properti asli
				setTimeout(() => {
					detailSprite.isVisible = false;
					detailSprite.x = originalX;
					detailSprite.y = originalY;
					detailSprite.width = originalWidth;
					detailSprite.height = originalHeight;
					detailSprite.zElevation = originalZElevation;
					detailSprite.opacity = originalOpacity;
					console.log('👁️ [L1T1] Detail pop-up hidden and restored');
				}, 3000);
			} else {
				console.warn('⚠️ [L1T1] No instances found for:', detailObjectName);
			}
		} else {
			console.warn('⚠️ [L1T1] Object class not found:', detailObjectName);
			console.log('💡 Available objects:', Object.keys(rt.objects).filter(name => name.includes('detail')));
		}
	} catch (e) {
		console.error('❌ [L1T1] Error in showDetailView:', e.message);
	}
}

// ========================================
// FUNGSI LOGIKA GAME
// ========================================

// Fungsi untuk klik kotak jawaban - DIPANGGIL DARI EVENT CONSTRUCT 3
// numberValue = angka kotak yang di-klik (1, 2, 3, 4, atau 5)
function lvl1t1_checkAnswer(numberValue, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in checkAnswer');
		return;
	}
	
	if (lvl1t1_isProcessing) {
		console.log('⏳ [L1T1] Processing, please wait...');
		return;
	}
	
	// Cek apakah game sudah selesai
	if (lvl1t1_itemsCompleted >= 5) {
		console.log('🎉 [L1T1] Game already completed!');
		alert('🎉 Game sudah selesai!\n\nFinal Score: ' + lvl1t1_score + '\nRating: ' + lvl1t1_getStarRating(lvl1t1_score) + ' ⭐');
		return;
	}
	
	lvl1t1_isProcessing = true;
	
	const item = lvl1t1_items[lvl1t1_currentItem];
	const correctAnswer = item.correctCount;
	
	console.log('');
	console.log('🔢 [L1T1] Kotak jawaban di-klik:', numberValue);
	console.log('📝 Tugas sekarang:', item.name);
	console.log('✅ Jawaban benar:', correctAnswer);
	console.log('👆 Player jawab:', numberValue);
	
	if (numberValue === correctAnswer) {
	// JAWABAN BENAR
		const baseScore = 100;
		const bonusScore = 50;
		lvl1t1_score += baseScore + bonusScore;
		
	// UPDATE VISUAL: Tampilkan icon di kotak sesuai urutan completion
	// itemsCompleted = 0 → kotak pertama (index 0)
	// itemsCompleted = 1 → kotak kedua (index 1), dst
		const boxIndex = lvl1t1_itemsCompleted; // 0-4
		lvl1t1_updateAnswerBox(boxIndex, numberValue, rt);
		
		lvl1t1_itemsCompleted++;
		
		console.log('✅ [L1T1] BENAR!', item.name, '=', correctAnswer);
		console.log('💰 Score: +' + (baseScore + bonusScore) + ' | Total:', lvl1t1_score);
		console.log('📊 Progress:', lvl1t1_itemsCompleted, '/5');
		console.log('');
		
	// Tampilkan detail view sebagai reward
		lvl1t1_showDetailView(lvl1t1_currentItem, rt);
		
	// Update UI
		lvl1t1_showFeedback(true, rt);
		lvl1t1_updateScore(rt);
		lvl1t1_updateProgress(rt);
		
	// Pindah ke item berikutnya
		lvl1t1_currentItem++;
		
	// Cek apakah semua item sudah selesai
		if (lvl1t1_itemsCompleted === 5) {
			const stars = lvl1t1_getStarRating(lvl1t1_score);
			console.log('');
			console.log('=================================');
			console.log('🎉 [L1T1] CONGRATULATIONS!');
			console.log('=================================');
			console.log('🏆 GAME COMPLETED!');
			console.log('💰 Final Score:', lvl1t1_score);
			console.log('⭐ Rating:', stars, 'stars');
			console.log('=================================');
			console.log('');
			
			// Tampilkan layar selesai (setelah detail hilang)
			setTimeout(() => {
				lvl1t1_showGameComplete(rt);
			}, 3000);
		} else {
			console.log('📝 Tugas selanjutnya:', lvl1t1_items[lvl1t1_currentItem].name);
			console.log('💡 Hint: Hitung', lvl1t1_items[lvl1t1_currentItem].name, 'di kamar');
			
			// Update tampilan tugas setelah feedback hilang
			setTimeout(() => {
				lvl1t1_updateCurrentTask(rt);
			}, 2000);
		}
	} else {
	// JAWABAN SALAH
		console.log('❌ [L1T1] SALAH! Try again.');
		console.log('💡 Expected:', correctAnswer, '| Player answered:', numberValue);
		console.log('💡 Hint: Hitung lagi', item.name, 'dengan teliti');
		console.log('');
		
	// Tampilkan feedback salah secara detail
		const feedbackMessage = '❌ SALAH!\n\n' +
			'Tugas: Hitung ' + item.name + '\n' +
			'Jawaban Kamu: ' + numberValue + '\n' +
			'Jawaban Benar: ' + correctAnswer + '\n\n' +
			'Coba hitung lagi dengan teliti!';
		
		alert(feedbackMessage);
		
	// Tampilkan feedback
		lvl1t1_showFeedback(false, rt);
	}
	
	lvl1t1_isProcessing = false;
}

// Hitung rating bintang berdasarkan skor
function lvl1t1_getStarRating(finalScore) {
	// Perfect score: 750 (5 items × 150)
	// 3 stars: 600+ (80% correct)
	// 2 stars: 450+ (60% correct)
	// 1 star: 300+ (40% correct)
	if (finalScore >= 600) return 3;
	if (finalScore >= 450) return 2;
	if (finalScore >= 300) return 1;
	return 0;
}

// ========================================
// FUNGSI UPDATE UI
// ========================================

// Fungsi untuk update semua elemen UI
function lvl1t1_updateUI(runtime) {
	const rt = runtime || lvl1t1_runtime;
	lvl1t1_updateScore(rt);
	lvl1t1_updateProgress(rt);
	lvl1t1_updateCurrentTask(rt);
	lvl1t1_hideFeedback(rt);
}

// Update tampilan skor
function lvl1t1_updateScore(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	const txtScore = rt.objects.txtScore;
	if (txtScore) {
		const instances = txtScore.getAllInstances();
		if (instances.length > 0) {
			instances[0].text = `Score: ${lvl1t1_score}`;
		}
	}
}

// Update tampilan progress
function lvl1t1_updateProgress(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	const txtProgress = rt.objects.txtProgress;
	if (txtProgress) {
		const instances = txtProgress.getAllInstances();
		if (instances.length > 0) {
			instances[0].text = `${lvl1t1_itemsCompleted}/5 Items`;
		}
	}
}

// Update tampilan tugas saat ini
function lvl1t1_updateCurrentTask(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	const txtCurrentTask = rt.objects.txtCurrentTask;
	if (txtCurrentTask) {
		const instances = txtCurrentTask.getAllInstances();
		if (instances.length > 0) {
			if (lvl1t1_itemsCompleted < 5) {
				instances[0].text = `Tugas: Hitung ${lvl1t1_items[lvl1t1_currentItem].name}`;
			} else {
				instances[0].text = `🎉 SELESAI!`;
			}
		}
	} else {
		// TEMPORARY: Log to console if no text object
		if (lvl1t1_itemsCompleted < 5) {
			console.log('📋 [L1T1] TUGAS SEKARANG: Hitung', lvl1t1_items[lvl1t1_currentItem].name);
		}
	}
}

// Tampilkan popup feedback (BENAR/SALAH)
function lvl1t1_showFeedback(isCorrect, runtime) {
	const rt = runtime || lvl1t1_runtime;
	
	// TEMPORARY: Show browser alert ONLY for correct answers
	// (Wrong answer alert is shown in checkAnswer with details)
	if (isCorrect) {
		alert('✅ BENAR!\n\nScore: ' + lvl1t1_score + '\nProgress: ' + lvl1t1_itemsCompleted + '/5');
	}
	
	if (!rt) return;
	
	// Try to use Text object if exists
	const txtFeedback = rt.objects.txtFeedback;
	if (txtFeedback) {
		const instances = txtFeedback.getAllInstances();
		if (instances.length > 0) {
			const feedbackText = instances[0];
			
			if (isCorrect) {
				feedbackText.text = '✅ BENAR!';
				feedbackText.colorRgb = [0, 1, 0]; // Green
			} else {
				feedbackText.text = '❌ SALAH!';
				feedbackText.colorRgb = [1, 0, 0]; // Red
			}
			
			// Show feedback
			feedbackText.isVisible = true;
			
			// Hide after 2 seconds
			setTimeout(() => {
				feedbackText.isVisible = false;
			}, 2000);
		}
	}
}

// Sembunyikan popup feedback
function lvl1t1_hideFeedback(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	const txtFeedback = rt.objects.txtFeedback;
	if (txtFeedback) {
		const instances = txtFeedback.getAllInstances();
		if (instances.length > 0) {
			instances[0].isVisible = false;
		}
	}
}

// Tampilkan popup game selesai
function lvl1t1_showGameComplete(runtime) {
	const rt = runtime || lvl1t1_runtime;
	const stars = lvl1t1_getStarRating(lvl1t1_score);
	const starDisplay = '⭐'.repeat(stars);
	
	// SEMENTARA: Tampilkan alert browser dengan opsi navigasi
	const userConfirmed = confirm('🎉 SELAMAT!\n\n' + 
		  'LEVEL 1 TINGKAT 1 SELESAI!\n\n' + 
		  starDisplay + '\n\n' +
		  'Final Score: ' + lvl1t1_score + '\n' +
		  'Rating: ' + stars + ' stars\n\n' +
		  'Klik OK untuk lanjut ke Level 1 Tingkat 2');
	
	console.log('[L1T1] 🎉 Game Complete!');
	console.log('[L1T1] Final Score: ' + lvl1t1_score);
	console.log('[L1T1] Star Rating: ' + stars + ' stars');
	
	// Navigasi ke level berikutnya jika user klik OK
	if (userConfirmed && rt) {
		console.log('[L1T1] 🚀 Navigating to Level1_Tingkat2...');
		rt.goToLayout("Level1_Tingkat2");
		return;
	}
	
	if (!rt) return;
	
	// Coba gunakan objek Text jika ada
	const txtFeedback = rt.objects.txtFeedback;
	if (txtFeedback) {
		const instances = txtFeedback.getAllInstances();
		if (instances.length > 0) {
			const feedbackText = instances[0];
			
			feedbackText.text = `🎉 SELESAI!\n${starDisplay}\nScore: ${lvl1t1_score}`;
			feedbackText.colorRgb = [1, 0.84, 0]; // Gold
			feedbackText.isVisible = true;
		}
	}
}

// ========================================
// INISIALISASI
// ========================================

runOnStartup(async runtime =>
{
	// Simpan referensi runtime secara global untuk level ini
	lvl1t1_runtime = runtime;
	
	// Ekspor fungsi ke global scope dengan prefix khusus level
	globalThis.lvl1t1_checkAnswer = (numberValue) => lvl1t1_checkAnswer(numberValue, runtime);
	globalThis.lvl1t1_getStarRating = lvl1t1_getStarRating;
	globalThis.lvl1t1_showDetailView = (itemIndex) => lvl1t1_showDetailView(itemIndex, runtime);
	globalThis.lvl1t1_hideAllDetailViews = () => lvl1t1_hideAllDetailViews(runtime);
	globalThis.lvl1t1_updateUI = () => lvl1t1_updateUI(runtime);
	globalThis.lvl1t1_showFeedback = (isCorrect) => lvl1t1_showFeedback(isCorrect, runtime);
	globalThis.lvl1t1_updateAnswerBox = (boxIndex, numberValue) => lvl1t1_updateAnswerBox(boxIndex, numberValue, runtime);
	globalThis.lvl1t1_resetAllBendaIcons = lvl1t1_resetAllBendaIcons;
	globalThis.lvl1t1_moveBendaToBox = (itemIndex, numberValue) => lvl1t1_moveBendaToBox(itemIndex, numberValue, runtime);
	
	console.log('✅ [L1T1] Semua fungsi game sudah didaftarkan ke global scope');
	console.log('📦 lvl1t1_checkAnswer(numberValue) - Terima angka 1-5 dari klik benda');
	console.log('📦 lvl1t1_updateAnswerBox(boxIndex, numberValue) - Pindahkan icon benda ke kotak');
	console.log('📦 lvl1t1_resetAllBendaIcons() - Reset semua icon benda');
	console.log('💡 Icon benda akan otomatis pindah ke kotak yang sesuai!');
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart_L1T1(runtime));
});

async function OnBeforeProjectStart_L1T1(runtime)
{
	// Inisialisasi state game saat layout Level1_Tingkat1 dimulai
	runtime.addEventListener("beforelayoutstart", (e) => {
	// Hanya dijalankan untuk layout Level1_Tingkat1
		if (e.layout.name !== "Level1_Tingkat1") return;
		
		lvl1t1_currentItem = 0;
		lvl1t1_score = 0;
		lvl1t1_itemsCompleted = 0;
		lvl1t1_isProcessing = false;
		lvl1t1_clickSequence = []; // Reset click sequence
		lvl1t1_movedBendaIcons = []; // Reset moved icons
		
	// Reset semua icon benda
		setTimeout(() => {
			lvl1t1_resetAllBendaIcons();
		}, 100); // Small delay to ensure objects loaded
		
		console.log('=================================');
		console.log('🎮 [L1T1] GAME INITIALIZED');
		console.log('Level 1 - Tingkat 1: Kamar Tidur');
		console.log('=================================');
		console.log('📝 Current task:', lvl1t1_items[lvl1t1_currentItem].name);
		console.log('💡 Hint: Count the', lvl1t1_items[lvl1t1_currentItem].name, 'in the room');
		console.log('');
		
	// Sembunyikan semua detail view di awal
		lvl1t1_hideAllDetailViews(runtime);
		
	// Inisialisasi UI
		lvl1t1_updateUI(runtime);
	});
}
