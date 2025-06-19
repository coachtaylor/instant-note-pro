# Day 6 Testing Checklist

## 🧪 Cross-Browser Testing & Optimization

### Task 1: Test on 10+ Popular Websites

#### **Test Sites List:**
1. **Google** (google.com)
   - [ ] Text selection on search results
   - [ ] Text selection in search box
   - [ ] Tooltip positioning
   - [ ] Keyboard shortcuts (Ctrl+1)

2. **GitHub** (github.com)
   - [ ] Code selection in repositories
   - [ ] Text selection in README files
   - [ ] Issue/PR description selection
   - [ ] Comment text selection

3. **Stack Overflow** (stackoverflow.com)
   - [ ] Code block selection
   - [ ] Question/answer text selection
   - [ ] Comment selection
   - [ ] Tag selection

4. **Medium** (medium.com)
   - [ ] Article text selection
   - [ ] Code block selection
   - [ ] Comment selection
   - [ ] Navigation text selection

5. **Reddit** (reddit.com)
   - [ ] Post text selection
   - [ ] Comment selection
   - [ ] Subreddit description selection
   - [ ] Sidebar text selection

6. **YouTube** (youtube.com)
   - [ ] Video description selection
   - [ ] Comment selection
   - [ ] Channel description selection
   - [ ] Playlist description selection

7. **Twitter/X** (twitter.com)
   - [ ] Tweet text selection
   - [ ] Profile bio selection
   - [ ] Thread text selection
   - [ ] Reply text selection

8. **LinkedIn** (linkedin.com)
   - [ ] Post text selection
   - [ ] Profile description selection
   - [ ] Article text selection
   - [ ] Comment selection

9. **Wikipedia** (wikipedia.org)
   - [ ] Article text selection
   - [ ] Reference text selection
   - [ ] Table data selection
   - [ ] Navigation text selection

10. **Dev.to** (dev.to)
    - [ ] Article text selection
    - [ ] Code block selection
    - [ ] Comment selection
    - [ ] Tag selection

#### **Test Scenarios for Each Site:**
- [ ] **Basic Text Selection**: Select regular paragraph text
- [ ] **Code Selection**: Select code blocks or inline code
- [ ] **Link Text**: Select text that contains links
- [ ] **Form Text**: Select text in input fields (should be limited)
- [ ] **Dynamic Content**: Select text that loads dynamically
- [ ] **Iframe Content**: Test on sites with embedded content
- [ ] **Long Text**: Select very long passages
- [ ] **Special Characters**: Select text with emojis, symbols, etc.

#### **Tooltip Testing:**
- [ ] **Positioning**: Tooltip appears in correct position
- [ ] **Visibility**: Tooltip is visible and not cut off
- [ ] **Responsiveness**: Tooltip adapts to screen size
- [ ] **Z-index**: Tooltip appears above other content
- [ ] **Animation**: Smooth appearance/disappearance

#### **Keyboard Shortcuts:**
- [ ] **Ctrl+1**: Saves selected text
- [ ] **Cmd+1** (Mac): Saves selected text
- [ ] **Escape**: Dismisses tooltip
- [ ] **Enter**: Confirms save action

#### **Storage & Sync:**
- [ ] **Save Success**: Note appears in popup
- [ ] **Data Integrity**: All note data is preserved
- [ ] **Sync**: Notes sync across devices (if logged in)
- [ ] **Storage Limits**: Handle large amounts of data

### Task 2: Handle Special Cases (SPAs, React Sites)

#### **Single Page Applications:**
- [ ] **React Sites**: Test on React-based applications
- [ ] **Vue Sites**: Test on Vue.js applications
- [ ] **Angular Sites**: Test on Angular applications
- [ ] **Dynamic Routing**: Test on sites with client-side routing
- [ ] **State Management**: Test on sites with complex state

#### **Dynamic Content:**
- [ ] **Infinite Scroll**: Test on sites with infinite scroll
- [ ] **Lazy Loading**: Test on sites with lazy-loaded content
- [ ] **Real-time Updates**: Test on sites with live updates
- [ ] **WebSocket Content**: Test on sites with WebSocket data

#### **Iframe Handling:**
- [ ] **Embedded Content**: Test on sites with iframes
- [ ] **Cross-origin**: Test on sites with cross-origin iframes
- [ ] **Sandboxed**: Test on sites with sandboxed iframes
- [ ] **Multiple Iframes**: Test on sites with multiple iframes

### Task 3: Optimize Performance

#### **Performance Metrics:**
- [ ] **Load Time**: Extension loads in < 2 seconds
- [ ] **Text Capture**: Selection to save in < 100ms
- [ ] **Popup Open**: Popup opens in < 500ms
- [ ] **Search Response**: Search results in < 50ms
- [ ] **Storage Operations**: Save/load in < 200ms

#### **Bundle Size:**
- [ ] **Total Size**: Extension bundle < 2MB
- [ ] **Content Script**: < 500KB
- [ ] **Popup**: < 1MB
- [ ] **Background**: < 200KB

#### **Memory Usage:**
- [ ] **Memory Leaks**: No memory leaks detected
- [ ] **Garbage Collection**: Proper cleanup
- [ ] **Event Listeners**: Properly removed
- [ ] **DOM References**: Properly cleaned up

### Task 4: Fix Edge Case Bugs

#### **Text Selection Edge Cases:**
- [ ] **Empty Selection**: Handle empty text selection
- [ ] **Whitespace Only**: Handle whitespace-only selection
- [ ] **Very Long Text**: Handle extremely long selections
- [ ] **Special Characters**: Handle Unicode, emojis, etc.
- [ ] **HTML Content**: Handle HTML in selection
- [ ] **Nested Elements**: Handle complex DOM structures

#### **Positioning Issues:**
- [ ] **Viewport Edges**: Tooltip at screen edges
- [ ] **Scrolled Content**: Tooltip in scrolled pages
- [ ] **Fixed Elements**: Tooltip with fixed headers/footers
- [ ] **Overflow Hidden**: Tooltip with overflow hidden
- [ ] **Transform Elements**: Tooltip with CSS transforms

#### **CSS Conflicts:**
- [ ] **Site CSS**: Tooltip not affected by site styles
- [ ] **Z-index Conflicts**: Tooltip appears above all content
- [ ] **Font Conflicts**: Tooltip uses correct fonts
- [ ] **Color Conflicts**: Tooltip colors are visible
- [ ] **Animation Conflicts**: Tooltip animations work

## 🌅 Afternoon Tasks

### Task 5: Implement Error Tracking
### Task 6: Add Performance Monitoring
### Task 7: Create Debug Mode
### Task 8: Write Troubleshooting Guide

---

## 📝 Test Results Template

### Site: [Website Name]
**URL**: [Website URL]
**Date**: [Test Date]
**Tester**: [Your Name]

#### ✅ Working Features:
- [Feature 1]
- [Feature 2]

#### ❌ Issues Found:
- [Issue 1] - [Severity: High/Medium/Low]
- [Issue 2] - [Severity: High/Medium/Low]

#### 🔧 Notes:
[Additional observations, workarounds, etc.]

---

## 🚀 Ready to Start Testing!

**Next Steps:**
1. Load the extension in Chrome
2. Go to `chrome://extensions/`
3. Enable Developer mode
4. Load unpacked → Select `build/chrome-mv3-dev`
5. Start testing with the first website on the list 