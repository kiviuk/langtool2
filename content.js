// 
// Function to check if an element is a text input
function isTextField(el) {
    if (!el) return false;

    const tagName = el.tagName.toLowerCase();

  
    //  Check for standard text-entry tags
    const isTextArea = tagName === 'textarea';

    const isInput = tagName === 'input' && 
                    ['text', 'password', 'email', 'search', 'tel', 'url'].includes(el.type);


    // Check for modern "rich text" editors (like Gmail, Notion, Discord)
    const isEditable = el.contentEditable === 'true' || el.getAttribute('contenteditable') === 'true';

 QS
    return isInput || isTextArea || isEditable;
}

// Event: User clicks into or tabs into a field
document.addEventListener('focusin', () => {

    const activeEl = document.activeElement;

    if (isTextField(activeEl)) {
        console.log("Cursor is now inside a text field!");
        
        // Notify the State Machine
        browser.runtime.sendMessage({ 
            action: "TEXT_FIELD_FOCUSED" 
        }).then(response => {
            // The Brain replies with the current state (selected AI model)
            if (response && response.activeModel) {
                console.log("Current State: Using AI Model ->", response.activeModel);
            }
        }).catch(err => console.warn("Background script not ready yet."));
    }
});


// Event: User clicks away or leaves the field
document.addEventListener('focusout', () => {
    browser.runtime.sendMessage({ 
        action: "TEXT_FIELD_BLURRED" 
    }).catch(() => {/* Ignore errors if background is sleeping */});
});
