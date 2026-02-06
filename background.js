import { AI, UI, ACTIONS } from './constants.js';

console.log("Background script loaded.");

let activeModelId = AI.DEFAULT_MODEL;

// On startup, check storage. If empty, write the default to storage.
browser.storage.local.get('selectedModel').then(res => {
    const val = res.selectedModel || AI.DEFAULT_MODEL;
    activeModelId = val;
    browser.storage.local.set({ selectedModel: val });
});

browser.storage.onChanged.addListener((changes) => {
    if (changes.selectedModel) activeModelId = changes.selectedModel.newValue;
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
