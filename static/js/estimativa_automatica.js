// Sistema de Estimativa Automática para Serralheria
// Este módulo calcula automaticamente estimativas de materiais, custos e prazos para projetos

document.addEventListener('DOMContentLoaded', function() {
    // Carregar bibliotecas necessárias
    loadEstimatorDependencies();
    
    // Inicializar o módulo quando as dependências estiverem carregadas
    initEstimatorModule();
});

// Carregar dependências
function loadEstimatorDependencies() {
    // Verificar se o jQuery já está carregado
    if (typeof jQuery === 'undefined') {
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        document.head.appendChild(jqueryScript);
    }
    
    // Verificar se o jsPDF já está carregado
    if (typeof window.jspdf === 'undefined') {
        const jspdfScript = document.createElement('script');
        jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(jspdfScript);
    }
}

// Variáveis globais
let estimatorData = {
    projectTypes: {},
    materials: {},
    laborRates: {},
    riskFactors: {},
    savedEstimates: []
};

// Função principal de inicialização
function initEstimatorModule() {
    // Criar container para o estimador se não existir
    createEstimatorContainer();
    
    // Carregar dados do estimador
    loadEstimatorData();
    
    // Configurar listeners de eventos
    setupEstimatorEventListeners();
}

// Criar container para o estimador
function createEstimatorContainer() {
    // Verificar se o container já existe
    const estimatorContainer = document.getElementById('estimator-container');
    if (estimatorContainer) return;
    
    // Criar container principal
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    const container = document.createElement('div');
    container.id = 'estimator-container';
    container.className = 'module-container';
    container.style.display = 'none';
    
    // Adicionar HTML para o estimador
    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-8">
                <h4 class="mb-3"><i class="bi bi-calculator"></i> Estimativa Automática de Projetos</h4>
            </div>
            <div class="col-md-4 text-end">
                <div class="btn-group">
                    <button id="btn-save-estimate" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-save"></i> Salvar
                    </button>
                    <button id="btn-export-estimate" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-file-pdf"></i> Exportar PDF
                    </button>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Detalhes do Projeto</h5>
                    </div>
                    <div class="card-body">
                        <form id="project-details-form">
                            <div class="mb-3">
                                <label for="project-type" class="form-label">Tipo de Projeto</label>
                                <select class="form-select" id="project-type" required>
                                    <option value="" selected disabled>Selecione o tipo de projeto</option>
                                    <option value="portao">Portão</option>
                                    <option value="grade">Grade</option>
                                    <option value="escada">Escada</option>
                                    <option value="guarda-corpo">Guarda-corpo</option>
                                    <option value="mezanino">Mezanino</option>
                                    <option value="cobertura">Cobertura</option>
                                    <option value="estrutura">Estrutura Metálica</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="project-name" class="form-label">Nome do Projeto</label>
                                <input type="text" class="form-control" id="project-name" placeholder="Ex: Portão Residencial" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="client-name" class="form-label">Nome do Cliente</label>
                                <input type="text" class="form-control" id="client-name" placeholder="Ex: João Silva">
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="project-width" class="form-label">Largura (m)</label>
                                    <input type="number" step="0.01" min="0.1" class="form-control" id="project-width" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="project-height" class="form-label">Altura (m)</label>
                                    <input type="number" step="0.01" min="0.1" class="form-control" id="project-height" required>
                                </div>
                            </div>
                            
                            <div id="length-container" class="mb-3" style="display: none;">
                                <label for="project-length" class="form-label">Comprimento (m)</label>
                                <input type="number" step="0.01" min="0.1" class="form-control" id="project-length">
                            </div>
                            
                            <div class="mb-3">
                                <label for="project-complexity" class="form-label">Complexidade</label>
                                <select class="form-select" id="project-complexity" required>
                                    <option value="baixa">Baixa (projeto simples)</option>
                                    <option value="media" selected>Média (detalhes moderados)</option>
                                    <option value="alta">Alta (muitos detalhes)</option>
                                    <option value="muito-alta">Muito Alta (projeto personalizado)</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="installation-location" class="form-label">Local de Instalação</label>
                                <select class="form-select" id="installation-location" required>
                                    <option value="terreo">Térreo (fácil acesso)</option>
                                    <option value="altura-baixa">Altura Baixa (até 3m)</option>
                                    <option value="altura-media">Altura Média (3-6m)</option>
                                    <option value="altura-alta">Altura Alta (acima de 6m)</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="material-quality" class="form-label">Qualidade do Material</label>
                                <select class="form-select" id="material-quality" required>
                                    <option value="padrao">Padrão (custo-benefício)</option>
                                    <option value="superior">Superior (maior durabilidade)</option>
                                    <option value="premium">Premium (alta qualidade)</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="finishing-type" class="form-label">Tipo de Acabamento</label>
                                <select class="form-select" id="finishing-type" required>
                                    <option value="pintura-simples">Pintura Simples</option>
                                    <option value="pintura-eletrostatica">Pintura Eletrostática</option>
                                    <option value="galvanizado">Galvanizado</option>
                                    <option value="inox">Aço Inox</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="urgency-level" class="form-label">Nível de Urgência</label>
                                <select class="form-select" id="urgency-level" required>
                                    <option value="normal">Normal (prazo padrão)</option>
                                    <option value="rapido">Rápido (prazo reduzido)</option>
                                    <option value="urgente">Urgente (prioridade máxima)</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="additional-features" class="form-label">Recursos Adicionais</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="feature-automation">
                                    <label class="form-check-label" for="feature-automation">Automação</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="feature-glass">
                                    <label class="form-check-label" for="feature-glass">Vidro</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="feature-design">
                                    <label class="form-check-label" for="feature-design">Design Personalizado</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="feature-installation">
                                    <label class="form-check-label" for="feature-installation">Instalação Incluída</label>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="project-notes" class="form-label">Observações</label>
                                <textarea class="form-control" id="project-notes" rows="2" placeholder="Detalhes adicionais sobre o projeto"></textarea>
                            </div>
                            
                            <button type="button" id="btn-calculate-estimate" class="btn btn-primary w-100">
                                <i class="bi bi-calculator"></i> Calcular Estimativa
                            </button>
                        </form>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Estimativas Salvas</h5>
                    </div>
                    <div class="card-body">
                        <div id="saved-estimates-list" class="list-group">
                            <div class="text-center text-muted py-3">
                                Nenhuma estimativa salva
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Resultado da Estimativa</h5>
                    </div>
                    <div class="card-body">
                        <div id="estimate-result">
                            <div class="text-center py-5">
                                <i class="bi bi-calculator fs-1 text-muted"></i>
                                <p class="mt-3 text-muted">Preencha os detalhes do projeto e clique em "Calcular Estimativa" para ver o resultado.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Materiais Estimados</h5>
                            </div>
                            <div class="card-body">
                                <div id="materials-estimate">
                                    <div class="text-center py-4 text-muted">
                                        Aguardando cálculo de estimativa
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Análise de Riscos</h5>
                            </div>
                            <div class="card-body">
                                <div id="risk-analysis">
                                    <div class="text-center py-4 text-muted">
                                        Aguardando cálculo de estimativa
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Cronograma Estimado</h5>
                    </div>
                    <div class="card-body">
                        <div id="timeline-estimate">
                            <div class="text-center py-4 text-muted">
                                Aguardando cálculo de estimativa
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mainContainer.appendChild(container);
    
    // Adicionar link de navegação para o estimador
    addEstimatorNavLink();
}

// Adicionar link de navegação para o estimador
function addEstimatorNavLink() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se o link já existe
    if (document.getElementById('nav-estimator')) return;
    
    // Criar link para o módulo de estimador
    const estimatorLink = document.createElement('li');
    estimatorLink.className = 'nav-item';
    estimatorLink.id = 'nav-estimator';
    estimatorLink.innerHTML = `
        <a class="nav-link" href="#" data-module="estimator">
            <i class="bi bi-calculator"></i> Estimativa
        </a>
    `;
    
    // Adicionar link ao menu de navegação
    navbarNav.appendChild(estimatorLink);
    
    // Adicionar event listener para o link
    estimatorLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showEstimator();
    });
}

// Mostrar o estimador
function showEstimator() {
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
    
    // Mostrar container do estimador
    const estimatorContainer = document.getElementById('estimator-container');
    if (estimatorContainer) {
        estimatorContainer.style.display = 'block';
    }
    
    // Atualizar links ativos no menu de navegação
    updateActiveNavLinks('estimator');
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

// Carregar dados do estimador
function loadEstimatorData() {
    // Carregar dados do localStorage se disponível
    const storedData = localStorage.getItem('serralheria_estimator_data');
    if (storedData) {
        estimatorData = JSON.parse(storedData);
        updateSavedEstimatesList();
        return;
    }
    
    // Caso contrário, inicializar com dados padrão
    initializeDefaultEstimatorData();
}

// Inicializar dados padrão do estimador
function initializeDefaultEstimatorData() {
    // Tipos de projeto e seus fatores de complexidade
    estimatorData.projectTypes = {
        'portao': {
            name: 'Portão',
            baseMaterialFactor: 1.0,
            baseLaborFactor: 1.0,
            baseTimelineDays: 5,
            needsLength: false,
            defaultMaterials: ['Metalon 30x30', 'Metalon 20x20', 'Chapa #18']
        },
        'grade': {
            name: 'Grade',
            baseMaterialFactor: 0.8,
            baseLaborFactor: 0.9,
            baseTimelineDays: 3,
            needsLength: false,
            defaultMaterials: ['Metalon 20x20', 'Barra Chata 1"x1/8"', 'Tubo Redondo 1/2"']
        },
        'escada': {
            name: 'Escada',
            baseMaterialFactor: 1.2,
            baseLaborFactor: 1.5,
            baseTimelineDays: 7,
            needsLength: true,
            defaultMaterials: ['Perfil U 100x40', 'Chapa Xadrez 1/8"', 'Tubo Redondo 1.1/2"']
        },
        'guarda-corpo': {
            name: 'Guarda-corpo',
            baseMaterialFactor: 1.1,
            baseLaborFactor: 1.2,
            baseTimelineDays: 4,
            needsLength: true,
            defaultMaterials: ['Tubo Redondo 2"', 'Tubo Redondo 1"', 'Barra Chata 1"x1/8"']
        },
        'mezanino': {
            name: 'Mezanino',
            baseMaterialFactor: 1.5,
            baseLaborFactor: 1.8,
            baseTimelineDays: 12,
            needsLength: true,
            defaultMaterials: ['Perfil I 150x15', 'Chapa Xadrez 3/16"', 'Perfil U 100x40']
        },
        'cobertura': {
            name: 'Cobertura',
            baseMaterialFactor: 1.3,
            baseLaborFactor: 1.4,
            baseTimelineDays: 8,
            needsLength: true,
            defaultMaterials: ['Metalon 40x60', 'Metalon 30x30', 'Telha Galvanizada']
        },
        'estrutura': {
            name: 'Estrutura Metálica',
            baseMaterialFactor: 1.4,
            baseLaborFactor: 1.6,
            baseTimelineDays: 15,
            needsLength: true,
            defaultMaterials: ['Perfil I 150x15', 'Perfil U 100x40', 'Cantoneira 2"x1/4"']
        },
        'outro': {
            name: 'Outro',
            baseMaterialFactor: 1.2,
            baseLaborFactor: 1.3,
            baseTimelineDays: 10,
            needsLength: true,
            defaultMaterials: ['Metalon 30x30', 'Chapa #18', 'Barra Chata 1"x1/8"']
        }
    };
    
    // Preços base de materiais (por metro ou unidade)
    estimatorData.materials = {
        'Metalon 20x20': { price: 15.0, unit: 'm', weight: 0.8 },
        'Metalon 30x30': { price: 22.0, unit: 'm', weight: 1.2 },
        'Metalon 40x40': { price: 32.0, unit: 'm', weight: 1.6 },
        'Metalon 40x60': { price: 45.0, unit: 'm', weight: 2.0 },
        'Tubo Redondo 1/2"': { price: 12.0, unit: 'm', weight: 0.6 },
        'Tubo Redondo 1"': { price: 18.0, unit: 'm', weight: 1.0 },
        'Tubo Redondo 1.1/2"': { price: 28.0, unit: 'm', weight: 1.5 },
        'Tubo Redondo 2"': { price: 38.0, unit: 'm', weight: 2.2 },
        'Barra Chata 1"x1/8"': { price: 10.0, unit: 'm', weight: 0.7 },
        'Cantoneira 1"x1/8"': { price: 14.0, unit: 'm', weight: 0.9 },
        'Cantoneira 2"x1/4"': { price: 35.0, unit: 'm', weight: 2.5 },
        'Perfil U 100x40': { price: 48.0, unit: 'm', weight: 3.0 },
        'Perfil I 150x15': { price: 85.0, unit: 'm', weight: 5.0 },
        'Chapa #18': { price: 180.0, unit: 'm²', weight: 12.0 },
        'Chapa #16': { price: 220.0, unit: 'm²', weight: 15.0 },
        'Chapa Xadrez 1/8"': { price: 280.0, unit: 'm²', weight: 18.0 },
        'Chapa Xadrez 3/16"': { price: 380.0, unit: 'm²', weight: 25.0 },
        'Telha Galvanizada': { price: 45.0, unit: 'm²', weight: 4.0 },
        'Vidro Temperado 8mm': { price: 320.0, unit: 'm²', weight: 20.0 },
        'Tinta (Galão)': { price: 120.0, unit: 'un', weight: 3.6 },
        'Eletrodo (kg)': { price: 25.0, unit: 'kg', weight: 1.0 },
        'Disco de Corte': { price: 12.0, unit: 'un', weight: 0.2 },
        'Parafusos e Fixadores': { price: 5.0, unit: 'un', weight: 0.1 },
        'Motor para Automação': { price: 850.0, unit: 'un', weight: 8.0 }
    };
    
    // Taxas de mão de obra (por hora)
    estimatorData.laborRates = {
        'Serralheiro': 35.0,
        'Soldador': 45.0,
        'Pintor': 30.0,
        'Instalador': 40.0,
        'Ajudante': 20.0
    };
    
    // Fatores de risco
    estimatorData.riskFactors = {
        'complexity': {
            'baixa': { factor: 1.0, description: 'Projeto simples com baixa complexidade' },
            'media': { factor: 1.2, description: 'Projeto com complexidade moderada' },
            'alta': { factor: 1.5, description: 'Projeto complexo com muitos detalhes' },
            'muito-alta': { factor: 2.0, description: 'Projeto altamente complexo e personalizado' }
        },
        'location': {
            'terreo': { factor: 1.0, description: 'Instalação no térreo, fácil acesso' },
            'altura-baixa': { factor: 1.2, description: 'Instalação em altura baixa (até 3m)' },
            'altura-media': { factor: 1.5, description: 'Instalação em altura média (3-6m)' },
            'altura-alta': { factor: 2.0, description: 'Instalação em altura elevada (acima de 6m)' }
        },
        'quality': {
            'padrao': { factor: 1.0, description: 'Materiais de qualidade padrão' },
            'superior': { factor: 1.3, description: 'Materiais de qualidade superior' },
            'premium': { factor: 1.6, description: 'Materiais de qualidade premium' }
        },
        'finishing': {
            'pintura-simples': { factor: 1.0, description: 'Acabamento com pintura simples' },
            'pintura-eletrostatica': { factor: 1.3, description: 'Acabamento com pintura eletrostática' },
            'galvanizado': { factor: 1.5, description: 'Acabamento galvanizado' },
            'inox': { factor: 2.0, description: 'Acabamento em aço inox' }
        },
        'urgency': {
            'normal': { factor: 1.0, description: 'Prazo normal de entrega' },
            'rapido': { factor: 1.3, description: 'Prazo reduzido (urgência moderada)' },
            'urgente': { factor: 1.8, description: 'Prazo mínimo (urgência máxima)' }
        }
    };
    
    // Estimativas salvas (inicialmente vazio)
    estimatorData.savedEstimates = [];
    
    // Salvar no localStorage
    saveEstimatorData();
}

// Salvar dados do estimador
function saveEstimatorData() {
    localStorage.setItem('serralheria_estimator_data', JSON.stringify(estimatorData));
}

// Configurar listeners de eventos
function setupEstimatorEventListeners() {
    document.addEventListener('click', function(e) {
        // Botão para calcular estimativa
        if (e.target && e.target.id === 'btn-calculate-estimate') {
            calculateEstimate();
        }
        
        // Botão para salvar estimativa
        if (e.target && e.target.id === 'btn-save-estimate') {
            saveCurrentEstimate();
        }
        
        // Botão para exportar estimativa em PDF
        if (e.target && e.target.id === 'btn-export-estimate') {
            exportEstimateToPDF();
        }
        
        // Botões para carregar estimativas salvas
        if (e.target && e.target.closest('.load-estimate-btn')) {
            const estimateId = e.target.closest('.load-estimate-btn').getAttribute('data-estimate-id');
            loadSavedEstimate(estimateId);
        }
        
        // Botões para excluir estimativas salvas
        if (e.target && e.target.closest('.delete-estimate-btn')) {
            const estimateId = e.target.closest('.delete-estimate-btn').getAttribute('data-estimate-id');
            deleteSavedEstimate(estimateId);
        }
    });
    
    // Listener para alteração do tipo de projeto
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'project-type') {
            const projectType = e.target.value;
            toggleLengthField(projectType);
        }
    });
}

// Alternar visibilidade do campo de comprimento
function toggleLengthField(projectType) {
    const lengthContainer = document.getElementById('length-container');
    if (!lengthContainer) return;
    
    const projectTypeInfo = estimatorData.projectTypes[projectType];
    if (projectTypeInfo && projectTypeInfo.needsLength) {
        lengthContainer.style.display = 'block';
        document.getElementById('project-length').required = true;
    } else {
        lengthContainer.style.display = 'none';
        document.getElementById('project-length').required = false;
    }
}

// Calcular estimativa
function calculateEstimate() {
    // Obter valores do formulário
    const projectType = document.getElementById('project-type').value;
    const projectName = document.getElementById('project-name').value;
    const clientName = document.getElementById('client-name').value;
    const width = parseFloat(document.getElementById('project-width').value);
    const height = parseFloat(document.getElementById('project-height').value);
    const lengthElement = document.getElementById('project-length');
    const length = lengthElement && lengthElement.style.display !== 'none' ? parseFloat(lengthElement.value) : 0;
    const complexity = document.getElementById('project-complexity').value;
    const location = document.getElementById('installation-location').value;
    const quality = document.getElementById('material-quality').value;
    const finishing = document.getElementById('finishing-type').value;
    const urgency = document.getElementById('urgency-level').value;
    const notes = document.getElementById('project-notes').value;
    
    // Verificar recursos adicionais
    const hasAutomation = document.getElementById('feature-automation').checked;
    const hasGlass = document.getElementById('feature-glass').checked;
    const hasCustomDesign = document.getElementById('feature-design').checked;
    const includesInstallation = document.getElementById('feature-installation').checked;
    
    // Validar campos obrigatórios
    if (!projectType || !projectName || !width || !height || 
        (estimatorData.projectTypes[projectType].needsLength && !length)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Calcular área e perímetro
    const area = width * height;
    const perimeter = 2 * (width + height);
    
    // Calcular volume (se aplicável)
    const volume = length > 0 ? width * height * length : 0;
    
    // Obter fatores de risco
    const complexityFactor = estimatorData.riskFactors.complexity[complexity].factor;
    const locationFactor = estimatorData.riskFactors.location[location].factor;
    const qualityFactor = estimatorData.riskFactors.quality[quality].factor;
    const finishingFactor = estimatorData.riskFactors.finishing[finishing].factor;
    const urgencyFactor = estimatorData.riskFactors.urgency[urgency].factor;
    
    // Calcular fator de risco total
    const totalRiskFactor = (complexityFactor + locationFactor + qualityFactor + finishingFactor + urgencyFactor) / 5;
    
    // Obter fatores base do tipo de projeto
    const projectTypeInfo = estimatorData.projectTypes[projectType];
    const baseMaterialFactor = projectTypeInfo.baseMaterialFactor;
    const baseLaborFactor = projectTypeInfo.baseLaborFactor;
    const baseTimelineDays = projectTypeInfo.baseTimelineDays;
    
    // Calcular estimativa de materiais
    const materialsEstimate = calculateMaterialsEstimate(
        projectType, width, height, length, area, perimeter, 
        baseMaterialFactor, qualityFactor, hasGlass
    );
    
    // Calcular estimativa de mão de obra
    const laborEstimate = calculateLaborEstimate(
        projectType, area, volume, baseLaborFactor, 
        complexityFactor, locationFactor, hasCustomDesign, includesInstallation
    );
    
    // Calcular estimativa de cronograma
    const timelineEstimate = calculateTimelineEstimate(
        baseTimelineDays, urgencyFactor, complexityFactor, 
        locationFactor, hasCustomDesign, includesInstallation
    );
    
    // Calcular custos adicionais
    const additionalCosts = calculateAdditionalCosts(
        hasAutomation, hasGlass, hasCustomDesign, includesInstallation,
        finishingFactor, area
    );
    
    // Calcular custo total
    const materialsCost = materialsEstimate.totalCost;
    const laborCost = laborEstimate.totalCost;
    const totalCost = materialsCost + laborCost + additionalCosts.totalCost;
    
    // Calcular margem de lucro (30% padrão, ajustado pelo fator de risco)
    const profitMargin = 0.3 * (1 + (totalRiskFactor - 1) * 0.5);
    const profit = totalCost * profitMargin;
    
    // Calcular preço final
    const finalPrice = totalCost + profit;
    
    // Criar objeto de estimativa
    const estimate = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        projectType,
        projectName,
        clientName,
        dimensions: { width, height, length },
        area,
        perimeter,
        volume,
        complexity,
        location,
        quality,
        finishing,
        urgency,
        features: {
            hasAutomation,
            hasGlass,
            hasCustomDesign,
            includesInstallation
        },
        notes,
        materials: materialsEstimate,
        labor: laborEstimate,
        additionalCosts,
        timeline: timelineEstimate,
        costs: {
            materials: materialsCost,
            labor: laborCost,
            additional: additionalCosts.totalCost,
            total: totalCost
        },
        profitMargin,
        profit,
        finalPrice,
        riskFactor: totalRiskFactor
    };
    
    // Armazenar estimativa atual
    window.currentEstimate = estimate;
    
    // Exibir resultado
    displayEstimateResult(estimate);
}

// Calcular estimativa de materiais
function calculateMaterialsEstimate(projectType, width, height, length, area, perimeter, baseMaterialFactor, qualityFactor, hasGlass) {
    const projectTypeInfo = estimatorData.projectTypes[projectType];
    const defaultMaterials = projectTypeInfo.defaultMaterials;
    const materials = [];
    let totalCost = 0;
    let totalWeight = 0;
    
    // Fator de dimensão (projetos maiores usam mais material por m²)
    const dimensionFactor = Math.min(1.5, Math.max(1.0, Math.log10(area + 1) * 0.5 + 1));
    
    // Calcular quantidade de material principal (estrutura)
    const mainMaterial = defaultMaterials[0];
    const mainMaterialInfo = estimatorData.materials[mainMaterial];
    
    let mainMaterialQuantity;
    if (projectTypeInfo.needsLength) {
        // Para projetos 3D (com comprimento)
        mainMaterialQuantity = (perimeter * 1.5 + length * 2) * baseMaterialFactor * dimensionFactor;
    } else {
        // Para projetos 2D (sem comprimento)
        mainMaterialQuantity = perimeter * 1.5 * baseMaterialFactor * dimensionFactor;
    }
    
    // Ajustar pela qualidade
    mainMaterialQuantity *= qualityFactor;
    
    const mainMaterialCost = mainMaterialQuantity * mainMaterialInfo.price;
    const mainMaterialWeight = mainMaterialQuantity * mainMaterialInfo.weight;
    
    materials.push({
        name: mainMaterial,
        quantity: mainMaterialQuantity.toFixed(2),
        unit: mainMaterialInfo.unit,
        unitPrice: mainMaterialInfo.price.toFixed(2),
        totalPrice: mainMaterialCost.toFixed(2),
        weight: mainMaterialWeight.toFixed(2)
    });
    
    totalCost += mainMaterialCost;
    totalWeight += mainMaterialWeight;
    
    // Calcular quantidade de material secundário
    const secondaryMaterial = defaultMaterials[1];
    const secondaryMaterialInfo = estimatorData.materials[secondaryMaterial];
    
    let secondaryMaterialQuantity;
    if (projectTypeInfo.needsLength && length > 0) {
        // Para projetos 3D (com comprimento)
        secondaryMaterialQuantity = (area * 0.5 + length * 1.2) * baseMaterialFactor * dimensionFactor;
    } else {
        // Para projetos 2D (sem comprimento)
        secondaryMaterialQuantity = area * 0.7 * baseMaterialFactor * dimensionFactor;
    }
    
    // Ajustar pela qualidade
    secondaryMaterialQuantity *= qualityFactor;
    
    const secondaryMaterialCost = secondaryMaterialQuantity * secondaryMaterialInfo.price;
    const secondaryMaterialWeight = secondaryMaterialQuantity * secondaryMaterialInfo.weight;
    
    materials.push({
        name: secondaryMaterial,
        quantity: secondaryMaterialQuantity.toFixed(2),
        unit: secondaryMaterialInfo.unit,
        unitPrice: secondaryMaterialInfo.price.toFixed(2),
        totalPrice: secondaryMaterialCost.toFixed(2),
        weight: secondaryMaterialWeight.toFixed(2)
    });
    
    totalCost += secondaryMaterialCost;
    totalWeight += secondaryMaterialWeight;
    
    // Calcular quantidade de material de fechamento/acabamento
    const finishingMaterial = defaultMaterials[2];
    const finishingMaterialInfo = estimatorData.materials[finishingMaterial];
    
    // Quantidade depende do tipo de material e unidade
    let finishingMaterialQuantity;
    if (finishingMaterialInfo.unit === 'm²') {
        // Material em área (chapas, telhas, etc.)
        finishingMaterialQuantity = area * 0.8 * baseMaterialFactor;
    } else if (finishingMaterialInfo.unit === 'm') {
        // Material linear (tubos, barras, etc.)
        finishingMaterialQuantity = perimeter * 0.8 * baseMaterialFactor;
    } else {
        // Material em unidades (parafusos, etc.)
        finishingMaterialQuantity = Math.ceil(area * 2 * baseMaterialFactor);
    }
    
    // Ajustar pela qualidade
    finishingMaterialQuantity *= qualityFactor;
    
    const finishingMaterialCost = finishingMaterialQuantity * finishingMaterialInfo.price;
    const finishingMaterialWeight = finishingMaterialQuantity * finishingMaterialInfo.weight;
    
    materials.push({
        name: finishingMaterial,
        quantity: finishingMaterialQuantity.toFixed(2),
        unit: finishingMaterialInfo.unit,
        unitPrice: finishingMaterialInfo.price.toFixed(2),
        totalPrice: finishingMaterialCost.toFixed(2),
        weight: finishingMaterialWeight.toFixed(2)
    });
    
    totalCost += finishingMaterialCost;
    totalWeight += finishingMaterialWeight;
    
    // Adicionar vidro se selecionado
    if (hasGlass) {
        const glassInfo = estimatorData.materials['Vidro Temperado 8mm'];
        const glassQuantity = area * 0.6; // 60% da área total
        const glassCost = glassQuantity * glassInfo.price;
        const glassWeight = glassQuantity * glassInfo.weight;
        
        materials.push({
            name: 'Vidro Temperado 8mm',
            quantity: glassQuantity.toFixed(2),
            unit: glassInfo.unit,
            unitPrice: glassInfo.price.toFixed(2),
            totalPrice: glassCost.toFixed(2),
            weight: glassWeight.toFixed(2)
        });
        
        totalCost += glassCost;
        totalWeight += glassWeight;
    }
    
    // Adicionar consumíveis (tinta, eletrodos, discos)
    // Tinta
    const paintInfo = estimatorData.materials['Tinta (Galão)'];
    const paintQuantity = Math.ceil(area / 15); // Um galão cobre aproximadamente 15m²
    const paintCost = paintQuantity * paintInfo.price;
    const paintWeight = paintQuantity * paintInfo.weight;
    
    materials.push({
        name: 'Tinta (Galão)',
        quantity: paintQuantity.toFixed(0),
        unit: paintInfo.unit,
        unitPrice: paintInfo.price.toFixed(2),
        totalPrice: paintCost.toFixed(2),
        weight: paintWeight.toFixed(2)
    });
    
    totalCost += paintCost;
    totalWeight += paintWeight;
    
    // Eletrodos
    const electrodeInfo = estimatorData.materials['Eletrodo (kg)'];
    const electrodeQuantity = totalWeight * 0.05; // 5% do peso total em eletrodos
    const electrodeCost = electrodeQuantity * electrodeInfo.price;
    
    materials.push({
        name: 'Eletrodo (kg)',
        quantity: electrodeQuantity.toFixed(2),
        unit: electrodeInfo.unit,
        unitPrice: electrodeInfo.price.toFixed(2),
        totalPrice: electrodeCost.toFixed(2),
        weight: electrodeQuantity.toFixed(2)
    });
    
    totalCost += electrodeCost;
    totalWeight += electrodeQuantity;
    
    // Discos de corte
    const discInfo = estimatorData.materials['Disco de Corte'];
    const discQuantity = Math.ceil(totalWeight / 50); // Um disco a cada 50kg de material
    const discCost = discQuantity * discInfo.price;
    const discWeight = discQuantity * discInfo.weight;
    
    materials.push({
        name: 'Disco de Corte',
        quantity: discQuantity.toFixed(0),
        unit: discInfo.unit,
        unitPrice: discInfo.price.toFixed(2),
        totalPrice: discCost.toFixed(2),
        weight: discWeight.toFixed(2)
    });
    
    totalCost += discCost;
    totalWeight += discWeight;
    
    // Parafusos e fixadores
    const fastenerInfo = estimatorData.materials['Parafusos e Fixadores'];
    const fastenerQuantity = Math.ceil(perimeter * 2); // Dois fixadores por metro de perímetro
    const fastenerCost = fastenerQuantity * fastenerInfo.price;
    const fastenerWeight = fastenerQuantity * fastenerInfo.weight;
    
    materials.push({
        name: 'Parafusos e Fixadores',
        quantity: fastenerQuantity.toFixed(0),
        unit: fastenerInfo.unit,
        unitPrice: fastenerInfo.price.toFixed(2),
        totalPrice: fastenerCost.toFixed(2),
        weight: fastenerWeight.toFixed(2)
    });
    
    totalCost += fastenerCost;
    totalWeight += fastenerWeight;
    
    return {
        materials,
        totalCost,
        totalWeight
    };
}

// Calcular estimativa de mão de obra
function calculateLaborEstimate(projectType, area, volume, baseLaborFactor, complexityFactor, locationFactor, hasCustomDesign, includesInstallation) {
    const labor = [];
    let totalHours = 0;
    let totalCost = 0;
    
    // Fator de dimensão (projetos maiores são mais eficientes por m²)
    const dimensionFactor = Math.min(1.0, Math.max(0.7, 1.0 - Math.log10(area + 1) * 0.1));
    
    // Calcular horas de serralheiro
    const serralheiroRate = estimatorData.laborRates['Serralheiro'];
    let serralheiroHours = area * 1.5 * baseLaborFactor * dimensionFactor;
    
    // Ajustar por complexidade e design personalizado
    serralheiroHours *= complexityFactor;
    if (hasCustomDesign) serralheiroHours *= 1.3;
    
    const serralheiroCost = serralheiroHours * serralheiroRate;
    
    labor.push({
        role: 'Serralheiro',
        hours: serralheiroHours.toFixed(2),
        hourlyRate: serralheiroRate.toFixed(2),
        totalCost: serralheiroCost.toFixed(2)
    });
    
    totalHours += serralheiroHours;
    totalCost += serralheiroCost;
    
    // Calcular horas de soldador
    const soldadorRate = estimatorData.laborRates['Soldador'];
    let soldadorHours = area * 0.8 * baseLaborFactor * dimensionFactor;
    
    // Ajustar por complexidade
    soldadorHours *= complexityFactor;
    
    const soldadorCost = soldadorHours * soldadorRate;
    
    labor.push({
        role: 'Soldador',
        hours: soldadorHours.toFixed(2),
        hourlyRate: soldadorRate.toFixed(2),
        totalCost: soldadorCost.toFixed(2)
    });
    
    totalHours += soldadorHours;
    totalCost += soldadorCost;
    
    // Calcular horas de pintor
    const pintorRate = estimatorData.laborRates['Pintor'];
    let pintorHours = area * 0.5 * baseLaborFactor * dimensionFactor;
    
    const pintorCost = pintorHours * pintorRate;
    
    labor.push({
        role: 'Pintor',
        hours: pintorHours.toFixed(2),
        hourlyRate: pintorRate.toFixed(2),
        totalCost: pintorCost.toFixed(2)
    });
    
    totalHours += pintorHours;
    totalCost += pintorCost;
    
    // Calcular horas de ajudante
    const ajudanteRate = estimatorData.laborRates['Ajudante'];
    let ajudanteHours = (serralheiroHours + soldadorHours) * 0.7; // 70% do tempo do serralheiro e soldador
    
    const ajudanteCost = ajudanteHours * ajudanteRate;
    
    labor.push({
        role: 'Ajudante',
        hours: ajudanteHours.toFixed(2),
        hourlyRate: ajudanteRate.toFixed(2),
        totalCost: ajudanteCost.toFixed(2)
    });
    
    totalHours += ajudanteHours;
    totalCost += ajudanteCost;
    
    // Adicionar instalação se incluída
    if (includesInstallation) {
        const instaladorRate = estimatorData.laborRates['Instalador'];
        let instaladorHours = area * 0.7 * baseLaborFactor * locationFactor;
        
        const instaladorCost = instaladorHours * instaladorRate;
        
        labor.push({
            role: 'Instalador',
            hours: instaladorHours.toFixed(2),
            hourlyRate: instaladorRate.toFixed(2),
            totalCost: instaladorCost.toFixed(2)
        });
        
        totalHours += instaladorHours;
        totalCost += instaladorCost;
    }
    
    return {
        labor,
        totalHours,
        totalCost
    };
}

// Calcular estimativa de cronograma
function calculateTimelineEstimate(baseTimelineDays, urgencyFactor, complexityFactor, locationFactor, hasCustomDesign, includesInstallation) {
    // Calcular dias de produção
    let productionDays = baseTimelineDays * complexityFactor;
    
    // Ajustar por urgência
    productionDays /= urgencyFactor;
    
    // Ajustar por design personalizado
    if (hasCustomDesign) productionDays *= 1.2;
    
    // Arredondar para cima
    productionDays = Math.ceil(productionDays);
    
    // Calcular dias de instalação (se incluída)
    let installationDays = 0;
    if (includesInstallation) {
        installationDays = Math.ceil(baseTimelineDays * 0.3 * locationFactor);
    }
    
    // Calcular dias totais
    const totalDays = productionDays + installationDays;
    
    // Calcular datas
    const today = new Date();
    
    // Data de início (próximo dia útil)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1); // Começar amanhã
    if (startDate.getDay() === 0) startDate.setDate(startDate.getDate() + 1); // Pular domingo
    if (startDate.getDay() === 6) startDate.setDate(startDate.getDate() + 2); // Pular sábado
    
    // Data de conclusão da produção
    const productionEndDate = addBusinessDays(startDate, productionDays);
    
    // Data de conclusão da instalação
    const installationEndDate = addBusinessDays(productionEndDate, installationDays);
    
    // Data de entrega final
    const deliveryDate = installationDays > 0 ? installationEndDate : productionEndDate;
    
    return {
        productionDays,
        installationDays,
        totalDays,
        startDate: startDate.toISOString(),
        productionEndDate: productionEndDate.toISOString(),
        installationEndDate: installationEndDate.toISOString(),
        deliveryDate: deliveryDate.toISOString()
    };
}

// Adicionar dias úteis a uma data
function addBusinessDays(date, days) {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) { // Não é fim de semana
            addedDays++;
        }
    }
    
    return result;
}

// Calcular custos adicionais
function calculateAdditionalCosts(hasAutomation, hasGlass, hasCustomDesign, includesInstallation, finishingFactor, area) {
    const additionalCosts = [];
    let totalCost = 0;
    
    // Custo de automação
    if (hasAutomation) {
        const motorInfo = estimatorData.materials['Motor para Automação'];
        const motorQuantity = Math.ceil(area / 10); // Um motor a cada 10m²
        const motorCost = motorQuantity * motorInfo.price;
        
        additionalCosts.push({
            name: 'Automação',
            description: `${motorQuantity} motor(es) para automação`,
            cost: motorCost.toFixed(2)
        });
        
        totalCost += motorCost;
    }
    
    // Custo de design personalizado
    if (hasCustomDesign) {
        const designCost = area * 50 * finishingFactor; // R$50 por m², ajustado pelo acabamento
        
        additionalCosts.push({
            name: 'Design Personalizado',
            description: 'Desenvolvimento de design exclusivo',
            cost: designCost.toFixed(2)
        });
        
        totalCost += designCost;
    }
    
    // Custo de transporte
    const transportCost = 200 + area * 10; // Base de R$200 + R$10 por m²
    
    additionalCosts.push({
        name: 'Transporte',
        description: 'Transporte do material e equipe',
        cost: transportCost.toFixed(2)
    });
    
    totalCost += transportCost;
    
    // Custo de ART (Anotação de Responsabilidade Técnica)
    if (area > 20 || includesInstallation) {
        const artCost = 350; // Valor fixo
        
        additionalCosts.push({
            name: 'ART',
            description: 'Anotação de Responsabilidade Técnica',
            cost: artCost.toFixed(2)
        });
        
        totalCost += artCost;
    }
    
    return {
        additionalCosts,
        totalCost
    };
}

// Exibir resultado da estimativa
function displayEstimateResult(estimate) {
    // Exibir resumo da estimativa
    const estimateResultContainer = document.getElementById('estimate-result');
    if (!estimateResultContainer) return;
    
    // Formatar valores monetários
    const formatCurrency = value => parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Formatar datas
    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };
    
    // Determinar nível de risco
    let riskLevel, riskClass;
    if (estimate.riskFactor < 1.2) {
        riskLevel = 'Baixo';
        riskClass = 'success';
    } else if (estimate.riskFactor < 1.5) {
        riskLevel = 'Médio';
        riskClass = 'warning';
    } else {
        riskLevel = 'Alto';
        riskClass = 'danger';
    }
    
    // Gerar HTML para o resumo da estimativa
    let html = `
        <div class="row mb-4">
            <div class="col-md-6">
                <h5 class="mb-3">${estimate.projectName}</h5>
                <p class="text-muted mb-1">
                    <strong>Tipo:</strong> ${estimatorData.projectTypes[estimate.projectType].name}
                </p>
                <p class="text-muted mb-1">
                    <strong>Cliente:</strong> ${estimate.clientName || 'Não informado'}
                </p>
                <p class="text-muted mb-1">
                    <strong>Dimensões:</strong> ${estimate.dimensions.width}m × ${estimate.dimensions.height}m
                    ${estimate.dimensions.length ? `× ${estimate.dimensions.length}m` : ''}
                </p>
                <p class="text-muted mb-1">
                    <strong>Área:</strong> ${estimate.area.toFixed(2)} m²
                </p>
                <p class="text-muted mb-3">
                    <strong>Nível de Risco:</strong> 
                    <span class="badge bg-${riskClass}">${riskLevel}</span>
                </p>
            </div>
            <div class="col-md-6">
                <div class="card bg-light h-100">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-4">Orçamento Total</h5>
                        <h2 class="mb-3">${formatCurrency(estimate.finalPrice)}</h2>
                        <div class="row">
                            <div class="col-6">
                                <p class="text-muted mb-1">Materiais:</p>
                                <p class="mb-2">${formatCurrency(estimate.costs.materials)}</p>
                            </div>
                            <div class="col-6">
                                <p class="text-muted mb-1">Mão de Obra:</p>
                                <p class="mb-2">${formatCurrency(estimate.costs.labor)}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <p class="text-muted mb-1">Adicionais:</p>
                                <p class="mb-2">${formatCurrency(estimate.costs.additional)}</p>
                            </div>
                            <div class="col-6">
                                <p class="text-muted mb-1">Margem:</p>
                                <p class="mb-2">${(estimate.profitMargin * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Cronograma Estimado</h6>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="text-center">
                                <p class="text-muted mb-1">Início</p>
                                <h5>${formatDate(estimate.timeline.startDate)}</h5>
                            </div>
                            <div class="progress flex-grow-1 mx-3" style="height: 10px;">
                                <div class="progress-bar bg-primary" role="progressbar" style="width: 100%"></div>
                            </div>
                            <div class="text-center">
                                <p class="text-muted mb-1">Entrega</p>
                                <h5>${formatDate(estimate.timeline.deliveryDate)}</h5>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-2">
                            <div>
                                <span class="badge bg-primary">${estimate.timeline.totalDays} dias úteis</span>
                            </div>
                            <div>
                                <span class="badge bg-secondary">${estimate.timeline.productionDays} dias de produção</span>
                                ${estimate.timeline.installationDays > 0 ? `<span class="badge bg-info ms-1">${estimate.timeline.installationDays} dias de instalação</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    estimateResultContainer.innerHTML = html;
    
    // Exibir lista de materiais
    displayMaterialsList(estimate.materials);
    
    // Exibir análise de riscos
    displayRiskAnalysis(estimate);
    
    // Exibir cronograma detalhado
    displayTimelineDetails(estimate.timeline);
}

// Exibir lista de materiais
function displayMaterialsList(materialsEstimate) {
    const materialsContainer = document.getElementById('materials-estimate');
    if (!materialsContainer) return;
    
    let html = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Qtd.</th>
                        <th>Unid.</th>
                        <th class="text-end">Valor</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    materialsEstimate.materials.forEach(material => {
        html += `
            <tr>
                <td>${material.name}</td>
                <td>${material.quantity}</td>
                <td>${material.unit}</td>
                <td class="text-end">R$ ${material.totalPrice}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Total</th>
                        <th class="text-end">R$ ${materialsEstimate.totalCost.toFixed(2)}</th>
                    </tr>
                    <tr>
                        <td colspan="3">Peso Total</td>
                        <td class="text-end">${materialsEstimate.totalWeight.toFixed(2)} kg</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    materialsContainer.innerHTML = html;
}

// Exibir análise de riscos
function displayRiskAnalysis(estimate) {
    const riskContainer = document.getElementById('risk-analysis');
    if (!riskContainer) return;
    
    // Obter descrições dos fatores de risco
    const complexityDescription = estimatorData.riskFactors.complexity[estimate.complexity].description;
    const locationDescription = estimatorData.riskFactors.location[estimate.location].description;
    const qualityDescription = estimatorData.riskFactors.quality[estimate.quality].description;
    const finishingDescription = estimatorData.riskFactors.finishing[estimate.finishing].description;
    const urgencyDescription = estimatorData.riskFactors.urgency[estimate.urgency].description;
    
    // Calcular fatores individuais
    const complexityFactor = estimatorData.riskFactors.complexity[estimate.complexity].factor;
    const locationFactor = estimatorData.riskFactors.location[estimate.location].factor;
    const qualityFactor = estimatorData.riskFactors.quality[estimate.quality].factor;
    const finishingFactor = estimatorData.riskFactors.finishing[estimate.finishing].factor;
    const urgencyFactor = estimatorData.riskFactors.urgency[estimate.urgency].factor;
    
    // Determinar classes de risco para cada fator
    function getRiskClass(factor) {
        if (factor < 1.2) return 'success';
        if (factor < 1.5) return 'warning';
        return 'danger';
    }
    
    let html = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>Complexidade</span>
                <span class="badge bg-${getRiskClass(complexityFactor)}">${(complexityFactor * 100 - 100).toFixed(0)}%</span>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${getRiskClass(complexityFactor)}" role="progressbar" 
                    style="width: ${(complexityFactor - 1) * 100}%"></div>
            </div>
            <small class="text-muted">${complexityDescription}</small>
        </div>
        
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>Local de Instalação</span>
                <span class="badge bg-${getRiskClass(locationFactor)}">${(locationFactor * 100 - 100).toFixed(0)}%</span>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${getRiskClass(locationFactor)}" role="progressbar" 
                    style="width: ${(locationFactor - 1) * 100}%"></div>
            </div>
            <small class="text-muted">${locationDescription}</small>
        </div>
        
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>Qualidade do Material</span>
                <span class="badge bg-${getRiskClass(qualityFactor)}">${(qualityFactor * 100 - 100).toFixed(0)}%</span>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${getRiskClass(qualityFactor)}" role="progressbar" 
                    style="width: ${(qualityFactor - 1) * 100}%"></div>
            </div>
            <small class="text-muted">${qualityDescription}</small>
        </div>
        
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>Acabamento</span>
                <span class="badge bg-${getRiskClass(finishingFactor)}">${(finishingFactor * 100 - 100).toFixed(0)}%</span>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${getRiskClass(finishingFactor)}" role="progressbar" 
                    style="width: ${(finishingFactor - 1) * 100}%"></div>
            </div>
            <small class="text-muted">${finishingDescription}</small>
        </div>
        
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>Urgência</span>
                <span class="badge bg-${getRiskClass(urgencyFactor)}">${(urgencyFactor * 100 - 100).toFixed(0)}%</span>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-${getRiskClass(urgencyFactor)}" role="progressbar" 
                    style="width: ${(urgencyFactor - 1) * 100}%"></div>
            </div>
            <small class="text-muted">${urgencyDescription}</small>
        </div>
        
        <div class="mt-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold">Risco Total</span>
                <span class="badge bg-${getRiskClass(estimate.riskFactor)}">${(estimate.riskFactor * 100 - 100).toFixed(0)}%</span>
            </div>
            <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-${getRiskClass(estimate.riskFactor)}" role="progressbar" 
                    style="width: ${(estimate.riskFactor - 1) * 100}%"></div>
            </div>
        </div>
    `;
    
    riskContainer.innerHTML = html;
}

// Exibir detalhes do cronograma
function displayTimelineDetails(timeline) {
    const timelineContainer = document.getElementById('timeline-estimate');
    if (!timelineContainer) return;
    
    // Formatar datas
    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };
    
    // Calcular etapas do cronograma
    const productionSteps = [
        { name: 'Preparação', days: Math.ceil(timeline.productionDays * 0.2) },
        { name: 'Corte e Montagem', days: Math.ceil(timeline.productionDays * 0.4) },
        { name: 'Soldagem', days: Math.ceil(timeline.productionDays * 0.2) },
        { name: 'Acabamento', days: Math.ceil(timeline.productionDays * 0.2) }
    ];
    
    // Calcular datas das etapas
    let currentDate = new Date(timeline.startDate);
    productionSteps.forEach(step => {
        step.startDate = new Date(currentDate);
        currentDate = addBusinessDays(currentDate, step.days);
        step.endDate = new Date(currentDate);
    });
    
    // Adicionar etapa de instalação se aplicável
    const timelineSteps = [...productionSteps];
    if (timeline.installationDays > 0) {
        timelineSteps.push({
            name: 'Instalação',
            days: timeline.installationDays,
            startDate: new Date(timeline.productionEndDate),
            endDate: new Date(timeline.installationEndDate)
        });
    }
    
    let html = `
        <div class="timeline-container">
            <div class="row">
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body text-center py-3">
                            <h6 class="card-title mb-1">Início do Projeto</h6>
                            <h5 class="mb-0">${formatDate(timeline.startDate)}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body text-center py-3">
                            <h6 class="card-title mb-1">Fim da Produção</h6>
                            <h5 class="mb-0">${formatDate(timeline.productionEndDate)}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body text-center py-3">
                            <h6 class="card-title mb-1">Entrega Final</h6>
                            <h5 class="mb-0">${formatDate(timeline.deliveryDate)}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body text-center py-3">
                            <h6 class="card-title mb-1">Tempo Total</h6>
                            <h5 class="mb-0">${timeline.totalDays} dias úteis</h5>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="timeline-steps mt-4">
    `;
    
    timelineSteps.forEach((step, index) => {
        const isLast = index === timelineSteps.length - 1;
        html += `
            <div class="timeline-step">
                <div class="timeline-content">
                    <div class="inner-circle bg-primary">
                        <i class="bi bi-check text-white"></i>
                    </div>
                    <p class="h6 mt-3 mb-1">${step.name}</p>
                    <p class="mb-0 text-muted">${formatDate(step.startDate)} - ${formatDate(step.endDate)}</p>
                    <p class="mb-0 badge bg-secondary">${step.days} dias</p>
                </div>
                ${!isLast ? '<div class="timeline-line"></div>' : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <style>
            .timeline-steps {
                display: flex;
                justify-content: space-between;
                position: relative;
            }
            
            .timeline-step {
                flex: 1;
                text-align: center;
                position: relative;
            }
            
            .timeline-line {
                position: absolute;
                top: 20px;
                right: -50%;
                width: 100%;
                height: 2px;
                background-color: #dee2e6;
                z-index: 0;
            }
            
            .inner-circle {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
                position: relative;
                z-index: 1;
            }
        </style>
    `;
    
    timelineContainer.innerHTML = html;
}

// Salvar estimativa atual
function saveCurrentEstimate() {
    const currentEstimate = window.currentEstimate;
    if (!currentEstimate) {
        alert('Nenhuma estimativa para salvar. Calcule uma estimativa primeiro.');
        return;
    }
    
    // Adicionar à lista de estimativas salvas
    estimatorData.savedEstimates.push(currentEstimate);
    
    // Salvar no localStorage
    saveEstimatorData();
    
    // Atualizar lista de estimativas salvas
    updateSavedEstimatesList();
    
    alert('Estimativa salva com sucesso!');
}

// Atualizar lista de estimativas salvas
function updateSavedEstimatesList() {
    const savedEstimatesList = document.getElementById('saved-estimates-list');
    if (!savedEstimatesList) return;
    
    if (estimatorData.savedEstimates.length === 0) {
        savedEstimatesList.innerHTML = `
            <div class="text-center text-muted py-3">
                Nenhuma estimativa salva
            </div>
        `;
        return;
    }
    
    let html = '';
    
    // Ordenar estimativas por data (mais recentes primeiro)
    const sortedEstimates = [...estimatorData.savedEstimates].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedEstimates.forEach(estimate => {
        const date = new Date(estimate.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        const formattedPrice = parseFloat(estimate.finalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        html += `
            <div class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${estimate.projectName}</h6>
                    <small>${formattedDate}</small>
                </div>
                <p class="mb-1">${estimatorData.projectTypes[estimate.projectType].name} - ${formattedPrice}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small>${estimate.clientName || 'Cliente não informado'}</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary load-estimate-btn" data-estimate-id="${estimate.id}">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-estimate-btn" data-estimate-id="${estimate.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    savedEstimatesList.innerHTML = html;
}

// Carregar estimativa salva
function loadSavedEstimate(estimateId) {
    const estimate = estimatorData.savedEstimates.find(e => e.id === estimateId);
    if (!estimate) return;
    
    // Armazenar estimativa atual
    window.currentEstimate = estimate;
    
    // Preencher formulário com dados da estimativa
    document.getElementById('project-type').value = estimate.projectType;
    document.getElementById('project-name').value = estimate.projectName;
    document.getElementById('client-name').value = estimate.clientName || '';
    document.getElementById('project-width').value = estimate.dimensions.width;
    document.getElementById('project-height').value = estimate.dimensions.height;
    
    // Mostrar/ocultar campo de comprimento conforme necessário
    toggleLengthField(estimate.projectType);
    
    // Preencher comprimento se aplicável
    const lengthElement = document.getElementById('project-length');
    if (lengthElement && estimate.dimensions.length) {
        lengthElement.value = estimate.dimensions.length;
    }
    
    document.getElementById('project-complexity').value = estimate.complexity;
    document.getElementById('installation-location').value = estimate.location;
    document.getElementById('material-quality').value = estimate.quality;
    document.getElementById('finishing-type').value = estimate.finishing;
    document.getElementById('urgency-level').value = estimate.urgency;
    
    // Preencher recursos adicionais
    document.getElementById('feature-automation').checked = estimate.features.hasAutomation;
    document.getElementById('feature-glass').checked = estimate.features.hasGlass;
    document.getElementById('feature-design').checked = estimate.features.hasCustomDesign;
    document.getElementById('feature-installation').checked = estimate.features.includesInstallation;
    
    document.getElementById('project-notes').value = estimate.notes || '';
    
    // Exibir resultado
    displayEstimateResult(estimate);
    displayMaterialsList(estimate.materials);
    displayRiskAnalysis(estimate);
    displayTimelineDetails(estimate.timeline);
}

// Excluir estimativa salva
function deleteSavedEstimate(estimateId) {
    if (!confirm('Tem certeza que deseja excluir esta estimativa?')) return;
    
    // Remover estimativa da lista
    estimatorData.savedEstimates = estimatorData.savedEstimates.filter(e => e.id !== estimateId);
    
    // Salvar no localStorage
    saveEstimatorData();
    
    // Atualizar lista de estimativas salvas
    updateSavedEstimatesList();
}

// Exportar estimativa para PDF
function exportEstimateToPDF() {
    const currentEstimate = window.currentEstimate;
    if (!currentEstimate) {
        alert('Nenhuma estimativa para exportar. Calcule uma estimativa primeiro.');
        return;
    }
    
    // Verificar se jsPDF está disponível
    if (typeof window.jspdf === 'undefined') {
        alert('Biblioteca de PDF não carregada. Tente novamente em alguns instantes.');
        return;
    }
    
    alert('Exportação para PDF será implementada em breve.');
    
    // Implementação básica (a ser expandida)
    /*
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Adicionar título
    doc.setFontSize(20);
    doc.text('Orçamento - ' + currentEstimate.projectName, 20, 20);
    
    // Adicionar informações do projeto
    doc.setFontSize(12);
    doc.text('Tipo: ' + estimatorData.projectTypes[currentEstimate.projectType].name, 20, 40);
    doc.text('Cliente: ' + (currentEstimate.clientName || 'Não informado'), 20, 50);
    doc.text('Dimensões: ' + currentEstimate.dimensions.width + 'm × ' + currentEstimate.dimensions.height + 'm', 20, 60);
    
    // Adicionar valor total
    doc.setFontSize(16);
    doc.text('Valor Total: R$ ' + currentEstimate.finalPrice.toFixed(2), 20, 80);
    
    // Salvar PDF
    doc.save('orcamento-' + currentEstimate.projectName.replace(/\s+/g, '-').toLowerCase() + '.pdf');
    */
}

// Exportar funções para uso em outros módulos
window.estimatorModule = {
    init: initEstimatorModule,
    show: showEstimator,
    calculate: calculateEstimate,
    save: saveCurrentEstimate,
    export: exportEstimateToPDF
};
