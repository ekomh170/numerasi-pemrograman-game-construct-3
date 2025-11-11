
// ========================================
// LEVEL 1 TINGKAT 1 - GAME LOGIC
// Kamar Tidur - Counting Objects Game
// Developers: Eko Muchamad Haryono & Anang Febryan Sutarja
// Date: November 10, 2025
// ========================================

// Runtime reference (will be set in runOnStartup)
let lvl1t1_runtime = null;

// Game state variables
let lvl1t1_currentItem = 0;  // Current item being counted (0-4)
let lvl1t1_score = 0;        // Player score
let lvl1t1_itemsCompleted = 0; // Number of items completed
let lvl1t1_isProcessing = false; // Prevent double clicks
let lvl1t1_clickSequence = []; // Array untuk track urutan klik (0-based index)

// Item configuration
// name = nama benda (untuk display)
// detailName = object detail untuk pop-up view (reward saat benar)
// correctCount = JAWABAN BENAR (hardcoded, tidak dihitung dari instance)
const lvl1t1_items = [
	{ name: 'Selimut', detailName: '1selimutdetaillvl1', correctCount: 1 },
	{ name: 'Bantal',  detailName: '2bantaldetaillvl1',  correctCount: 2 },
	{ name: 'Boneka',  detailName: '3bonekadetaillvl1',  correctCount: 3 },
	{ name: 'Baju',    detailName: '4bajudetaillvl1',    correctCount: 4 },
	{ name: 'Buku',    detailName: '5bukudetaillvl1',    correctCount: 5 }
];

// Kotak jawaban configuration (5 object terpisah)
const lvl1t1_answerBoxes = [
	'1kotakjawabanlvl1t1', // Kotak angka 1
	'2kotakjawabanlvl1t1', // Kotak angka 2
	'3kotakjawabanlvl1t1', // Kotak angka 3
	'4kotakjawabanlvl1t1', // Kotak angka 4
	'5kotakjawabanlvl1t1'  // Kotak angka 5
];

// ========================================
// KOTAK JAWABAN FUNCTIONS
// ========================================

// Function untuk update visual kotak jawaban
function lvl1t1_updateAnswerBox(boxIndex, numberValue, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in updateAnswerBox');
		return;
	}
	
	const boxName = lvl1t1_answerBoxes[boxIndex];
	
	try {
		const boxObject = rt.objects[boxName];
		if (boxObject) {
			const instances = boxObject.getAllInstances();
			if (instances.length > 0) {
				const box = instances[0];
				
				// Jika box punya Text property, update text
				if (box.text !== undefined) {
					box.text = numberValue.toString();
					console.log('📝 [L1T1] Updated box', boxIndex + 1, 'with number:', numberValue);
				}
				
				// Jika box punya AnimationFrame, set ke frame tertentu
				// Frame 0 = kosong, Frame 1-5 = angka 1-5
				if (box.animationFrame !== undefined && numberValue >= 1 && numberValue <= 5) {
					box.animationFrame = numberValue; // Set ke frame angka
					console.log('🎬 [L1T1] Updated box', boxIndex + 1, 'animation frame to:', numberValue);
				}
			}
		}
	} catch (e) {
		console.warn('⚠️ [L1T1] Could not update box:', boxName, e.message);
	}
}

// ========================================
// DETAIL VIEW FUNCTIONS
// ========================================

// Function to hide all detail views
function lvl1t1_hideAllDetailViews(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in hideAllDetailViews');
		return;
	}
	
	// Hide all detail objects (the actual detail sprites)
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

// Function to show detail view
function lvl1t1_showDetailView(itemIndex, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.error('❌ [L1T1] Runtime not available in showDetailView');
		return;
	}
	
	const item = lvl1t1_items[itemIndex];
	const detailObjectName = item.detailName; // e.g., '1selimutdetaillvl1'
	
	try {
		// Access detail object (the ACTUAL detail sprite)
		const objectClass = rt.objects[detailObjectName];
		
		if (objectClass) {
			const instances = objectClass.getAllInstances();
			if (instances.length > 0) {
				const detailSprite = instances[0];
				
				// Store original position to restore later
				const originalX = detailSprite.x;
				const originalY = detailSprite.y;
				const originalWidth = detailSprite.width;
				const originalHeight = detailSprite.height;
				const originalZElevation = detailSprite.zElevation;
				const originalOpacity = detailSprite.opacity;
				
				// Move to center of screen (640, 360 for 1280x720)
				detailSprite.x = 640;
				detailSprite.y = 360;
				
				// Set FIXED SIZE (400x400) instead of scale multiplier
				detailSprite.width = 400;
				detailSprite.height = 400;
				
				// Set high Z-elevation to be on top
				detailSprite.zElevation = 1000;
				
				// Make sure it's fully opaque
				detailSprite.opacity = 1;
				
				// Show detail
				detailSprite.isVisible = true;
				
				console.log('👁️ [L1T1] Showing pop-up detail:', detailObjectName);
				console.log('📍 Position: (640, 360) | Size: 400x400 | Z: 1000 | Opacity: 1');
				console.log('📐 Original size:', originalWidth, 'x', originalHeight);
				
				// Hide after 3 seconds and restore original properties
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
// GAME LOGIC FUNCTIONS
// ========================================

// Function untuk klik kotak jawaban - DIPANGGIL DARI CONSTRUCT 3 EVENTS
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
	
	// Check if game is already completed
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
	
	// TRACKING: Simpan klik ke array (0-based index dari items)
	lvl1t1_clickSequence.push(lvl1t1_currentItem);
	
	// UPDATE VISUAL: Tampilkan angka di kotak sesuai urutan klik
	const boxIndex = lvl1t1_clickSequence.length - 1; // Kotak ke berapa (0-4)
	lvl1t1_updateAnswerBox(boxIndex, numberValue, rt);
	
	if (numberValue === correctAnswer) {
		// CORRECT ANSWER
		const baseScore = 100;
		const bonusScore = 50;
		lvl1t1_score += baseScore + bonusScore;
		lvl1t1_itemsCompleted++;
		
		console.log('✅ [L1T1] BENAR!', item.name, '=', correctAnswer);
		console.log('💰 Score: +' + (baseScore + bonusScore) + ' | Total:', lvl1t1_score);
		console.log('📊 Progress:', lvl1t1_itemsCompleted, '/5');
		console.log('');
		
		// Show detail view sebagai reward
		lvl1t1_showDetailView(lvl1t1_currentItem, rt);
		
		// Update UI
		lvl1t1_showFeedback(true, rt);
		lvl1t1_updateScore(rt);
		lvl1t1_updateProgress(rt);
		
		// Move to next item
		lvl1t1_currentItem++;
		
		// Check if all items completed
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
			
			// Show completion screen (after detail disappears)
			setTimeout(() => {
				lvl1t1_showGameComplete(rt);
			}, 3000);
		} else {
			console.log('📝 Tugas selanjutnya:', lvl1t1_items[lvl1t1_currentItem].name);
			console.log('💡 Hint: Hitung', lvl1t1_items[lvl1t1_currentItem].name, 'di kamar');
			
			// Update task display after feedback disappears
			setTimeout(() => {
				lvl1t1_updateCurrentTask(rt);
			}, 2000);
		}
	} else {
		// WRONG ANSWER
		console.log('❌ [L1T1] SALAH! Try again.');
		console.log('💡 Expected:', correctAnswer, '| Player answered:', numberValue);
		console.log('💡 Hint: Hitung lagi', item.name, 'dengan teliti');
		console.log('');
		
		// Show detailed wrong feedback
		const feedbackMessage = '❌ SALAH!\n\n' +
			'Tugas: Hitung ' + item.name + '\n' +
			'Jawaban Kamu: ' + numberValue + '\n' +
			'Jawaban Benar: ' + correctAnswer + '\n\n' +
			'Coba hitung lagi dengan teliti!';
		
		alert(feedbackMessage);
		
		// Show feedback
		lvl1t1_showFeedback(false, rt);
	}
	
	lvl1t1_isProcessing = false;
}

// Calculate star rating based on score
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
// UI UPDATE FUNCTIONS
// ========================================

// Function to update all UI elements
function lvl1t1_updateUI(runtime) {
	const rt = runtime || lvl1t1_runtime;
	lvl1t1_updateScore(rt);
	lvl1t1_updateProgress(rt);
	lvl1t1_updateCurrentTask(rt);
	lvl1t1_hideFeedback(rt);
}

// Update score display
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

// Update progress display
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

// Update current task display
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

// Show feedback popup (BENAR/SALAH)
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

// Hide feedback popup
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

// Show game completion popup
function lvl1t1_showGameComplete(runtime) {
	const rt = runtime || lvl1t1_runtime;
	const stars = lvl1t1_getStarRating(lvl1t1_score);
	const starDisplay = '⭐'.repeat(stars);
	
	// TEMPORARY: Show browser alert with navigation option
	const userConfirmed = confirm('🎉 SELAMAT!\n\n' + 
		  'LEVEL 1 TINGKAT 1 SELESAI!\n\n' + 
		  starDisplay + '\n\n' +
		  'Final Score: ' + lvl1t1_score + '\n' +
		  'Rating: ' + stars + ' stars\n\n' +
		  'Klik OK untuk lanjut ke Level 1 Tingkat 2');
	
	console.log('[L1T1] 🎉 Game Complete!');
	console.log('[L1T1] Final Score: ' + lvl1t1_score);
	console.log('[L1T1] Star Rating: ' + stars + ' stars');
	
	// Navigate to next level if user clicks OK
	if (userConfirmed && rt) {
		console.log('[L1T1] 🚀 Navigating to Level1_Tingkat2...');
		rt.goToLayout("Level1_Tingkat2");
		return;
	}
	
	if (!rt) return;
	
	// Try to use Text object if exists
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
// INITIALIZATION
// ========================================

runOnStartup(async runtime =>
{
	// Store runtime reference globally for this level
	lvl1t1_runtime = runtime;
	
	// Export functions to global scope with level-specific prefix
	globalThis.lvl1t1_checkAnswer = (numberValue) => lvl1t1_checkAnswer(numberValue, runtime);
	globalThis.lvl1t1_getStarRating = lvl1t1_getStarRating;
	globalThis.lvl1t1_showDetailView = (itemIndex) => lvl1t1_showDetailView(itemIndex, runtime);
	globalThis.lvl1t1_hideAllDetailViews = () => lvl1t1_hideAllDetailViews(runtime);
	globalThis.lvl1t1_updateUI = () => lvl1t1_updateUI(runtime);
	globalThis.lvl1t1_showFeedback = (isCorrect) => lvl1t1_showFeedback(isCorrect, runtime);
	globalThis.lvl1t1_updateAnswerBox = (boxIndex, numberValue) => lvl1t1_updateAnswerBox(boxIndex, numberValue, runtime);
	
	console.log('✅ [L1T1] Game functions registered to global scope');
	console.log('📦 lvl1t1_checkAnswer(numberValue) - Terima angka 1-5 dari kotak jawaban');
	console.log('📦 lvl1t1_updateAnswerBox(boxIndex, numberValue) - Update visual kotak jawaban');
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart_L1T1(runtime));
});

async function OnBeforeProjectStart_L1T1(runtime)
{
	// Initialize game state when Level1_Tingkat1 layout starts
	runtime.addEventListener("beforelayoutstart", (e) => {
		// Only run for Level1_Tingkat1 layout
		if (e.layout.name !== "Level1_Tingkat1") return;
		
		lvl1t1_currentItem = 0;
		lvl1t1_score = 0;
		lvl1t1_itemsCompleted = 0;
		lvl1t1_isProcessing = false;
		lvl1t1_clickSequence = []; // Reset click sequence
		
		console.log('=================================');
		console.log('🎮 [L1T1] GAME INITIALIZED');
		console.log('Level 1 - Tingkat 1: Kamar Tidur');
		console.log('=================================');
		console.log('📝 Current task:', lvl1t1_items[lvl1t1_currentItem].name);
		console.log('💡 Hint: Count the', lvl1t1_items[lvl1t1_currentItem].name, 'in the room');
		console.log('');
		
		// Hide all detail views at start
		lvl1t1_hideAllDetailViews(runtime);
		
		// Initialize UI
		lvl1t1_updateUI(runtime);
	});
}
