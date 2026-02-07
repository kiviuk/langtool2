// The Options Logic

import { AI, OPTIONS_PAGE } from './constants.js';
import { AI_MODELS } from './models.js';

document.addEventListener('DOMContentLoaded', () => {
    const modelInput = document.getElementById('model-select');
    const apiKeyInput = document.getElementById('api-key');
    const darkModeToggle = document.getElementById('dark-mode');
    const statusEl = document.getElementById('status');

    // Helper functions
    const applyTheme = (isDark) => {
        document.body.classList.toggle('light-theme', !isDark);
    };

    const showStatus = () => {
        statusEl.textContent = "Saved.";
        setTimeout(() => {
          statusEl.textContent = ""; 
        }, OPTIONS_PAGE.TIMEOUT);
    };

    // 1. Populate the dropdown
    AI_MODELS.forEach(groupData => {
        const group = document.createElement('optgroup');
        group.label = groupData.group;
        groupData.models.forEach(m => {
            const opt = new Option(m.label, m.id);
            group.appendChild(opt);
        });
        modelInput.appendChild(group);
    });

    // 2. Simple Load
    browser.storage.local.get(['selectedModel', 'openRouterKey', 'darkMode']).then(res => {
        // We still use ?? just in case the user JUST installed and 
        // opened options before the background script finished its write.
        modelInput.value = res.selectedModel ?? AI.DEFAULT_MODEL;
        apiKeyInput.value = res.openRouterKey ?? "";
        
        const isDark = res.darkMode ?? true;
        darkModeToggle.checked = isDark;
        applyTheme(isDark);
    });

    // Watch for Model changes (from the options page)
    modelInput.addEventListener('change', () => {
        browser.storage.local.set({ selectedModel: modelInput.value });
        showStatus();
    });

    // Watch for API Key changes (from the options page)
    apiKeyInput.addEventListener('change', () => {
        browser.storage.local.set({ openRouterKey: apiKeyInput.value.trim() });
        showStatus();
    });

    darkModeToggle.addEventListener('change', () => {
        const isEnabled = darkModeToggle.checked;
        browser.storage.local.set({ darkMode: isEnabled });
        applyTheme(isEnabled);
        showStatus();
    });
});
