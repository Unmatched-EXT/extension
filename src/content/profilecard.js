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
    card.className = 'um-profile-card rounded-lg';
    
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
                    <div class="font-bold text-sm text-zinc-100 truncate">${userData.user.username}</div>
                    <div class="text-xs text-zinc-400">${userData.user.title || 'Free'}</div>
                </div>
            </div>

            <div class="h-px bg-zinc-800 my-2"></div>

            <div class="flex items-center justify-between mb-2">
                <div>
                    <span class="text-xs text-zinc-400">K/D:</span>
                    <span class="text-sm text-zinc-200 ml-1">${kd}</span>
                </div>
                <div class="h-4 w-px bg-zinc-800 mx-2"></div>
                <div>
                    <span class="text-xs text-zinc-400">MMR:</span>
                    <span class="text-sm text-zinc-200 ml-1">${mmr}</span>
                </div>
            </div>

            <div class="h-px bg-zinc-800 my-2"></div>

            <div class="games-section">
                ${gameModes.length > 0 ? createGameSection('CS2', gameModes) : 
                    '<div class="text-sm text-zinc-400 text-center">No stats available</div>'}
            </div>
        </div>
    `;

    return card;
}

function initializeProfileCards() {
    if (window._profileCardHandler) {
        document.removeEventListener('mouseover', window._profileCardHandler);
    }
    removeProfileCards();

    let hoverTimeout;
    let currentCard = null;
    let isHoveringCard = false;

    window._profileCardHandler = async (e) => {
        const userLink = e.target.closest('a[href^="/user/"]');
        if (!userLink && !e.target.closest('.um-profile-card')) {
            if (currentCard && !isHoveringCard) {
                currentCard.remove();
                currentCard = null;
            }
            return;
        }

        if (e.target.closest('.um-profile-card')) {
            isHoveringCard = true;
            return;
        }

        clearTimeout(hoverTimeout);
        if (currentCard) {
            currentCard.remove();
            currentCard = null;
        }

        hoverTimeout = setTimeout(async () => {
            const userId = userLink.href.split('/user/')[1];
            if (!userId) return;

            const userData = await fetchUserData(userId);
            if (!userData) return;

            const card = createProfileCard(userData);
            if (!card) return;

            card.style.position = 'fixed';
            card.style.zIndex = '9999';
            document.body.appendChild(card);

            const updateCardPosition = (e) => {
                const x = e.clientX;
                const y = e.clientY;
                const cardRect = card.getBoundingClientRect();
                
                const SCREEN_PADDING = 20;
                const rightOverflow = x + cardRect.width + SCREEN_PADDING > window.innerWidth;
                const bottomOverflow = y + cardRect.height + SCREEN_PADDING > window.innerHeight;
                
                card.style.left = rightOverflow 
                    ? `${window.innerWidth - cardRect.width - SCREEN_PADDING}px` 
                    : `${x + SCREEN_PADDING}px`;
                card.style.top = bottomOverflow 
                    ? `${window.innerHeight - cardRect.height - SCREEN_PADDING}px` 
                    : `${y + SCREEN_PADDING}px`;
            };

            updateCardPosition(e);
            document.addEventListener('mousemove', updateCardPosition);
            currentCard = card;

            card.addEventListener('mouseleave', () => {
                isHoveringCard = false;
                if (!isHoveringCard) {
                    card.remove();
                    currentCard = null;
                }
            });

            userLink.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', updateCardPosition);
                if (!isHoveringCard) {
                    card.remove();
                    currentCard = null;
                }
            }, { once: true });
        }, 1000);
    };

    document.addEventListener('mouseover', window._profileCardHandler);
}

function removeProfileCards() {
    const cards = document.querySelectorAll('.um-profile-card');
    cards.forEach(card => card.remove());
}

const style = document.createElement('style');
style.textContent = `
    .um-profile-card {
        background: rgb(24 24 27 / 0.95);
        backdrop-filter: blur(8px);
        color: rgb(244 244 245);
        min-width: 300px;
        max-width: 360px;
        width: max-content;
        opacity: 0;
        animation: fadeIn 0.2s forwards;
        border-radius: 8px;
        border: 1px solid rgb(39 39 42);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .game-section {
        transition: background-color 0.2s;
        border: 1px solid rgb(39 39 42);
        background: rgb(24 24 27);
        border-radius: 0.5rem;
    }

    .game-section > div:not(:first-child) {
        border-top: 1px solid rgb(39 39 42);
    }

    .um-profile-card:hover {
        border-color: rgb(63 63 70);
    }

    .game-section:hover {
        background: rgb(39 39 42);
        border-color: rgb(63 63 70);
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(style);

initializeProfileCards();

window.profilecard = {
    _initialized: true
}; 