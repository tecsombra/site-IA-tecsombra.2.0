// Integração dos módulos de materiais e finanças
// Este arquivo integra os módulos de gerenciamento de materiais e finanças ao sistema principal

document.addEventListener('DOMContentLoaded', function() {
    // Adicionar links de navegação para os novos módulos
    addModuleNavLinks();
    
    // Adicionar containers para os novos módulos
    addModuleContainers();
    
    // Inicializar os módulos quando necessário
    setupModuleInitialization();
    
    // Carregar scripts externos necessários
    loadExternalScripts();
});

// Adicionar links de navegação para os novos módulos
function addModuleNavLinks() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se os links já existem
    if (document.getElementById('nav-materiais') && document.getElementById('nav-financas')) return;
    
    // Criar link para o módulo de materiais
    const materiaisLink = document.createElement('li');
    materiaisLink.className = 'nav-item';
    materiaisLink.id = 'nav-materiais';
    materiaisLink.innerHTML = `
        <a class="nav-link" href="#" data-module="materiais">
            <i class="bi bi-box-seam"></i> Materiais
        </a>
    `;
    
    // Criar link para o módulo de finanças
    const financasLink = document.createElement('li');
    financasLink.className = 'nav-item';
    financasLink.id = 'nav-financas';
    financasLink.innerHTML = `
        <a class="nav-link" href="#" data-module="financas">
            <i class="bi bi-graph-up"></i> Finanças
        </a>
    `;
    
    // Adicionar links ao menu de navegação
    navbarNav.appendChild(materiaisLink);
    navbarNav.appendChild(financasLink);
    
    // Adicionar event listeners para os links
    materiaisLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showModule('materiais');
    });
    
    financasLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showModule('financas');
    });
}

// Adicionar containers para os novos módulos
function addModuleContainers() {
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    // Verificar se os containers já existem
    if (document.getElementById('materials-management-container') && document.getElementById('finance-module-container')) return;
    
    // Criar container para o módulo de materiais
    const materiaisContainer = document.createElement('div');
    materiaisContainer.id = 'materials-management-container';
    materiaisContainer.className = 'module-container';
    materiaisContainer.style.display = 'none';
    
    // Criar container para o módulo de finanças
    const financasContainer = document.createElement('div');
    financasContainer.id = 'finance-module-container';
    financasContainer.className = 'module-container';
    financasContainer.style.display = 'none';
    
    // Adicionar containers ao container principal
    mainContainer.appendChild(materiaisContainer);
    mainContainer.appendChild(financasContainer);
}

// Configurar inicialização dos módulos
function setupModuleInitialization() {
    // Adicionar event listeners para os links de navegação
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('[data-module]')) {
            const moduleType = e.target.closest('[data-module]').getAttribute('data-module');
            showModule(moduleType);
        }
    });
}

// Mostrar módulo específico
function showModule(moduleType) {
    // Ocultar todos os containers de módulos
    const moduleContainers = document.querySelectorAll('.module-container');
    moduleContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // Ocultar container principal do sistema
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // Mostrar container do módulo selecionado
    if (moduleType === 'materiais') {
        const materiaisContainer = document.getElementById('materials-management-container');
        if (materiaisContainer) {
            materiaisContainer.style.display = 'block';
            
            // Inicializar módulo de materiais se ainda não foi inicializado
            if (window.materialsModule && typeof window.materialsModule.init === 'function') {
                window.materialsModule.init();
            }
        }
    } else if (moduleType === 'financas') {
        const financasContainer = document.getElementById('finance-module-container');
        if (financasContainer) {
            financasContainer.style.display = 'block';
            
            // Inicializar módulo de finanças se ainda não foi inicializado
            if (window.financeModule && typeof window.financeModule.init === 'function') {
                window.financeModule.init();
            }
        }
    } else if (moduleType === 'main') {
        // Mostrar container principal do sistema
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }
    
    // Atualizar links ativos no menu de navegação
    updateActiveNavLinks(moduleType);
}

// Atualizar links ativos no menu de navegação
function updateActiveNavLinks(activeModule) {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkModule = link.getAttribute('data-module');
        if (linkModule === activeModule) {
            link.classList.add('active');
        }
    });
}

// Carregar scripts externos necessários
function loadExternalScripts() {
    // Verificar se os scripts já foram carregados
    if (document.getElementById('materiais-script') && document.getElementById('catalogo-materiais-script') && document.getElementById('financas-script')) return;
    
    // Carregar script do módulo de gerenciamento de materiais
    const materiaisScript = document.createElement('script');
    materiaisScript.id = 'materiais-script';
    materiaisScript.src = '/static/js/gerenciador_materiais.js';
    document.head.appendChild(materiaisScript);
    
    // Carregar script do catálogo de materiais
    const catalogoScript = document.createElement('script');
    catalogoScript.id = 'catalogo-materiais-script';
    catalogoScript.src = '/static/js/catalogo_materiais.js';
    document.head.appendChild(catalogoScript);
    
    // Carregar script do módulo financeiro
    const financasScript = document.createElement('script');
    financasScript.id = 'financas-script';
    financasScript.src = '/static/js/modulo_financeiro.js';
    document.head.appendChild(financasScript);
    
    // Carregar Bootstrap Icons se ainda não estiver carregado
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const iconsLink = document.createElement('link');
        iconsLink.rel = 'stylesheet';
        iconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
        document.head.appendChild(iconsLink);
    }
}

// Adicionar estilos CSS para os novos módulos
function addModuleStyles() {
    // Verificar se os estilos já foram adicionados
    if (document.getElementById('module-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'module-styles';
    styleElement.textContent = `
        .module-container {
            padding: 20px 0;
        }
        
        .bg-success-light {
            background-color: rgba(40, 167, 69, 0.15);
        }
        
        .bg-danger-light {
            background-color: rgba(220, 53, 69, 0.15);
        }
        
        .bg-warning-light {
            background-color: rgba(255, 193, 7, 0.15);
        }
        
        .bg-info-light {
            background-color: rgba(23, 162, 184, 0.15);
        }
        
        .icon-box {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .period-navigation {
            display: flex;
            align-items: center;
        }
        
        .finance-dashboard .card {
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            border-radius: 0.5rem;
        }
        
        .finance-dashboard .card-header {
            background-color: transparent;
            border-bottom: 1px solid rgba(0, 0, 0, 0.125);
            padding: 1rem 1.25rem;
        }
        
        .table th {
            font-weight: 600;
            color: #495057;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Inicializar integração
document.addEventListener('DOMContentLoaded', function() {
    addModuleNavLinks();
    addModuleContainers();
    setupModuleInitialization();
    loadExternalScripts();
    addModuleStyles();
});
