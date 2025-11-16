// ========================================
// TIMER HELPER untuk Level 1 Tingkat 1
// Membuat Text object untuk timer secara otomatis
// ========================================

// Fungsi untuk membuat Text object timer
function createTimerTextObject(runtime) {
	try {
		// Pastikan ada object type "Text" di project
		const textType = runtime.objects.Text;
		if (!textType) {
			console.error('❌ [Timer] Object type "Text" tidak ada di project!');
			console.error('💡 Buat object type "Text" dulu di project properties');
			return null;
		}
		
		// Cari layer "UI" atau layer pertama yang ada
		let targetLayer = null;
		const layout = runtime.layout;
		
		if (layout) {
			// Coba cari layer "UI"
			for (let i = 0; i < layout.layers.length; i++) {
				const layer = layout.layers[i];
				if (layer.name === "UI" || layer.name === "ui" || layer.name === "Layer 0") {
					targetLayer = layer;
					break;
				}
			}
			
			// Jika tidak ada, gunakan layer pertama
			if (!targetLayer && layout.layers.length > 0) {
				targetLayer = layout.layers[0];
			}
		}
		
		if (!targetLayer) {
			console.error('❌ [Timer] Tidak ada layer tersedia!');
			return null;
		}
		
		console.log('📍 [Timer] Membuat Text object di layer:', targetLayer.name);
		
		// Buat instance Text baru
		const timerText = textType.createInstance(
			targetLayer.name,
			1150, // x position (kanan atas)
			50    // y position
		);
		
		if (timerText) {
			// Setup properti
			timerText.text = "00:60";
			timerText.fontSize = 36;
			timerText.colorRgb = [1, 1, 1]; // Putih
			timerText.isVisible = true;
			timerText.zElevation = 100;
			
			console.log('✅ [Timer] Text object berhasil dibuat!');
			console.log('   Position: (1150, 50)');
			console.log('   Font Size: 36px');
			console.log('   Color: White');
			console.log('   Layer:', targetLayer.name);
			
			return timerText;
		} else {
			console.error('❌ [Timer] Gagal membuat instance Text');
		}
	} catch (e) {
		console.error('❌ [Timer] Error:', e.message);
		console.error(e.stack);
	}
	
	return null;
}

// Export fungsi ke global scope
globalThis.createTimerTextObject = createTimerTextObject;

console.log('✅ Timer Helper loaded - Function "createTimerTextObject(runtime)" tersedia');
