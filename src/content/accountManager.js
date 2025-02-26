function decodeToken(token) {
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload;
    } catch (error) {
        return null;
    }
}

async function fetchUserData(userId) {
    try {
        const response = await fetch(`https://unmatched.gg/api/user/${userId}`);
        const data = await response.json();
        
        if (!data || !data.user) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
}

function createAccountManager() {
    const container = document.createElement('div');
    container.className = 'unmatched-ext-account-manager';
    
    const header = document.createElement('div');
    header.className = 'unmatched-ext-header';
    
    const title = document.createElement('div');
    title.className = 'unmatched-ext-title';
    title.textContent = 'Temporary Accounts';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'unmatched-ext-close';
    closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    closeButton.onclick = () => container.style.display = 'none';
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    const content = document.createElement('div');
    content.className = 'unmatched-ext-content';

    const accountList = document.createElement('div');
    accountList.className = 'unmatched-ext-account-list';

    const saveTemp = document.createElement('button');
    saveTemp.className = 'unmatched-ext-button save-account';
    saveTemp.innerHTML = '<i class="fa-solid fa-plus mr-2"></i>Save Current Account';
    saveTemp.onclick = saveTemporaryAccount;

    content.appendChild(accountList);
    content.appendChild(saveTemp);
    
    container.appendChild(header);
    container.appendChild(content);

    return container;
}

function showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.unmatched-ext-toast');
    const offset = existingToasts.length * 60;

    const toast = document.createElement('div');
    toast.className = `unmatched-ext-toast ${type}`;
    toast.textContent = message;
    toast.style.bottom = `${16 + offset}px`;
    
    document.body.appendChild(toast);
    

    toast.offsetHeight;
    toast.classList.add('show');

    existingToasts.forEach((existingToast, index) => {
        const currentBottom = parseInt(existingToast.style.bottom || '16');
        existingToast.style.bottom = `${currentBottom + 60}px`;
        existingToast.style.opacity = '0';
        setTimeout(() => existingToast.remove(), 300);
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function saveTemporaryAccount() {
    try {
        const tokens = {
            um_language: localStorage.getItem('um_language'),
            um_refresh_token: localStorage.getItem('um_refresh_token'),
            um_token: localStorage.getItem('um_token'),
            um_cache_token: localStorage.getItem('um_cache_token')
        };

        if (!tokens.um_token) {
            window.toast.error('No active account found');
            return;
        }

        const decoded = await decodeToken(tokens.um_token);
        const userId = decoded['unmatched.UserId'];

        const response = await fetch(`https://unmatched.gg/api/user/${userId}`);
        const userData = await response.json();
        const username = userData.user.username;

        const savedAccounts = JSON.parse(localStorage.getItem('um_saved_accounts') || '[]');
        const accountExists = savedAccounts.some(account => account.username === username);

        if (accountExists) {
            window.toast.warning('Account already saved');
            return;
        }

        const accountData = {
            tokens,
            username: username,
            temporary: true,
            timestamp: Date.now()
        };

        savedAccounts.push(accountData);
        localStorage.setItem('um_saved_accounts', JSON.stringify(savedAccounts));
        updateAccountList();
        window.toast.success('Account saved successfully');

    } catch (error) {
        window.toast.error('Error saving account');
    }
}

function createAccountItem(account) {
    const item = document.createElement('div');
    item.className = 'unmatched-ext-account-item';

    const info = document.createElement('div');
    info.className = 'unmatched-ext-account-info';

    const username = document.createElement('div');
    username.className = 'unmatched-ext-account-username';
    username.textContent = account.username;

    const type = document.createElement('div');
    type.className = 'unmatched-ext-account-type';
    type.textContent = account.temporary ? 'Temporary' : 'Permanent';
    
    if (account.email && account.password) {
        const generatedBadge = document.createElement('span');
        generatedBadge.className = 'unmatched-ext-account-badge';
        generatedBadge.textContent = 'Generated';
        type.appendChild(generatedBadge);
    }

    const actions = document.createElement('div');
    actions.className = 'unmatched-ext-account-actions';

    if (account.email && account.password) {
        const viewButton = document.createElement('button');
        viewButton.className = 'unmatched-ext-button-icon';
        viewButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
        viewButton.title = 'View credentials';
        viewButton.onclick = (e) => {
            e.stopPropagation();
            
            const modal = document.createElement('div');
            modal.className = 'unmatched-ext-credentials-modal';
            modal.onclick = (e) => e.stopPropagation();
            
            const modalHeader = document.createElement('div');
            modalHeader.className = 'unmatched-ext-header';
            
            const modalTitle = document.createElement('div');
            modalTitle.className = 'unmatched-ext-title';
            modalTitle.textContent = 'Account Credentials';
            
            const modalClose = document.createElement('button');
            modalClose.className = 'unmatched-ext-close';
            modalClose.innerHTML = '<i class="fa-solid fa-times"></i>';
            modalClose.onclick = () => modal.remove();
            
            modalHeader.appendChild(modalTitle);
            modalHeader.appendChild(modalClose);
            
            const modalBody = document.createElement('div');
            modalBody.className = 'unmatched-ext-body';
            
            const fields = [
                { label: 'Username', value: account.username },
                { label: 'Password', value: account.password },
                { label: 'Email', value: account.email },
                { label: 'Email Password', value: account.emailPassword }
            ];
            
            fields.forEach(field => {
                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'unmatched-ext-field';
                
                const label = document.createElement('div');
                label.className = 'unmatched-ext-field-label';
                label.textContent = field.label;
                
                const value = document.createElement('div');
                value.className = 'unmatched-ext-field-value';
                value.textContent = field.value;
                
                const copyButton = document.createElement('button');
                copyButton.className = 'unmatched-ext-copy-button';
                copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
                copyButton.onclick = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(field.value);
                    copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
                    }, 1000);
                };
                
                fieldDiv.appendChild(label);
                fieldDiv.appendChild(value);
                fieldDiv.appendChild(copyButton);
                modalBody.appendChild(fieldDiv);
            });
            
            modal.appendChild(modalHeader);
            modal.appendChild(modalBody);
            document.body.appendChild(modal);
        };
        actions.appendChild(viewButton);
    }

    if (account.temporary) {
        const switchButton = document.createElement('button');
        switchButton.className = 'unmatched-ext-button-icon';
        switchButton.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i>';
        switchButton.title = 'Switch to this account';
        switchButton.onclick = (e) => {
            e.stopPropagation();
            switchAccount(account.tokens);
        };
        actions.appendChild(switchButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'unmatched-ext-button-icon delete';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.title = 'Delete account';
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteAccount(account);
    };
    actions.appendChild(deleteButton);

    info.appendChild(username);
    info.appendChild(type);
    item.appendChild(info);
    item.appendChild(actions);

    return item;
}

function deleteAccount(account) {
    const savedAccounts = JSON.parse(localStorage.getItem('um_saved_accounts') || '[]');
    const updatedAccounts = savedAccounts.filter(acc => acc.username !== account.username);
    localStorage.setItem('um_saved_accounts', JSON.stringify(updatedAccounts));
    updateAccountList();
    showToast('Account deleted', 'success');
}

function switchAccount(tokens) {
    Object.entries(tokens).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
    showToast('Switching account...', 'info');
    setTimeout(() => location.reload(), 500);
}

function updateAccountList() {
    const accounts = JSON.parse(localStorage.getItem('um_saved_accounts') || '[]');
    const list = document.querySelector('.unmatched-ext-account-list');
    if (!list) return;

    list.innerHTML = '';
    
    if (accounts.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'unmatched-ext-account-item empty';
        emptyState.textContent = 'No accounts saved';
        list.appendChild(emptyState);
        return;
    }

    accounts.forEach(account => {
        list.appendChild(createAccountItem(account));
    });
}

window.accountManager = {
    createAccountManager,
    updateAccountList,
    saveTemporaryAccount,
    decodeToken,
    fetchUserData
}; 