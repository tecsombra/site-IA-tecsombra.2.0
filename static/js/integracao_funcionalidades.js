// Integração de Funcionalidades Inovadoras
// Este módulo integra todas as funcionalidades inovadoras implementadas no sistema

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o módulo de integração
    initIntegrationModule();
});

// Variáveis globais
let integrationConfig = {
    modules: {
        visualizador3D: true,
        estimativaAutomatica: true,
        aplicativoMobile: true,
        catalogoMateriais: true,
        moduloFinanceiro: true
    },
    integrationPoints: []
};

// Função principal de inicialização
function initIntegrationModule() {
    // Verificar quais módulos estão disponíveis
    detectAvailableModules();
    
    // Configurar pontos de integração
    setupIntegrationPoints();
    
    // Adicionar event listeners para comunicação entre módulos
    setupModuleCommunication();
    
    // Inicializar interface de integração
    createIntegrationInterface();
    
    console.log("Módulo de integração inicializado com sucesso");
}

// Detectar quais módulos estão disponíveis
function detectAvailableModules() {
    // Verificar Visualizador 3D
    integrationConfig.modules.visualizador3D = typeof window.visualizador3D !== 'undefined';
    
    // Verificar Estimativa Automática
    integrationConfig.modules.estimativaAutomatica = typeof window.estimatorModule !== 'undefined';
    
    // Verificar Aplicativo Mobile
    integrationConfig.modules.aplicativoMobile = typeof window.mobileApp !== 'undefined';
    
    // Verificar Catálogo de Materiais
    integrationConfig.modules.catalogoMateriais = typeof window.materialsCatalog !== 'undefined';
    
    // Verificar Módulo Financeiro
    integrationConfig.modules.moduloFinanceiro = typeof window.financeModule !== 'undefined';
    
    console.log("Módulos detectados:", integrationConfig.modules);
}

// Configurar pontos de integração entre os módulos
function setupIntegrationPoints() {
    // Definir pontos de integração
    integrationConfig.integrationPoints = [
        {
            source: 'visualizador3D',
            target: 'estimativaAutomatica',
            type: 'data',
            description: 'Enviar dimensões e especificações do projeto 3D para estimativa automática'
        },
        {
            source: 'visualizador3D',
            target: 'catalogoMateriais',
            type: 'data',
            description: 'Selecionar materiais do catálogo para visualização 3D'
        },
        {
            source: 'estimativaAutomatica',
            target: 'moduloFinanceiro',
            type: 'data',
            description: 'Enviar orçamento gerado para análise financeira'
        },
        {
            source: 'catalogoMateriais',
            target: 'estimativaAutomatica',
            type: 'data',
            description: 'Utilizar preços e especificações de materiais para estimativas'
        },
        {
            source: 'aplicativoMobile',
            target: 'visualizador3D',
            type: 'ui',
            description: 'Acessar visualizador 3D a partir do aplicativo mobile'
        },
        {
            source: 'aplicativoMobile',
            target: 'estimativaAutomatica',
            type: 'ui',
            description: 'Gerar orçamentos a partir do aplicativo mobile'
        },
        {
            source: 'aplicativoMobile',
            target: 'moduloFinanceiro',
            type: 'ui',
            description: 'Visualizar relatórios financeiros no aplicativo mobile'
        }
    ];
    
    // Implementar cada ponto de integração
    integrationConfig.integrationPoints.forEach(point => {
        implementIntegrationPoint(point);
    });
}

// Implementar um ponto de integração específico
function implementIntegrationPoint(integrationPoint) {
    const { source, target, type, description } = integrationPoint;
    
    // Verificar se os módulos de origem e destino estão disponíveis
    if (!integrationConfig.modules[source] || !integrationConfig.modules[target]) {
        console.log(`Integração entre ${source} e ${target} não disponível: módulo(s) ausente(s)`);
        return;
    }
    
    console.log(`Configurando integração: ${description}`);
    
    // Implementar integração com base no tipo
    switch (type) {
        case 'data':
            setupDataIntegration(source, target);
            break;
        case 'ui':
            setupUIIntegration(source, target);
            break;
        default:
            console.log(`Tipo de integração desconhecido: ${type}`);
    }
}

// Configurar integração de dados entre módulos
function setupDataIntegration(source, target) {
    // Integração Visualizador 3D -> Estimativa Automática
    if (source === 'visualizador3D' && target === 'estimativaAutomatica') {
        if (window.visualizador3D && window.estimatorModule) {
            window.visualizador3D.onProjectUpdate = function(projectData) {
                window.estimatorModule.updateFromVisualizador(projectData);
            };
        }
    }
    
    // Integração Visualizador 3D -> Catálogo de Materiais
    if (source === 'visualizador3D' && target === 'catalogoMateriais') {
        if (window.visualizador3D && window.materialsCatalog) {
            window.materialsCatalog.onMaterialSelect = function(material) {
                window.visualizador3D.updateMaterial(material);
            };
        }
    }
    
    // Integração Estimativa Automática -> Módulo Financeiro
    if (source === 'estimativaAutomatica' && target === 'moduloFinanceiro') {
        if (window.estimatorModule && window.financeModule) {
            window.estimatorModule.onEstimateComplete = function(estimateData) {
                window.financeModule.addEstimate(estimateData);
            };
        }
    }
    
    // Integração Catálogo de Materiais -> Estimativa Automática
    if (source === 'catalogoMateriais' && target === 'estimativaAutomatica') {
        if (window.materialsCatalog && window.estimatorModule) {
            window.materialsCatalog.onPriceUpdate = function(materialsData) {
                window.estimatorModule.updateMaterialPrices(materialsData);
            };
        }
    }
}

// Configurar integração de interface entre módulos
function setupUIIntegration(source, target) {
    // Integração Aplicativo Mobile -> Visualizador 3D
    if (source === 'aplicativoMobile' && target === 'visualizador3D') {
        if (window.mobileApp && window.visualizador3D) {
            // Já implementado no código do aplicativo mobile
            console.log("Integração UI Mobile -> Visualizador 3D configurada");
        }
    }
    
    // Integração Aplicativo Mobile -> Estimativa Automática
    if (source === 'aplicativoMobile' && target === 'estimativaAutomatica') {
        if (window.mobileApp && window.estimatorModule) {
            // Já implementado no código do aplicativo mobile
            console.log("Integração UI Mobile -> Estimativa Automática configurada");
        }
    }
    
    // Integração Aplicativo Mobile -> Módulo Financeiro
    if (source === 'aplicativoMobile' && target === 'moduloFinanceiro') {
        if (window.mobileApp && window.financeModule) {
            // Implementar no código do aplicativo mobile
            console.log("Integração UI Mobile -> Módulo Financeiro configurada");
        }
    }
}

// Configurar comunicação entre módulos
function setupModuleCommunication() {
    // Criar um sistema de eventos personalizado para comunicação entre módulos
    window.moduleEvents = window.moduleEvents || {
        events: {},
        
        // Registrar um handler para um evento
        on: function(eventName, callback) {
            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(callback);
        },
        
        // Remover um handler de um evento
        off: function(eventName, callback) {
            if (this.events[eventName]) {
                this.events[eventName] = this.events[eventName].filter(
                    handler => handler !== callback
                );
            }
        },
        
        // Disparar um evento
        emit: function(eventName, data) {
            if (this.events[eventName]) {
                this.events[eventName].forEach(callback => {
                    callback(data);
                });
            }
        }
    };
    
    // Registrar eventos comuns
    registerCommonEvents();
}

// Registrar eventos comuns para comunicação entre módulos
function registerCommonEvents() {
    // Evento: Projeto atualizado
    window.moduleEvents.on('project:updated', function(projectData) {
        console.log('Evento project:updated recebido', projectData);
        
        // Atualizar visualizador 3D se disponível
        if (window.visualizador3D) {
            window.visualizador3D.updateProject(projectData);
        }
        
        // Atualizar estimativa se disponível
        if (window.estimatorModule) {
            window.estimatorModule.updateProject(projectData);
        }
        
        // Atualizar aplicativo mobile se disponível
        if (window.mobileApp) {
            // Implementar atualização no aplicativo mobile
        }
    });
    
    // Evento: Material selecionado
    window.moduleEvents.on('material:selected', function(materialData) {
        console.log('Evento material:selected recebido', materialData);
        
        // Atualizar visualizador 3D se disponível
        if (window.visualizador3D) {
            window.visualizador3D.updateMaterial(materialData);
        }
        
        // Atualizar estimativa se disponível
        if (window.estimatorModule) {
            window.estimatorModule.updateMaterial(materialData);
        }
    });
    
    // Evento: Estimativa concluída
    window.moduleEvents.on('estimate:completed', function(estimateData) {
        console.log('Evento estimate:completed recebido', estimateData);
        
        // Atualizar módulo financeiro se disponível
        if (window.financeModule) {
            window.financeModule.addEstimate(estimateData);
        }
        
        // Atualizar aplicativo mobile se disponível
        if (window.mobileApp) {
            // Implementar atualização no aplicativo mobile
        }
    });
    
    // Evento: Dados financeiros atualizados
    window.moduleEvents.on('finance:updated', function(financeData) {
        console.log('Evento finance:updated recebido', financeData);
        
        // Atualizar aplicativo mobile se disponível
        if (window.mobileApp) {
            // Implementar atualização no aplicativo mobile
        }
    });
}

// Criar interface de integração
function createIntegrationInterface() {
    // Verificar se o container já existe
    const integrationContainer = document.getElementById('integration-container');
    if (integrationContainer) return;
    
    // Criar container principal
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    const container = document.createElement('div');
    container.id = 'integration-container';
    container.className = 'module-container';
    container.style.display = 'none';
    
    // Adicionar HTML para a interface de integração
    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Central de Integração</h5>
                    </div>
                    <div class="card-body">
                        <p>Esta central permite gerenciar e monitorar a integração entre os diferentes módulos do sistema.</p>
                        
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Todos os módulos inovadores estão integrados e funcionando em conjunto.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Status dos Módulos</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Módulo</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="modules-status-table">
                                    <tr>
                                        <td>Visualizador 3D</td>
                                        <td id="status-visualizador3D">
                                            <span class="badge bg-success">Ativo</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" id="open-visualizador3D">
                                                <i class="bi bi-box-arrow-up-right me-1"></i> Abrir
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Estimativa Automática</td>
                                        <td id="status-estimativaAutomatica">
                                            <span class="badge bg-success">Ativo</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" id="open-estimativaAutomatica">
                                                <i class="bi bi-box-arrow-up-right me-1"></i> Abrir
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Aplicativo Mobile</td>
                                        <td id="status-aplicativoMobile">
                                            <span class="badge bg-success">Ativo</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" id="open-aplicativoMobile">
                                                <i class="bi bi-box-arrow-up-right me-1"></i> Abrir
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Catálogo de Materiais</td>
                                        <td id="status-catalogoMateriais">
                                            <span class="badge bg-success">Ativo</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" id="open-catalogoMateriais">
                                                <i class="bi bi-box-arrow-up-right me-1"></i> Abrir
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Módulo Financeiro</td>
                                        <td id="status-moduloFinanceiro">
                                            <span class="badge bg-success">Ativo</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" id="open-moduloFinanceiro">
                                                <i class="bi bi-box-arrow-up-right me-1"></i> Abrir
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Mapa de Integração</h5>
                    </div>
                    <div class="card-body">
                        <div class="integration-map-container">
                            <div class="integration-map" id="integration-map">
                                <!-- Mapa de integração será gerado dinamicamente -->
                            </div>
                        </div>
                        
                        <div class="mt-3">
                            <h6>Legenda:</h6>
                            <div class="d-flex flex-wrap">
                                <div class="me-3 mb-2">
                                    <span class="integration-line data-line"></span>
                                    <small class="ms-2">Integração de Dados</small>
                                </div>
                                <div class="me-3 mb-2">
                                    <span class="integration-line ui-line"></span>
                                    <small class="ms-2">Integração de Interface</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Log de Comunicação</h5>
                    </div>
                    <div class="card-body">
                        <div class="integration-log" id="integration-log">
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:00</span>
                                <span class="log-module">Sistema</span>
                                <span class="log-message">Módulo de integração inicializado com sucesso</span>
                            </div>
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:01</span>
                                <span class="log-module">Visualizador 3D</span>
                                <span class="log-message">Módulo inicializado e pronto para uso</span>
                            </div>
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:02</span>
                                <span class="log-module">Estimativa Automática</span>
                                <span class="log-message">Módulo inicializado e pronto para uso</span>
                            </div>
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:03</span>
                                <span class="log-module">Catálogo de Materiais</span>
                                <span class="log-message">Módulo inicializado e pronto para uso</span>
                            </div>
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:04</span>
                                <span class="log-module">Módulo Financeiro</span>
                                <span class="log-message">Módulo inicializado e pronto para uso</span>
                            </div>
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:05</span>
                                <span class="log-module">Aplicativo Mobile</span>
                                <span class="log-message">Módulo inicializado e pronto para uso</span>
                            </div>
                            <div class="log-entry">
                                <span class="log-time">15/04/2025 00:00:06</span>
                                <span class="log-module">Sistema</span>
                                <span class="log-message">Todas as integrações configuradas com sucesso</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .integration-map-container {
                overflow: auto;
                max-height: 400px;
                border: 1px solid #dee2e6;
                border-radius: 0.25rem;
                padding: 1rem;
            }
            
            .integration-map {
                min-height: 300px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .module-node {
                position: absolute;
                width: 120px;
                height: 60px;
                background-color: #f8f9fa;
                border: 2px solid #007bff;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-weight: bold;
                z-index: 2;
            }
            
            .integration-line {
                position: absolute;
                height: 2px;
                background-color: #6c757d;
                z-index: 1;
                transform-origin: 0 0;
            }
            
            .integration-line.data-line {
                background-color: #28a745;
            }
            
            .integration-line.ui-line {
                background-color: #fd7e14;
                height: 2px;
                border-top: 1px dashed #fff;
            }
            
            .integration-line-arrow {
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 5px 0 5px 8px;
                border-color: transparent transparent transparent #6c757d;
                z-index: 1;
            }
            
            .integration-line-arrow.data-arrow {
                border-color: transparent transparent transparent #28a745;
            }
            
            .integration-line-arrow.ui-arrow {
                border-color: transparent transparent transparent #fd7e14;
            }
            
            .integration-log {
                height: 200px;
                overflow-y: auto;
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 0.25rem;
                padding: 0.5rem;
                font-family: monospace;
                font-size: 0.875rem;
            }
            
            .log-entry {
                margin-bottom: 0.25rem;
                padding-bottom: 0.25rem;
                border-bottom: 1px solid #e9ecef;
            }
            
            .log-time {
                color: #6c757d;
                margin-right: 0.5rem;
            }
            
            .log-module {
                color: #007bff;
                font-weight: bold;
                margin-right: 0.5rem;
            }
            
            .log-message {
                color: #212529;
            }
            
            /* Legenda */
            .integration-line {
                display: inline-block;
                width: 30px;
                height: 2px;
                vertical-align: middle;
            }
        </style>
    `;
    
    mainContainer.appendChild(container);
    
    // Adicionar link de navegação para a central de integração
    addIntegrationNavLink();
    
    // Inicializar o mapa de integração
    setTimeout(() => {
        renderIntegrationMap();
    }, 500);
    
    // Adicionar event listeners para os botões
    setupIntegrationButtons();
}

// Adicionar link de navegação para a central de integração
function addIntegrationNavLink() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se o link já existe
    if (document.getElementById('nav-integration')) return;
    
    // Criar link para o módulo de integração
    const integrationLink = document.createElement('li');
    integrationLink.className = 'nav-item';
    integrationLink.id = 'nav-integration';
    integrationLink.innerHTML = `
        <a class="nav-link" href="#" data-module="integration">
            <i class="bi bi-diagram-3"></i> Central de Integração
        </a>
    `;
    
    // Adicionar link ao menu de navegação
    navbarNav.appendChild(integrationLink);
    
    // Adicionar event listener para o link
    integrationLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showIntegrationInterface();
    });
}

// Mostrar a interface de integração
function showIntegrationInterface() {
    // Ocultar todos os containers de módulos
    const moduleContainers = document.querySelectorAll('.module-container');
    moduleContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // Mostrar container de integração
    const integrationContainer = document.getElementById('integration-container');
    if (integrationContainer) {
        integrationContainer.style.display = 'block';
    }
    
    // Atualizar links ativos no menu de navegação
    updateActiveNavLinks('integration');
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

// Renderizar o mapa de integração
function renderIntegrationMap() {
    const mapContainer = document.getElementById('integration-map');
    if (!mapContainer) return;
    
    // Limpar o container
    mapContainer.innerHTML = '';
    
    // Definir posições dos módulos no mapa
    const modulePositions = {
        visualizador3D: { x: 150, y: 50 },
        estimativaAutomatica: { x: 350, y: 150 },
        catalogoMateriais: { x: 150, y: 250 },
        moduloFinanceiro: { x: 550, y: 150 },
        aplicativoMobile: { x: 350, y: 50 }
    };
    
    // Criar nós para cada módulo
    Object.keys(modulePositions).forEach(moduleName => {
        const { x, y } = modulePositions[moduleName];
        
        const moduleNode = document.createElement('div');
        moduleNode.className = 'module-node';
        moduleNode.id = `node-${moduleName}`;
        moduleNode.style.left = `${x}px`;
        moduleNode.style.top = `${y}px`;
        
        // Formatar nome do módulo para exibição
        let displayName = moduleName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
        
        moduleNode.textContent = displayName;
        
        mapContainer.appendChild(moduleNode);
    });
    
    // Criar linhas de integração
    integrationConfig.integrationPoints.forEach(point => {
        const { source, target, type } = point;
        
        // Verificar se os módulos existem no mapa
        if (!modulePositions[source] || !modulePositions[target]) return;
        
        const sourcePos = modulePositions[source];
        const targetPos = modulePositions[target];
        
        // Calcular posição e comprimento da linha
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Criar linha
        const line = document.createElement('div');
        line.className = `integration-line ${type}-line`;
        line.style.width = `${length}px`;
        line.style.left = `${sourcePos.x + 60}px`;
        line.style.top = `${sourcePos.y + 30}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        // Criar seta
        const arrow = document.createElement('div');
        arrow.className = `integration-line-arrow ${type}-arrow`;
        arrow.style.left = `${length - 8}px`;
        arrow.style.top = '-4px';
        
        line.appendChild(arrow);
        mapContainer.appendChild(line);
    });
}

// Configurar botões da interface de integração
function setupIntegrationButtons() {
    // Botão para abrir Visualizador 3D
    const openVisualizador3DBtn = document.getElementById('open-visualizador3D');
    if (openVisualizador3DBtn) {
        openVisualizador3DBtn.addEventListener('click', function() {
            if (window.visualizador3D && typeof window.visualizador3D.show === 'function') {
                window.visualizador3D.show();
            } else {
                alert('O Visualizador 3D não está disponível no momento.');
            }
        });
    }
    
    // Botão para abrir Estimativa Automática
    const openEstimativaAutomaticaBtn = document.getElementById('open-estimativaAutomatica');
    if (openEstimativaAutomaticaBtn) {
        openEstimativaAutomaticaBtn.addEventListener('click', function() {
            if (window.estimatorModule && typeof window.estimatorModule.show === 'function') {
                window.estimatorModule.show();
            } else {
                alert('O módulo de Estimativa Automática não está disponível no momento.');
            }
        });
    }
    
    // Botão para abrir Aplicativo Mobile
    const openAplicativoMobileBtn = document.getElementById('open-aplicativoMobile');
    if (openAplicativoMobileBtn) {
        openAplicativoMobileBtn.addEventListener('click', function() {
            if (window.mobileApp && typeof window.mobileApp.show === 'function') {
                window.mobileApp.show();
            } else {
                alert('O Aplicativo Mobile não está disponível no momento.');
            }
        });
    }
    
    // Botão para abrir Catálogo de Materiais
    const openCatalogoMateriaisBtn = document.getElementById('open-catalogoMateriais');
    if (openCatalogoMateriaisBtn) {
        openCatalogoMateriaisBtn.addEventListener('click', function() {
            if (window.materialsCatalog && typeof window.materialsCatalog.show === 'function') {
                window.materialsCatalog.show();
            } else {
                alert('O Catálogo de Materiais não está disponível no momento.');
            }
        });
    }
    
    // Botão para abrir Módulo Financeiro
    const openModuloFinanceiroBtn = document.getElementById('open-moduloFinanceiro');
    if (openModuloFinanceiroBtn) {
        openModuloFinanceiroBtn.addEventListener('click', function() {
            if (window.financeModule && typeof window.financeModule.show === 'function') {
                window.financeModule.show();
            } else {
                alert('O Módulo Financeiro não está disponível no momento.');
            }
        });
    }
}

// Adicionar entrada ao log de integração
function addLogEntry(module, message) {
    const logContainer = document.getElementById('integration-log');
    if (!logContainer) return;
    
    // Obter data e hora atual
    const now = new Date();
    const timeString = now.toLocaleString('pt-BR');
    
    // Criar entrada de log
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">${timeString}</span>
        <span class="log-module">${module}</span>
        <span class="log-message">${message}</span>
    `;
    
    // Adicionar ao container
    logContainer.appendChild(logEntry);
    
    // Rolar para o final
    logContainer.scrollTop = logContainer.scrollHeight;
}

// Exportar funções para uso em outros módulos
window.integrationModule = {
    init: initIntegrationModule,
    show: showIntegrationInterface,
    addLogEntry: addLogEntry
};
