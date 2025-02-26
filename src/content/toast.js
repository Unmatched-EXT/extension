const TOAST_DURATION = 3000;
const MAX_TOASTS = 3;
const TOAST_HEIGHT = 40;
const TOAST_GAP = 8;

function createToastContainer() {
    const containerId = 'unmatched-ext-toast-container';
    let container = document.getElementById(containerId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        
        const updateToastPosition = () => {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const bottomPosition = scrollTop + viewportHeight - 16;
            container.style.top = `${bottomPosition}px`;
        };

        window.addEventListener('scroll', updateToastPosition);
        window.addEventListener('resize', updateToastPosition);

        updateToastPosition();
        
        const style = document.createElement('style');
        style.textContent = `
            #${containerId} {
                position: absolute;
                right: 16px;
                display: flex;
                flex-direction: column-reverse;
                gap: ${TOAST_GAP}px;
                z-index: 2147483647;
                pointer-events: none;
                transform: translateY(-100%);
            }

            .unmatched-ext-toast {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                min-width: 250px;
                max-width: 350px;
                background: rgb(24 24 27);
                border: 1px solid;
                border-radius: 6px;
                color: rgb(244 244 245);
                font-size: 13px;
                line-height: 1.4;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.2s ease;
                pointer-events: none;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }

            .unmatched-ext-toast.show {
                opacity: 1;
                transform: translateX(0);
            }

            .unmatched-ext-toast.hide {
                opacity: 0;
                transform: translateX(100%);
            }

            .unmatched-ext-toast i {
                font-size: 14px;
                flex-shrink: 0;
            }

            .unmatched-ext-toast span {
                overflow-wrap: break-word;
            }

            .unmatched-ext-toast.success {
                border-color: rgb(34 197 94);
                background: rgba(22, 101, 52, 0.1);
            }
            
            .unmatched-ext-toast.success i {
                color: rgb(34 197 94);
            }
            
            .unmatched-ext-toast.error {
                border-color: rgb(239 68 68);
                background: rgba(127, 29, 29, 0.1);
            }
            
            .unmatched-ext-toast.error i {
                color: rgb(239 68 68);
            }
            
            .unmatched-ext-toast.warning {
                border-color: rgb(234 179 8);
                background: rgba(161, 98, 7, 0.1);
            }
            
            .unmatched-ext-toast.warning i {
                color: rgb(234 179 8);
            }
            
            .unmatched-ext-toast.info {
                border-color: rgb(59 130 246);
                background: rgba(30, 58, 138, 0.1);
            }
            
            .unmatched-ext-toast.info i {
                color: rgb(59 130 246);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(container);
    }
    
    return container;
}

function showToast(message, type = 'info') {
    const container = createToastContainer();
    const toasts = container.querySelectorAll('.unmatched-ext-toast');
    
    if (toasts.length >= MAX_TOASTS) {
        container.removeChild(container.firstChild);
    }
    
    const toast = document.createElement('div');
    toast.className = `unmatched-ext-toast ${type}`;
    
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fa-solid fa-check';
            break;
        case 'error':
            icon.className = 'fa-solid fa-xmark';
            break;
        case 'warning':
            icon.className = 'fa-solid fa-triangle-exclamation';
            break;
        default:
            icon.className = 'fa-solid fa-info';
    }
    
    const text = document.createElement('span');
    text.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentNode === container) {
                    container.removeChild(toast);
                }
            }, 200);
        }, TOAST_DURATION);
    });
}

window.toast = {
    show: showToast,
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info')
}; 