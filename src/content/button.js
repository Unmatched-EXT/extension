function createExtensionButton() {
  const link = document.createElement('a');
  link.className = 'link mb-4 md:mb-0';
  link.href = '#';
  link.id = 'unmatched-extension-button';
  
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-gamepad mr-1';
  
  const text = document.createElement('span');
  text.className = 'md:hidden lg:inline';
  text.textContent = 'Extension';

  link.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menu = document.getElementById('unmatched-ext-menu');
    menu.classList.toggle('open');
  };
  
  link.appendChild(icon);
  link.appendChild(text);
  
  return link;
}

export { createExtensionButton }; 