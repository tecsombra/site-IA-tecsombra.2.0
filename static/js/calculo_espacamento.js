/**
 * Módulo de Cálculo Automático de Espaçamento entre Tesouras e Terças
 * 
 * Este módulo implementa o cálculo automático de espaçamento entre tesouras e terças
 * para estruturas metálicas de cobertura, seguindo as normas técnicas ABNT NBR 8800
 * e as práticas recomendadas do setor.
 * 
 * Autor: Manus AI
 * Data: 15/04/2025
 */

// Inicializar o módulo quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o jQuery já está carregado
    if (typeof jQuery === 'undefined') {
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        document.head.appendChild(jqueryScript);
        
        jqueryScript.onload = function() {
            initEspacamentoModule();
        };
    } else {
        initEspacamentoModule();
    }
});

// Variáveis globais
let espacamentoData = {
    tiposTelha: {},
    tiposPerfil: {},
    materiaisEstrutura: {},
    configuracoesVao: {}
};

// Função principal de inicialização
function initEspacamentoModule() {
    // Criar container para o módulo se não existir
    createEspacamentoContainer();
    
    // Carregar dados do módulo
    loadEspacamentoData();
    
    // Configurar listeners de eventos
    setupEspacamentoEventListeners();
    
    // Integrar com o módulo de estimativa automática
    integrateWithEstimativaModule();
}

// Criar container para o módulo de espaçamento
function createEspacamentoContainer() {
    // Verificar se o container já existe
    const espacamentoContainer = document.getElementById('espacamento-container');
    if (espacamentoContainer) return;
    
    // Criar container principal
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    const container = document.createElement('div');
    container.id = 'espacamento-container';
    container.className = 'module-container';
    container.style.display = 'none';
    
    // Adicionar HTML para o módulo de espaçamento
    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-8">
                <h4 class="mb-3"><i class="bi bi-rulers"></i> Cálculo de Espaçamento entre Tesouras e Terças</h4>
            </div>
            <div class="col-md-4 text-end">
                <div class="btn-group">
                    <button id="btn-save-espacamento" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-save"></i> Salvar
                    </button>
                    <button id="btn-export-espacamento" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-file-pdf"></i> Exportar PDF
                    </button>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Parâmetros da Estrutura</h5>
                    </div>
                    <div class="card-body">
                        <form id="espacamento-form">
                            <div class="mb-3">
                                <label for="tipo-estrutura" class="form-label">Tipo de Estrutura</label>
                                <select class="form-select" id="tipo-estrutura" required>
                                    <option value="" selected disabled>Selecione o tipo de estrutura</option>
                                    <option value="duas-aguas">Cobertura em Duas Águas</option>
                                    <option value="uma-agua">Cobertura em Uma Água</option>
                                    <option value="arco">Cobertura em Arco</option>
                                    <option value="shed">Cobertura tipo Shed</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="vao-livre" class="form-label">Vão Livre (m)</label>
                                <input type="number" step="0.01" min="1" class="form-control" id="vao-livre" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="comprimento-total" class="form-label">Comprimento Total (m)</label>
                                <input type="number" step="0.01" min="1" class="form-control" id="comprimento-total" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="inclinacao-telhado" class="form-label">Inclinação do Telhado (%)</label>
                                <input type="number" step="0.1" min="1" max="100" class="form-control" id="inclinacao-telhado" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="tipo-telha" class="form-label">Tipo de Telha</label>
                                <select class="form-select" id="tipo-telha" required>
                                    <option value="" selected disabled>Selecione o tipo de telha</option>
                                    <option value="trapezoidal-40">Telha Trapezoidal TP40</option>
                                    <option value="trapezoidal-25">Telha Trapezoidal TP25</option>
                                    <option value="ondulada">Telha Ondulada</option>
                                    <option value="termoacustica">Telha Termoacústica</option>
                                    <option value="zipada">Telha Zipada</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="material-estrutura" class="form-label">Material da Estrutura</label>
                                <select class="form-select" id="material-estrutura" required>
                                    <option value="" selected disabled>Selecione o material</option>
                                    <option value="aco-astm-a36">Aço ASTM A36</option>
                                    <option value="aco-astm-a572">Aço ASTM A572</option>
                                    <option value="aco-sae-1020">Aço SAE 1020</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="perfil-terca" class="form-label">Perfil das Terças</label>
                                <select class="form-select" id="perfil-terca" required>
                                    <option value="" selected disabled>Selecione o perfil</option>
                                    <option value="u-simples">Perfil U Simples</option>
                                    <option value="u-enrijecido">Perfil U Enrijecido</option>
                                    <option value="z-simples">Perfil Z Simples</option>
                                    <option value="z-enrijecido">Perfil Z Enrijecido</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="carga-adicional" class="form-label">Carga Adicional (kgf/m²)</label>
                                <input type="number" step="0.1" min="0" class="form-control" id="carga-adicional" value="0">
                                <small class="form-text text-muted">Equipamentos, forro, etc.</small>
                            </div>
                            
                            <div class="mb-3">
                                <label for="regiao-vento" class="form-label">Região de Vento (NBR 6123)</label>
                                <select class="form-select" id="regiao-vento">
                                    <option value="1">Região I (Vo = 30 m/s)</option>
                                    <option value="2">Região II (Vo = 35 m/s)</option>
                                    <option value="3">Região III (Vo = 40 m/s)</option>
                                    <option value="4">Região IV (Vo = 45 m/s)</option>
                                    <option value="5">Região V (Vo = 50 m/s)</option>
                                </select>
                            </div>
                            
                            <button type="button" id="btn-calcular-espacamento" class="btn btn-primary w-100">
                                <i class="bi bi-calculator"></i> Calcular Espaçamento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Resultado do Cálculo</h5>
                    </div>
                    <div class="card-body">
                        <div id="espacamento-result">
                            <div class="text-center py-5">
                                <i class="bi bi-rulers fs-1 text-muted"></i>
                                <p class="mt-3 text-muted">Preencha os parâmetros da estrutura e clique em "Calcular Espaçamento" para ver o resultado.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Espaçamento entre Tesouras</h5>
                            </div>
                            <div class="card-body">
                                <div id="tesouras-espacamento">
                                    <div class="text-center py-4 text-muted">
                                        Aguardando cálculo de espaçamento
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Espaçamento entre Terças</h5>
                            </div>
                            <div class="card-body">
                                <div id="tercas-espacamento">
                                    <div class="text-center py-4 text-muted">
                                        Aguardando cálculo de espaçamento
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Visualização Esquemática</h5>
                    </div>
                    <div class="card-body">
                        <div id="esquema-espacamento" style="height: 300px; position: relative;">
                            <div class="text-center py-4 text-muted">
                                Aguardando cálculo de espaçamento
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mainContainer.appendChild(container);
    
    // Adicionar link de navegação para o módulo de espaçamento
    addEspacamentoNavLink();
}

// Adicionar link de navegação para o módulo de espaçamento
function addEspacamentoNavLink() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se o link já existe
    if (document.getElementById('nav-espacamento')) return;
    
    // Criar link para o módulo de espaçamento
    const espacamentoLink = document.createElement('li');
    espacamentoLink.className = 'nav-item';
    espacamentoLink.id = 'nav-espacamento';
    espacamentoLink.innerHTML = `
        <a class="nav-link" href="#" data-module="espacamento">
            <i class="bi bi-rulers"></i> Espaçamento
        </a>
    `;
    
    // Adicionar link ao menu de navegação
    navbarNav.appendChild(espacamentoLink);
    
    // Adicionar event listener para o link
    espacamentoLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showEspacamentoModule();
    });
}

// Mostrar o módulo de espaçamento
function showEspacamentoModule() {
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
    
    // Mostrar container do módulo de espaçamento
    const espacamentoContainer = document.getElementById('espacamento-container');
    if (espacamentoContainer) {
        espacamentoContainer.style.display = 'block';
    }
    
    // Atualizar links ativos no menu de navegação
    updateActiveNavLinks('espacamento');
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

// Carregar dados do módulo de espaçamento
function loadEspacamentoData() {
    // Dados de tipos de telha
    espacamentoData.tiposTelha = {
        'trapezoidal-40': {
            nome: 'Telha Trapezoidal TP40',
            espessura: 0.5, // mm
            peso: 5.2, // kg/m²
            vaoMaximo: 2.5, // m
            vaoRecomendado: 1.8, // m
            inclinacaoMinima: 5 // %
        },
        'trapezoidal-25': {
            nome: 'Telha Trapezoidal TP25',
            espessura: 0.43, // mm
            peso: 4.3, // kg/m²
            vaoMaximo: 2.0, // m
            vaoRecomendado: 1.6, // m
            inclinacaoMinima: 7 // %
        },
        'ondulada': {
            nome: 'Telha Ondulada',
            espessura: 0.5, // mm
            peso: 4.8, // kg/m²
            vaoMaximo: 1.8, // m
            vaoRecomendado: 1.5, // m
            inclinacaoMinima: 10 // %
        },
        'termoacustica': {
            nome: 'Telha Termoacústica',
            espessura: 30, // mm (total com isolamento)
            peso: 10.5, // kg/m²
            vaoMaximo: 2.5, // m
            vaoRecomendado: 1.8, // m
            inclinacaoMinima: 5 // %
        },
        'zipada': {
            nome: 'Telha Zipada',
            espessura: 0.65, // mm
            peso: 6.2, // kg/m²
            vaoMaximo: 3.0, // m
            vaoRecomendado: 2.0, // m
            inclinacaoMinima: 1 // %
        }
    };
    
    // Dados de tipos de perfil
    espacamentoData.tiposPerfil = {
        'u-simples': {
            nome: 'Perfil U Simples',
            alturas: [100, 150, 200, 250, 300], // mm
            espessuras: [2.0, 2.65, 3.0, 3.75, 4.75], // mm
            peso: [2.71, 3.97, 5.36, 7.14, 9.09], // kg/m (para espessura 2.65mm)
            inerciaY: [83.6, 291.5, 683.8, 1345.6, 2315.3] // cm⁴ (para espessura 2.65mm)
        },
        'u-enrijecido': {
            nome: 'Perfil U Enrijecido',
            alturas: [100, 150, 200, 250, 300], // mm
            espessuras: [2.0, 2.65, 3.0, 3.75, 4.75], // mm
            peso: [3.06, 4.43, 5.94, 7.84, 9.89], // kg/m (para espessura 2.65mm)
            inerciaY: [106.2, 358.4, 831.6, 1624.8, 2776.4] // cm⁴ (para espessura 2.65mm)
        },
        'z-simples': {
            nome: 'Perfil Z Simples',
            alturas: [100, 150, 200, 250, 300], // mm
            espessuras: [2.0, 2.65, 3.0, 3.75, 4.75], // mm
            peso: [2.83, 4.13, 5.57, 7.39, 9.39], // kg/m (para espessura 2.65mm)
            inerciaY: [89.8, 312.4, 732.7, 1440.2, 2477.9] // cm⁴ (para espessura 2.65mm)
        },
        'z-enrijecido': {
            nome: 'Perfil Z Enrijecido',
            alturas: [100, 150, 200, 250, 300], // mm
            espessuras: [2.0, 2.65, 3.0, 3.75, 4.75], // mm
            peso: [3.18, 4.59, 6.15, 8.10, 10.21], // kg/m (para espessura 2.65mm)
            inerciaY: [113.6, 383.5, 889.8, 1738.5, 2970.8] // cm⁴ (para espessura 2.65mm)
        }
    };
    
    // Dados de materiais de estrutura
    espacamentoData.materiaisEstrutura = {
        'aco-astm-a36': {
            nome: 'Aço ASTM A36',
            fy: 250, // MPa (tensão de escoamento)
            fu: 400, // MPa (tensão de ruptura)
            E: 200000 // MPa (módulo de elasticidade)
        },
        'aco-astm-a572': {
            nome: 'Aço ASTM A572',
            fy: 345, // MPa (tensão de escoamento)
            fu: 450, // MPa (tensão de ruptura)
            E: 200000 // MPa (módulo de elasticidade)
        },
        'aco-sae-1020': {
            nome: 'Aço SAE 1020',
            fy: 210, // MPa (tensão de escoamento)
            fu: 380, // MPa (tensão de ruptura)
            E: 200000 // MPa (módulo de elasticidade)
        }
    };
    
    // Configurações de vão
    espacamentoData.configuracoesVao = {
        'tesouras': {
            minimo: 3.0, // m
            maximo: 6.0, // m
            padrao: 4.5, // m
            afastamentoCumeeira: 0.25 // m
        },
        'tercas': {
            minimo: 1.5, // m
            maximo: 2.5, // m
            padrao: 1.8, // m
            afastamentoCumeeira: 0.2 // m
        }
    };
}

// Configurar listeners de eventos
function setupEspacamentoEventListeners() {
    // Botão de calcular espaçamento
    const btnCalcularEspacamento = document.getElementById('btn-calcular-espacamento');
    if (btnCalcularEspacamento) {
        btnCalcularEspacamento.addEventListener('click', function() {
            calcularEspacamento();
        });
    }
    
    // Botão de salvar espaçamento
    const btnSaveEspacamento = document.getElementById('btn-save-espacamento');
    if (btnSaveEspacamento) {
        btnSaveEspacamento.addEventListener('click', function() {
            salvarEspacamento();
        });
    }
    
    // Botão de exportar PDF
    const btnExportEspacamento = document.getElementById('btn-export-espacamento');
    if (btnExportEspacamento) {
        btnExportEspacamento.addEventListener('click', function() {
            exportarPDFEspacamento();
        });
    }
    
    // Evento de mudança no tipo de telha
    const tipoTelhaSelect = document.getElementById('tipo-telha');
    if (tipoTelhaSelect) {
        tipoTelhaSelect.addEventListener('change', function() {
            atualizarParametrosTelha();
        });
    }
    
    // Evento de mudança no tipo de estrutura
    const tipoEstruturaSelect = document.getElementById('tipo-estrutura');
    if (tipoEstruturaSelect) {
        tipoEstruturaSelect.addEventListener('change', function() {
            atualizarParametrosEstrutura();
        });
    }
}

// Integrar com o módulo de estimativa automática
function integrateWithEstimativaModule() {
    // Verificar se o módulo de estimativa automática existe
    const estimativaContainer = document.getElementById('estimator-container');
    if (!estimativaContainer) return;
    
    // Adicionar botão para calcular espaçamento no módulo de estimativa
    const estimativaForm = estimativaContainer.querySelector('#project-details-form');
    if (estimativaForm) {
        const btnGroup = document.createElement('div');
        btnGroup.className = 'mt-3';
        btnGroup.innerHTML = `
            <button type="button" id="btn-espacamento-from-estimativa" class="btn btn-outline-secondary w-100">
                <i class="bi bi-rulers"></i> Calcular Espaçamento
            </button>
        `;
        
        estimativaForm.appendChild(btnGroup);
        
        // Adicionar event listener para o botão
        const btnEspacamentoFromEstimativa = document.getElementById('btn-espacamento-from-estimativa');
        if (btnEspacamentoFromEstimativa) {
            btnEspacamentoFromEstimativa.addEventListener('click', function() {
                transferirDadosParaEspacamento();
            });
        }
    }
}

// Transferir dados do módulo de estimativa para o módulo de espaçamento
function transferirDadosParaEspacamento() {
    // Obter dados do formulário de estimativa
    const projectType = document.getElementById('project-type')?.value;
    const projectWidth = document.getElementById('project-width')?.value;
    const projectHeight = document.getElementById('project-height')?.value;
    const projectLength = document.getElementById('project-length')?.value;
    
    // Mostrar o módulo de espaçamento
    showEspacamentoModule();
    
    // Preencher o formulário de espaçamento com os dados da estimativa
    if (projectType === 'cobertura') {
        document.getElementById('tipo-estrutura').value = 'duas-aguas';
    } else if (projectType === 'mezanino') {
        document.getElementById('tipo-estrutura').value = 'uma-agua';
    }
    
    if (projectWidth) {
        document.getElementById('vao-livre').value = projectWidth;
    }
    
    if (projectLength) {
        document.getElementById('comprimento-total').value = projectLength;
    }
    
    // Definir inclinação padrão
    document.getElementById('inclinacao-telhado').value = 10;
    
    // Focar no primeiro campo vazio
    const emptyFields = Array.from(document.querySelectorAll('#espacamento-form input, #espacamento-form select')).filter(field => !field.value);
    if (emptyFields.length > 0) {
        emptyFields[0].focus();
    }
}

// Atualizar parâmetros com base no tipo de telha selecionado
function atualizarParametrosTelha() {
    const tipoTelha = document.getElementById('tipo-telha').value;
    if (!tipoTelha) return;
    
    const telhaData = espacamentoData.tiposTelha[tipoTelha];
    if (!telhaData) return;
    
    // Atualizar inclinação mínima
    const inclinacaoInput = document.getElementById('inclinacao-telhado');
    if (inclinacaoInput && parseFloat(inclinacaoInput.value) < telhaData.inclinacaoMinima) {
        inclinacaoInput.value = telhaData.inclinacaoMinima;
    }
}

// Atualizar parâmetros com base no tipo de estrutura selecionado
function atualizarParametrosEstrutura() {
    const tipoEstrutura = document.getElementById('tipo-estrutura').value;
    if (!tipoEstrutura) return;
    
    // Ajustar campos com base no tipo de estrutura
    if (tipoEstrutura === 'uma-agua') {
        // Para estrutura de uma água, ajustar inclinação mínima
        const inclinacaoInput = document.getElementById('inclinacao-telhado');
        if (inclinacaoInput && parseFloat(inclinacaoInput.value) < 5) {
            inclinacaoInput.value = 5;
        }
    } else if (tipoEstrutura === 'arco') {
        // Para estrutura em arco, desabilitar campo de inclinação
        const inclinacaoInput = document.getElementById('inclinacao-telhado');
        if (inclinacaoInput) {
            inclinacaoInput.disabled = true;
            inclinacaoInput.value = '';
        }
    } else {
        // Para outros tipos, habilitar campo de inclinação
        const inclinacaoInput = document.getElementById('inclinacao-telhado');
        if (inclinacaoInput) {
            inclinacaoInput.disabled = false;
        }
    }
}

// Calcular espaçamento entre tesouras e terças
function calcularEspacamento() {
    // Obter valores do formulário
    const tipoEstrutura = document.getElementById('tipo-estrutura').value;
    const vaoLivre = parseFloat(document.getElementById('vao-livre').value);
    const comprimentoTotal = parseFloat(document.getElementById('comprimento-total').value);
    const inclinacaoTelhado = parseFloat(document.getElementById('inclinacao-telhado').value);
    const tipoTelha = document.getElementById('tipo-telha').value;
    const materialEstrutura = document.getElementById('material-estrutura').value;
    const perfilTerca = document.getElementById('perfil-terca').value;
    const cargaAdicional = parseFloat(document.getElementById('carga-adicional').value) || 0;
    const regiaoVento = document.getElementById('regiao-vento').value;
    
    // Validar formulário
    if (!tipoEstrutura || !vaoLivre || !comprimentoTotal || !inclinacaoTelhado || !tipoTelha || !materialEstrutura || !perfilTerca) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter dados da telha selecionada
    const telhaData = espacamentoData.tiposTelha[tipoTelha];
    if (!telhaData) {
        alert('Tipo de telha inválido.');
        return;
    }
    
    // Obter dados do perfil selecionado
    const perfilData = espacamentoData.tiposPerfil[perfilTerca];
    if (!perfilData) {
        alert('Tipo de perfil inválido.');
        return;
    }
    
    // Obter dados do material selecionado
    const materialData = espacamentoData.materiaisEstrutura[materialEstrutura];
    if (!materialData) {
        alert('Material inválido.');
        return;
    }
    
    // Calcular espaçamento entre tesouras
    const espacamentoTesouras = calcularEspacamentoTesouras(vaoLivre, comprimentoTotal, inclinacaoTelhado, telhaData, materialData, cargaAdicional, regiaoVento);
    
    // Calcular espaçamento entre terças
    const espacamentoTercas = calcularEspacamentoTercas(vaoLivre, inclinacaoTelhado, telhaData, perfilData, materialData, espacamentoTesouras.espacamento, cargaAdicional, regiaoVento);
    
    // Exibir resultados
    exibirResultadosEspacamento(espacamentoTesouras, espacamentoTercas);
    
    // Desenhar esquema
    desenharEsquemaEspacamento(tipoEstrutura, vaoLivre, comprimentoTotal, inclinacaoTelhado, espacamentoTesouras, espacamentoTercas);
}

// Calcular espaçamento entre tesouras
function calcularEspacamentoTesouras(vaoLivre, comprimentoTotal, inclinacaoTelhado, telhaData, materialData, cargaAdicional, regiaoVento) {
    // Calcular carga total (peso próprio + sobrecarga + vento)
    const pesoProprioEstrutura = 15; // kg/m² (estimativa para estrutura metálica)
    const pesoTelha = telhaData.peso; // kg/m²
    const sobrecarga = 25; // kg/m² (manutenção)
    const cargaVento = calcularCargaVento(regiaoVento, inclinacaoTelhado); // kg/m²
    
    const cargaTotal = pesoProprioEstrutura + pesoTelha + sobrecarga + cargaAdicional + cargaVento; // kg/m²
    
    // Converter para kN/m²
    const cargaTotalKN = cargaTotal / 102; // 1 kgf = 9.81 N, então 1 kgf/m² ≈ 0.00981 kN/m²
    
    // Calcular espaçamento máximo entre tesouras com base na carga
    // Fórmula baseada em práticas de engenharia e normas técnicas
    let espacamentoMaximo = 6.0; // m (valor máximo recomendado)
    
    // Ajustar espaçamento com base na carga total
    if (cargaTotalKN > 1.5) {
        espacamentoMaximo = 5.0;
    }
    if (cargaTotalKN > 2.0) {
        espacamentoMaximo = 4.5;
    }
    if (cargaTotalKN > 2.5) {
        espacamentoMaximo = 4.0;
    }
    if (cargaTotalKN > 3.0) {
        espacamentoMaximo = 3.5;
    }
    
    // Ajustar espaçamento com base no vão livre
    if (vaoLivre > 15) {
        espacamentoMaximo = Math.min(espacamentoMaximo, 4.0);
    }
    if (vaoLivre > 20) {
        espacamentoMaximo = Math.min(espacamentoMaximo, 3.5);
    }
    if (vaoLivre > 25) {
        espacamentoMaximo = Math.min(espacamentoMaximo, 3.0);
    }
    
    // Calcular número de tesouras
    const numeroTesouras = Math.ceil(comprimentoTotal / espacamentoMaximo) + 1;
    
    // Calcular espaçamento real
    const espacamentoReal = comprimentoTotal / (numeroTesouras - 1);
    
    // Calcular altura da tesoura (regra prática: 1/10 a 1/15 do vão)
    const alturaTesoura = Math.round((vaoLivre / 12) * 100) / 100;
    
    return {
        espacamento: espacamentoReal,
        numero: numeroTesouras,
        altura: alturaTesoura,
        cargaTotal: cargaTotal,
        cargaTotalKN: cargaTotalKN
    };
}

// Calcular espaçamento entre terças
function calcularEspacamentoTercas(vaoLivre, inclinacaoTelhado, telhaData, perfilData, materialData, espacamentoTesouras, cargaAdicional, regiaoVento) {
    // Obter vão máximo recomendado para a telha
    const vaoMaximoTelha = telhaData.vaoRecomendado; // m
    
    // Calcular comprimento real da água do telhado (considerando a inclinação)
    const alturaAgua = (vaoLivre / 2) * (inclinacaoTelhado / 100);
    const comprimentoAgua = Math.sqrt(Math.pow(vaoLivre / 2, 2) + Math.pow(alturaAgua, 2));
    
    // Calcular número de terças por água
    // Considerando o afastamento da cumeeira
    const afastamentoCumeeira = espacamentoData.configuracoesVao.tercas.afastamentoCumeeira;
    const comprimentoUtil = comprimentoAgua - afastamentoCumeeira;
    
    // Calcular número de terças por água (excluindo a terça da cumeeira)
    const numeroTercasPorAgua = Math.ceil(comprimentoUtil / vaoMaximoTelha) + 1;
    
    // Calcular espaçamento real entre terças
    const espacamentoReal = comprimentoUtil / (numeroTercasPorAgua - 1);
    
    // Calcular número total de terças (incluindo a terça da cumeeira)
    const numeroTotalTercas = numeroTercasPorAgua * 2 - 1;
    
    // Calcular posições das terças
    const posicoesTercas = calcularPosicoesTercas(comprimentoAgua, numeroTercasPorAgua, espacamentoReal, afastamentoCumeeira);
    
    return {
        espacamento: espacamentoReal,
        numeroTotal: numeroTotalTercas,
        numeroPorAgua: numeroTercasPorAgua,
        comprimentoAgua: comprimentoAgua,
        afastamentoCumeeira: afastamentoCumeeira,
        posicoes: posicoesTercas
    };
}

// Calcular posições das terças
function calcularPosicoesTercas(comprimentoAgua, numeroTercasPorAgua, espacamentoReal, afastamentoCumeeira) {
    const posicoes = [];
    
    // Terça da cumeeira
    posicoes.push({
        posicao: 0,
        descricao: 'Terça da cumeeira'
    });
    
    // Terças da primeira água
    for (let i = 1; i < numeroTercasPorAgua; i++) {
        const posicao = i * espacamentoReal;
        posicoes.push({
            posicao: posicao,
            descricao: `Terça ${i} (primeira água)`
        });
    }
    
    // Terças da segunda água
    for (let i = 1; i < numeroTercasPorAgua; i++) {
        const posicao = -i * espacamentoReal;
        posicoes.push({
            posicao: posicao,
            descricao: `Terça ${i} (segunda água)`
        });
    }
    
    return posicoes.sort((a, b) => a.posicao - b.posicao);
}

// Calcular carga de vento
function calcularCargaVento(regiaoVento, inclinacaoTelhado) {
    // Velocidade básica do vento por região (m/s)
    const velocidadeBasica = {
        '1': 30,
        '2': 35,
        '3': 40,
        '4': 45,
        '5': 50
    };
    
    // Obter velocidade básica
    const v0 = velocidadeBasica[regiaoVento] || 30;
    
    // Fatores simplificados
    const s1 = 1.0; // Fator topográfico
    const s2 = 0.95; // Fator de rugosidade (terreno categoria III, altura 10m)
    const s3 = 1.0; // Fator estatístico (edificação tipo II)
    
    // Velocidade característica
    const vk = v0 * s1 * s2 * s3;
    
    // Pressão dinâmica (q)
    const q = 0.613 * Math.pow(vk, 2) / 100; // kN/m²
    
    // Coeficiente de pressão (simplificado)
    let cp = -0.8; // Valor padrão para sucção
    
    // Ajustar coeficiente com base na inclinação
    if (inclinacaoTelhado <= 5) {
        cp = -0.8;
    } else if (inclinacaoTelhado <= 10) {
        cp = -0.7;
    } else if (inclinacaoTelhado <= 15) {
        cp = -0.5;
    } else if (inclinacaoTelhado <= 20) {
        cp = -0.3;
    } else {
        cp = -0.2;
    }
    
    // Pressão efetiva
    const pressao = q * cp;
    
    // Converter para kg/m²
    return Math.abs(pressao * 102);
}

// Exibir resultados do cálculo de espaçamento
function exibirResultadosEspacamento(espacamentoTesouras, espacamentoTercas) {
    // Exibir resultado geral
    const resultadoContainer = document.getElementById('espacamento-result');
    if (resultadoContainer) {
        resultadoContainer.innerHTML = `
            <div class="alert alert-success">
                <h5 class="alert-heading">Cálculo concluído com sucesso!</h5>
                <p>O espaçamento ideal entre tesouras é de <strong>${espacamentoTesouras.espacamento.toFixed(2)} m</strong>, 
                totalizando <strong>${espacamentoTesouras.numero} tesouras</strong>.</p>
                <p>O espaçamento ideal entre terças é de <strong>${espacamentoTercas.espacamento.toFixed(2)} m</strong>, 
                totalizando <strong>${espacamentoTercas.numeroTotal} terças</strong> (${espacamentoTercas.numeroPorAgua} por água, incluindo a terça da cumeeira).</p>
                <hr>
                <p class="mb-0">Altura recomendada da tesoura: <strong>${espacamentoTesouras.altura.toFixed(2)} m</strong></p>
            </div>
        `;
    }
    
    // Exibir detalhes do espaçamento entre tesouras
    const tesouraContainer = document.getElementById('tesouras-espacamento');
    if (tesouraContainer) {
        tesouraContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table table-sm">
                    <tbody>
                        <tr>
                            <th>Espaçamento entre tesouras:</th>
                            <td>${espacamentoTesouras.espacamento.toFixed(2)} m</td>
                        </tr>
                        <tr>
                            <th>Número total de tesouras:</th>
                            <td>${espacamentoTesouras.numero}</td>
                        </tr>
                        <tr>
                            <th>Altura recomendada da tesoura:</th>
                            <td>${espacamentoTesouras.altura.toFixed(2)} m</td>
                        </tr>
                        <tr>
                            <th>Carga total considerada:</th>
                            <td>${espacamentoTesouras.cargaTotal.toFixed(2)} kg/m² (${espacamentoTesouras.cargaTotalKN.toFixed(2)} kN/m²)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Exibir detalhes do espaçamento entre terças
    const tercaContainer = document.getElementById('tercas-espacamento');
    if (tercaContainer) {
        tercaContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table table-sm">
                    <tbody>
                        <tr>
                            <th>Espaçamento entre terças:</th>
                            <td>${espacamentoTercas.espacamento.toFixed(2)} m</td>
                        </tr>
                        <tr>
                            <th>Número total de terças:</th>
                            <td>${espacamentoTercas.numeroTotal}</td>
                        </tr>
                        <tr>
                            <th>Terças por água:</th>
                            <td>${espacamentoTercas.numeroPorAgua}</td>
                        </tr>
                        <tr>
                            <th>Comprimento da água:</th>
                            <td>${espacamentoTercas.comprimentoAgua.toFixed(2)} m</td>
                        </tr>
                        <tr>
                            <th>Afastamento na cumeeira:</th>
                            <td>${espacamentoTercas.afastamentoCumeeira.toFixed(2)} m</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

// Desenhar esquema do espaçamento
function desenharEsquemaEspacamento(tipoEstrutura, vaoLivre, comprimentoTotal, inclinacaoTelhado, espacamentoTesouras, espacamentoTercas) {
    const container = document.getElementById('esquema-espacamento');
    if (!container) return;
    
    // Limpar container
    container.innerHTML = '';
    
    // Verificar se o canvas já existe
    let canvas = container.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Definir escala
    const escalaX = (canvas.width - 40) / comprimentoTotal;
    const escalaY = (canvas.height - 40) / vaoLivre;
    const escala = Math.min(escalaX, escalaY);
    
    // Definir origem
    const originX = 20;
    const originY = canvas.height - 20;
    
    // Desenhar eixos
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Eixo X
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + comprimentoTotal * escala, originY);
    ctx.stroke();
    
    // Desenhar tesouras
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < espacamentoTesouras.numero; i++) {
        const x = originX + i * espacamentoTesouras.espacamento * escala;
        
        // Desenhar tesoura
        ctx.beginPath();
        
        if (tipoEstrutura === 'duas-aguas') {
            // Tesoura de duas águas
            ctx.moveTo(x, originY);
            ctx.lineTo(x, originY - espacamentoTesouras.altura * escala);
            ctx.lineTo(x, originY - vaoLivre * escala / 2);
            ctx.stroke();
        } else if (tipoEstrutura === 'uma-agua') {
            // Tesoura de uma água
            ctx.moveTo(x, originY);
            ctx.lineTo(x, originY - vaoLivre * escala * (inclinacaoTelhado / 100));
            ctx.stroke();
        } else if (tipoEstrutura === 'arco') {
            // Tesoura em arco
            ctx.moveTo(x, originY);
            
            // Desenhar arco
            const raio = vaoLivre * escala / 2;
            ctx.arc(x, originY - raio, raio, Math.PI, 0, true);
            
            ctx.stroke();
        }
        
        // Adicionar texto
        ctx.fillStyle = '#007bff';
        ctx.font = '10px Arial';
        ctx.fillText(`T${i+1}`, x - 5, originY + 15);
    }
    
    // Desenhar linha de telhado
    ctx.strokeStyle = '#dc3545';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    
    if (tipoEstrutura === 'duas-aguas') {
        // Telhado de duas águas
        const alturaAgua = (vaoLivre / 2) * (inclinacaoTelhado / 100);
        const alturaCumeeira = vaoLivre * escala / 2 + alturaAgua * escala;
        
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + comprimentoTotal * escala / 2, originY - alturaCumeeira);
        ctx.lineTo(originX + comprimentoTotal * escala, originY);
        ctx.stroke();
    } else if (tipoEstrutura === 'uma-agua') {
        // Telhado de uma água
        const alturaAgua = vaoLivre * (inclinacaoTelhado / 100);
        
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + comprimentoTotal * escala, originY - alturaAgua * escala);
        ctx.stroke();
    } else if (tipoEstrutura === 'arco') {
        // Telhado em arco
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        
        // Desenhar arco
        const raio = vaoLivre * escala / 2;
        ctx.arc(originX + comprimentoTotal * escala / 2, originY - raio, raio, Math.PI, 0, true);
        
        ctx.stroke();
    }
    
    // Resetar linha tracejada
    ctx.setLineDash([]);
    
    // Adicionar legenda
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`Espaçamento entre tesouras: ${espacamentoTesouras.espacamento.toFixed(2)} m`, 20, 20);
    ctx.fillText(`Espaçamento entre terças: ${espacamentoTercas.espacamento.toFixed(2)} m`, 20, 40);
}

// Salvar espaçamento
function salvarEspacamento() {
    // Implementação futura
    alert('Funcionalidade de salvar espaçamento será implementada em breve.');
}

// Exportar PDF do espaçamento
function exportarPDFEspacamento() {
    // Verificar se jsPDF está disponível
    if (typeof jspdf === 'undefined') {
        alert('Biblioteca jsPDF não está disponível. Por favor, tente novamente mais tarde.');
        return;
    }
    
    // Implementação futura
    alert('Funcionalidade de exportar PDF será implementada em breve.');
}

// Exportar função para uso global
window.calcularEspacamentoTesourasTercas = calcularEspacamento;
