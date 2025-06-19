// Test script for Instant Note Pro Extension
// Run this in the browser console to test various scenarios

console.log('🧪 Instant Note Pro Extension Test Suite')
console.log('========================================')

// Test 1: Check if extension is loaded
function testExtensionLoaded() {
  console.log('✅ Test 1: Extension Loaded')
  console.log('- Content script should be running')
  console.log('- Look for "HighlightCapture mounted" in console')
  console.log('- Check if tooltip styles are injected')
  
  const styles = document.getElementById('instant-note-pro-styles')
  if (styles) {
    console.log('✅ Tooltip styles found')
  } else {
    console.log('❌ Tooltip styles not found')
  }
}

// Test 2: Test text selection
function testTextSelection() {
  console.log('\n✅ Test 2: Text Selection')
  console.log('- Select some text on this page')
  console.log('- Tooltip should appear above selection')
  console.log('- Tooltip should be positioned correctly')
  console.log('- Tooltip should have "Save Note (Cmd+1)" text')
}

// Test 3: Test keyboard shortcuts
function testKeyboardShortcuts() {
  console.log('\n✅ Test 3: Keyboard Shortcuts')
  console.log('- Select some text')
  console.log('- Press Ctrl+1 (or Cmd+1 on Mac)')
  console.log('- Note should be saved without tooltip click')
  console.log('- Success notification should appear')
}

// Test 4: Test tooltip positioning
function testTooltipPositioning() {
  console.log('\n✅ Test 4: Tooltip Positioning')
  console.log('- Select text at different positions:')
  console.log('  • Top of page')
  console.log('  • Middle of page')
  console.log('  • Bottom of page')
  console.log('  • Left edge')
  console.log('  • Right edge')
  console.log('- Tooltip should always be visible')
  console.log('- Tooltip should not be cut off')
}

// Test 5: Test edge cases
function testEdgeCases() {
  console.log('\n✅ Test 5: Edge Cases')
  console.log('- Test empty selection (should not show tooltip)')
  console.log('- Test whitespace-only selection')
  console.log('- Test very long text selection')
  console.log('- Test selection with special characters (emojis, etc.)')
  console.log('- Test selection in input fields (should be limited)')
  console.log('- Test selection with links')
}

// Test 6: Test popup functionality
function testPopup() {
  console.log('\n✅ Test 6: Popup Functionality')
  console.log('- Click extension icon in toolbar')
  console.log('- Popup should open')
  console.log('- Saved notes should be visible')
  console.log('- Search should work')
  console.log('- Dark mode toggle should work')
  console.log('- Import/export should work')
}

// Test 7: Test storage
function testStorage() {
  console.log('\n✅ Test 7: Storage')
  console.log('- Save a few notes')
  console.log('- Refresh the page')
  console.log('- Notes should persist')
  console.log('- Check Chrome storage sync')
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running all tests...\n')
  testExtensionLoaded()
  testTextSelection()
  testKeyboardShortcuts()
  testTooltipPositioning()
  testEdgeCases()
  testPopup()
  testStorage()
  console.log('\n🎉 Test suite complete!')
  console.log('Check the console for any errors or warnings.')
}

// Export functions for manual testing
window.InstantNoteProTests = {
  testExtensionLoaded,
  testTextSelection,
  testKeyboardShortcuts,
  testTooltipPositioning,
  testEdgeCases,
  testPopup,
  testStorage,
  runAllTests
}

console.log('📋 Test functions available:')
console.log('- InstantNoteProTests.runAllTests() - Run all tests')
console.log('- InstantNoteProTests.testExtensionLoaded() - Test extension loading')
console.log('- InstantNoteProTests.testTextSelection() - Test text selection')
console.log('- InstantNoteProTests.testKeyboardShortcuts() - Test keyboard shortcuts')
console.log('- InstantNoteProTests.testTooltipPositioning() - Test tooltip positioning')
console.log('- InstantNoteProTests.testEdgeCases() - Test edge cases')
console.log('- InstantNoteProTests.testPopup() - Test popup functionality')
console.log('- InstantNoteProTests.testStorage() - Test storage')

// Auto-run basic test
testExtensionLoaded() 