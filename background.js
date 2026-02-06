console.log("Background script loaded.");

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.status === "typing") {
        console.log("The background script knows the user is in a text field on tab: " + sender.tab.id);
        
        // Example: Change the extension icon color to show it's active
        browser.browserAction.setBadgeText({text: "!", tabId: sender.tab.id});
    } else {
        browser.browserAction.setBadgeText({text: "", tabId: sender.tab.id});
    }
});

let activeModelId = "google/gemini-2.0-flash-001";

browser.storage.local.get('selectedModel').then(res => {
    if (res.selectedModel) activeModelId = res.selectedModel;
});

browser.storage.onChanged.addListener((changes) => {
    if (changes.selectedModel) activeModelId = changes.selectedModel.newValue;
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TEXT_FIELD_FOCUSED") {
        browser.browserAction.setBadgeText({text: "AI", tabId: sender.tab.id});
        browser.browserAction.setBadgeBackgroundColor({color: "#4CAF50"});
        sendResponse({ activeModel: activeModelId });
    } 
    else if (message.action === "TEXT_FIELD_BLURRED") {
        browser.browserAction.setBadgeText({text: "", tabId: sender.tab.id});
    }
});
