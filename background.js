import { AI, UI, ACTIONS } from './constants.js';

console.log("Background script loaded.");

// 1. Initialize with defaults immediately
let activeModelId = AI.DEFAULT_MODEL;
let openRouterKey = ""; // Local cache for the key

// 2. Set defaults in storage ONLY ONCE (for the Options UI)
browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get(['selectedModel', 'darkMode']).then(res => {
        const defaults = {};
        if (res.selectedModel === undefined) defaults.selectedModel = AI.DEFAULT_MODEL;
        if (res.darkMode === undefined)      defaults.darkMode = true;
        
        if (Object.keys(defaults).length > 0) {
            browser.storage.local.set(defaults);
        }
    });
});

// 3. Load user preferences
browser.storage.local.get(['selectedModel', 'openRouterKey']).then(res => {
    if (res.selectedModel) activeModelId = res.selectedModel;
    if (res.openRouterKey) openRouterKey = res.openRouterKey;
});

// 4. Watch for future changes
browser.storage.onChanged.addListener((changes) => {
    if (changes.selectedModel) activeModelId = changes.selectedModel.newValue;
    if (changes.openRouterKey) openRouterKey = changes.openRouterKey.newValue;
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === ACTIONS.FOCUS) {
        console.log("Observer detected text field on tab: " + sender.tab.id);
        
        // Set the Badge
        browser.browserAction.setBadgeText({ text: UI.BADGE_TEXT, tabId: sender.tab.id });
        browser.browserAction.setBadgeBackgroundColor({ color: UI.BADGE_COLOR });
        
        // Send State back to Observer
        sendResponse({ activeModel: activeModelId });
    } 
    else if (message.action === ACTIONS.BLUR) {
        browser.browserAction.setBadgeText({ text: "", tabId: sender.tab.id });
    }
    return true; // Keeps the messaging channel open for async response
});
