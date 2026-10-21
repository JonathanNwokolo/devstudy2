/**
 * Notificações (toast). Texto sempre via textContent: a mensagem pode conter entrada do usuário.
 */
export const Toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'success', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        }[type] || 'ℹ';
        
        // message pode conter texto digitado pelo usuário (ex.: termo de busca): usar textContent.
        const iconEl = document.createElement('span');
        iconEl.className = 'toast-icon';
        iconEl.textContent = icon;

        const messageEl = document.createElement('span');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;

        const closeEl = document.createElement('button');
        closeEl.className = 'toast-close';
        closeEl.setAttribute('aria-label', 'Fechar notificação');
        closeEl.textContent = '×';
        closeEl.addEventListener('click', () => toast.remove());

        toast.append(iconEl, messageEl, closeEl);
        
        this.container.appendChild(toast);
        
        // Animação de entrada
        setTimeout(() => toast.classList.add('toast-show'), 10);
        
        // Remove após duração
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    success(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error(message, duration) {
        this.show(message, 'error', duration);
    },
    
    info(message, duration) {
        this.show(message, 'info', duration);
    },
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
};


// Compatibilidade: scripts legados e testes usam window.Toast.
window.Toast = Toast;
