function hideAds() {
    const style = document.createElement('style');
    style.id = 'unmatched-ad-blocker';
    style.textContent = `
        div[class*="flex"][class*="justify-center"][class*="items-center"] > a[href*="/api/campaign/"],
        div[class*="flex"][class*="justify-center"][class*="items-center"]:has(> a[href*="/api/campaign/"]),
        div[class*="flex flex-row justify-center items-center w-full gap-2"],
        a[href*="/api/campaign/"],
        div:has(> a[href*="/api/campaign/"]) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

function showAds() {
    const style = document.getElementById('unmatched-ad-blocker');
    if (style) {
        style.remove();
    }
}

function toggleAdBlocker(enabled) {
    window.state.adBlockerEnabled = enabled;
    localStorage.setItem('adBlockerEnabled', enabled);

    if (enabled) {
        hideAds();
        window.toast.show('Ad blocker enabled', 'success');
    } else {
        showAds();
        window.toast.show('Ad blocker disabled', 'info');
    }
}

function createAdBlockerToggle() {
    const adBlockerSection = document.createElement('div');
    adBlockerSection.className = 'unmatched-ext-section';

    const adBlockerTitle = document.createElement('div');
    adBlockerTitle.className = 'unmatched-ext-section-title';
    adBlockerTitle.textContent = 'Ad Blocker';

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'unmatched-ext-button-group';

    const toggleButton = document.createElement('button');
    toggleButton.className = `unmatched-ext-button-toggle ${window.state.adBlockerEnabled ? 'enabled' : 'disabled'}`;
    toggleButton.textContent = window.state.adBlockerEnabled ? 'Enabled' : 'Disabled';
    toggleButton.onclick = () => {
        const newState = !window.state.adBlockerEnabled;
        toggleButton.className = `unmatched-ext-button-toggle ${newState ? 'enabled' : 'disabled'}`;
        toggleButton.textContent = newState ? 'Enabled' : 'Disabled';
        toggleAdBlocker(newState);
    };

    buttonGroup.appendChild(toggleButton);
    adBlockerSection.appendChild(adBlockerTitle);
    adBlockerSection.appendChild(buttonGroup);

    return adBlockerSection;
}

function initializeAdBlocker() {
    if (window.state?.adBlockerEnabled) {
        hideAds();
    }
}

window.adblocker = {
    createAdBlockerToggle,
    toggleAdBlocker,
    hideAds,
    showAds,
    initializeAdBlocker
}; 