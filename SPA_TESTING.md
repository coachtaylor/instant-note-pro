# ⚛️ SPA & Framework Testing Guide

## 🎯 Task 2: Handle Special Cases (SPAs, React Sites)

### **React Sites Testing**

#### **1. Create React App (CRA)**
**Test URL**: https://create-react-app.dev/
**Test Scenarios:**
- [ ] Select text in documentation
- [ ] Test on code examples
- [ ] Test during page transitions
- [ ] Test with React Router navigation

#### **2. Next.js Documentation**
**Test URL**: https://nextjs.org/docs
**Test Scenarios:**
- [ ] Select text in documentation
- [ ] Test on code blocks
- [ ] Test during client-side navigation
- [ ] Test with dynamic imports

#### **3. React Router Example**
**Test URL**: https://reactrouter.com/
**Test Scenarios:**
- [ ] Select text on different routes
- [ ] Test during route transitions
- [ ] Test with nested routes
- [ ] Test with dynamic routes

### **Vue.js Sites Testing**

#### **4. Vue.js Documentation**
**Test URL**: https://vuejs.org/guide/
**Test Scenarios:**
- [ ] Select text in documentation
- [ ] Test on code examples
- [ ] Test with Vue Router
- [ ] Test with Vuex state changes

#### **5. Nuxt.js Documentation**
**Test URL**: https://nuxt.com/docs
**Test Scenarios:**
- [ ] Select text in documentation
- [ ] Test on code blocks
- [ ] Test with SSR/SSG content
- [ ] Test with dynamic content

### **Angular Sites Testing**

#### **6. Angular Documentation**
**Test URL**: https://angular.io/docs
**Test Scenarios:**
- [ ] Select text in documentation
- [ ] Test on code examples
- [ ] Test with Angular Router
- [ ] Test with RxJS observables

### **Dynamic Content Testing**

#### **7. Infinite Scroll Sites**
**Test Scenarios:**
- [ ] Select text before loading more content
- [ ] Select text after loading more content
- [ ] Test during scroll events
- [ ] Test with virtual scrolling

#### **8. Real-time Update Sites**
**Test Scenarios:**
- [ ] Select text before updates
- [ ] Select text during updates
- [ ] Test with WebSocket data
- [ ] Test with polling updates

### **Iframe Handling**

#### **9. Sites with Embedded Content**
**Test Scenarios:**
- [ ] Select text in main page
- [ ] Select text in iframe content
- [ ] Test with cross-origin iframes
- [ ] Test with sandboxed iframes

#### **10. Multiple Iframe Sites**
**Test Scenarios:**
- [ ] Select text in different iframes
- [ ] Test iframe communication
- [ ] Test with nested iframes
- [ ] Test with dynamic iframe loading

## 🔧 Technical Challenges

### **React-Specific Issues:**
1. **Event Delegation**: React's synthetic events
2. **Virtual DOM**: Dynamic content updates
3. **State Management**: Redux/Zustand state changes
4. **Component Lifecycle**: Mount/unmount cycles
5. **Hooks**: useEffect cleanup

### **Vue-Specific Issues:**
1. **Reactivity System**: Vue's reactivity
2. **Template Compilation**: Vue templates
3. **Lifecycle Hooks**: Vue component lifecycle
4. **Composition API**: Vue 3 composition functions

### **Angular-Specific Issues:**
1. **Zone.js**: Angular's change detection
2. **Dependency Injection**: Angular services
3. **RxJS Observables**: Angular's reactive programming
4. **AOT Compilation**: Angular's ahead-of-time compilation

### **General SPA Issues:**
1. **Client-side Routing**: History API changes
2. **Dynamic Imports**: Code splitting
3. **State Management**: Global state changes
4. **Performance Optimization**: Lazy loading
5. **SEO Considerations**: Server-side rendering

## 🛠️ Solutions & Workarounds

### **For React Sites:**
```javascript
// Listen for React Router changes
window.addEventListener('popstate', handleRouteChange);

// Listen for React state changes
const observer = new MutationObserver(handleDOMChanges);
observer.observe(document.body, { childList: true, subtree: true });
```

### **For Vue Sites:**
```javascript
// Listen for Vue Router changes
window.addEventListener('popstate', handleRouteChange);

// Listen for Vue reactivity changes
const observer = new MutationObserver(handleDOMChanges);
observer.observe(document.body, { childList: true, subtree: true });
```

### **For Angular Sites:**
```javascript
// Listen for Angular Router changes
window.addEventListener('popstate', handleRouteChange);

// Listen for Angular change detection
const observer = new MutationObserver(handleDOMChanges);
observer.observe(document.body, { childList: true, subtree: true });
```

### **For Dynamic Content:**
```javascript
// Debounce selection events
let selectionTimeout;
const debouncedSelection = () => {
  clearTimeout(selectionTimeout);
  selectionTimeout = setTimeout(handleSelection, 100);
};

// Listen for dynamic content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Handle new content
      handleNewContent(mutation.addedNodes);
    }
  });
});
```

## 📊 Testing Checklist for SPAs

### **Basic SPA Functionality:**
- [ ] Text selection works on initial load
- [ ] Text selection works after navigation
- [ ] Text selection works with dynamic content
- [ ] Tooltip appears correctly in all scenarios
- [ ] Keyboard shortcuts work consistently

### **Route Changes:**
- [ ] Extension works after client-side navigation
- [ ] Extension works with browser back/forward
- [ ] Extension works with programmatic navigation
- [ ] Extension works with route parameters

### **Dynamic Content:**
- [ ] Extension works with lazy-loaded content
- [ ] Extension works with infinite scroll
- [ ] Extension works with real-time updates
- [ ] Extension works with WebSocket data

### **Performance:**
- [ ] Extension doesn't slow down SPA navigation
- [ ] Extension doesn't interfere with SPA performance
- [ ] Extension handles large DOM changes efficiently
- [ ] Extension doesn't cause memory leaks

### **Compatibility:**
- [ ] Extension works with React Router
- [ ] Extension works with Vue Router
- [ ] Extension works with Angular Router
- [ ] Extension works with custom routing solutions

## 🚨 Critical SPA Issues

### **High Priority:**
1. **Extension breaks after navigation** - Fix immediately
2. **Memory leaks on route changes** - Fix immediately
3. **Performance degradation** - Fix immediately
4. **Event listener conflicts** - Fix immediately

### **Medium Priority:**
1. **Tooltip positioning issues** - Fix before release
2. **Dynamic content not detected** - Fix before release
3. **State management conflicts** - Fix before release
4. **CSS conflicts with SPA styles** - Fix before release

### **Low Priority:**
1. **Minor performance optimizations** - Fix in future updates
2. **Edge case handling** - Fix in future updates
3. **Additional framework support** - Fix in future updates

## 🎯 Success Criteria for SPAs

The extension is ready for SPA support when:

- [ ] Works on React sites (Create React App, Next.js)
- [ ] Works on Vue sites (Vue.js, Nuxt.js)
- [ ] Works on Angular sites (Angular CLI, Angular Universal)
- [ ] Handles client-side routing correctly
- [ ] Handles dynamic content loading
- [ ] No memory leaks on navigation
- [ ] Performance is acceptable
- [ ] No conflicts with framework features 