const DEFAULT_COLORS = {
    darkBorder: '42.8 96.3% 58%',
    darkRing: '42.8 96.3% 58%',
    darkAccent: '42.8 96.3% 58%',
    lightAccent: '42.8 96.3% 58%',
    lightBorder: '42.8 96.3% 58%',
    lightInput: '42.8 96.3% 58%',
    lightRing: '42.8 96.3% 58%'
};

function updateWebsiteColors(colors) {
    const indexStyle = Array.from(document.styleSheets)
        .find(sheet => sheet.href && /index-[a-zA-Z0-9]+\.css/.test(sheet.href));

    if (!indexStyle) return;

    try {
        Array.from(indexStyle.cssRules).forEach(rule => {
            if (rule.selectorText === '.dark') {
                rule.style.setProperty('--border', colors.darkBorder);
                rule.style.setProperty('--ring', colors.darkRing);
                rule.style.setProperty('--accent', colors.darkAccent);
            } else if (rule.selectorText === ':root') {
                rule.style.setProperty('--accent', colors.lightAccent);
                rule.style.setProperty('--border', colors.lightBorder);
                rule.style.setProperty('--input', colors.lightInput);
                rule.style.setProperty('--ring', colors.lightRing);
            }
        });
    } catch (error) {
        console.error('Error updating CSS:', error);
    }
}

function updateBackground(backgroundUrl, showToast = true) {
    try {
        const indexStyle = Array.from(document.styleSheets)
            .find(sheet => sheet.href && sheet.href.includes('index'));

        if (!indexStyle) {
            if (showToast) window.toast.show('Index stylesheet not found', 'error');
            return;
        }

        const blur = parseInt(window.state.customBackgroundBlur) || 0;
        const darkness = parseInt(window.state.customBackgroundDarkness) || 0;
        
        if (showToast) window.toast.show('Background updated successfully', 'success');

        Array.from(indexStyle.cssRules).forEach(rule => {
            if (rule.selectorText === '.bg') {
                rule.style.setProperty('background-image', `url(${backgroundUrl})`);
                rule.style.setProperty('background-size', 'cover');
                rule.style.setProperty('background-position', 'center');
                rule.style.setProperty('backdrop-filter', `blur(${blur}px) brightness(${100 - darkness}%)`);
            }
        });

    } catch (error) {
        if (showToast) window.toast.show('Error updating background', 'error');
    }
}

function handleNewBackground(file, preview) {
    const reader = new FileReader();
    reader.onload = (event) => {
        window.state.customBackground = event.target.result;
        
        if (preview) {
            preview.style.backgroundImage = `url(${event.target.result})`;
            preview.style.display = 'block';
            preview.parentElement.classList.add('has-preview');
            
            const uploadContent = preview.parentElement.querySelector('.unmatched-ext-upload-content');
            if (uploadContent) uploadContent.style.display = 'none';
        }

        chrome.storage.local.set({ 
            customBackground: window.state.customBackground,
            customBackgroundBlur: window.state.customBackgroundBlur,
            customBackgroundDarkness: window.state.customBackgroundDarkness
        }, () => {
            if (window.state.websiteModifierEnabled) {
                updateBackground(window.state.customBackground);
            }
        });
    };
    reader.readAsDataURL(file);
}

function resetBackground() {
    window.state = window.state || {};
    window.state.customBackground = '';
    window.state.customBackgroundBlur = 0;
    window.state.customBackgroundDarkness = 0;
    chrome.storage.local.set({
        customBackground: '',
        customBackgroundBlur: 0,
        customBackgroundDarkness: 0
    }, () => {
        updateBackground('/assets/vertigo_tint.png');
    });
}

function createColorPicker(label, defaultValue) {
    const container = document.createElement('div');
    container.className = 'unmatched-ext-color-picker';

    const labelElement = document.createElement('div');
    labelElement.className = 'unmatched-ext-field-label';
    labelElement.textContent = label;

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'unmatched-ext-color-input';
    input.value = defaultValue;
    
    input.addEventListener('input', (e) => {
        const hsl = hexToHSL(e.target.value);
        const colorValue = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        window.state.tempAccentColor = e.target.value;
        
        if (window.state.websiteModifierEnabled) {
            updateWebsiteColors({
                darkBorder: colorValue,
                darkRing: colorValue,
                darkAccent: colorValue,
                lightAccent: colorValue,
                lightBorder: colorValue,
                lightInput: colorValue,
                lightRing: colorValue
            });
        }
    });

    input.addEventListener('change', (e) => {
        const hsl = hexToHSL(e.target.value);
        const colorValue = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        window.state.tempAccentColor = e.target.value;
        
        if (window.state.websiteModifierEnabled) {
            updateWebsiteColors({
                darkBorder: colorValue,
                darkRing: colorValue,
                darkAccent: colorValue,
                lightAccent: colorValue,
                lightBorder: colorValue,
                lightInput: colorValue,
                lightRing: colorValue
            });
        }
    });

    container.appendChild(labelElement);
    container.appendChild(input);
    return container;
}

function hexToHSL(hex) {
    let r = parseInt(hex.substring(1,3), 16) / 255;
    let g = parseInt(hex.substring(3,5), 16) / 255;
    let b = parseInt(hex.substring(5,7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function createBackgroundUploader() {
    const container = document.createElement('div');
    container.className = 'unmatched-ext-background-uploader';

    const dropZone = document.createElement('div');
    dropZone.className = 'unmatched-ext-drop-zone';

    const uploadContent = document.createElement('div');
    uploadContent.className = 'unmatched-ext-upload-content';
    uploadContent.style.display = 'flex';
    uploadContent.style.flexDirection = 'column';
    uploadContent.style.alignItems = 'center';
    uploadContent.style.justifyContent = 'center';
    uploadContent.style.height = '100%';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-cloud-arrow-up';

    const text = document.createElement('span');
    text.textContent = 'Drag & Drop or Click to Upload';

    const info = document.createElement('div');
    info.className = 'unmatched-ext-file-info';
    info.textContent = 'Supports images and GIFs';

    const preview = document.createElement('div');
    preview.className = 'unmatched-ext-preview';
    preview.style.display = 'none';
    
    if (window.state?.customBackground) {
        preview.style.backgroundImage = `url(${window.state.customBackground})`;
        preview.style.display = 'block';
        dropZone.classList.add('has-preview');
        uploadContent.style.display = 'none';
    }

    uploadContent.appendChild(icon);
    uploadContent.appendChild(text);
    uploadContent.appendChild(info);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'unmatched-ext-file-input';
    fileInput.accept = 'image/*';

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = 'rgb(63 63 70)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = 'rgb(39 39 42)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = 'rgb(39 39 42)';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleNewBackground(file, preview);
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleNewBackground(file, preview);
        }
    });

    const slidersGroup = document.createElement('div');
    slidersGroup.className = 'unmatched-ext-slider-group';

    const blurContainer = document.createElement('div');
    blurContainer.className = 'unmatched-ext-slider-container';

    const blurLabel = document.createElement('div');
    blurLabel.className = 'unmatched-ext-slider-label';
    blurLabel.innerHTML = 'Blur <span class="unmatched-ext-slider-value">0px</span>';

    const blurSlider = document.createElement('input');
    blurSlider.type = 'range';
    blurSlider.className = 'unmatched-ext-slider';
    blurSlider.min = '0';
    blurSlider.max = '20';
    blurSlider.value = window.state?.customBackgroundBlur || '0';

    const darknessContainer = document.createElement('div');
    darknessContainer.className = 'unmatched-ext-slider-container';

    const darknessLabel = document.createElement('div');
    darknessLabel.className = 'unmatched-ext-slider-label';
    darknessLabel.innerHTML = 'Darkness <span class="unmatched-ext-slider-value">0%</span>';

    const darknessSlider = document.createElement('input');
    darknessSlider.type = 'range';
    darknessSlider.className = 'unmatched-ext-slider';
    darknessSlider.min = '0';
    darknessSlider.max = '100';
    darknessSlider.value = window.state?.customBackgroundDarkness || '0';

    let updateTimeout;
    const debouncedUpdate = (value, type) => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            if (window.state.websiteModifierEnabled && window.state.customBackground) {
                updateBackground(window.state.customBackground);
            }
        }, 200);

        if (type === 'blur') {
            window.state.customBackgroundBlur = value;
            blurLabel.querySelector('.unmatched-ext-slider-value').textContent = `${value}px`;
        } else {
            window.state.customBackgroundDarkness = value;
            darknessLabel.querySelector('.unmatched-ext-slider-value').textContent = `${value}%`;
        }
    };

    blurSlider.oninput = (e) => {
        const value = e.target.value;
        blurLabel.querySelector('.unmatched-ext-slider-value').textContent = `${value}px`;
        window.state.customBackgroundBlur = value;
        if (window.state.websiteModifierEnabled && window.state.customBackground) {
            updateBackground(window.state.customBackground, false);
        }
    };

    blurSlider.onmouseup = () => {
        if (window.state.websiteModifierEnabled && window.state.customBackground) {
            updateBackground(window.state.customBackground, true);
        }
    };

    darknessSlider.oninput = (e) => {
        const value = e.target.value;
        darknessLabel.querySelector('.unmatched-ext-slider-value').textContent = `${value}%`;
        window.state.customBackgroundDarkness = value;
        if (window.state.websiteModifierEnabled && window.state.customBackground) {
            updateBackground(window.state.customBackground, false);
        }
    };

    darknessSlider.onmouseup = () => {
        if (window.state.websiteModifierEnabled && window.state.customBackground) {
            updateBackground(window.state.customBackground, true);
        }
    };

    blurContainer.appendChild(blurLabel);
    blurContainer.appendChild(blurSlider);
    darknessContainer.appendChild(darknessLabel);
    darknessContainer.appendChild(darknessSlider);
    slidersGroup.appendChild(blurContainer);
    slidersGroup.appendChild(darknessContainer);

    dropZone.appendChild(uploadContent);
    dropZone.appendChild(preview);
    dropZone.appendChild(fileInput);

    container.appendChild(dropZone);
    container.appendChild(slidersGroup);

    return container;
}

function createSliderWithLabel(label, slider) {
    const container = document.createElement('div');
    container.className = 'unmatched-ext-slider-container';

    const labelElement = document.createElement('div');
    labelElement.className = 'unmatched-ext-field-label';
    labelElement.textContent = label;

    container.appendChild(labelElement);
    container.appendChild(slider);
    return container;
}

function initializeState() {
    chrome.storage.local.get([
        'customBackground',
        'customBackgroundBlur',
        'customBackgroundDarkness',
        'websiteModifierEnabled',
        'accentColor',
        'profileCardsEnabled',
        'adBlockerEnabled'
    ], (result) => {
        window.state = {
            customBackground: result.customBackground || '',
            customBackgroundBlur: result.customBackgroundBlur || 0,
            customBackgroundDarkness: result.customBackgroundDarkness || 0,
            websiteModifierEnabled: result.websiteModifierEnabled || false,
            accentColor: result.accentColor || '#2FEEFF',
            profileCardsEnabled: result.profileCardsEnabled || false,
            adBlockerEnabled: result.adBlockerEnabled || false
        };

        if (window.state.websiteModifierEnabled) {
            applyStoredSettings();
        }
        if (window.state.profileCardsEnabled) {
            window.profilecard.initializeProfileCards();
        }
        if (window.state.adBlockerEnabled) {
            hideAds();
        }
    });
}

function applyStoredSettings() {
    chrome.storage.local.get([
        'customBackground',
        'accentColor'
    ], (result) => {
        if (result.customBackground) {
            updateBackground(result.customBackground);
        }
        if (result.accentColor) {
            const hsl = hexToHSL(result.accentColor);
            const colorValue = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
            updateWebsiteColors({
                darkBorder: colorValue,
                darkRing: colorValue,
                darkAccent: colorValue,
                lightAccent: colorValue,
                lightBorder: colorValue,
                lightInput: colorValue,
                lightRing: colorValue
            });
        }
    });
}

function toggleModifier(enabled) {
    window.state.websiteModifierEnabled = enabled;
    chrome.storage.local.set({ websiteModifierEnabled: enabled }, () => {
        if (enabled) {
            applyStoredSettings();
        } else {
            updateBackground('/assets/vertigo_tint.png');
            updateWebsiteColors(DEFAULT_COLORS);
        }
    });
}

function saveSettings() {
    const settings = {
        customBackground: window.state.tempBackground || window.state.customBackground || '',
        customBackgroundBlur: window.state.customBackgroundBlur || 0,
        customBackgroundDarkness: window.state.customBackgroundDarkness || 0,
        accentColor: window.state.tempAccentColor || window.state.accentColor || '#2FEEFF'
    };

    window.state = {
        ...window.state,
        customBackground: settings.customBackground,
        accentColor: settings.accentColor
    };

    chrome.storage.local.set(settings, () => {
        window.toast.show('Settings saved successfully', 'success');
    });
}

function toggleProfileCards(enabled) {
    window.state.profileCardsEnabled = enabled;
    
    chrome.storage.local.set({ profileCardsEnabled: enabled }, () => {
        if (enabled) {
            window.profilecard.initializeProfileCards();
            window.toast.show('Profile cards enabled', 'success');
        } else {
            window.profilecard.removeProfileCards();
            window.toast.show('Profile cards disabled', 'info');
        }
    });
}

function initializeProfileCards() {
    if (!window.state.profileCardsEnabled) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('.profile-link')) {
                    createProfileCard(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll('.profile-link').forEach(createProfileCard);
}

function removeProfileCards() {
    const cards = document.querySelectorAll('.um-profile-card');
    cards.forEach(card => card.remove());
}

async function fetchUserData(userId) {
    try {
        const [userResponse, statsResponse] = await Promise.all([
            fetch(`https://unmatched.gg/api/user/${userId}`),
            fetch(`https://unmatched.gg/api/stats/user/${userId}`)
        ]);
        
        const userData = await userResponse.json();
        const statsData = await statsResponse.json();
        
        return {
            user: userData.user,
            stats: statsData
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

function createGameModeRow(level, rank, gamemode, matches, winRate) {
    return `
        <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-2">
                <div class="flex items-center">
                    <img src="https://unmatched.gg/assets/levels/${level}.png" class="w-6 h-6" alt="Level ${level}">
                    <img src="https://unmatched.gg/assets/ranks/${rank}.png" class="w-6 h-6 -ml-1" alt="Rank ${rank}">
                </div>
                <span class="text-base">${gamemode}</span>
            </div>
            <div class="text-right">
                <div class="text-sm">Matches ${matches}</div>
                <div class="text-sm text-green-400">Win % ${winRate}%</div>
            </div>
        </div>
    `;
}

function createGameSection(game, modes) {
    return `
        <div class="game-section rounded-lg bg-[#1a1b2e] p-3">
            <div class="text-sm font-medium text-[#ffd700] mb-2">${game}</div>
            ${modes.map(mode => createGameModeRow(
                mode.level, 
                mode.rank, 
                mode.gamemode, 
                mode.matches, 
                mode.winRate
            )).join('')}
        </div>
    `;
}

function createProfileCard(userData) {
    if (window.location.pathname.startsWith('/user/')) return null;

    const card = document.createElement('div');
    card.className = 'um-profile-card rounded-lg bg-[#252850] border border-white/10 shadow-[.1em_.1em_1em_0_#00000042]';
    
    const stats = Array.isArray(userData.stats) ? userData.stats : [];
    
    const gameModes = stats.map(stat => ({
        level: stat.level || 1,
        rank: stat.rank || 1,
        gamemode: stat.gamemodeName,
        matches: (stat.wins || 0) + (stat.losses || 0),
        winRate: stat.wins && (stat.wins + stat.losses) > 0 ? 
            Math.round((stat.wins / (stat.wins + stat.losses)) * 100) : 0
    }));

    const kd = stats.length > 0 ? 
        (stats.reduce((sum, stat) => sum + (stat.kills || 0), 0) / 
        Math.max(1, stats.reduce((sum, stat) => sum + (stat.deaths || 0), 0))).toFixed(2) : '0';

    const mmr = stats.length > 0 ? 
        Math.max(...stats.map(stat => Math.round(stat.elo || 0))) : 0;

    card.innerHTML = `
        <div class="flex flex-col p-3">
            <div class="flex items-center gap-2">
                <img src="https://unmatched.gg/api/${userData.user.avatar}" class="w-8 h-8 rounded" alt="Avatar">
                <div class="flex-1 truncate">
                    <div class="font-bold text-sm truncate">${userData.user.username}</div>
                    <div class="text-xs opacity-70">${userData.user.title || 'Free'}</div>
                </div>
            </div>

            <div class="h-px bg-white/10 my-2"></div>

            <div class="flex items-center justify-between mb-2">
                <div>
                    <span class="text-xs opacity-70">K/D:</span>
                    <span class="text-sm ml-1">${kd}</span>
                </div>
                <div class="h-4 w-px bg-white/10 mx-2"></div>
                <div>
                    <span class="text-xs opacity-70">MMR:</span>
                    <span class="text-sm ml-1">${mmr}</span>
                </div>
            </div>

            <div class="h-px bg-white/10 my-2"></div>

            <div class="games-section">
                ${gameModes.length > 0 ? createGameSection('CS2', gameModes) : 
                    '<div class="text-sm opacity-70 text-center">No stats available</div>'}
            </div>
        </div>
    `;

    return card;
}

initializeState();

window.modifier = {
    createColorPicker,
    createBackgroundUploader,
    updateWebsiteColors,
    updateBackground,
    handleNewBackground,
    resetBackground,
    saveSettings,
    toggleModifier,
    toggleProfileCards
}; 