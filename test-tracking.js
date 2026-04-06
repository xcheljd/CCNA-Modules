// Quick test script to verify tracking integration
// Run this in browser console after opening the app

// Test 1: Check if ActivityTracker is working
console.log('=== TRACKING TEST ===');

// Get initial state
const initialStreak = JSON.parse(localStorage.getItem('study-streak') || '{"currentStreak":0}');
const initialPerf = JSON.parse(localStorage.getItem('performance-history') || '{"daily":[]}');

console.log('Initial Streak:', initialStreak.currentStreak);
console.log('Initial Performance Snapshots:', initialPerf.daily.length);

// Simulate marking a video complete
console.log('\n--- Simulating video completion ---');
// This would normally be done through UI: ActivityTracker.recordVideoCompletion(1, 'videoId', true, modules);

// Check streak was recorded
const afterStreak = JSON.parse(localStorage.getItem('study-streak') || '{"currentStreak":0}');
const afterPerf = JSON.parse(localStorage.getItem('performance-history') || '{"daily":[]}');

console.log('After Activity Streak:', afterStreak.currentStreak);
console.log('After Activity Performance Snapshots:', afterPerf.daily.length);
console.log('Streak History:', afterStreak.streakHistory);

// Test 2: Verify streak increases on different days
const today = new Date().toISOString().split('T')[0];
console.log("\nToday's date:", today);
console.log('Last study date:', afterStreak.lastStudyDate);

console.log('\n=== TEST COMPLETE ===');
console.log('To test manually:');
console.log('1. Go to a module detail page');
console.log('2. Mark a video as complete');
console.log('3. Check Dashboard to see streak update');
console.log('4. Check Performance Charts to see data');
