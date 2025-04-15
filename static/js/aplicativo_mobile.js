// Aplicativo Mobile para Clientes de Serralheria
// Este módulo cria uma versão responsiva para dispositivos móveis

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o dispositivo é móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Inicializar o módulo mobile
    initMobileApp();
    
    // Se for um dispositivo móvel, mostrar a interface mobile por padrão
    if (isMobile) {
        setTimeout(() => {
            showMobileInterface();
        }, 500);
    }
});

// Variáveis globais
let mobileAppData = {
    projects: [],
    notifications: [],
    user: null,
    settings: {
        darkMode: false,
        notifications: true,
        language: 'pt-BR'
    }
};

// Função principal de inicialização
function initMobileApp() {
    // Criar container para o app mobile se não existir
    createMobileAppContainer();
    
    // Carregar dados do app mobile
    loadMobileAppData();
    
    // Configurar listeners de eventos
    setupMobileAppEventListeners();
    
    // Adicionar meta tag para viewport responsivo
    addResponsiveMetaTag();
    
    // Adicionar ícones para instalação como PWA
    setupPWASupport();
}

// Adicionar meta tag para viewport responsivo
function addResponsiveMetaTag() {
    // Verificar se a meta tag já existe
    let metaViewport = document.querySelector('meta[name="viewport"]');
    
    if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(metaViewport);
    }
}

// Configurar suporte a PWA (Progressive Web App)
function setupPWASupport() {
    // Adicionar link para ícone
    let linkIcon = document.querySelector('link[rel="icon"]');
    if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.rel = 'icon';
        linkIcon.href = '/static/img/logo.png';
        document.head.appendChild(linkIcon);
    }
    
    // Adicionar link para manifest.json
    let linkManifest = document.querySelector('link[rel="manifest"]');
    if (!linkManifest) {
        linkManifest = document.createElement('link');
        linkManifest.rel = 'manifest';
        linkManifest.href = '/static/manifest.json';
        document.head.appendChild(linkManifest);
    }
    
    // Adicionar meta tags para iOS
    let metaAppleMobile = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!metaAppleMobile) {
        metaAppleMobile = document.createElement('meta');
        metaAppleMobile.name = 'apple-mobile-web-app-capable';
        metaAppleMobile.content = 'yes';
        document.head.appendChild(metaAppleMobile);
    }
    
    let metaAppleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!metaAppleStatus) {
        metaAppleStatus = document.createElement('meta');
        metaAppleStatus.name = 'apple-mobile-web-app-status-bar-style';
        metaAppleStatus.content = 'black-translucent';
        document.head.appendChild(metaAppleStatus);
    }
    
    // Criar manifest.json se não existir
    createManifestFile();
    
    // Registrar service worker para funcionalidade offline
    registerServiceWorker();
}

// Criar arquivo manifest.json para PWA
function createManifestFile() {
    // Verificar se o diretório existe
    const manifestContent = {
        "name": "IA Serralheria",
        "short_name": "Serralheria",
        "description": "Aplicativo para gerenciamento de projetos de serralheria",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#007bff",
        "icons": [
            {
                "src": "/static/img/logo-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/static/img/logo-512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    };
    
    // Criar o arquivo manifest.json usando fetch ou XMLHttpRequest
    // Nota: Em um ambiente real, isso seria feito no servidor
    console.log("Manifest para PWA configurado:", manifestContent);
}

// Registrar service worker para funcionalidade offline
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/js/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar Service Worker:', error);
            });
    }
}

// Criar container para o app mobile
function createMobileAppContainer() {
    // Verificar se o container já existe
    const mobileAppContainer = document.getElementById('mobile-app-container');
    if (mobileAppContainer) return;
    
    // Criar container principal
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    const container = document.createElement('div');
    container.id = 'mobile-app-container';
    container.className = 'module-container';
    container.style.display = 'none';
    
    // Adicionar HTML para o app mobile
    container.innerHTML = `
        <div class="mobile-app">
            <!-- Tela de Login -->
            <div id="mobile-login-screen" class="mobile-screen">
                <div class="text-center mb-4 mt-5">
                    <img src="/static/img/logo.png" alt="Logo" class="mobile-logo" style="max-width: 120px;">
                    <h4 class="mt-3">IA Serralheria</h4>
                    <p class="text-muted">Acesse sua conta para visualizar seus projetos</p>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <form id="mobile-login-form">
                            <div class="mb-3">
                                <label for="mobile-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="mobile-email" placeholder="seu@email.com">
                            </div>
                            <div class="mb-3">
                                <label for="mobile-password" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="mobile-password" placeholder="Sua senha">
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="mobile-remember">
                                <label class="form-check-label" for="mobile-remember">Lembrar-me</label>
                            </div>
                            <button type="button" id="mobile-login-btn" class="btn btn-primary w-100">Entrar</button>
                        </form>
                        
                        <div class="text-center mt-3">
                            <a href="#" id="mobile-forgot-password">Esqueceu a senha?</a>
                        </div>
                        
                        <hr>
                        
                        <div class="text-center">
                            <p class="mb-2">Não tem uma conta?</p>
                            <button type="button" id="mobile-demo-btn" class="btn btn-outline-secondary w-100">
                                Acessar Demonstração
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tela Principal (Dashboard) -->
            <div id="mobile-dashboard-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <h5 class="mb-0">Dashboard</h5>
                    <div>
                        <button id="mobile-notifications-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-bell"></i>
                            <span class="badge bg-danger notification-badge">3</span>
                        </button>
                        <button id="mobile-profile-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-person-circle"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mobile-content">
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h6 class="mb-0">Projetos Ativos</h6>
                                <span class="badge bg-primary">4</span>
                            </div>
                            
                            <div class="progress mb-2" style="height: 8px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: 75%"></div>
                            </div>
                            
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">3 concluídos</small>
                                <small class="text-muted">1 em andamento</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="card h-100">
                                <div class="card-body text-center py-3">
                                    <i class="bi bi-calendar-check fs-3 text-primary mb-2"></i>
                                    <h6 class="mb-0">Próxima Entrega</h6>
                                    <p class="mb-0">15/04/2025</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card h-100">
                                <div class="card-body text-center py-3">
                                    <i class="bi bi-currency-dollar fs-3 text-success mb-2"></i>
                                    <h6 class="mb-0">Orçamentos</h6>
                                    <p class="mb-0">2 pendentes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h6 class="mb-3">Seus Projetos</h6>
                    
                    <div id="mobile-projects-list">
                        <div class="card mb-3 project-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Portão Residencial</h6>
                                        <p class="text-muted mb-2">Cliente: João Silva</p>
                                        <span class="badge bg-success">Em produção</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 2.850,00</p>
                                        <small class="text-muted">Entrega: 15/04/2025</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 project-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Guarda-corpo</h6>
                                        <p class="text-muted mb-2">Cliente: Maria Oliveira</p>
                                        <span class="badge bg-warning">Aguardando aprovação</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 1.950,00</p>
                                        <small class="text-muted">Orçamento: 10/04/2025</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 project-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Escada Metálica</h6>
                                        <p class="text-muted mb-2">Cliente: Carlos Mendes</p>
                                        <span class="badge bg-info">Aguardando material</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 4.200,00</p>
                                        <small class="text-muted">Entrega: 25/04/2025</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-3 mb-4">
                        <button id="mobile-view-all-projects-btn" class="btn btn-outline-primary">
                            Ver Todos os Projetos
                        </button>
                    </div>
                    
                    <h6 class="mb-3">Ações Rápidas</h6>
                    
                    <div class="row mb-4">
                        <div class="col-4">
                            <div class="text-center">
                                <button class="btn btn-light rounded-circle mb-2 quick-action-btn" id="mobile-new-project-btn">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                                <p class="small mb-0">Novo Projeto</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center">
                                <button class="btn btn-light rounded-circle mb-2 quick-action-btn" id="mobile-estimate-btn">
                                    <i class="bi bi-calculator"></i>
                                </button>
                                <p class="small mb-0">Orçamento</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center">
                                <button class="btn btn-light rounded-circle mb-2 quick-action-btn" id="mobile-gallery-btn">
                                    <i class="bi bi-images"></i>
                                </button>
                                <p class="small mb-0">Galeria</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mobile-footer">
                    <button class="footer-btn active" data-screen="dashboard">
                        <i class="bi bi-house"></i>
                        <span>Início</span>
                    </button>
                    <button class="footer-btn" data-screen="projects">
                        <i class="bi bi-kanban"></i>
                        <span>Projetos</span>
                    </button>
                    <button class="footer-btn" data-screen="estimates">
                        <i class="bi bi-calculator"></i>
                        <span>Orçamentos</span>
                    </button>
                    <button class="footer-btn" data-screen="clients">
                        <i class="bi bi-people"></i>
                        <span>Clientes</span>
                    </button>
                    <button class="footer-btn" data-screen="more">
                        <i class="bi bi-three-dots"></i>
                        <span>Mais</span>
                    </button>
                </div>
            </div>
            
            <!-- Tela de Projetos -->
            <div id="mobile-projects-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <h5 class="mb-0">Projetos</h5>
                    <div>
                        <button id="mobile-search-projects-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-search"></i>
                        </button>
                        <button id="mobile-add-project-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mobile-content">
                    <div class="mb-3">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary active" data-filter="all">Todos</button>
                            <button class="btn btn-outline-primary" data-filter="active">Ativos</button>
                            <button class="btn btn-outline-primary" data-filter="completed">Concluídos</button>
                        </div>
                    </div>
                    
                    <div id="mobile-projects-list-full">
                        <div class="card mb-3 project-card" data-status="active">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Portão Residencial</h6>
                                        <p class="text-muted mb-2">Cliente: João Silva</p>
                                        <span class="badge bg-success">Em produção</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 2.850,00</p>
                                        <small class="text-muted">Entrega: 15/04/2025</small>
                                    </div>
                                </div>
                                <div class="progress mt-2" style="height: 5px;">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: 75%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 project-card" data-status="active">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Guarda-corpo</h6>
                                        <p class="text-muted mb-2">Cliente: Maria Oliveira</p>
                                        <span class="badge bg-warning">Aguardando aprovação</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 1.950,00</p>
                                        <small class="text-muted">Orçamento: 10/04/2025</small>
                                    </div>
                                </div>
                                <div class="progress mt-2" style="height: 5px;">
                                    <div class="progress-bar bg-warning" role="progressbar" style="width: 30%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 project-card" data-status="active">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Escada Metálica</h6>
                                        <p class="text-muted mb-2">Cliente: Carlos Mendes</p>
                                        <span class="badge bg-info">Aguardando material</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 4.200,00</p>
                                        <small class="text-muted">Entrega: 25/04/2025</small>
                                    </div>
                                </div>
                                <div class="progress mt-2" style="height: 5px;">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: 45%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 project-card" data-status="completed">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Mezanino Comercial</h6>
                                        <p class="text-muted mb-2">Cliente: Empresa XYZ</p>
                                        <span class="badge bg-secondary">Concluído</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 12.500,00</p>
                                        <small class="text-muted">Entregue: 01/04/2025</small>
                                    </div>
                                </div>
                                <div class="progress mt-2" style="height: 5px;">
                                    <div class="progress-bar bg-secondary" role="progressbar" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 project-card" data-status="completed">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Grade de Proteção</h6>
                                        <p class="text-muted mb-2">Cliente: Ana Souza</p>
                                        <span class="badge bg-secondary">Concluído</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 1.200,00</p>
                                        <small class="text-muted">Entregue: 25/03/2025</small>
                                    </div>
                                </div>
                                <div class="progress mt-2" style="height: 5px;">
                                    <div class="progress-bar bg-secondary" role="progressbar" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mobile-footer">
                    <button class="footer-btn" data-screen="dashboard">
                        <i class="bi bi-house"></i>
                        <span>Início</span>
                    </button>
                    <button class="footer-btn active" data-screen="projects">
                        <i class="bi bi-kanban"></i>
                        <span>Projetos</span>
                    </button>
                    <button class="footer-btn" data-screen="estimates">
                        <i class="bi bi-calculator"></i>
                        <span>Orçamentos</span>
                    </button>
                    <button class="footer-btn" data-screen="clients">
                        <i class="bi bi-people"></i>
                        <span>Clientes</span>
                    </button>
                    <button class="footer-btn" data-screen="more">
                        <i class="bi bi-three-dots"></i>
                        <span>Mais</span>
                    </button>
                </div>
            </div>
            
            <!-- Tela de Orçamentos -->
            <div id="mobile-estimates-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <h5 class="mb-0">Orçamentos</h5>
                    <div>
                        <button id="mobile-search-estimates-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-search"></i>
                        </button>
                        <button id="mobile-add-estimate-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mobile-content">
                    <div class="mb-3">
                        <div class="btn-group w-100">
                            <button class="btn btn-outline-primary active" data-filter="all">Todos</button>
                            <button class="btn btn-outline-primary" data-filter="pending">Pendentes</button>
                            <button class="btn btn-outline-primary" data-filter="approved">Aprovados</button>
                        </div>
                    </div>
                    
                    <div id="mobile-estimates-list">
                        <div class="card mb-3 estimate-card" data-status="pending">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Guarda-corpo</h6>
                                        <p class="text-muted mb-2">Cliente: Maria Oliveira</p>
                                        <span class="badge bg-warning">Aguardando aprovação</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 1.950,00</p>
                                        <small class="text-muted">Enviado: 10/04/2025</small>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end mt-2">
                                    <button class="btn btn-sm btn-outline-primary me-2">
                                        <i class="bi bi-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-sm btn-outline-success">
                                        <i class="bi bi-share"></i> Enviar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 estimate-card" data-status="pending">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Cobertura Metálica</h6>
                                        <p class="text-muted mb-2">Cliente: Roberto Alves</p>
                                        <span class="badge bg-warning">Aguardando aprovação</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 5.800,00</p>
                                        <small class="text-muted">Enviado: 08/04/2025</small>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end mt-2">
                                    <button class="btn btn-sm btn-outline-primary me-2">
                                        <i class="bi bi-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-sm btn-outline-success">
                                        <i class="bi bi-share"></i> Enviar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 estimate-card" data-status="approved">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Portão Residencial</h6>
                                        <p class="text-muted mb-2">Cliente: João Silva</p>
                                        <span class="badge bg-success">Aprovado</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 2.850,00</p>
                                        <small class="text-muted">Aprovado: 05/04/2025</small>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end mt-2">
                                    <button class="btn btn-sm btn-outline-primary me-2">
                                        <i class="bi bi-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary">
                                        <i class="bi bi-file-pdf"></i> PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 estimate-card" data-status="approved">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">Escada Metálica</h6>
                                        <p class="text-muted mb-2">Cliente: Carlos Mendes</p>
                                        <span class="badge bg-success">Aprovado</span>
                                    </div>
                                    <div class="text-end">
                                        <p class="text-primary mb-1">R$ 4.200,00</p>
                                        <small class="text-muted">Aprovado: 02/04/2025</small>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end mt-2">
                                    <button class="btn btn-sm btn-outline-primary me-2">
                                        <i class="bi bi-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary">
                                        <i class="bi bi-file-pdf"></i> PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mobile-footer">
                    <button class="footer-btn" data-screen="dashboard">
                        <i class="bi bi-house"></i>
                        <span>Início</span>
                    </button>
                    <button class="footer-btn" data-screen="projects">
                        <i class="bi bi-kanban"></i>
                        <span>Projetos</span>
                    </button>
                    <button class="footer-btn active" data-screen="estimates">
                        <i class="bi bi-calculator"></i>
                        <span>Orçamentos</span>
                    </button>
                    <button class="footer-btn" data-screen="clients">
                        <i class="bi bi-people"></i>
                        <span>Clientes</span>
                    </button>
                    <button class="footer-btn" data-screen="more">
                        <i class="bi bi-three-dots"></i>
                        <span>Mais</span>
                    </button>
                </div>
            </div>
            
            <!-- Tela de Clientes -->
            <div id="mobile-clients-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <h5 class="mb-0">Clientes</h5>
                    <div>
                        <button id="mobile-search-clients-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-search"></i>
                        </button>
                        <button id="mobile-add-client-btn" class="btn btn-sm btn-icon">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mobile-content">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Buscar cliente..." id="mobile-client-search-input">
                        <button class="btn btn-outline-secondary" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                    
                    <div id="mobile-clients-list">
                        <div class="card mb-3 client-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="client-avatar me-3">
                                        <span>JS</span>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">João Silva</h6>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-telephone me-1"></i> (11) 98765-4321
                                        </p>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-envelope me-1"></i> joao.silva@email.com
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <span class="badge bg-primary">1 projeto ativo</span>
                                    <button class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-eye"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 client-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="client-avatar me-3">
                                        <span>MO</span>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Maria Oliveira</h6>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-telephone me-1"></i> (11) 91234-5678
                                        </p>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-envelope me-1"></i> maria.oliveira@email.com
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <span class="badge bg-warning">1 orçamento pendente</span>
                                    <button class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-eye"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 client-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="client-avatar me-3">
                                        <span>CM</span>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Carlos Mendes</h6>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-telephone me-1"></i> (11) 97654-3210
                                        </p>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-envelope me-1"></i> carlos.mendes@email.com
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <span class="badge bg-primary">1 projeto ativo</span>
                                    <button class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-eye"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 client-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="client-avatar me-3">
                                        <span>EX</span>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Empresa XYZ</h6>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-telephone me-1"></i> (11) 3456-7890
                                        </p>
                                        <p class="text-muted mb-0 small">
                                            <i class="bi bi-envelope me-1"></i> contato@empresaxyz.com
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <span class="badge bg-secondary">1 projeto concluído</span>
                                    <button class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-eye"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mobile-footer">
                    <button class="footer-btn" data-screen="dashboard">
                        <i class="bi bi-house"></i>
                        <span>Início</span>
                    </button>
                    <button class="footer-btn" data-screen="projects">
                        <i class="bi bi-kanban"></i>
                        <span>Projetos</span>
                    </button>
                    <button class="footer-btn" data-screen="estimates">
                        <i class="bi bi-calculator"></i>
                        <span>Orçamentos</span>
                    </button>
                    <button class="footer-btn active" data-screen="clients">
                        <i class="bi bi-people"></i>
                        <span>Clientes</span>
                    </button>
                    <button class="footer-btn" data-screen="more">
                        <i class="bi bi-three-dots"></i>
                        <span>Mais</span>
                    </button>
                </div>
            </div>
            
            <!-- Tela de Mais Opções -->
            <div id="mobile-more-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <h5 class="mb-0">Mais Opções</h5>
                </div>
                
                <div class="mobile-content">
                    <div class="list-group mb-4">
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-visualizador-3d-btn">
                            <div>
                                <i class="bi bi-cube me-2"></i>
                                Visualizador 3D
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-materials-btn">
                            <div>
                                <i class="bi bi-tools me-2"></i>
                                Catálogo de Materiais
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-finances-btn">
                            <div>
                                <i class="bi bi-graph-up me-2"></i>
                                Finanças
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-gallery-link-btn">
                            <div>
                                <i class="bi bi-images me-2"></i>
                                Galeria de Projetos
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                    
                    <div class="list-group mb-4">
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-settings-btn">
                            <div>
                                <i class="bi bi-gear me-2"></i>
                                Configurações
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-help-btn">
                            <div>
                                <i class="bi bi-question-circle me-2"></i>
                                Ajuda e Suporte
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="mobile-about-btn">
                            <div>
                                <i class="bi bi-info-circle me-2"></i>
                                Sobre o App
                            </div>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Versão do Aplicativo</h6>
                            <p class="mb-0">IA Serralheria v1.0.0</p>
                            <p class="text-muted small mb-0">Última atualização: 15/04/2025</p>
                        </div>
                    </div>
                    
                    <button id="mobile-logout-btn" class="btn btn-outline-danger w-100 mb-4">
                        <i class="bi bi-box-arrow-right me-2"></i>
                        Sair da Conta
                    </button>
                </div>
                
                <div class="mobile-footer">
                    <button class="footer-btn" data-screen="dashboard">
                        <i class="bi bi-house"></i>
                        <span>Início</span>
                    </button>
                    <button class="footer-btn" data-screen="projects">
                        <i class="bi bi-kanban"></i>
                        <span>Projetos</span>
                    </button>
                    <button class="footer-btn" data-screen="estimates">
                        <i class="bi bi-calculator"></i>
                        <span>Orçamentos</span>
                    </button>
                    <button class="footer-btn" data-screen="clients">
                        <i class="bi bi-people"></i>
                        <span>Clientes</span>
                    </button>
                    <button class="footer-btn active" data-screen="more">
                        <i class="bi bi-three-dots"></i>
                        <span>Mais</span>
                    </button>
                </div>
            </div>
            
            <!-- Tela de Notificações -->
            <div id="mobile-notifications-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <button class="btn btn-sm btn-icon me-2" id="mobile-back-from-notifications-btn">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <h5 class="mb-0">Notificações</h5>
                    <button class="btn btn-sm btn-icon" id="mobile-clear-notifications-btn">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                
                <div class="mobile-content">
                    <div id="mobile-notifications-list">
                        <div class="card mb-3 notification-card unread">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="notification-icon me-3 bg-primary">
                                        <i class="bi bi-bell"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Orçamento Aprovado</h6>
                                        <p class="mb-1">O orçamento para o projeto "Portão Residencial" foi aprovado pelo cliente.</p>
                                        <p class="text-muted mb-0 small">Hoje, 10:30</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 notification-card unread">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="notification-icon me-3 bg-warning">
                                        <i class="bi bi-exclamation-triangle"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Material em Falta</h6>
                                        <p class="mb-1">O material "Metalon 40x60" está em falta no estoque. Verifique com o fornecedor.</p>
                                        <p class="text-muted mb-0 small">Hoje, 09:15</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 notification-card unread">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="notification-icon me-3 bg-success">
                                        <i class="bi bi-calendar-check"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Entrega Agendada</h6>
                                        <p class="mb-1">A entrega do projeto "Escada Metálica" foi agendada para 25/04/2025.</p>
                                        <p class="text-muted mb-0 small">Ontem, 16:45</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 notification-card">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="notification-icon me-3 bg-info">
                                        <i class="bi bi-people"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Novo Cliente</h6>
                                        <p class="mb-1">Um novo cliente foi cadastrado: "Roberto Alves".</p>
                                        <p class="text-muted mb-0 small">12/04/2025, 11:20</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mb-3 notification-card">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="notification-icon me-3 bg-secondary">
                                        <i class="bi bi-gear"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1">Atualização do Sistema</h6>
                                        <p class="mb-1">O sistema foi atualizado para a versão 1.0.0 com novas funcionalidades.</p>
                                        <p class="text-muted mb-0 small">10/04/2025, 08:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tela de Perfil -->
            <div id="mobile-profile-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <button class="btn btn-sm btn-icon me-2" id="mobile-back-from-profile-btn">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <h5 class="mb-0">Perfil</h5>
                    <button class="btn btn-sm btn-icon" id="mobile-edit-profile-btn">
                        <i class="bi bi-pencil"></i>
                    </button>
                </div>
                
                <div class="mobile-content">
                    <div class="text-center mb-4">
                        <div class="profile-avatar mx-auto mb-3">
                            <span>US</span>
                        </div>
                        <h5 class="mb-1">Usuário Demo</h5>
                        <p class="text-muted mb-0">usuario@demo.com</p>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Informações Pessoais</h6>
                            
                            <div class="mb-3">
                                <p class="text-muted mb-1 small">Nome</p>
                                <p class="mb-0">Usuário Demo</p>
                            </div>
                            
                            <div class="mb-3">
                                <p class="text-muted mb-1 small">Email</p>
                                <p class="mb-0">usuario@demo.com</p>
                            </div>
                            
                            <div class="mb-3">
                                <p class="text-muted mb-1 small">Telefone</p>
                                <p class="mb-0">(11) 98765-4321</p>
                            </div>
                            
                            <div>
                                <p class="text-muted mb-1 small">Cargo</p>
                                <p class="mb-0">Administrador</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Estatísticas</h6>
                            
                            <div class="row text-center">
                                <div class="col-4">
                                    <h5 class="mb-1">4</h5>
                                    <p class="text-muted small mb-0">Projetos Ativos</p>
                                </div>
                                <div class="col-4">
                                    <h5 class="mb-1">2</h5>
                                    <p class="text-muted small mb-0">Orçamentos</p>
                                </div>
                                <div class="col-4">
                                    <h5 class="mb-1">5</h5>
                                    <p class="text-muted small mb-0">Clientes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Segurança</h6>
                            
                            <a href="#" class="d-flex justify-content-between align-items-center mb-3">
                                <span>Alterar Senha</span>
                                <i class="bi bi-chevron-right"></i>
                            </a>
                            
                            <a href="#" class="d-flex justify-content-between align-items-center">
                                <span>Configurações de Privacidade</span>
                                <i class="bi bi-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tela de Configurações -->
            <div id="mobile-settings-screen" class="mobile-screen" style="display: none;">
                <div class="mobile-header">
                    <button class="btn btn-sm btn-icon me-2" id="mobile-back-from-settings-btn">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <h5 class="mb-0">Configurações</h5>
                </div>
                
                <div class="mobile-content">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Aparência</h6>
                            
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="mobile-dark-mode-switch">
                                <label class="form-check-label" for="mobile-dark-mode-switch">Modo Escuro</label>
                            </div>
                            
                            <div class="mb-3">
                                <label for="mobile-font-size" class="form-label">Tamanho da Fonte</label>
                                <select class="form-select" id="mobile-font-size">
                                    <option value="small">Pequeno</option>
                                    <option value="medium" selected>Médio</option>
                                    <option value="large">Grande</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Notificações</h6>
                            
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="mobile-push-notifications-switch" checked>
                                <label class="form-check-label" for="mobile-push-notifications-switch">Notificações Push</label>
                            </div>
                            
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="mobile-email-notifications-switch" checked>
                                <label class="form-check-label" for="mobile-email-notifications-switch">Notificações por Email</label>
                            </div>
                            
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="mobile-sound-notifications-switch" checked>
                                <label class="form-check-label" for="mobile-sound-notifications-switch">Sons de Notificação</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Idioma e Região</h6>
                            
                            <div class="mb-3">
                                <label for="mobile-language" class="form-label">Idioma</label>
                                <select class="form-select" id="mobile-language">
                                    <option value="pt-BR" selected>Português (Brasil)</option>
                                    <option value="en-US">English (US)</option>
                                    <option value="es-ES">Español</option>
                                </select>
                            </div>
                            
                            <div>
                                <label for="mobile-currency" class="form-label">Moeda</label>
                                <select class="form-select" id="mobile-currency">
                                    <option value="BRL" selected>Real (R$)</option>
                                    <option value="USD">Dólar (US$)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Armazenamento</h6>
                            
                            <div class="mb-3">
                                <p class="text-muted mb-1 small">Espaço Utilizado</p>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-primary" role="progressbar" style="width: 35%"></div>
                                </div>
                                <div class="d-flex justify-content-between mt-1">
                                    <small class="text-muted">35 MB</small>
                                    <small class="text-muted">100 MB</small>
                                </div>
                            </div>
                            
                            <button class="btn btn-outline-danger btn-sm">
                                <i class="bi bi-trash me-1"></i> Limpar Cache
                            </button>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-3">Backup e Sincronização</h6>
                            
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="mobile-auto-sync-switch" checked>
                                <label class="form-check-label" for="mobile-auto-sync-switch">Sincronização Automática</label>
                            </div>
                            
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="bi bi-cloud-upload me-1"></i> Backup
                                </button>
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="bi bi-cloud-download me-1"></i> Restaurar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            /* Estilos para o aplicativo mobile */
            .mobile-app {
                max-width: 480px;
                margin: 0 auto;
                background-color: #f8f9fa;
                min-height: 100vh;
                position: relative;
            }
            
            .mobile-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background-color: #fff;
                border-bottom: 1px solid #dee2e6;
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            
            .mobile-content {
                padding: 15px;
                padding-bottom: 80px;
            }
            
            .mobile-footer {
                display: flex;
                justify-content: space-between;
                background-color: #fff;
                border-top: 1px solid #dee2e6;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                max-width: 480px;
                margin: 0 auto;
            }
            
            .footer-btn {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px 0;
                background: none;
                border: none;
                color: #6c757d;
                font-size: 0.8rem;
            }
            
            .footer-btn i {
                font-size: 1.2rem;
                margin-bottom: 4px;
            }
            
            .footer-btn.active {
                color: #007bff;
            }
            
            .btn-icon {
                width: 36px;
                height: 36px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background-color: #f8f9fa;
            }
            
            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                font-size: 0.6rem;
                padding: 2px 5px;
            }
            
            .quick-action-btn {
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .project-card, .estimate-card, .client-card, .notification-card {
                transition: transform 0.2s;
            }
            
            .project-card:active, .estimate-card:active, .client-card:active, .notification-card:active {
                transform: scale(0.98);
            }
            
            .client-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #e9ecef;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #495057;
            }
            
            .profile-avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background-color: #e9ecef;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 2rem;
                color: #495057;
            }
            
            .notification-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .notification-card.unread {
                border-left: 3px solid #007bff;
            }
            
            /* Estilos para modo escuro */
            .dark-mode {
                background-color: #212529;
                color: #f8f9fa;
            }
            
            .dark-mode .mobile-header,
            .dark-mode .mobile-footer,
            .dark-mode .card {
                background-color: #343a40;
                border-color: #495057;
            }
            
            .dark-mode .text-muted {
                color: #adb5bd !important;
            }
            
            .dark-mode .btn-light {
                background-color: #495057;
                border-color: #6c757d;
                color: #f8f9fa;
            }
            
            .dark-mode .form-control,
            .dark-mode .form-select {
                background-color: #495057;
                border-color: #6c757d;
                color: #f8f9fa;
            }
            
            /* Estilos responsivos */
            @media (max-width: 576px) {
                .mobile-app {
                    max-width: none;
                }
                
                .mobile-footer {
                    max-width: none;
                }
            }
        </style>
    `;
    
    mainContainer.appendChild(container);
    
    // Adicionar link de navegação para o app mobile
    addMobileAppNavLink();
}

// Adicionar link de navegação para o app mobile
function addMobileAppNavLink() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se o link já existe
    if (document.getElementById('nav-mobile-app')) return;
    
    // Criar link para o módulo de app mobile
    const mobileAppLink = document.createElement('li');
    mobileAppLink.className = 'nav-item';
    mobileAppLink.id = 'nav-mobile-app';
    mobileAppLink.innerHTML = `
        <a class="nav-link" href="#" data-module="mobile-app">
            <i class="bi bi-phone"></i> App Mobile
        </a>
    `;
    
    // Adicionar link ao menu de navegação
    navbarNav.appendChild(mobileAppLink);
    
    // Adicionar event listener para o link
    mobileAppLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showMobileInterface();
    });
}

// Mostrar a interface mobile
function showMobileInterface() {
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
    
    // Mostrar container do app mobile
    const mobileAppContainer = document.getElementById('mobile-app-container');
    if (mobileAppContainer) {
        mobileAppContainer.style.display = 'block';
    }
    
    // Atualizar links ativos no menu de navegação
    updateActiveNavLinks('mobile-app');
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

// Carregar dados do app mobile
function loadMobileAppData() {
    // Carregar dados do localStorage se disponível
    const storedData = localStorage.getItem('serralheria_mobile_app_data');
    if (storedData) {
        mobileAppData = JSON.parse(storedData);
        return;
    }
    
    // Caso contrário, inicializar com dados padrão
    initializeDefaultMobileAppData();
}

// Inicializar dados padrão do app mobile
function initializeDefaultMobileAppData() {
    // Projetos de exemplo
    mobileAppData.projects = [
        {
            id: '1',
            name: 'Portão Residencial',
            client: 'João Silva',
            status: 'production',
            statusText: 'Em produção',
            price: 2850.0,
            deliveryDate: '2025-04-15',
            progress: 75
        },
        {
            id: '2',
            name: 'Guarda-corpo',
            client: 'Maria Oliveira',
            status: 'pending',
            statusText: 'Aguardando aprovação',
            price: 1950.0,
            deliveryDate: '2025-04-20',
            progress: 30
        },
        {
            id: '3',
            name: 'Escada Metálica',
            client: 'Carlos Mendes',
            status: 'waiting',
            statusText: 'Aguardando material',
            price: 4200.0,
            deliveryDate: '2025-04-25',
            progress: 45
        },
        {
            id: '4',
            name: 'Mezanino Comercial',
            client: 'Empresa XYZ',
            status: 'completed',
            statusText: 'Concluído',
            price: 12500.0,
            deliveryDate: '2025-04-01',
            progress: 100
        },
        {
            id: '5',
            name: 'Grade de Proteção',
            client: 'Ana Souza',
            status: 'completed',
            statusText: 'Concluído',
            price: 1200.0,
            deliveryDate: '2025-03-25',
            progress: 100
        }
    ];
    
    // Notificações de exemplo
    mobileAppData.notifications = [
        {
            id: '1',
            title: 'Orçamento Aprovado',
            message: 'O orçamento para o projeto "Portão Residencial" foi aprovado pelo cliente.',
            date: '2025-04-15T10:30:00',
            type: 'primary',
            icon: 'bell',
            read: false
        },
        {
            id: '2',
            title: 'Material em Falta',
            message: 'O material "Metalon 40x60" está em falta no estoque. Verifique com o fornecedor.',
            date: '2025-04-15T09:15:00',
            type: 'warning',
            icon: 'exclamation-triangle',
            read: false
        },
        {
            id: '3',
            title: 'Entrega Agendada',
            message: 'A entrega do projeto "Escada Metálica" foi agendada para 25/04/2025.',
            date: '2025-04-14T16:45:00',
            type: 'success',
            icon: 'calendar-check',
            read: false
        },
        {
            id: '4',
            title: 'Novo Cliente',
            message: 'Um novo cliente foi cadastrado: "Roberto Alves".',
            date: '2025-04-12T11:20:00',
            type: 'info',
            icon: 'people',
            read: true
        },
        {
            id: '5',
            title: 'Atualização do Sistema',
            message: 'O sistema foi atualizado para a versão 1.0.0 com novas funcionalidades.',
            date: '2025-04-10T08:00:00',
            type: 'secondary',
            icon: 'gear',
            read: true
        }
    ];
    
    // Usuário de exemplo
    mobileAppData.user = {
        name: 'Usuário Demo',
        email: 'usuario@demo.com',
        phone: '(11) 98765-4321',
        role: 'Administrador',
        avatar: 'US'
    };
    
    // Configurações padrão
    mobileAppData.settings = {
        darkMode: false,
        notifications: true,
        language: 'pt-BR',
        currency: 'BRL',
        fontSize: 'medium',
        pushNotifications: true,
        emailNotifications: true,
        soundNotifications: true,
        autoSync: true
    };
    
    // Salvar no localStorage
    saveMobileAppData();
}

// Salvar dados do app mobile
function saveMobileAppData() {
    localStorage.setItem('serralheria_mobile_app_data', JSON.stringify(mobileAppData));
}

// Configurar listeners de eventos
function setupMobileAppEventListeners() {
    document.addEventListener('click', function(e) {
        // Botão de login
        if (e.target && e.target.id === 'mobile-login-btn') {
            handleLogin();
        }
        
        // Botão de demonstração
        if (e.target && e.target.id === 'mobile-demo-btn') {
            handleDemoLogin();
        }
        
        // Botões do menu de navegação inferior
        if (e.target && (e.target.classList.contains('footer-btn') || e.target.parentElement.classList.contains('footer-btn'))) {
            const button = e.target.classList.contains('footer-btn') ? e.target : e.target.parentElement;
            const screen = button.getAttribute('data-screen');
            if (screen) {
                showMobileScreen(screen);
            }
        }
        
        // Botão de notificações
        if (e.target && (e.target.id === 'mobile-notifications-btn' || e.target.closest('#mobile-notifications-btn'))) {
            showMobileScreen('notifications');
        }
        
        // Botão de perfil
        if (e.target && (e.target.id === 'mobile-profile-btn' || e.target.closest('#mobile-profile-btn'))) {
            showMobileScreen('profile');
        }
        
        // Botão de voltar das notificações
        if (e.target && (e.target.id === 'mobile-back-from-notifications-btn' || e.target.closest('#mobile-back-from-notifications-btn'))) {
            showMobileScreen('dashboard');
        }
        
        // Botão de voltar do perfil
        if (e.target && (e.target.id === 'mobile-back-from-profile-btn' || e.target.closest('#mobile-back-from-profile-btn'))) {
            showMobileScreen('dashboard');
        }
        
        // Botão de voltar das configurações
        if (e.target && (e.target.id === 'mobile-back-from-settings-btn' || e.target.closest('#mobile-back-from-settings-btn'))) {
            showMobileScreen('more');
        }
        
        // Botão de configurações
        if (e.target && (e.target.id === 'mobile-settings-btn' || e.target.closest('#mobile-settings-btn'))) {
            showMobileScreen('settings');
        }
        
        // Botão de logout
        if (e.target && e.target.id === 'mobile-logout-btn') {
            handleLogout();
        }
        
        // Botão de visualizador 3D
        if (e.target && (e.target.id === 'mobile-visualizador-3d-btn' || e.target.closest('#mobile-visualizador-3d-btn'))) {
            // Verificar se o visualizador 3D está disponível
            if (window.visualizador3D && typeof window.visualizador3D.show === 'function') {
                window.visualizador3D.show();
            } else {
                alert('O Visualizador 3D está sendo carregado. Por favor, tente novamente em alguns instantes.');
            }
        }
        
        // Botão de estimativa
        if (e.target && (e.target.id === 'mobile-estimate-btn' || e.target.closest('#mobile-estimate-btn'))) {
            // Verificar se o estimador está disponível
            if (window.estimatorModule && typeof window.estimatorModule.show === 'function') {
                window.estimatorModule.show();
            } else {
                showMobileScreen('estimates');
            }
        }
        
        // Filtros de projetos
        if (e.target && e.target.hasAttribute('data-filter')) {
            const filter = e.target.getAttribute('data-filter');
            filterProjects(filter);
            
            // Atualizar botões ativos
            const filterButtons = document.querySelectorAll('[data-filter]');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    });
    
    // Listener para alternar modo escuro
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'mobile-dark-mode-switch') {
            toggleDarkMode(e.target.checked);
        }
    });
}

// Manipular login
function handleLogin() {
    const email = document.getElementById('mobile-email').value;
    const password = document.getElementById('mobile-password').value;
    
    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Em um ambiente real, aqui seria feita a autenticação com o servidor
    // Para demonstração, apenas simular o login
    showMobileScreen('dashboard');
}

// Manipular login de demonstração
function handleDemoLogin() {
    showMobileScreen('dashboard');
}

// Manipular logout
function handleLogout() {
    showMobileScreen('login');
}

// Mostrar tela específica do app mobile
function showMobileScreen(screenName) {
    // Ocultar todas as telas
    const screens = document.querySelectorAll('.mobile-screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Mostrar a tela solicitada
    const targetScreen = document.getElementById(`mobile-${screenName}-screen`);
    if (targetScreen) {
        targetScreen.style.display = 'block';
    }
    
    // Atualizar botões ativos no menu de navegação inferior
    if (['dashboard', 'projects', 'estimates', 'clients', 'more'].includes(screenName)) {
        const footerButtons = document.querySelectorAll('.footer-btn');
        footerButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-screen') === screenName) {
                btn.classList.add('active');
            }
        });
    }
}

// Alternar modo escuro
function toggleDarkMode(enabled) {
    const mobileApp = document.querySelector('.mobile-app');
    if (!mobileApp) return;
    
    if (enabled) {
        mobileApp.classList.add('dark-mode');
    } else {
        mobileApp.classList.remove('dark-mode');
    }
    
    // Salvar preferência
    mobileAppData.settings.darkMode = enabled;
    saveMobileAppData();
}

// Filtrar projetos
function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const status = card.getAttribute('data-status');
        
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'active' && status !== 'completed') {
            card.style.display = 'block';
        } else if (filter === 'completed' && status === 'completed') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Exportar funções para uso em outros módulos
window.mobileApp = {
    init: initMobileApp,
    show: showMobileInterface
};
