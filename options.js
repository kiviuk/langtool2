// The Options Logic

import { AI, OPTIONS_PAGE } from './constants.js';
import { AI_MODELS } from './models.js';

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('model-select');

    // 1. Populate the dropdown
    AI_MODELS.forEach(groupData => {
        const group = document.createElement('optgroup');
        group.label = groupData.group;
        groupData.models.forEach(m => {
            const opt = new Option(m.label, m.id);
            group.appendChild(opt);
        });
        select.appendChild(group);
    });

    // 2. Get, Set UI, and Sync
    browser.storage.local.get('selectedModel').then(res => {
        const val = res.selectedModel || AI.DEFAULT_MODEL;
        select.value = val;
        browser.storage.local.set({ selectedModel: val });
    });

    // Watch for changes (from the options page)
    select.addEventListener('change', () => {
        const statusEl = document.getElementById('status');

        browser.storage.local.set({ selectedModel: select.value });

        statusEl.textContent = "Saved.";

        setTimeout(() => {
          statusEl.textContent = ""
        }, OPTIONS_PAGE.TIMEOUT);

    });
});
