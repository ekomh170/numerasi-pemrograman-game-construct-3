
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

// Item configuration
// iconName = object yang DI-KLIK oleh player (icon di UI)
// objectName = object yang DIHITUNG jumlahnya di scene (detail benda)
const lvl1t1_items = [
	{ name: 'Selimut', objectName: '1selimutdetaillvl1', correctCount: 1, iconName: '1selimutlvl1' },
	{ name: 'Bantal',  objectName: '2bantaldetaillvl1',  correctCount: 1, iconName: '2bantallvl1' },
	{ name: 'Boneka',  objectName: '3bonekadetaillvl1',  correctCount: 1, iconName: '3bonekalvl1' },
	{ name: 'Baju',    objectName: '4bajudetaillvl1',    correctCount: 1, iconName: '4baju1lvl1' },
	{ name: 'Buku',    objectName: '5bukudetaillvl1',    correctCount: 1, iconName: '5bukulvl1' }
];

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
			const objectClass = rt.objects[item.objectName];
			if (objectClass) {
				const instances = objectClass.getAllInstances();
				instances.forEach(inst => {
					inst.isVisible = false;
				});
			}
		} catch (e) {
			console.warn('⚠️ [L1T1] Could not hide:', item.objectName, e.message);
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
	const detailObjectName = item.objectName; // e.g., '1selimutdetaillvl1'
	
	try {
		// Access detail object (the ACTUAL detail sprite, not benda)
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

// Function to check answer - DIPANGGIL DARI CONSTRUCT 3 EVENTS
function lvl1t1_checkAnswer(itemIndex, runtime) {
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
	
	if (itemIndex !== lvl1t1_currentItem) {
		console.log('❌ [L1T1] Not this item\'s turn yet!');
		console.log('💡 Current task:', lvl1t1_items[lvl1t1_currentItem].name);
		
		// Show alert for wrong item clicked
		alert('❌ SALAH URUTAN!\n\nTugas sekarang: Hitung ' + lvl1t1_items[lvl1t1_currentItem].name + '\n\nKlik icon yang benar!');
		return;
	}
	
	lvl1t1_isProcessing = true;
	
	// Show detail view of clicked item
	lvl1t1_showDetailView(itemIndex, rt);
	
	const item = lvl1t1_items[itemIndex];
	
	// Get all instances of the object type
	const objectType = rt.objects[item.objectName];
	
	if (!objectType) {
		console.error('❌ [L1T1] Object type not found:', item.objectName);
		console.log('💡 Available objects:', Object.keys(rt.objects));
		lvl1t1_isProcessing = false;
		return;
	}
	
	const actualCount = objectType.getAllInstances().length;
	const expectedCount = item.correctCount;
	
	console.log('');
	console.log('🔍 [L1T1] Checking:', item.name);
	console.log('Expected:', expectedCount, '| Found:', actualCount);
	
	if (actualCount === expectedCount) {
		// CORRECT ANSWER
		const baseScore = 100;
		const bonusScore = 50; // Bonus untuk jawaban benar
		lvl1t1_score += baseScore + bonusScore;
		lvl1t1_itemsCompleted++;
		lvl1t1_currentItem++;
		
		console.log('✅ [L1T1] CORRECT!', item.name);
		console.log('💰 Score: +' + (baseScore + bonusScore) + ' | Total:', lvl1t1_score);
		console.log('📊 Progress:', lvl1t1_itemsCompleted, '/5');
		console.log('');
		
		// Update UI
		lvl1t1_showFeedback(true, rt);
		lvl1t1_updateScore(rt);
		lvl1t1_updateProgress(rt);
		
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
			
			// Show completion screen
			setTimeout(() => {
				lvl1t1_showGameComplete(rt);
			}, 2000);
		} else {
			console.log('📝 Next task:', lvl1t1_items[lvl1t1_currentItem].name);
			console.log('💡 Hint: Count the', lvl1t1_items[lvl1t1_currentItem].name, 'in the room');
			
			// Update task display after feedback disappears
			setTimeout(() => {
				lvl1t1_updateCurrentTask(rt);
			}, 2000);
		}
	} else {
		// WRONG ANSWER
		console.log('❌ [L1T1] WRONG! Try again.');
		console.log('💡 Expected:', expectedCount, '| But found:', actualCount);
		console.log('💡 Hint: Look carefully, count the', item.name, 'in the room');
		console.log('');
		
		// Show detailed wrong feedback with counts
		const feedbackMessage = '❌ SALAH!\n\n' +
			'Item: ' + item.name + '\n' +
			'Seharusnya: ' + expectedCount + '\n' +
			'Yang dihitung: ' + actualCount + '\n\n' +
			'Coba hitung lagi dengan teliti!';
		
		alert(feedbackMessage);
		
		// Try to use Text object if exists
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
	globalThis.lvl1t1_checkAnswer = (itemIndex) => lvl1t1_checkAnswer(itemIndex);
	globalThis.lvl1t1_getStarRating = lvl1t1_getStarRating;
	globalThis.lvl1t1_showDetailView = (itemIndex) => lvl1t1_showDetailView(itemIndex);
	globalThis.lvl1t1_hideAllDetailViews = () => lvl1t1_hideAllDetailViews();
	globalThis.lvl1t1_updateUI = () => lvl1t1_updateUI();
	globalThis.lvl1t1_showFeedback = (isCorrect) => lvl1t1_showFeedback(isCorrect);
	
	console.log('✅ [L1T1] Game functions registered to global scope');
	console.log('Functions: lvl1t1_checkAnswer, lvl1t1_getStarRating, etc.');
	
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
