/* Static Help/Privacy pages share the user's local appearance preference. */
(()=>{'use strict';try{const theme=JSON.parse(localStorage.getItem('slotdesk-display')||'{}').theme;if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme;}catch(_){}})();
