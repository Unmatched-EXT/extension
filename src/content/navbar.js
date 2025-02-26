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
        detailsContainer.appendChild(fieldDiv);
    });

    return detailsContainer;
}

function insertExtensionElements() {
  if (document.getElementById('unmatched-extension-button')) return;

  const navbar = document.querySelector('.flex.flex-col.md\\:flex-row.md\\:items-center.md\\:justify-start.md\\:space-x-4');
  
  if (navbar) {
    const extensionButton = document.createElement('a');
    extensionButton.className = 'link mb-4 md:mb-0';
    extensionButton.href = '#';
    extensionButton.id = 'unmatched-extension-button';
    
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-gamepad mr-1';
    
    const text = document.createElement('span');
    text.className = 'md:hidden lg:inline';
    text.textContent = 'Extension';

    extensionButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = document.getElementById('unmatched-ext-menu');
      if (menu) menu.classList.toggle('open');
    };
    
    extensionButton.appendChild(icon);
    extensionButton.appendChild(text);

    const menu = window.menu.createExtensionMenu();

    const wagerDiv = navbar.querySelector('div.flex.flex-row.items-center.mb-4.md\\:mb-0');
    if (wagerDiv) {
      wagerDiv.parentNode.insertBefore(extensionButton, wagerDiv.nextSibling);
    } else {
      navbar.appendChild(extensionButton);
    }

    document.body.appendChild(menu);

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !extensionButton.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    insertExtensionElements();
  });
} else {
  insertExtensionElements();
}

const observer = new MutationObserver(() => {
  if (!document.getElementById('unmatched-extension-button')) {
    insertExtensionElements();
  }
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true
}); 