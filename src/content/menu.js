function createExtensionMenu() {
  if (window.adblocker && window.adblocker.initializeAdBlocker) {
    window.adblocker.initializeAdBlocker();
  }

  const menu = document.createElement('div');
  menu.className = 'unmatched-ext-menu';
  menu.id = 'unmatched-ext-menu';

  const modifierContent = document.createElement('div');
  modifierContent.className = 'unmatched-ext-modifier-content';
  modifierContent.style.display = 'none';
  modifierContent.onclick = (e) => e.stopPropagation();

  const modifierHeader = document.createElement('div');
  modifierHeader.className = 'unmatched-ext-header';

  const modifierTitle = document.createElement('div');
  modifierTitle.className = 'unmatched-ext-title';
  modifierTitle.textContent = 'Customization';

  const modifierClose = document.createElement('button');
  modifierClose.className = 'unmatched-ext-close';
  modifierClose.innerHTML = '<i class="fa-solid fa-times"></i>';
  modifierClose.onclick = (e) => {
    e.stopPropagation();
    modifierContent.style.display = 'none';
  };

  modifierHeader.appendChild(modifierTitle);
  modifierHeader.appendChild(modifierClose);

  const modifierBody = document.createElement('div');
  modifierBody.className = 'unmatched-ext-body';

  const categoryTabs = document.createElement('div');
  categoryTabs.className = 'unmatched-ext-tabs';

  const websiteTab = document.createElement('button');
  websiteTab.className = 'unmatched-ext-tab active';
  websiteTab.textContent = 'Website Modifier';

  const profileTab = document.createElement('button');
  profileTab.className = 'unmatched-ext-tab';
  profileTab.textContent = 'Profile Modifier';

  categoryTabs.appendChild(websiteTab);
  categoryTabs.appendChild(profileTab);

  const websiteContent = document.createElement('div');
  websiteContent.className = 'unmatched-ext-tab-content';

  const profileContent = document.createElement('div');
  profileContent.className = 'unmatched-ext-tab-content';
  profileContent.style.display = 'none';

  const colorSection = document.createElement('div');
  colorSection.className = 'unmatched-ext-section';
  colorSection.onclick = (e) => e.stopPropagation();
  
  const colorTitle = document.createElement('div');
  colorTitle.className = 'unmatched-ext-section-title';
  colorTitle.textContent = 'Color Customization';
  
  colorSection.appendChild(colorTitle);
  colorSection.appendChild(window.modifier.createColorPicker('Accent Color', window.state?.accentColor || '#2FEEFF'));

  const backgroundSection = document.createElement('div');
  backgroundSection.className = 'unmatched-ext-section';
  backgroundSection.onclick = (e) => e.stopPropagation();
  
  const backgroundTitle = document.createElement('div');
  backgroundTitle.className = 'unmatched-ext-section-title';
  backgroundTitle.textContent = 'Background Customization';
  
  backgroundSection.appendChild(backgroundTitle);
  backgroundSection.appendChild(window.modifier.createBackgroundUploader());

  websiteContent.appendChild(colorSection);
  websiteContent.appendChild(backgroundSection);

  const profileEmptyMessage = document.createElement('div');
  profileEmptyMessage.className = 'unmatched-ext-empty-message';
  profileEmptyMessage.textContent = 'Profile customization options coming soon';
  profileContent.appendChild(profileEmptyMessage);

  websiteTab.onclick = () => {
    websiteTab.classList.add('active');
    profileTab.classList.remove('active');
    websiteContent.style.display = 'block';
    profileContent.style.display = 'none';
  };
  
  profileTab.onclick = () => {
    profileTab.classList.add('active');
    websiteTab.classList.remove('active');
    profileContent.style.display = 'block';
    websiteContent.style.display = 'none';
  };

  modifierBody.appendChild(categoryTabs);
  modifierBody.appendChild(websiteContent);
  modifierBody.appendChild(profileContent);

  const saveButton = document.createElement('button');
  saveButton.className = 'unmatched-ext-button save-settings';
  saveButton.textContent = 'Save Settings';
  saveButton.onclick = (e) => {
    e.stopPropagation();
    window.modifier.saveSettings();
  };

  modifierBody.appendChild(saveButton);

  modifierContent.appendChild(modifierHeader);
  modifierContent.appendChild(modifierBody);
  document.body.appendChild(modifierContent);

  const updateMenuPosition = () => {
    if (menu.classList.contains('open')) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const viewportCenter = scrollTop + (viewportHeight / 2);
      
      menu.style.position = 'absolute';
      menu.style.top = `${viewportCenter}px`;
      menu.style.left = '50%';
      menu.style.transform = 'translate(-50%, -50%)';
      menu.style.maxHeight = '85vh';
      menu.style.overflowY = 'auto';

      const menuRect = menu.getBoundingClientRect();
      
      if (modifierContent.style.display === 'block') {
        modifierContent.style.position = 'absolute';
        modifierContent.style.top = `${viewportCenter}px`;
        modifierContent.style.left = `${menuRect.right + 16}px`;
      }
      
      if (accountManager.style.display === 'block') {
        accountManager.style.position = 'absolute';
        accountManager.style.top = `${viewportCenter}px`;
        accountManager.style.left = `${menuRect.right + 16}px`;
      }
    }
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('open')) {
        requestAnimationFrame(updateMenuPosition);
      }
    });
  });

  observer.observe(menu, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('scroll', () => {
    if (menu.classList.contains('open')) {
      requestAnimationFrame(updateMenuPosition);
    }
  });

  window.addEventListener('resize', () => {
    if (menu.classList.contains('open')) {
      requestAnimationFrame(updateMenuPosition);
    }
  });

  const header = document.createElement('div');
  header.className = 'unmatched-ext-header';

  const title = document.createElement('div');
  title.className = 'unmatched-ext-title';
  title.textContent = 'unmatched.ext [1.03] | discord.gg/CfRzDbB8SF';

  const closeButton = document.createElement('button');
  closeButton.className = 'unmatched-ext-close';
  closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
  closeButton.onclick = (e) => {
    e.stopPropagation();
    menu.classList.remove('open');
    modifierContent.style.display = 'none';
  };

  const content = document.createElement('div');
  content.className = 'unmatched-ext-content';

  const accountGenButton = document.createElement('button');
  accountGenButton.className = 'unmatched-ext-button';
  
  const accountButtonContent = document.createElement('div');
  accountButtonContent.className = 'unmatched-ext-button-content';
  
  const accountButtonIcon = document.createElement('i');
  accountButtonIcon.className = 'fa-solid fa-user-plus mr-2';
  
  const accountButtonText = document.createElement('span');
  accountButtonText.textContent = 'Account Generator';
  
  accountButtonContent.appendChild(accountButtonIcon);
  accountButtonContent.appendChild(accountButtonText);
  accountGenButton.appendChild(accountButtonContent);
  
  accountGenButton.onclick = (e) => {
    e.stopPropagation();
    if (!window.generator) {
      console.error('Account Generator not initialized');
      return;
    }
    window.generator.generateAccount();
  };

  const accountManagerButton = document.createElement('button');
  accountManagerButton.className = 'unmatched-ext-button';
  
  const accountManagerContent = document.createElement('div');
  accountManagerContent.className = 'unmatched-ext-button-content';
  
  const accountManagerIcon = document.createElement('i');
  accountManagerIcon.className = 'fa-solid fa-users mr-2';
  
  const accountManagerText = document.createElement('span');
  accountManagerText.textContent = 'Account Manager';
  
  accountManagerContent.appendChild(accountManagerIcon);
  accountManagerContent.appendChild(accountManagerText);
  accountManagerButton.appendChild(accountManagerContent);

  const modifierButton = document.createElement('div');
  modifierButton.className = 'unmatched-ext-button-group';

  const toggleButton = document.createElement('button');
  toggleButton.className = `unmatched-ext-button unmatched-ext-button-toggle ${window.state?.websiteModifierEnabled ? 'enabled' : 'disabled'}`;
  
  const toggleContent = document.createElement('div');
  toggleContent.className = 'unmatched-ext-button-content';
  
  const toggleIcon = document.createElement('i');
  toggleIcon.className = 'fa-solid fa-paint-brush mr-2';
  
  const toggleText = document.createElement('span');
  toggleText.textContent = 'Website Modifier';
  
  toggleContent.appendChild(toggleIcon);
  toggleContent.appendChild(toggleText);
  toggleButton.appendChild(toggleContent);

  const settingsButton = document.createElement('button');
  settingsButton.className = 'unmatched-ext-button-settings';
  settingsButton.innerHTML = '<i class="fa-solid fa-cog"></i>';

  const adBlockerButton = document.createElement('div');
  adBlockerButton.className = 'unmatched-ext-button-group';

  const adBlockerToggle = document.createElement('button');
  adBlockerToggle.className = `unmatched-ext-button unmatched-ext-button-toggle ${window.state?.adBlockerEnabled ? 'enabled' : 'disabled'}`;
  
  const adBlockerContent = document.createElement('div');
  adBlockerContent.className = 'unmatched-ext-button-content';
  
  const adBlockerIcon = document.createElement('i');
  adBlockerIcon.className = 'fa-solid fa-shield mr-2';
  
  const adBlockerText = document.createElement('span');
  adBlockerText.textContent = 'Ad Blocker';
  
  adBlockerContent.appendChild(adBlockerIcon);
  adBlockerContent.appendChild(adBlockerText);
  adBlockerToggle.appendChild(adBlockerContent);

  let isEnabled = window.state?.websiteModifierEnabled || false;
  toggleButton.onclick = (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;
    toggleButton.classList.toggle('disabled', !isEnabled);
    toggleButton.classList.toggle('enabled', isEnabled);
    window.modifier.toggleModifier(isEnabled);
    return false;
  };

  let isAdBlockerEnabled = window.state?.adBlockerEnabled || false;
  adBlockerToggle.onclick = (e) => {
    e.stopPropagation();
    isAdBlockerEnabled = !isAdBlockerEnabled;
    adBlockerToggle.classList.toggle('disabled', !isAdBlockerEnabled);
    adBlockerToggle.classList.toggle('enabled', isAdBlockerEnabled);
    window.adblocker.toggleAdBlocker(isAdBlockerEnabled);
  };

  modifierButton.appendChild(toggleButton);
  modifierButton.appendChild(settingsButton);
  adBlockerButton.appendChild(adBlockerToggle);

  content.appendChild(accountGenButton);
  content.appendChild(accountManagerButton);
  content.appendChild(modifierButton);
  content.appendChild(adBlockerButton);

  header.appendChild(title);
  header.appendChild(closeButton);
  menu.appendChild(header);
  menu.appendChild(content);

  document.addEventListener('click', (e) => {
    const extensionButton = document.getElementById('unmatched-extension-button');
    const isExtensionButtonClick = extensionButton && extensionButton.contains(e.target);

    const isModifierClick = modifierContent.contains(e.target);
    const isAccountManagerClick = accountManager.contains(e.target);
    const isMainMenuClick = menu.contains(e.target);

    if (!isExtensionButtonClick && !isModifierClick && !isAccountManagerClick && !isMainMenuClick) {
      menu.classList.remove('open');
      modifierContent.style.display = 'none';
      accountManager.style.display = 'none';
    }
  });

  const accountManager = document.createElement('div');
  accountManager.className = 'unmatched-ext-account-manager';
  accountManager.style.display = 'none';
  
  const accountManagerHeader = document.createElement('div');
  accountManagerHeader.className = 'unmatched-ext-header';
  
  const accountManagerTitle = document.createElement('div');
  accountManagerTitle.className = 'unmatched-ext-title';
  accountManagerTitle.textContent = 'Account Manager';
  
  const accountManagerClose = document.createElement('button');
  accountManagerClose.className = 'unmatched-ext-close';
  accountManagerClose.innerHTML = '<i class="fa-solid fa-times"></i>';
  accountManagerClose.onclick = (e) => {
    e.stopPropagation();
    accountManager.style.display = 'none';
  };
  
  accountManagerHeader.appendChild(accountManagerTitle);
  accountManagerHeader.appendChild(accountManagerClose);
  
  const accountManagerBody = document.createElement('div');
  accountManagerBody.className = 'unmatched-ext-body';
  
  const accountList = document.createElement('div');
  accountList.className = 'unmatched-ext-account-list';
  
  const refreshButton = document.createElement('button');
  refreshButton.className = 'unmatched-ext-button refresh-accounts';
  refreshButton.innerHTML = '<i class="fa-solid fa-sync-alt mr-2"></i> Refresh Accounts';
  refreshButton.onclick = (e) => {
    e.stopPropagation();
    refreshAccountList();
    window.toast.show('Account list refreshed', 'success');
  };

  const discordSettingsButton = document.createElement('button');
  discordSettingsButton.className = 'unmatched-ext-button discord-settings';
  discordSettingsButton.innerHTML = '<i class="fa-solid fa-cog mr-2"></i> Discord Settings';
  discordSettingsButton.onclick = (e) => {
    e.stopPropagation();
    toggleDiscordSettings();
  };

  const discordSettings = document.createElement('div');
  discordSettings.className = 'unmatched-ext-discord-settings';
  discordSettings.style.display = 'none';

  const webhookSection = document.createElement('div');
  webhookSection.className = 'unmatched-ext-section webhook-section';

  const webhookTitle = document.createElement('div');
  webhookTitle.className = 'unmatched-ext-section-title';
  webhookTitle.textContent = 'Discord Webhook URL';

  const webhookInput = document.createElement('input');
  webhookInput.type = 'text';
  webhookInput.className = 'unmatched-ext-input';
  webhookInput.placeholder = 'Enter Discord webhook URL';
  webhookInput.value = window.state?.discordWebhook || '';
  webhookInput.onchange = (e) => {
    const webhookUrl = e.target.value.trim();
    window.state.discordWebhook = webhookUrl;
    chrome.storage.local.set({ discordWebhook: webhookUrl });
  };

  const webhookActions = document.createElement('div');
  webhookActions.className = 'unmatched-ext-webhook-actions';

  const saveWebhookButton = document.createElement('button');
  saveWebhookButton.className = 'unmatched-ext-button webhook-save';
  saveWebhookButton.textContent = 'Save Webhook';
  saveWebhookButton.onclick = (e) => {
    e.stopPropagation();
    const webhookUrl = webhookInput.value.trim();
    if (!webhookUrl) {
      window.toast.show('Please enter a webhook URL', 'error');
      return;
    }
    
    window.state.discordWebhook = webhookUrl;
    chrome.storage.local.set({ discordWebhook: webhookUrl }, () => {
      window.toast.show('Webhook URL saved', 'success');
    });
  };

  const sendAccountsButton = document.createElement('button');
  sendAccountsButton.className = 'unmatched-ext-button webhook-send';
  sendAccountsButton.innerHTML = '<i class="fa-brands fa-discord mr-2"></i> Send Accounts to Discord';
  sendAccountsButton.onclick = (e) => {
    e.stopPropagation();
    sendAccountsToDiscord();
  };

  webhookActions.appendChild(saveWebhookButton);
  webhookSection.appendChild(webhookTitle);
  webhookSection.appendChild(webhookInput);
  webhookSection.appendChild(webhookActions);
  webhookSection.appendChild(sendAccountsButton);

  discordSettings.appendChild(webhookSection);

  function toggleDiscordSettings() {
    if (discordSettings.style.display === 'none') {
      discordSettings.style.display = 'block';
      discordSettingsButton.innerHTML = '<i class="fa-solid fa-chevron-up mr-2"></i> Hide Discord Settings';
    } else {
      discordSettings.style.display = 'none';
      discordSettingsButton.innerHTML = '<i class="fa-solid fa-cog mr-2"></i> Discord Settings';
    }
  }

  const saveTemporaryButton = document.createElement('button');
  saveTemporaryButton.className = 'unmatched-ext-button save-account';
  saveTemporaryButton.innerHTML = '<i class="fa-solid fa-plus mr-2"></i> Save Temporary Account';
  saveTemporaryButton.onclick = (e) => {
    e.stopPropagation();
    
    if (typeof window.accountManager.saveTemporaryAccount === 'function') {
      try {
        window.accountManager.saveTemporaryAccount(() => {
          refreshAccountList();
        });
      } catch (error) {
        window.accountManager.saveTemporaryAccount();
        setTimeout(refreshAccountList, 500);
      }
    } else {
      saveTemporaryAccountFallback();
    }
  };

  function saveTemporaryAccountFallback() {    
    try {
      const tempAccount = JSON.parse(localStorage.getItem('um_temp_account'));
      
      if (!tempAccount) {
        window.toast.show('No temporary account found', 'error');
        return;
      }

      const accountData = {
        tokens: {
          um_language: tempAccount.tokens?.um_language || 'en',
          um_refresh_token: tempAccount.tokens?.um_refresh_token || '',
          um_token: tempAccount.tokens?.um_token || '',
          um_cache_token: tempAccount.tokens?.um_cache_token || 'undefined'
        },
        username: tempAccount.username || 'Unknown',
        temporary: true,
        timestamp: Date.now()
      };
      
      
      chrome.storage.local.get(['um_saved_accounts'], function(result) {
        let accounts = result.um_saved_accounts || [];
        
        if (!Array.isArray(accounts)) {
          accounts = [];
        }
        
        accounts.push(accountData);
        
        chrome.storage.local.set({ um_saved_accounts: accounts }, () => {
          if (chrome.runtime.lastError) {
            window.toast.show('Error saving account', 'error');
            return;
          }
          
          window.toast.show('Temporary account saved', 'success');
          
          setTimeout(() => {
            refreshAccountList();
          }, 100);
        });
      });
    } catch (e) {
      window.toast.show('Error saving temporary account', 'error');
    }
  }

  accountManagerBody.appendChild(accountList);
  accountManagerBody.appendChild(refreshButton);
  accountManagerBody.appendChild(discordSettingsButton);
  accountManagerBody.appendChild(discordSettings);
  accountManagerBody.appendChild(saveTemporaryButton);

  accountManager.appendChild(accountManagerHeader);
  accountManager.appendChild(accountManagerBody);
  
  document.body.appendChild(accountManager);

  accountManagerButton.onclick = (e) => {
    e.stopPropagation();
    if (!window.accountManager) {
      console.error('Account Manager not loaded');
      return;
    }

    if (accountManager.style.display === 'none' || !accountManager.style.display) {
      accountManager.style.display = 'block';
      const menuRect = menu.getBoundingClientRect();
      accountManager.style.left = `${menuRect.right + 16}px`;
      accountManager.style.top = `${menuRect.top + (menuRect.height / 2)}px`;
      refreshAccountList();
    } else {
      accountManager.style.display = 'none';
    }
    updateMenuPosition();
  };

  function createAccountItem(account) {
    const item = document.createElement('div');
    item.className = 'unmatched-ext-account-item';
    
    const info = document.createElement('div');
    info.className = 'unmatched-ext-account-info';
    
    const username = document.createElement('div');
    username.className = 'unmatched-ext-account-username';
    username.textContent = account.username || 'Unknown';
    
    if (account.temporary && !account.email) {
      const badge = document.createElement('span');
      badge.className = 'unmatched-ext-account-badge';
      badge.textContent = 'Temporary';
      username.appendChild(badge);
    }
    
    info.appendChild(username);
    item.appendChild(info);
    
    const actions = document.createElement('div');
    actions.className = 'unmatched-ext-account-actions';
    
    const viewButton = document.createElement('button');
    viewButton.className = 'unmatched-ext-button-icon';
    viewButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
    viewButton.onclick = (e) => {
      e.stopPropagation();
      viewAccountDetails(account);
    };
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'unmatched-ext-button-icon delete';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.onclick = (e) => {
      e.stopPropagation();
      deleteAccount(account);
    };
    
    actions.appendChild(viewButton);
    actions.appendChild(deleteButton);
    item.appendChild(actions);
    
    return item;
  }

  function viewAccountDetails(account) {
    const modal = document.createElement('div');
    modal.className = 'unmatched-ext-credentials-modal';
    
    const header = document.createElement('div');
    header.className = 'unmatched-ext-header';
    
    const title = document.createElement('div');
    title.className = 'unmatched-ext-title';
    title.textContent = `Account: ${account.username || 'Unknown'}`;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'unmatched-ext-close';
    closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    const body = document.createElement('div');
    body.className = 'unmatched-ext-body';
    
    const detailsFields = [
      { label: 'Username', value: account.username || 'Unknown' },
      { label: 'Password', value: account.password || 'Unknown' }
    ];
    
    if (account.email) {
      detailsFields.push({ label: 'Email', value: account.email });
    }
    
    if (account.emailPassword) {
      detailsFields.push({ label: 'Email Password', value: account.emailPassword });
    }
    
    if (account.tokens) {
      if (account.tokens.um_token) {
        detailsFields.push({ label: 'Token', value: account.tokens.um_token });
      }
      if (account.tokens.um_refresh_token) {
        detailsFields.push({ label: 'Refresh Token', value: account.tokens.um_refresh_token });
      }
    }
    
    detailsFields.forEach(field => {
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
      copyButton.onclick = () => {
        navigator.clipboard.writeText(field.value);
        copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
        }, 1000);
      };
      
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(value);
      fieldDiv.appendChild(copyButton);
      body.appendChild(fieldDiv);
    });
    
    modal.appendChild(header);
    modal.appendChild(body);
    document.body.appendChild(modal);
  }

  function deleteAccount(accountToDelete) {
    if (confirm(`Are you sure you want to delete the account "${accountToDelete.username}"?`)) {
      
      chrome.storage.local.get(['um_saved_accounts'], function(result) {
        let accounts = result.um_saved_accounts || [];
        
        const newAccounts = accounts.filter(account => {
          if (!account) return false;
          
          if (accountToDelete.timestamp && account.timestamp) {
            return account.timestamp !== accountToDelete.timestamp;
          }
          
          return account.username !== accountToDelete.username;
        });
        
        
        chrome.storage.local.set({ um_saved_accounts: newAccounts }, () => {          
          try {
            localStorage.removeItem('um_saved_accounts');
          } catch (e) {
            console.error("Error clearing localStorage:", e);
          }
          
          window.toast.show('Account deleted successfully', 'success');
          
          setTimeout(() => {
            refreshAccountList();
          }, 100);
        });
      });
    }
  }

  settingsButton.onclick = (e) => {
    e.stopPropagation();
    
    const menuRect = menu.getBoundingClientRect();
    modifierContent.style.position = 'absolute';
    modifierContent.style.top = `${menuRect.top + (menuRect.height / 2)}px`;
    modifierContent.style.left = `${menuRect.right + 16}px`;
    
    modifierContent.style.display = 'block';
    
    websiteTab.classList.add('active');
    profileTab.classList.remove('active');
    websiteContent.style.display = 'block';
    profileContent.style.display = 'none';
  };

  accountManager.onclick = (e) => e.stopPropagation();

  function sendAccountsToDiscord() {
    const webhookUrl = window.state?.discordWebhook;
    if (!webhookUrl) {
      window.toast.show('Please set a Discord webhook URL first', 'error');
      return;
    }
    
    chrome.storage.local.get(['um_saved_accounts'], function(result) {
      const accounts = result.um_saved_accounts || [];
      
      if (!accounts || accounts.length === 0) {
        window.toast.show('No accounts to send', 'error');
        return;
      }
      
      const formattedAccounts = accounts.map(account => {
        if (account.email && account.password) {
          return {
            title: `Generated Account: ${account.username}`,
            color: 3447003,
            fields: [
              { name: 'Username', value: `\`${account.username}\``, inline: true },
              { name: 'Password', value: `\`${account.password}\``, inline: true },
              { name: 'Email', value: `\`${account.email}\``, inline: true },
              { name: 'Email Password', value: `\`${account.emailPassword}\``, inline: true }
            ],
            footer: { text: 'Unmatched.Ext Account Manager - Generated Account' },
            timestamp: new Date().toISOString()
          };
        } else {
          return {
            title: `Temporary Account: ${account.username}`,
            color: 15844367,
            fields: [
              { name: 'Username', value: `\`${account.username}\``, inline: true },
              { name: 'Token', value: `\`${account.tokens?.um_token || 'N/A'}\``, inline: false }
            ],
            footer: { text: 'Unmatched.Ext Account Manager - Temporary Account' },
            timestamp: new Date().toISOString()
          };
        }
      });
      
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'Unmatched.Ext',
          avatar_url: 'https://unmatched.gg/favicon.ico',
          embeds: formattedAccounts
        })
      })
      .then(response => {
        if (response.ok) {
          window.toast.show('All accounts sent to Discord successfully', 'success');
        } else {
          window.toast.show('Failed to send accounts to Discord', 'error');
        }
      })
      .catch(error => {
        window.toast.show('Error sending accounts to Discord', 'error');
      });
    });
  }

  return menu;
}

function createAccountDetails(accountData) {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'unmatched-ext-account-details';

    const fields = [
        { label: 'Username', value: accountData.username },
        { label: 'Password', value: accountData.password },
        { label: 'Email', value: accountData.email },
        { label: 'Email Password', value: accountData.emailPassword }
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
        detailsContainer.appendChild(fieldDiv);
    });

    return detailsContainer;
}

function createModifierPanel() {
    const panel = document.createElement('div');
    panel.className = 'unmatched-ext-modifier-panel';

    const header = document.createElement('div');
    header.className = 'unmatched-ext-header';

    const title = document.createElement('div');
    title.className = 'unmatched-ext-title';
    title.textContent = 'Customization';

    const closeButton = document.createElement('button');
    closeButton.className = 'unmatched-ext-close';
    closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    closeButton.onclick = () => {
        const modifierContent = document.querySelector('.unmatched-ext-modifier-content');
        if (modifierContent) {
            modifierContent.style.display = 'none';
        }
    };

    header.appendChild(title);
    header.appendChild(closeButton);

    const content = document.createElement('div');
    content.className = 'unmatched-ext-content';

    const categoryTabs = document.createElement('div');
    categoryTabs.className = 'unmatched-ext-tabs';

    const websiteTab = document.createElement('button');
    websiteTab.className = 'unmatched-ext-tab active';
    websiteTab.textContent = 'Website Modifier';
    
    const profileTab = document.createElement('button');
    profileTab.className = 'unmatched-ext-tab';
    profileTab.textContent = 'Profile Modifier';
    
    categoryTabs.appendChild(websiteTab);
    categoryTabs.appendChild(profileTab);
    
    const websiteContent = document.createElement('div');
    websiteContent.className = 'unmatched-ext-tab-content';
    
    const profileContent = document.createElement('div');
    profileContent.className = 'unmatched-ext-tab-content';
    profileContent.style.display = 'none';
    
    const colorSection = document.createElement('div');
    colorSection.className = 'unmatched-ext-section';
    
    const colorTitle = document.createElement('div');
    colorTitle.className = 'unmatched-ext-section-title';
    colorTitle.textContent = 'Color Customization';
    
    colorSection.appendChild(colorTitle);
    colorSection.appendChild(window.modifier.createColorPicker('Accent Color', window.state?.accentColor || '#2FEEFF'));

    const backgroundSection = document.createElement('div');
    backgroundSection.className = 'unmatched-ext-section';
    
    const backgroundTitle = document.createElement('div');
    backgroundTitle.className = 'unmatched-ext-section-title';
    backgroundTitle.textContent = 'Background Customization';
    
    backgroundSection.appendChild(backgroundTitle);
    backgroundSection.appendChild(window.modifier.createBackgroundUploader());
    
    const profileEmptyMessage = document.createElement('div');
    profileEmptyMessage.className = 'unmatched-ext-empty-message';
    profileEmptyMessage.textContent = 'Profile customization options coming soon';
    profileContent.appendChild(profileEmptyMessage);
    
    websiteContent.appendChild(colorSection);
    websiteContent.appendChild(backgroundSection);
    
    websiteTab.onclick = () => {
        websiteTab.classList.add('active');
        profileTab.classList.remove('active');
        websiteContent.style.display = 'block';
        profileContent.style.display = 'none';
    };
    
    profileTab.onclick = () => {
        profileTab.classList.add('active');
        websiteTab.classList.remove('active');
        profileContent.style.display = 'block';
        websiteContent.style.display = 'none';
    };

    const saveButton = document.createElement('button');
    saveButton.className = 'unmatched-ext-button save-settings';
    saveButton.textContent = 'Save Settings';
    saveButton.onclick = () => window.modifier.saveSettings();

    content.appendChild(categoryTabs);
    content.appendChild(websiteContent);
    content.appendChild(profileContent);
    content.appendChild(saveButton);
    
    panel.appendChild(header);
    panel.appendChild(content);
    
    return panel;
}

function initializeAccountManager() {
  if (window.accountManagerInitialized) {
    return;
  }
  
  if (!window.accountManager) {
    window.accountManager = {
      getAccounts: function() {
        return new Promise((resolve) => {
          chrome.storage.local.get(['um_saved_accounts'], function(result) {
            const accounts = result.um_saved_accounts || [];
            resolve(accounts);
          });
        });
      },
      saveTemporaryAccount: function(callback) {
        saveTemporaryAccountFallback();
        if (typeof callback === 'function') {
          setTimeout(callback, 100);
        }
      }
    };
  }
  
  window.accountManagerInitialized = true;
  
  setTimeout(() => {
    if (document.querySelector('.unmatched-ext-account-list')) {
      refreshAccountList();
    }
  }, 1000);
}

document.addEventListener('DOMContentLoaded', initializeAccountManager);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeAccountManager();
}

window.menu = {
    createExtensionMenu,
    createAccountDetails,
    createModifierPanel
};

function refreshAccountList() {
  const accountListElement = document.querySelector('.unmatched-ext-account-list');
  if (!accountListElement) {
    window.toast.show('Account list element not found', 'error');
    return;
  }
  
  accountListElement.innerHTML = '';
  
  try {
    const localStorageAccounts = localStorage.getItem('um_saved_accounts');
    
    if (localStorageAccounts) {
      try {
        const accounts = JSON.parse(localStorageAccounts);
        
        if (Array.isArray(accounts) && accounts.length > 0) {
          chrome.storage.local.set({ um_saved_accounts: accounts }, () => {
            window.toast.show('Accounts synced to storage', 'success');
          });
          
          accounts.forEach(account => {
            try {
              const accountItem = createAccountItem(account);
              accountListElement.appendChild(accountItem);
            } catch (e) {
              window.toast.show('Error creating account item', 'error');
            }
          });
          return;
        }
      } catch (e) {
        window.toast.show('Error parsing accounts', 'error');
      }
    }
    
    chrome.storage.local.get(['um_saved_accounts'], function(result) {
      let accounts = result.um_saved_accounts || [];
      
      if (!Array.isArray(accounts)) {
        try {
          accounts = JSON.parse(accounts);
        } catch (e) {
          accounts = [];
        }
      }
      
      accounts = accounts.filter(account => !!account);
      
      if (accounts.length > 0) {
        localStorage.setItem('um_saved_accounts', JSON.stringify(accounts));
        
        accounts.forEach(account => {
          try {
            const accountItem = createAccountItem(account);
            accountListElement.appendChild(accountItem);
          } catch (e) {
            window.toast.show('Error creating account item', 'error');
          }
        });
      } else {
        showEmptyState(accountListElement);
      }
    });
    
  } catch (e) {
    window.toast.show('Error refreshing account list', 'error');
    showEmptyState(accountListElement);
  }
}

function showEmptyState(container) {
  const emptyItem = document.createElement('div');
  emptyItem.className = 'unmatched-ext-account-item empty';
  emptyItem.textContent = 'No accounts saved yet';
  container.appendChild(emptyItem);
}

window.refreshAccountList = refreshAccountList; 