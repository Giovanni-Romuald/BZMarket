// messages_script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les messages Django
    initDjangoMessages();
    
    // Fonction pour afficher un nouveau message
    window.showMessage = function(message, type = 'info', autoDismiss = true) {
        createMessageElement(message, type, autoDismiss);
    };
    
    // Fonction pour masquer tous les messages
    window.hideAllMessages = function() {
        document.querySelectorAll('.alert').forEach(alert => {
            hideMessage(alert);
        });
    };
});

function initDjangoMessages() {
    // Trouver tous les conteneurs de messages
    const messageContainers = document.querySelectorAll('.messages-container');
    
    messageContainers.forEach(container => {
        const messages = container.querySelectorAll('.alert');
        
        messages.forEach(message => {
            // Ajouter les classes pour l'animation
            message.classList.add('show');
            
            // Ajouter l'icône appropriée
            addMessageIcon(message);
            
            // Configurer la disparition automatique après 6 secondes
            if (!message.classList.contains('manual-dismiss')) {
                message.classList.add('auto-dismiss');
                setupAutoDismiss(message);
            }
            
            // Configurer le bouton de fermeture
            const closeBtn = message.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    hideMessage(message);
                });
            }
        });
    });
}

function createMessageElement(message, type = 'info', autoDismiss = true) {
    // Créer le conteneur s'il n'existe pas
    let container = document.querySelector('.messages-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'messages-container';
        document.body.appendChild(container);
    }
    
    // Créer l'élément de message
    const messageEl = document.createElement('div');
    messageEl.className = `alert alert-${type}`;
    messageEl.setAttribute('role', 'alert');
    
    // Créer le contenu
    messageEl.innerHTML = `
        <div class="alert-icon"></div>
        <div class="alert-content">${message}</div>
        <button type="button" class="btn-close" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Ajouter au conteneur
    container.appendChild(messageEl);
    
    // Forcer le reflow pour l'animation
    void messageEl.offsetWidth;
    
    // Afficher avec animation
    messageEl.classList.add('show');
    
    // Ajouter l'icône
    addMessageIcon(messageEl);
    
    // Configurer la disparition
    if (autoDismiss) {
        messageEl.classList.add('auto-dismiss');
        setupAutoDismiss(messageEl);
    } else {
        messageEl.classList.add('manual-dismiss');
    }
    
    // Configurer le bouton de fermeture
    const closeBtn = messageEl.querySelector('.btn-close');
    closeBtn.addEventListener('click', function() {
        hideMessage(messageEl);
    });
    
    return messageEl;
}

function addMessageIcon(messageEl) {
    const iconContainer = messageEl.querySelector('.alert-icon');
    if (!iconContainer) return;
    
    let iconClass = 'fas fa-info-circle';
    
    // Déterminer l'icône en fonction du type
    if (messageEl.classList.contains('alert-success')) {
        iconClass = 'fas fa-check-circle';
    } else if (messageEl.classList.contains('alert-error') || messageEl.classList.contains('alert-danger')) {
        iconClass = 'fas fa-exclamation-circle';
    } else if (messageEl.classList.contains('alert-warning')) {
        iconClass = 'fas fa-exclamation-triangle';
    } else if (messageEl.classList.contains('alert-debug')) {
        iconClass = 'fas fa-bug';
    }
    
    iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
}

function setupAutoDismiss(messageEl) {
    // Démarrer l'animation de la barre de progression
    const countdownBar = messageEl.querySelector('.countdown-bar');
    
    // Masquer après 6 secondes
    const dismissTimeout = setTimeout(() => {
        hideMessage(messageEl);
    }, 6000);
    
    // Stocker le timeout pour pouvoir l'annuler si nécessaire
    messageEl.dataset.dismissTimeout = dismissTimeout;
    
    // Arrêter le timeout si l'utilisateur survole le message
    messageEl.addEventListener('mouseenter', function() {
        clearTimeout(dismissTimeout);
        
        // Arrêter l'animation de la barre de progression
        const beforeStyle = window.getComputedStyle(this, '::before');
        if (beforeStyle.animationName === 'countdown') {
            this.style.setProperty('--animation-play-state', 'paused');
        }
    });
    
    // Reprendre le timeout quand la souris quitte
    messageEl.addEventListener('mouseleave', function() {
        const remainingTime = 6000 - (Date.now() - parseInt(this.dataset.createdAt || Date.now()));
        
        if (remainingTime > 0) {
            this.dataset.dismissTimeout = setTimeout(() => {
                hideMessage(messageEl);
            }, remainingTime);
            
            // Reprendre l'animation de la barre
            this.style.setProperty('--animation-play-state', 'running');
        }
    });
    
    // Enregistrer le temps de création
    if (!messageEl.dataset.createdAt) {
        messageEl.dataset.createdAt = Date.now();
    }
}

function hideMessage(messageEl) {
    // Annuler le timeout s'il existe
    if (messageEl.dataset.dismissTimeout) {
        clearTimeout(messageEl.dataset.dismissTimeout);
    }
    
    // Animation de sortie
    messageEl.style.animation = 'slideOutRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    
    // Supprimer après l'animation
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
        
        // Supprimer le conteneur s'il est vide
        const container = document.querySelector('.messages-container');
        if (container && container.children.length === 0) {
            container.parentNode.removeChild(container);
        }
    }, 500);
}

// Fonction utilitaire pour convertir les messages Django
window.convertDjangoMessages = function() {
    // Cette fonction peut être utilisée pour convertir les messages Django existants
    // en cas d'ajout dynamique après le chargement de la page
    initDjangoMessages();
};

// Support pour les événements personnalisés
document.addEventListener('django-message', function(e) {
    if (e.detail && e.detail.message) {
        showMessage(e.detail.message, e.detail.type || 'info', e.detail.autoDismiss !== false);
    }
});

// Exemple d'utilisation programmatique :
// window.showMessage('Opération réussie !', 'success');
// window.showMessage('Une erreur est survenue', 'error', false);