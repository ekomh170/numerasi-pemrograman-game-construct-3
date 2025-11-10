
// ========================================
// LEVEL 1 TINGKAT 3 - DRAG & MATCH DOLLS
// Kamar Tidur - Match Small Dolls to Big Dolls
// Developers: Eko Muchamad Haryono & Anang Febryan Sutarja
// Date: November 10, 2025
// ========================================

// Runtime reference (will be set in runOnStartup)
let lvl1t3_runtime = null;

// Game state variables
let lvl1t3_score = 0;        // Player score
let lvl1t3_matchedCount = 0; // Number of dolls matched
let lvl1t3_currentDraggedItem = null; // Currently dragged item
let lvl1t3_isProcessing = false; // Prevent multiple matches at once

// Doll configuration (5 boneka)
// smallDoll = boneka kecil yang di-drag dari kamar
// bigDoll = boneka besar target di bawah
const lvl1t3_dolls = [
	{ id: 1, smallDoll: 'boneka1lvl1t3', bigDoll: 'boneka1lvl1t3out', matched: false },
	{ id: 2, smallDoll: 'boneka2lvl1t3', bigDoll: 'boneka2lvl1t3out', matched: false },
	{ id: 3, smallDoll: 'boneka3lvl1t3', bigDoll: 'boneka3lvl1t3out', matched: false },
	{ id: 4, smallDoll: 'boneka4lvl1t3', bigDoll: 'boneka4lvl1t3out', matched: false },
	{ id: 5, smallDoll: 'boneka5lvl1t3', bigDoll: 'boneka5lvl1t3out', matched: false }
];

// ========================================
// DRAG & DROP FUNCTIONS
// ========================================

/**
 * Check if small doll is dropped on correct big doll
 * @param {number} dollIndex - Index dari doll (0-4)
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_checkMatch(dollIndex, runtime) {
	const rt = runtime || lvl1t3_runtime;
	if (!rt) {
		console.error('❌ [L1T3] Runtime not available in checkMatch');
		return;
	}

	if (lvl1t3_isProcessing) {
		console.log('⏳ [L1T3] Processing, please wait...');
		return;
	}

	const doll = lvl1t3_dolls[dollIndex];

	// Check if already matched
	if (doll.matched) {
		console.log('⚠️ [L1T3] Doll already matched:', doll.id);
		return;
	}

	lvl1t3_isProcessing = true;

	try {
		// Get small doll and big doll instances
		const smallDollClass = rt.objects[doll.smallDoll];
		const bigDollClass = rt.objects[doll.bigDoll];

		if (!smallDollClass || !bigDollClass) {
			console.error('❌ [L1T3] Object not found:', doll.smallDoll, 'or', doll.bigDoll);
			lvl1t3_isProcessing = false;
			return;
		}

		const smallDollInstance = smallDollClass.getFirstInstance();
		const bigDollInstance = bigDollClass.getFirstInstance();

		if (!smallDollInstance || !bigDollInstance) {
			console.error('❌ [L1T3] Instance not found');
			lvl1t3_isProcessing = false;
			return;
		}

		// Check if small doll is overlapping with correct big doll
		const isOverlapping = smallDollInstance.testOverlap(bigDollInstance);

		if (isOverlapping) {
			// CORRECT MATCH!
			console.log('✅ [L1T3] CORRECT! Boneka', doll.id, 'matched!');
			
			// Mark as matched
			doll.matched = true;
			lvl1t3_matchedCount++;
			
			// Add score
			const matchScore = 150; // 150 poin per match
			lvl1t3_score += matchScore;
			
			// Hide small doll (sudah diambil)
			smallDollInstance.isVisible = false;
			
			// Visual feedback on big doll - bounce effect
			const originalWidth = bigDollInstance.width;
			const originalHeight = bigDollInstance.height;
			
			// Bounce animation (scale up then back)
			bigDollInstance.width = originalWidth * 1.2;
			bigDollInstance.height = originalHeight * 1.2;
			
			setTimeout(() => {
				bigDollInstance.width = originalWidth;
				bigDollInstance.height = originalHeight;
			}, 200);

			console.log('💰 [L1T3] Score: +' + matchScore + ' | Total:', lvl1t3_score);
			console.log('📊 [L1T3] Progress:', lvl1t3_matchedCount, '/5');

			// Show feedback
			lvl1t3_showFeedback(true, rt);
			lvl1t3_updateScore(rt);
			lvl1t3_updateProgress(rt);

			// Check if all dolls matched
			if (lvl1t3_matchedCount === 5) {
				console.log('');
				console.log('=================================');
				console.log('🎉 [L1T3] CONGRATULATIONS!');
				console.log('=================================');
				console.log('🏆 ALL DOLLS MATCHED!');
				console.log('💰 Final Score:', lvl1t3_score);
				console.log('⭐ Rating:', lvl1t3_getStarRating(lvl1t3_score), 'stars');
				console.log('=================================');
				console.log('');

				setTimeout(() => {
					lvl1t3_showGameComplete(rt);
				}, 1500);
			}
		} else {
			// WRONG MATCH - return to original position
			console.log('❌ [L1T3] Wrong position! Try again.');
			
			// Reset position (will be handled by Construct 3 drag behavior)
			lvl1t3_showFeedback(false, rt);
			
			// Optional: Auto reset position
			lvl1t3_resetDollPosition(dollIndex, rt);
		}
	} catch (e) {
		console.error('❌ [L1T3] Error in checkMatch:', e.message);
	}

	lvl1t3_isProcessing = false;
}

/**
 * Reset small doll to original position if dropped in wrong place
 * @param {number} dollIndex - Index dari doll (0-4)
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_resetDollPosition(dollIndex, runtime) {
	const rt = runtime || lvl1t3_runtime;
	if (!rt) return;

	const doll = lvl1t3_dolls[dollIndex];
	const smallDollClass = rt.objects[doll.smallDoll];
	
	if (smallDollClass) {
		const smallDollInstance = smallDollClass.getFirstInstance();
		if (smallDollInstance) {
			// Original positions from layout (scaled for 1280x720 viewport)
			const originalPositions = [
				{ x: 95, y: 315 },   // boneka1 - kiri bawah (tiger orange)
				{ x: 583, y: 54 },   // boneka2 - atas di lemari (tiger kuning)
				{ x: 197, y: 220 },  // boneka3 - di kasur (giraffe)
				{ x: 557, y: 314 },  // boneka4 - kanan bawah (tiger orange)
				{ x: 441, y: 286 }   // boneka5 - tengah bawah (lion kuning)
			];

			const originalPos = originalPositions[dollIndex];
			smallDollInstance.x = originalPos.x;
			smallDollInstance.y = originalPos.y;
			
			console.log('[L1T3] 🔄 Reset boneka', doll.id, 'ke posisi:', originalPos.x, ',', originalPos.y);
		}
	}
}

// ========================================
// SCORING & FEEDBACK FUNCTIONS
// ========================================

/**
 * Calculate star rating based on score
 * @param {number} finalScore - Final score
 * @returns {number} Star rating (0-3)
 */
function lvl1t3_getStarRating(finalScore) {
	// Perfect score: 750 (5 dolls × 150)
	// 3 stars: 600+ (80%)
	// 2 stars: 450+ (60%)
	// 1 star: 300+ (40%)
	if (finalScore >= 600) return 3;
	if (finalScore >= 450) return 2;
	if (finalScore >= 300) return 1;
	return 0;
}

/**
 * Update score display
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_updateScore(runtime) {
	const rt = runtime || lvl1t3_runtime;
	if (!rt) return;

	const txtScore = rt.objects.txtScore;
	if (txtScore) {
		const instances = txtScore.getAllInstances();
		if (instances.length > 0) {
			instances[0].text = `Score: ${lvl1t3_score}`;
		}
	}

	console.log('💰 [L1T3] Score updated:', lvl1t3_score);
}

/**
 * Update progress display
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_updateProgress(runtime) {
	const rt = runtime || lvl1t3_runtime;
	if (!rt) return;

	const txtProgress = rt.objects.txtProgress;
	if (txtProgress) {
		const instances = txtProgress.getAllInstances();
		if (instances.length > 0) {
			instances[0].text = `${lvl1t3_matchedCount}/5 Boneka`;
		}
	}

	console.log('📊 [L1T3] Progress updated:', lvl1t3_matchedCount, '/5');
}

/**
 * Show feedback (BENAR/SALAH)
 * @param {boolean} isCorrect - Apakah jawaban benar
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_showFeedback(isCorrect, runtime) {
	const rt = runtime || lvl1t3_runtime;

	// Show browser alert (HANYA untuk match yang benar, tidak untuk salah)
	if (isCorrect) {
		// Simple feedback tanpa alert untuk tidak mengganggu gameplay
		console.log('✅ [L1T3] COCOK! Score:', lvl1t3_score, '| Progress:', lvl1t3_matchedCount, '/5');
	} else {
		console.log('❌ [L1T3] Bukan pasangan yang cocok. Coba lagi!');
	}

	if (!rt) return;

	// Try to use Text object if exists
	const txtFeedback = rt.objects.txtFeedback;
	if (txtFeedback) {
		const instances = txtFeedback.getAllInstances();
		if (instances.length > 0) {
			const feedbackText = instances[0];

			if (isCorrect) {
				feedbackText.text = '✅ COCOK!';
				feedbackText.colorRgb = [0, 1, 0]; // Green
			} else {
				feedbackText.text = '❌ SALAH!';
				feedbackText.colorRgb = [1, 0, 0]; // Red
			}

			feedbackText.isVisible = true;

			setTimeout(() => {
				feedbackText.isVisible = false;
			}, 1500);
		}
	}
}

/**
 * Show game completion screen
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_showGameComplete(runtime) {
	const rt = runtime || lvl1t3_runtime;
	const stars = lvl1t3_getStarRating(lvl1t3_score);
	const starDisplay = '⭐'.repeat(stars);

	// Show completion alert with navigation option
	const userConfirmed = confirm('🎉 SELAMAT!\n\n' +
		'LEVEL 1 TINGKAT 3 SELESAI!\n' +
		'Semua boneka berhasil dipasangkan!\n\n' +
		starDisplay + '\n\n' +
		'Final Score: ' + lvl1t3_score + '\n' +
		'Rating: ' + stars + ' stars\n\n' +
		'Klik OK untuk lanjut ke Level 2');

	console.log('[L1T3] 🎉 Game Complete!');
	console.log('[L1T3] Final Score: ' + lvl1t3_score);
	console.log('[L1T3] Star Rating: ' + stars + ' stars');

	// Navigate to next level if user clicks OK
	if (userConfirmed && rt) {
		console.log('[L1T3] 🚀 Navigating to Level2_Tingkat1...');
		rt.goToLayout("Level2_Tingkat1");
		return;
	}

	if (!rt) return;

	// Try to use Text object if exists
	const txtFeedback = rt.objects.txtFeedback;
	if (txtFeedback) {
		const instances = txtFeedback.getAllInstances();
		if (instances.length > 0) {
			const feedbackText = instances[0];

			feedbackText.text = `🎉 SELESAI!\n${starDisplay}\nScore: ${lvl1t3_score}`;
			feedbackText.colorRgb = [1, 0.84, 0]; // Gold
			feedbackText.isVisible = true;
		}
	}
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if a small doll is overlapping with its matching big doll
 * This can be called from event sheet when drag ends
 * @param {number} dollIndex - Index dari doll (0-4)
 * @param {IRuntime} runtime - The Construct 3 runtime instance
 */
function lvl1t3_onDollDropped(dollIndex, runtime) {
	console.log('[L1T3] 🎯 Checking doll drop:', dollIndex + 1);
	lvl1t3_checkMatch(dollIndex, runtime);
}

/**
 * Get current game state for debugging
 * @returns {object} Current game state
 */
function lvl1t3_getGameState() {
	return {
		score: lvl1t3_score,
		matchedCount: lvl1t3_matchedCount,
		dollsStatus: lvl1t3_dolls.map(d => ({
			id: d.id,
			matched: d.matched
		}))
	};
}

// ========================================
// INITIALIZATION
// ========================================

runOnStartup(async runtime => {
	// Store runtime reference globally for this level
	lvl1t3_runtime = runtime;

	// Export functions to global scope with level-specific prefix
	globalThis.lvl1t3_checkMatch = (dollIndex) => lvl1t3_checkMatch(dollIndex);
	globalThis.lvl1t3_onDollDropped = (dollIndex) => lvl1t3_onDollDropped(dollIndex);
	globalThis.lvl1t3_resetDollPosition = (dollIndex) => lvl1t3_resetDollPosition(dollIndex);
	globalThis.lvl1t3_getStarRating = lvl1t3_getStarRating;
	globalThis.lvl1t3_updateScore = () => lvl1t3_updateScore();
	globalThis.lvl1t3_updateProgress = () => lvl1t3_updateProgress();
	globalThis.lvl1t3_showFeedback = (isCorrect) => lvl1t3_showFeedback(isCorrect);
	globalThis.lvl1t3_getGameState = lvl1t3_getGameState;

	console.log('✅ [L1T3] Game functions registered to global scope');
	console.log('Functions: lvl1t3_checkMatch, lvl1t3_onDollDropped, etc.');

	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart_L1T3(runtime));
});

async function OnBeforeProjectStart_L1T3(runtime) {
	// Initialize game state when Level1_Tingkat3 layout starts
	runtime.addEventListener("beforelayoutstart", (e) => {
		// Only run for Level1_Tingkat3 layout
		if (e.layout.name !== "Level1_Tingkat3") return;

		// Reset game state
		lvl1t3_score = 0;
		lvl1t3_matchedCount = 0;
		lvl1t3_isProcessing = false;
		lvl1t3_currentDraggedItem = null;

		// Reset all dolls matched status
		lvl1t3_dolls.forEach(doll => {
			doll.matched = false;
		});

		console.log('=================================');
		console.log('🎮 [L1T3] GAME INITIALIZED');
		console.log('Level 1 - Tingkat 3: Match the Dolls');
		console.log('=================================');
		console.log('🎯 Objective: Drag boneka kecil ke boneka besar yang cocok');
		console.log('📊 Total boneka: 5');
		console.log('💰 Score per match: 150 poin');
		console.log('🏆 Perfect score: 750 poin');
		console.log('');

		// Initialize UI
		lvl1t3_updateScore(runtime);
		lvl1t3_updateProgress(runtime);
	});
}
