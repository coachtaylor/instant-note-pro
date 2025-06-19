# 🌐 Website Testing Guide

## 🚀 How to Test on External Websites

### Step 1: Load the Extension
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `build/chrome-mv3-dev` folder
5. The extension should appear in your toolbar

### Step 2: Test Each Website

#### **1. Google (google.com)**
**Test Scenarios:**
- [ ] Search for "test" and select text from search results
- [ ] Try selecting text in the search box (should be limited)
- [ ] Test on Google News articles
- [ ] Test on Google Docs (if accessible)

**Potential Issues:**
- Google's dynamic content loading
- Search suggestions dropdown
- Google's own text selection handlers

#### **2. GitHub (github.com)**
**Test Scenarios:**
- [ ] Select code in repositories
- [ ] Select text in README files
- [ ] Select issue/PR descriptions
- [ ] Select comment text
- [ ] Test on GitHub Gist

**Potential Issues:**
- GitHub's syntax highlighting
- Code block formatting
- GitHub's own copy functionality
- Dark/light theme switching

#### **3. Stack Overflow (stackoverflow.com)**
**Test Scenarios:**
- [ ] Select code blocks in questions/answers
- [ ] Select question text
- [ ] Select answer text
- [ ] Select comment text
- [ ] Select tag text

**Potential Issues:**
- Stack Overflow's code highlighting
- MathJax equations
- Stack Overflow's own copy buttons
- Dynamic content loading

#### **4. Medium (medium.com)**
**Test Scenarios:**
- [ ] Select article text
- [ ] Select code blocks
- [ ] Select comment text
- [ ] Test on Medium's editor (if accessible)

**Potential Issues:**
- Medium's paywall content
- Medium's own highlighting features
- Dynamic article loading
- Medium's custom fonts

#### **5. Reddit (reddit.com)**
**Test Scenarios:**
- [ ] Select post text
- [ ] Select comment text
- [ ] Select subreddit descriptions
- [ ] Test on Reddit's new/old interface

**Potential Issues:**
- Reddit's dynamic content loading
- Reddit's own copy features
- Reddit's infinite scroll
- Reddit's comment threading

#### **6. YouTube (youtube.com)**
**Test Scenarios:**
- [ ] Select video descriptions
- [ ] Select comment text
- [ ] Select channel descriptions
- [ ] Select playlist descriptions

**Potential Issues:**
- YouTube's dynamic content
- YouTube's own text selection
- YouTube's comment system
- YouTube's accessibility features

#### **7. Twitter/X (twitter.com)**
**Test Scenarios:**
- [ ] Select tweet text
- [ ] Select profile bios
- [ ] Select thread text
- [ ] Select reply text

**Potential Issues:**
- Twitter's character limits
- Twitter's own copy features
- Twitter's dynamic loading
- Twitter's accessibility features

#### **8. LinkedIn (linkedin.com)**
**Test Scenarios:**
- [ ] Select post text
- [ ] Select profile descriptions
- [ ] Select article text
- [ ] Select comment text

**Potential Issues:**
- LinkedIn's professional features
- LinkedIn's own copy features
- LinkedIn's dynamic content
- LinkedIn's privacy settings

#### **9. Wikipedia (wikipedia.org)**
**Test Scenarios:**
- [ ] Select article text
- [ ] Select reference text
- [ ] Select table data
- [ ] Select navigation text

**Potential Issues:**
- Wikipedia's reference links
- Wikipedia's table formatting
- Wikipedia's dynamic content
- Wikipedia's accessibility features

#### **10. Dev.to (dev.to)**
**Test Scenarios:**
- [ ] Select article text
- [ ] Select code blocks
- [ ] Select comment text
- [ ] Select tag text

**Potential Issues:**
- Dev.to's syntax highlighting
- Dev.to's own copy features
- Dev.to's dynamic content
- Dev.to's community features

## 🔍 What to Look For

### ✅ Positive Indicators:
- Tooltip appears immediately after text selection
- Tooltip is positioned correctly (above selection)
- Tooltip is visible and not cut off
- Keyboard shortcuts work (Ctrl+1/Cmd+1)
- Success notification appears
- Notes appear in extension popup
- No conflicts with site's own features

### ❌ Issues to Watch For:
- Tooltip doesn't appear
- Tooltip appears in wrong position
- Tooltip is cut off or invisible
- Conflicts with site's text selection
- Performance issues (slow response)
- JavaScript errors in console
- Site's own features interfere
- Tooltip appears in input fields (shouldn't)

### 🐛 Common Problems:
1. **Z-index conflicts** - Site CSS overrides tooltip
2. **Event conflicts** - Site's event handlers interfere
3. **Dynamic content** - Content loads after extension
4. **CSS conflicts** - Site styles affect tooltip
5. **Performance issues** - Slow response on heavy sites
6. **Memory leaks** - Extension doesn't clean up properly

## 📊 Testing Checklist

For each website, check:

### Basic Functionality:
- [ ] Text selection works
- [ ] Tooltip appears
- [ ] Tooltip positioning is correct
- [ ] Keyboard shortcuts work
- [ ] Success notification appears
- [ ] Notes save to popup

### Edge Cases:
- [ ] Long text selections
- [ ] Text with special characters
- [ ] Text with links
- [ ] Text in different positions (top, bottom, edges)
- [ ] Text in scrollable areas
- [ ] Text in dynamic content

### Performance:
- [ ] Response time is fast (< 100ms)
- [ ] No memory leaks
- [ ] No console errors
- [ ] Extension doesn't slow down the page

### Compatibility:
- [ ] Works with site's features
- [ ] No conflicts with site's CSS
- [ ] No conflicts with site's JavaScript
- [ ] Works in different browsers

## 🚨 Critical Issues to Fix Immediately:

1. **Tooltip doesn't appear** - High priority
2. **Tooltip appears in input fields** - High priority
3. **Performance issues** - Medium priority
4. **CSS conflicts** - Medium priority
5. **Console errors** - Medium priority
6. **Memory leaks** - High priority

## 📝 Reporting Issues

When you find an issue, document:

1. **Website URL**
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Browser and version**
6. **Console errors (if any)**
7. **Screenshots (if helpful)**
8. **Severity level**

## 🎯 Success Criteria

The extension is ready for production when:

- [ ] Works on all 10 test websites
- [ ] No critical issues found
- [ ] Performance is acceptable (< 100ms response)
- [ ] No memory leaks
- [ ] No console errors
- [ ] User experience is smooth
- [ ] All edge cases handled 