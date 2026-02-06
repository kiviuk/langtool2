document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('model-select');

    AI_MODELS.forEach(groupData => {
        const group = document.createElement('optgroup');
        group.label = groupData.group;
        groupData.models.forEach(m => {
            const opt = new Option(m.label, m.id);
            group.appendChild(opt);
        });
        select.appendChild(group);
    });

    browser.storage.local.get('selectedModel').then(res => {
        if (res.selectedModel) select.value = res.selectedModel;
    });

    select.addEventListener('change', () => {
        browser.storage.local.set({ selectedModel: select.value });
        document.getElementById('status').textContent = "Saved.";
        setTimeout(() => document.getElementById('status').textContent = "", 1000);
    });
});
