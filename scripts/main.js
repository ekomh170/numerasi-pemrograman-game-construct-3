
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

