(async () => {
    const src = browser.runtime.getURL('content.js');
    await import(src);
})();
