import { Toast } from '../core/toast.js';
import { readJSON, writeJSON } from '../core/storage.js';

/**
 * Progresso de "Erros Comuns": checkbox "visto" em cada .erro-card + barra de progresso.
 * Persistido em localStorage ("devstudy-progress").
 */

const ProgressTracker = {
    storageKey: 'devstudy-progress',
    
    init() {
        this.loadProgress();
        this.addCheckboxes();
        this.updateProgressBar();
    },
    
    loadProgress() {
        const saved = readJSON(this.storageKey, {});
        return saved && typeof saved === 'object' ? saved : {};
    },
    
    saveProgress(progress) {
        writeJSON(this.storageKey, progress);
    },
    
    addCheckboxes() {
        document.querySelectorAll('.erro-card').forEach((card, index) => {
            const progress = this.loadProgress();
            const id = `erro-${index}`;
            const isChecked = progress[id] || false;
            
            // Adiciona checkbox no header do card
            const header = card.querySelector('.erro-header');
            if (header && !header.querySelector('.erro-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'erro-checkbox';
                checkbox.id = id;
                checkbox.checked = isChecked;
                checkbox.title = 'Marcar como visto';
                
                if (isChecked) {
                    card.classList.add('erro-viewed');
                }
                
                checkbox.addEventListener('change', (e) => {
                    const progress = this.loadProgress();
                    progress[id] = e.target.checked;
                    this.saveProgress(progress);
                    
                    if (e.target.checked) {
                        card.classList.add('erro-viewed');
                        Toast.success('Erro marcado como visto!');
                    } else {
                        card.classList.remove('erro-viewed');
                    }
                    
                    this.updateProgressBar();
                });
                
                header.insertBefore(checkbox, header.firstChild);
            }
        });
    },
    
    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (!progressBar) return;
        
        const total = document.querySelectorAll('.erro-card').length;
        const progress = this.loadProgress();
        const completed = Object.values(progress).filter(Boolean).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        progressBar.style.width = `${percentage}%`;
        if (progressText) {
            progressText.textContent = `${completed}/${total} erros vistos (${percentage}%)`;
        }
    }
};


export function initProgressTracker() {
    ProgressTracker.init();
}
