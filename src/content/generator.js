function generateRandomString(length = 10) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function createMailTmAccount() {
    try {
        const API_BASE_URL = 'https://api.mail.tm';
        const domainsResponse = await fetch(`${API_BASE_URL}/domains`);
        const domains = await domainsResponse.json();
        const domain = domains['hydra:member'][0].domain;

        const username = await window.utils.generateRandomString();
        const password = await window.utils.generateRandomString(12);
        const address = `${username}@${domain}`;

        const accountResponse = await fetch(`${API_BASE_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        const accountData = await accountResponse.json();

        const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        const tokenData = await tokenResponse.json();

        return { 
            email: address,
            password: password,
            token: tokenData.token,
            id: accountData.id
        };
    } catch (error) {
        window.toast.error('Error creating email account');
        return null;
    }
}

async function checkEmailForConfirmation(email, token) {
    try {
        window.toast.info('Checking for confirmation email...');

        const API_BASE_URL = 'https://api.mail.tm';
        const response = await fetch(`${API_BASE_URL}/messages`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        const messages = data['hydra:member'];

        for (const message of messages) {
            const messageResponse = await fetch(`${API_BASE_URL}/messages/${message.id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const fullMessage = await messageResponse.json();

            if (message.subject === 'Confirm your Email' && !message.seen) {
                await fetch(`${API_BASE_URL}/messages/${message.id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ seen: true })
                });

                const content = fullMessage.text || fullMessage.html || message.intro;
                const match = content.match(/https:\/\/unmatched\.gg\/confirm\/[a-f0-9]{64}/);
                
                if (match) {
                    window.open(match[0], '_blank');
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        return false;
    }
}

function waitForRegistration() {
    return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('/api/user/register')) {
                    observer.disconnect();
                    resolve();
                    break;
                }
            }
        });
        observer.observe({ entryTypes: ['resource'] });
    });
}

async function fillRegistrationForm(accountData) {
    if (window.location.pathname !== '/register') {
        window.location.href = '/register';
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const setInputValue = (input, value) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const fillInput = async (selector, value) => {
        for (let i = 0; i < 50; i++) {
            const input = document.querySelector(selector);
            if (input) {
                setInputValue(input, value);
                return true;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        return false;
    };

    await Promise.all([
        fillInput('input[name="username"]', accountData.username),
        fillInput('input[name="password"]', accountData.password),
        fillInput('input[name="passwordRepeat"]', accountData.password),
        fillInput('input[name="email"]', accountData.email)
    ]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const selectRandomCountry = async () => {
        const countryButton = document.querySelector('button[role="combobox"]');
        if (countryButton) {
            countryButton.click();
            await new Promise(r => setTimeout(r, 500));
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            if (options.length > 0) {
                const randomOption = options[Math.floor(Math.random() * options.length)];
                randomOption.click();
            }
        }
    };
    await selectRandomCountry();

    await new Promise(resolve => setTimeout(resolve, 500));

    const termsCheckbox = document.querySelector('button[role="checkbox"][id="terms"]');
    if (termsCheckbox) {
        termsCheckbox.click();
    }

    window.toast.info('Please complete captcha and press register');

    waitForRegistration().then(() => {
        setTimeout(async () => {
            const maxAttempts = 30;
            let attempts = 0;
            
            const checkEmail = async () => {
                if (attempts >= maxAttempts) return;
                const found = await checkEmailForConfirmation(accountData.email, accountData.token);
                if (!found && attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkEmail, 3000);
                }
            };
            checkEmail();
        }, 1000);
    });
}

async function generateUsername() {
    try {
        const response = await fetch('https://api.diddy.quest/api/gamertag.php');
        const data = await response.json();
        
        if (data.success && data.gamertag) {
            const randomNum = Math.floor(Math.random() * 99) + 1;
            return `${data.gamertag}${randomNum}`;
        } else {
            return generateFallbackUsername();
        }
    } catch (error) {
        return generateFallbackUsername();
    }
}

function generateFallbackUsername() {
    const adjectives = ['Swift', 'Brave', 'Silent', 'Shadow', 'Dark', 'Light', 'Storm', 'Fire', 'Ice', 'Wind'];
    const nouns = ['Warrior', 'Hunter', 'Knight', 'Ninja', 'Dragon', 'Wolf', 'Eagle', 'Tiger', 'Bear', 'Lion'];
    const randomNum = Math.floor(Math.random() * 99) + 1;
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${randomNum}`;
}

async function generateAccount() {
    const mailAccount = await createMailTmAccount();
    if (!mailAccount) return null;

    const username = await generateUsername();
    const password = await window.utils.generateRandomString(16);

    const accountData = {
        username,
        password,
        email: mailAccount.email,
        emailPassword: mailAccount.password,
        token: mailAccount.token
    };

    localStorage.setItem('unmatched_ext_account', JSON.stringify(accountData));
    
    const savedAccounts = JSON.parse(localStorage.getItem('um_saved_accounts') || '[]');
    savedAccounts.push({
        username: username,
        password: password,
        email: mailAccount.email,
        emailPassword: mailAccount.password,
        temporary: true,
        timestamp: Date.now(),
        tokens: {
            um_language: localStorage.getItem('um_language'),
            um_refresh_token: '',
            um_token: '',
            um_cache_token: ''
        }
    });
    localStorage.setItem('um_saved_accounts', JSON.stringify(savedAccounts));
    
    if (window.accountManager && typeof window.accountManager.updateAccountList === 'function') {
        window.accountManager.updateAccountList();
    }
    
    if (window.toast) {
        window.toast.success('Account saved to Account Manager');
    }

    if (window.location.pathname !== '/register') {
        window.location.href = '/register';
    } else {
        fillRegistrationForm(accountData);
    }

    return accountData;
}

async function checkAndFillForm() {
    if (window.location.pathname === '/register') {
        const storedData = localStorage.getItem('unmatched_ext_account');
        if (storedData) {
            const accountData = JSON.parse(storedData);
            localStorage.removeItem('unmatched_ext_account');
            await fillRegistrationForm(accountData);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndFillForm);
} else {
    checkAndFillForm();
}

window.generator = {
    generateAccount
}; 