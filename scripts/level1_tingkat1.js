// ========================================
// LEVEL 1 TINGKAT 1 - LOGIKA GAME
// Kamar Tidur - Game Menghitung Benda
// Pengembang: Eko Muchamad Haryono & Anang Febryan Sutarja
// Tanggal: 10 November 2025
// ========================================

// Referensi runtime (akan di-set di runOnStartup)
let lvl1t1_runtime = null;

// Variabel state game
let lvl1t1_currentItem = 0;
let lvl1t1_score = 0;
let lvl1t1_itemsCompleted = 0;
let lvl1t1_isProcessing = false;
let lvl1t1_clickSequence = [];

// Konfigurasi item
const lvl1t1_items = [
{ name: 'Selimut', detailName: '1selimutdetaillvl1', correctCount: 1 },
{ name: 'Bantal',  detailName: '2bantaldetaillvl1',  correctCount: 2 },
{ name: 'Boneka',  detailName: '3bonekadetaillvl1',  correctCount: 3 },
{ name: 'Baju',    detailName: '4bajudetaillvl1',    correctCount: 4 },
{ name: 'Buku',    detailName: '5bukudetaillvl1',    correctCount: 5 }
];

const lvl1t1_answerBoxes = [
'1kotakjawabanlvl1t1',
'2kotakjawabanlvl1t1',
'3kotakjawabanlvl1t1',
'4kotakjawabanlvl1t1',
'5kotakjawabanlvl1t1'
];

const lvl1t1_bendaIcons = [
'benda1lvl1',
'benda2lvl1',
'benda3lvl1',
'benda4lvl1',
'benda5lvl1'
];

// Timer variables
let lvl1t1_timeGame = 60;
let lvl1t1_timerInterval = null;
let lvl1t1_timerActive = false;

function lvl1t1_formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function lvl1t1_updateTimeDisplay(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) {
		console.log('❌ [L1T1] No runtime available for updateTimeDisplay');
		return;
	}
	
	const timeText = lvl1t1_formatTime(lvl1t1_timeGame);
	
	// Update Text object jika ada
	try {
		const txtTimeGame = rt.objects.txtTimeGame;
		if (txtTimeGame) {
			const instances = txtTimeGame.getAllInstances();
			console.log('🔍 [L1T1] txtTimeGame instances found:', instances.length);
			
			if (instances.length > 0) {
				const textInstance = instances[0];
				const displayText = '⏱️ ' + timeText;
				
				console.log('📝 [L1T1] Setting text to:', displayText);
				
				// Try different methods to set text
				if (textInstance.text !== undefined) {
					textInstance.text = displayText;
				} else if (textInstance.setText) {
					textInstance.setText(displayText);
				}
				
				// Ubah warna berdasarkan waktu tersisa
				if (lvl1t1_timeGame <= 10) {
					textInstance.colorRgb = [1, 0, 0]; // Merah jika <= 10 detik
					console.log('🔴 [L1T1] Timer RED (≤10s)');
				} else if (lvl1t1_timeGame <= 30) {
					textInstance.colorRgb = [1, 1, 0]; // Kuning jika <= 30 detik
					console.log('🟡 [L1T1] Timer YELLOW (≤30s)');
				} else {
					textInstance.colorRgb = [1, 1, 1]; // Putih (normal)
				}
			} else {
				console.log('⚠️ [L1T1] No txtTimeGame instances in layout');
			}
		} else {
			console.log('⚠️ [L1T1] txtTimeGame object not found in runtime.objects');
		}
	} catch (e) {
		console.error('❌ [L1T1] Error updating time display:', e);
		console.log('⏱️ [L1T1] Time:', timeText);
	}
}

function lvl1t1_startTimer(runtime) {
	const rt = runtime || lvl1t1_runtime;
	
	console.log('🚀 [L1T1] ===== STARTING TIMER =====');
	console.log('🚀 [L1T1] Runtime available:', !!rt);
	console.log('🚀 [L1T1] Initial time: 60 seconds');
	
	lvl1t1_timerActive = true;
	lvl1t1_timeGame = 60;
	
	// Initial update
	console.log('🚀 [L1T1] Calling initial updateTimeDisplay...');
	lvl1t1_updateTimeDisplay(rt);
	
	if (lvl1t1_timerInterval) {
		console.log('⚠️ [L1T1] Clearing existing timer interval');
		clearInterval(lvl1t1_timerInterval);
	}
	
	lvl1t1_timerInterval = setInterval(() => {
		if (!lvl1t1_timerActive) {
			console.log('⏸️ [L1T1] Timer paused, skipping update');
			return;
		}
		
		lvl1t1_timeGame--;
		console.log('⏱️ [L1T1] Tick -', lvl1t1_formatTime(lvl1t1_timeGame));
		lvl1t1_updateTimeDisplay(rt);
		
		if (lvl1t1_timeGame <= 0) {
			lvl1t1_timerActive = false;
			clearInterval(lvl1t1_timerInterval);
			console.log('⏰ [L1T1] TIME UP!');
			lvl1t1_onTimeUp(rt);
		}
	}, 1000);
	
	console.log('✅ [L1T1] Timer interval set, ticking every 1 second');
	console.log('⏱️ [L1T1] Timer started: 60 seconds');
}

function lvl1t1_stopTimer() {
	lvl1t1_timerActive = false;
	if (lvl1t1_timerInterval) clearInterval(lvl1t1_timerInterval);
	console.log('⏱️ [L1T1] Timer stopped at:', lvl1t1_formatTime(lvl1t1_timeGame));
}

function lvl1t1_onTimeUp(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	console.log('⏰ [L1T1] Time up!');
	alert('⏰ Waktu Habis!\n\nWaktu 1 menit sudah selesai.\nCoba lagi!');
	rt.goToLayout("Level1_Tingkat1");
}

// Icon movement
let lvl1t1_movedBendaIcons = [];

function lvl1t1_moveBendaToBox(itemIndex, numberValue, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	const bendaIconName = lvl1t1_bendaIcons[itemIndex];
	const targetBoxName = lvl1t1_answerBoxes[numberValue - 1];
	
	try {
		const bendaIconObject = rt.objects[bendaIconName];
		if (!bendaIconObject) return;
		
		const bendaInstances = bendaIconObject.getAllInstances();
		if (bendaInstances.length === 0) return;
		
		const bendaIcon = bendaInstances[0];
		
		const boxObject = rt.objects[targetBoxName];
		if (!boxObject) return;
		
		const boxInstances = boxObject.getAllInstances();
		if (boxInstances.length === 0) return;
		
		const targetBox = boxInstances[0];
		
		bendaIcon.x = targetBox.x;
		bendaIcon.y = targetBox.y;
		
		const originalWidth = bendaIcon.width;
		const originalHeight = bendaIcon.height;
		const targetSize = 60;
		const scaleRatio = targetSize / Math.max(originalWidth, originalHeight);
		
		bendaIcon.width = originalWidth * scaleRatio;
		bendaIcon.height = originalHeight * scaleRatio;
		bendaIcon.zElevation = targetBox.zElevation + 10;
		bendaIcon.isVisible = true;
		bendaIcon.opacity = 1;
		
		lvl1t1_movedBendaIcons[itemIndex] = { icon: bendaIcon };
		
		console.log('✅ [L1T1] Icon moved to box', numberValue);
	} catch (e) {
		console.error('❌ [L1T1] Error moving icon:', e.message);
	}
}

function lvl1t1_updateAnswerBox(boxIndex, numberValue, runtime) {
	lvl1t1_moveBendaToBox(boxIndex, numberValue, runtime);
}

function lvl1t1_resetAllBendaIcons() {
	const rt = lvl1t1_runtime;
	if (!rt) return;
	
	lvl1t1_bendaIcons.forEach((bendaIconName) => {
		try {
			const bendaIconObject = rt.objects[bendaIconName];
			if (!bendaIconObject) return;
			
			const instances = bendaIconObject.getAllInstances();
			if (instances.length === 0) return;
			
			instances[0].isVisible = true;
			instances[0].opacity = 1;
		} catch (e) {}
	});
	
	lvl1t1_movedBendaIcons = [];
	console.log('↩️ [L1T1] Icons reset');
}

// Detail views
function lvl1t1_hideAllDetailViews(runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	lvl1t1_items.forEach(item => {
		try {
			const objectClass = rt.objects[item.detailName];
			if (objectClass) {
				objectClass.getAllInstances().forEach(inst => inst.isVisible = false);
			}
		} catch (e) {}
	});
	
	console.log('👁️ [L1T1] All details hidden');
}

function lvl1t1_showDetailView(itemIndex, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	const item = lvl1t1_items[itemIndex];
	
	try {
		const objectClass = rt.objects[item.detailName];
		if (objectClass) {
			const instances = objectClass.getAllInstances();
			if (instances.length > 0) {
				const detailSprite = instances[0];
				
				const origX = detailSprite.x;
				const origY = detailSprite.y;
				const origW = detailSprite.width;
				const origH = detailSprite.height;
				const origZ = detailSprite.zElevation;
				
				detailSprite.x = 640;
				detailSprite.y = 360;
				detailSprite.width = 400;
				detailSprite.height = 400;
				detailSprite.zElevation = 1000;
				detailSprite.isVisible = true;
				
				console.log('👁️ [L1T1] Showing detail popup:', item.detailName);
				
				setTimeout(() => {
					detailSprite.isVisible = false;
					detailSprite.x = origX;
					detailSprite.y = origY;
					detailSprite.width = origW;
					detailSprite.height = origH;
					detailSprite.zElevation = origZ;
				}, 3000);
			}
		}
	} catch (e) {
		console.error('❌ [L1T1] Error showing detail:', e.message);
	}
}

// Game logic
function lvl1t1_checkAnswer(numberValue, runtime) {
	const rt = runtime || lvl1t1_runtime;
	if (!rt) return;
	
	if (lvl1t1_isProcessing) return;
	
	if (lvl1t1_itemsCompleted >= 5) {
		alert('Game completed! Score: ' + lvl1t1_score);
		return;
	}
	
	lvl1t1_isProcessing = true;
	
	const item = lvl1t1_items[lvl1t1_currentItem];
	const correctAnswer = item.correctCount;
	
	console.log('🔢 [L1T1] Answer clicked:', numberValue, '| Correct:', correctAnswer);
	
	if (numberValue === correctAnswer) {
		lvl1t1_score += 150;
		
		const boxIndex = lvl1t1_itemsCompleted;
		lvl1t1_updateAnswerBox(boxIndex, numberValue, rt);
		
		lvl1t1_itemsCompleted++;
		
		console.log('✅ [L1T1] CORRECT! Score:', lvl1t1_score, '| Progress:', lvl1t1_itemsCompleted, '/5');
		
		lvl1t1_showDetailView(lvl1t1_currentItem, rt);
		lvl1t1_showFeedback(true, rt);
		lvl1t1_updateScore(rt);
		lvl1t1_updateProgress(rt);
		
		lvl1t1_currentItem++;
		
		if (lvl1t1_itemsCompleted === 5) {
			lvl1t1_stopTimer();
			
			console.log('🎉 [L1T1] GAME COMPLETED!');
			
			setTimeout(() => {
				lvl1t1_showGameComplete(rt);
			}, 3000);
		} else {
			setTimeout(() => {
				lvl1t1_updateCurrentTask(rt);
			}, 2000);
		}
	} else {
		console.log('❌ [L1T1] WRONG!');
		
		alert('❌ SALAH!\n\nTugas: Hitung ' + item.name + '\nJawaban Kamu: ' + numberValue + '\nJawaban Benar: ' + correctAnswer);
		lvl1t1_showFeedback(false, rt);
	}
	
	lvl1t1_isProcessing = false;
}

function lvl1t1_getStarRating(finalScore) {
	if (finalScore >= 600) return 3;
	if (finalScore >= 450) return 2;
	if (finalScore >= 300) return 1;
	return 0;
}

// UI updates
function lvl1t1_updateUI(runtime) {
	const rt = runtime || lvl1t1_runtime;
	lvl1t1_updateScore(rt);
	lvl1t1_updateProgress(rt);
	lvl1t1_updateCurrentTask(rt);
	lvl1t1_hideFeedback(rt);
}

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
	}
}

function lvl1t1_showFeedback(isCorrect, runtime) {
	const rt = runtime || lvl1t1_runtime;
	
	if (isCorrect) {
		alert('✅ BENAR!\n\nScore: ' + lvl1t1_score + '\nProgress: ' + lvl1t1_itemsCompleted + '/5');
	}
	
	if (!rt) return;
	
	const txtFeedback = rt.objects.txtFeedback;
	if (txtFeedback) {
		const instances = txtFeedback.getAllInstances();
		if (instances.length > 0) {
			const feedbackText = instances[0];
			
			if (isCorrect) {
				feedbackText.text = '✅ BENAR!';
				feedbackText.colorRgb = [0, 1, 0];
			} else {
				feedbackText.text = '❌ SALAH!';
				feedbackText.colorRgb = [1, 0, 0];
			}
			
			feedbackText.isVisible = true;
			
			setTimeout(() => {
				feedbackText.isVisible = false;
			}, 2000);
		}
	}
}

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

function lvl1t1_showGameComplete(runtime) {
	const rt = runtime || lvl1t1_runtime;
	const stars = lvl1t1_getStarRating(lvl1t1_score);
	const starDisplay = '⭐'.repeat(stars);
	
	lvl1t1_stopTimer();
	
	try {
		localStorage.setItem('lvl1t1_finalScore', lvl1t1_score.toString());
		localStorage.setItem('lvl1t1_finalStars', stars.toString());
		localStorage.setItem('lvl1t1_finalTime', lvl1t1_timeGame.toString());
		console.log('💾 [L1T1] Saved to localStorage');
	} catch (e) {
		console.warn('⚠️ [L1T1] Failed to save:', e.message);
	}
	
	console.log('🎉 [L1T1] Final Score:', lvl1t1_score, '| Stars:', stars);
	
	const confirmed = confirm('🎉 SELAMAT!\n\nLEVEL 1 TINGKAT 1 SELESAI!\n\n' + 
		starDisplay + '\n\n' +
		'Final Score: ' + lvl1t1_score + '\n' +
		'Rating: ' + stars + ' stars\n\n' +
		'Klik OK untuk melihat reward');
	
	if (confirmed && rt) {
		console.log('🚀 [L1T1] Going to reward page...');
		rt.goToLayout("Level1_Tingkat1_Reward");
	}
}

// Initialization
runOnStartup(async runtime =>
{
	console.log('🚀 [L1T1] ========================================');
	console.log('🚀 [L1T1] level1_tingkat1.js LOADED!');
	console.log('🚀 [L1T1] Initializing Level 1 Tingkat 1...');
	console.log('🚀 [L1T1] ========================================');
	
	lvl1t1_runtime = runtime;
	
	globalThis.lvl1t1_checkAnswer = (numberValue) => lvl1t1_checkAnswer(numberValue, runtime);
	globalThis.lvl1t1_getStarRating = lvl1t1_getStarRating;
	globalThis.lvl1t1_showDetailView = (itemIndex) => lvl1t1_showDetailView(itemIndex, runtime);
	globalThis.lvl1t1_hideAllDetailViews = () => lvl1t1_hideAllDetailViews(runtime);
	globalThis.lvl1t1_updateUI = () => lvl1t1_updateUI(runtime);
	globalThis.lvl1t1_showFeedback = (isCorrect) => lvl1t1_showFeedback(isCorrect, runtime);
	globalThis.lvl1t1_updateAnswerBox = (boxIndex, numberValue) => lvl1t1_updateAnswerBox(boxIndex, numberValue, runtime);
	globalThis.lvl1t1_resetAllBendaIcons = lvl1t1_resetAllBendaIcons;
	globalThis.lvl1t1_moveBendaToBox = (itemIndex, numberValue) => lvl1t1_moveBendaToBox(itemIndex, numberValue, runtime);
	globalThis.lvl1t1_startTimer = () => lvl1t1_startTimer(runtime);
	globalThis.lvl1t1_stopTimer = lvl1t1_stopTimer;
	globalThis.lvl1t1_updateTimeDisplay = () => lvl1t1_updateTimeDisplay(runtime);
	
	console.log('✅ [L1T1] All functions registered to global scope');
	console.log('📦 Available functions:');
	console.log('   - lvl1t1_checkAnswer(numberValue)');
	console.log('   - lvl1t1_startTimer()');
	console.log('   - lvl1t1_stopTimer()');
	console.log('   - lvl1t1_updateTimeDisplay()');
	console.log('⏱️ Timer: 60 seconds countdown with color warnings');
	console.log('');
	console.log('💡 TIP: If timer doesn\'t start, call lvl1t1_startTimer() manually');
	
	runtime.addEventListener("beforeprojectstart", () => {
		console.log('🎬 [L1T1] beforeprojectstart event fired!');
		OnBeforeProjectStart_L1T1(runtime);
	});
	
	// Fallback: Start timer after 3 seconds if not started
	setTimeout(() => {
		console.log('⏰ [L1T1] Fallback check: timerActive =', lvl1t1_timerActive);
		console.log('⏰ [L1T1] Fallback check: runtime exists =', !!lvl1t1_runtime);
		
		if (!lvl1t1_timerActive && lvl1t1_runtime) {
			console.log('⚠️ [L1T1] Timer not started by events, trying fallback...');
			
			// Cek apakah sedang di layout yang benar
			const currentLayout = lvl1t1_runtime.layout;
			if (currentLayout) {
				console.log('🗺️ [L1T1] Current layout:', currentLayout.name);
				
				if (currentLayout.name === "Level1_Tingkat1" ||
				    currentLayout.name === "Level1Tingkat1" ||
				    currentLayout.name === "ES_Level1_Tingkat1") {
					console.log('✅ [L1T1] Correct layout detected, starting timer now!');
					lvl1t1_startTimer(runtime);
				} else {
					console.log('⏭️ [L1T1] Wrong layout, skipping timer');
				}
			}
		} else if (lvl1t1_timerActive) {
			console.log('✅ [L1T1] Timer already running!');
		}
	}, 3000);
});

export async function OnBeforeProjectStart_L1T1(runtime)
{
	console.log('🔧 [L1T1] OnBeforeProjectStart_L1T1 called');
	
	// Set runtime global immediately
	lvl1t1_runtime = runtime;
	
	runtime.addEventListener("beforelayoutstart", (e) => {
		console.log('📋 [L1T1] Layout starting:', e.layout.name);
		
		// Cek semua kemungkinan nama layout
		if (e.layout.name !== "Level1_Tingkat1" && 
		    e.layout.name !== "Level1Tingkat1" && 
		    e.layout.name !== "ES_Level1_Tingkat1") {
			console.log('⚠️ [L1T1] Skipping layout:', e.layout.name);
			return;
		}
		
		console.log('✅ [L1T1] Initializing game for layout:', e.layout.name);
		
		lvl1t1_currentItem = 0;
		lvl1t1_score = 0;
		lvl1t1_itemsCompleted = 0;
		lvl1t1_isProcessing = false;
		lvl1t1_clickSequence = [];
		lvl1t1_movedBendaIcons = [];
		
		lvl1t1_timeGame = 60;
		lvl1t1_timerActive = false;
		if (lvl1t1_timerInterval) clearInterval(lvl1t1_timerInterval);
		
		setTimeout(() => {
			lvl1t1_resetAllBendaIcons();
		}, 100);
		
		console.log('=================================');
		console.log('🎮 [L1T1] GAME INITIALIZED');
		console.log('Level: 1 - Tingkat 1 (Kamar Tidur)');
		console.log('=================================');
		console.log('📝 Current task:', lvl1t1_items[lvl1t1_currentItem].name);
		console.log('⏱️ Timer: 60 seconds (1 minute)');
		console.log('🎯 Goal: Complete all 5 items');
		console.log('=================================');
		
		lvl1t1_hideAllDetailViews(runtime);
		lvl1t1_updateUI(runtime);
		
		setTimeout(() => {
			console.log('🚀 [L1T1] Starting timer now...');
			lvl1t1_startTimer(runtime);
		}, 500);
	});
}