// Módulo Financeiro com Gráficos
// Este módulo permite gerenciar finanças da serralheria com visualizações gráficas

// Importar bibliotecas necessárias (Chart.js)
document.addEventListener('DOMContentLoaded', function() {
    // Carregar Chart.js dinamicamente
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    chartScript.integrity = 'sha256-+8RZJLOWWrKgmQT4HlCjmYmcjdKG0UFMGfUmuvxhJM=';
    chartScript.crossOrigin = 'anonymous';
    document.head.appendChild(chartScript);
    
    // Carregar extensão de datalabels para Chart.js
    const datalabelsScript = document.createElement('script');
    datalabelsScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js';
    document.head.appendChild(datalabelsScript);
    
    // Inicializar o módulo quando o Chart.js estiver carregado
    chartScript.onload = function() {
        datalabelsScript.onload = function() {
            initFinanceModule();
        };
    };
});

// Variáveis globais
let financeData = {
    receitas: [],
    despesas: [],
    projetos: [],
    clientes: [],
    materiais: []
};

let charts = {};
let currentPeriod = 'mensal';
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Função principal de inicialização
function initFinanceModule() {
    // Carregar dados financeiros do localStorage ou do servidor
    loadFinanceData();
    
    // Configurar listeners de eventos
    setupFinanceEventListeners();
    
    // Renderizar a interface inicial
    renderFinanceInterface();
    
    // Inicializar gráficos
    initializeCharts();
}

// Carregar dados financeiros
function loadFinanceData() {
    // Tentar carregar do localStorage primeiro (para demonstração)
    const storedFinanceData = localStorage.getItem('serralheria_finance_data');
    
    if (storedFinanceData) {
        financeData = JSON.parse(storedFinanceData);
    } else {
        // Carregar dados de demonstração se não houver dados salvos
        loadDemoFinanceData();
    }
}

// Carregar dados de demonstração
function loadDemoFinanceData() {
    // Gerar dados de demonstração para o ano atual
    const currentYear = new Date().getFullYear();
    
    // Receitas de demonstração
    for (let month = 0; month < 12; month++) {
        // Receitas de projetos
        const baseRevenue = 15000 + Math.random() * 10000;
        financeData.receitas.push({
            id: month + 1,
            data: new Date(currentYear, month, 15).toISOString(),
            valor: baseRevenue,
            categoria: 'Projetos',
            descricao: `Receita de projetos - ${getMonthName(month)}`,
            metodo_pagamento: 'Diversos',
            status: 'Recebido'
        });
        
        // Receitas de manutenção
        const maintenanceRevenue = 3000 + Math.random() * 2000;
        financeData.receitas.push({
            id: month + 100,
            data: new Date(currentYear, month, 20).toISOString(),
            valor: maintenanceRevenue,
            categoria: 'Manutenção',
            descricao: `Serviços de manutenção - ${getMonthName(month)}`,
            metodo_pagamento: 'Diversos',
            status: 'Recebido'
        });
        
        // Receitas de consultoria
        if (month % 2 === 0) {
            const consultingRevenue = 2000 + Math.random() * 1500;
            financeData.receitas.push({
                id: month + 200,
                data: new Date(currentYear, month, 25).toISOString(),
                valor: consultingRevenue,
                categoria: 'Consultoria',
                descricao: `Serviços de consultoria - ${getMonthName(month)}`,
                metodo_pagamento: 'Transferência',
                status: 'Recebido'
            });
        }
    }
    
    // Despesas de demonstração
    for (let month = 0; month < 12; month++) {
        // Despesas com materiais
        const materialsCost = 6000 + Math.random() * 3000;
        financeData.despesas.push({
            id: month + 1,
            data: new Date(currentYear, month, 5).toISOString(),
            valor: materialsCost,
            categoria: 'Materiais',
            descricao: `Compra de materiais - ${getMonthName(month)}`,
            fornecedor: 'Diversos',
            metodo_pagamento: 'Transferência',
            status: 'Pago'
        });
        
        // Despesas com mão de obra
        const laborCost = 5000 + Math.random() * 2000;
        financeData.despesas.push({
            id: month + 100,
            data: new Date(currentYear, month, 10).toISOString(),
            valor: laborCost,
            categoria: 'Mão de Obra',
            descricao: `Pagamento de funcionários - ${getMonthName(month)}`,
            fornecedor: 'Funcionários',
            metodo_pagamento: 'Transferência',
            status: 'Pago'
        });
        
        // Despesas com equipamentos (a cada 3 meses)
        if (month % 3 === 0) {
            const equipmentCost = 2000 + Math.random() * 3000;
            financeData.despesas.push({
                id: month + 200,
                data: new Date(currentYear, month, 15).toISOString(),
                valor: equipmentCost,
                categoria: 'Equipamentos',
                descricao: `Compra de equipamentos - ${getMonthName(month)}`,
                fornecedor: 'Diversos',
                metodo_pagamento: 'Cartão',
                status: 'Pago'
            });
        }
        
        // Despesas com aluguel
        const rentCost = 1500;
        financeData.despesas.push({
            id: month + 300,
            data: new Date(currentYear, month, 5).toISOString(),
            valor: rentCost,
            categoria: 'Aluguel',
            descricao: `Aluguel do galpão - ${getMonthName(month)}`,
            fornecedor: 'Imobiliária',
            metodo_pagamento: 'Transferência',
            status: 'Pago'
        });
        
        // Despesas com serviços (água, luz, internet)
        const utilitiesCost = 800 + Math.random() * 200;
        financeData.despesas.push({
            id: month + 400,
            data: new Date(currentYear, month, 10).toISOString(),
            valor: utilitiesCost,
            categoria: 'Serviços',
            descricao: `Água, luz e internet - ${getMonthName(month)}`,
            fornecedor: 'Diversos',
            metodo_pagamento: 'Débito Automático',
            status: 'Pago'
        });
        
        // Despesas com impostos (trimestrais)
        if (month % 3 === 2) {
            const taxCost = 3000 + Math.random() * 1000;
            financeData.despesas.push({
                id: month + 500,
                data: new Date(currentYear, month, 20).toISOString(),
                valor: taxCost,
                categoria: 'Impostos',
                descricao: `Pagamento de impostos - Trimestre ${Math.floor(month/3) + 1}`,
                fornecedor: 'Governo',
                metodo_pagamento: 'Transferência',
                status: 'Pago'
            });
        }
    }
    
    // Projetos de demonstração
    const projectStatus = ['Em Orçamento', 'Aprovado', 'Em Produção', 'Instalação', 'Concluído'];
    const projectTypes = ['Portão', 'Grade', 'Estrutura', 'Escada', 'Cobertura', 'Mezanino'];
    
    for (let i = 1; i <= 20; i++) {
        const startDate = new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const projectValue = 5000 + Math.random() * 20000;
        const materialCost = projectValue * 0.4;
        const laborCost = projectValue * 0.3;
        const profit = projectValue - materialCost - laborCost;
        
        financeData.projetos.push({
            id: i,
            cliente_id: Math.floor(Math.random() * 10) + 1,
            data_inicio: startDate.toISOString(),
            data_entrega: new Date(startDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            tipo: projectTypes[Math.floor(Math.random() * projectTypes.length)],
            descricao: `Projeto ${i} - ${projectTypes[Math.floor(Math.random() * projectTypes.length)]}`,
            valor_total: projectValue,
            custo_material: materialCost,
            custo_mao_obra: laborCost,
            lucro: profit,
            margem_lucro: (profit / projectValue) * 100,
            status: projectStatus[Math.floor(Math.random() * projectStatus.length)]
        });
    }
    
    // Clientes de demonstração
    const clientNames = [
        'João Silva', 'Maria Oliveira', 'Carlos Santos', 'Ana Pereira', 'Pedro Costa',
        'Construções Rápidas Ltda', 'Imobiliária Horizonte', 'Condomínio Solar', 'Mercado Central', 'Escola Nova Era'
    ];
    
    for (let i = 1; i <= 10; i++) {
        financeData.clientes.push({
            id: i,
            nome: clientNames[i-1],
            telefone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
            email: clientNames[i-1].toLowerCase().replace(' ', '.') + '@email.com',
            endereco: `Rua ${i}, ${Math.floor(Math.random() * 1000) + 1}`,
            tipo: i <= 5 ? 'Pessoa Física' : 'Pessoa Jurídica',
            projetos_realizados: Math.floor(Math.random() * 5) + 1,
            valor_total: Math.floor(Math.random() * 50000) + 10000,
            ultima_compra: new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
        });
    }
    
    // Salvar no localStorage
    saveFinanceData();
}

// Salvar dados financeiros
function saveFinanceData() {
    localStorage.setItem('serralheria_finance_data', JSON.stringify(financeData));
    
    // Aqui também poderia enviar para o servidor via API
    // sendFinanceDataToServer(financeData);
}

// Configurar listeners de eventos
function setupFinanceEventListeners() {
    document.addEventListener('click', function(e) {
        // Alternar período de visualização
        if (e.target && e.target.classList.contains('period-selector')) {
            const period = e.target.getAttribute('data-period');
            if (period) {
                currentPeriod = period;
                updateCharts();
                highlightSelectedPeriod();
            }
        }
        
        // Navegação entre períodos
        if (e.target && e.target.id === 'prev-period') {
            navigatePeriod('prev');
        }
        if (e.target && e.target.id === 'next-period') {
            navigatePeriod('next');
        }
        
        // Botões para adicionar receitas/despesas
        if (e.target && e.target.id === 'btn-add-receita') {
            showAddRevenueForm();
        }
        if (e.target && e.target.id === 'btn-add-despesa') {
            showAddExpenseForm();
        }
        
        // Botões para salvar formulários
        if (e.target && e.target.id === 'btn-save-receita') {
            saveRevenueForm();
        }
        if (e.target && e.target.id === 'btn-save-despesa') {
            saveExpenseForm();
        }
        
        // Botões para cancelar formulários
        if (e.target && e.target.id === 'btn-cancel-receita') {
            hideAddRevenueForm();
        }
        if (e.target && e.target.id === 'btn-cancel-despesa') {
            hideAddExpenseForm();
        }
        
        // Botões para exportar relatórios
        if (e.target && e.target.id === 'btn-export-pdf') {
            exportFinanceReport('pdf');
        }
        if (e.target && e.target.id === 'btn-export-excel') {
            exportFinanceReport('excel');
        }
    });
}

// Renderizar a interface financeira
function renderFinanceInterface() {
    const financeContainer = document.getElementById('finance-module-container');
    if (!financeContainer) return;
    
    let html = `
        <div class="finance-dashboard">
            <div class="row mb-4">
                <div class="col-md-8">
                    <h4 class="mb-3"><i class="bi bi-graph-up"></i> Dashboard Financeiro</h4>
                </div>
                <div class="col-md-4 text-end">
                    <div class="btn-group">
                        <button id="btn-export-pdf" class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-file-pdf"></i> PDF
                        </button>
                        <button id="btn-export-excel" class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-file-excel"></i> Excel
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="period-navigation">
                                    <button id="prev-period" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>
                                    <span id="current-period-label" class="mx-2 fw-bold">${getCurrentPeriodLabel()}</span>
                                    <button id="next-period" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                                <div class="period-selector-container">
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-sm btn-outline-primary period-selector ${currentPeriod === 'mensal' ? 'active' : ''}" data-period="mensal">Mensal</button>
                                        <button class="btn btn-sm btn-outline-primary period-selector ${currentPeriod === 'trimestral' ? 'active' : ''}" data-period="trimestral">Trimestral</button>
                                        <button class="btn btn-sm btn-outline-primary period-selector ${currentPeriod === 'anual' ? 'active' : ''}" data-period="anual">Anual</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <div class="card bg-light">
                                        <div class="card-body py-3">
                                            <div class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="card-title mb-0 text-muted">Receita Total</h6>
                                                    <h4 class="mt-2 mb-0 text-success" id="total-revenue">R$ ${formatCurrency(calculateTotalRevenue())}</h4>
                                                </div>
                                                <div class="icon-box bg-success-light rounded p-2">
                                                    <i class="bi bi-graph-up-arrow text-success fs-4"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <div class="card bg-light">
                                        <div class="card-body py-3">
                                            <div class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="card-title mb-0 text-muted">Despesa Total</h6>
                                                    <h4 class="mt-2 mb-0 text-danger" id="total-expense">R$ ${formatCurrency(calculateTotalExpense())}</h4>
                                                </div>
                                                <div class="icon-box bg-danger-light rounded p-2">
                                                    <i class="bi bi-graph-down-arrow text-danger fs-4"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <div class="card bg-light">
                                        <div class="card-body py-3">
                                            <div class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="card-title mb-0 text-muted">Lucro Líquido</h6>
                                                    <h4 class="mt-2 mb-0 ${calculateNetProfit() >= 0 ? 'text-success' : 'text-danger'}" id="net-profit">R$ ${formatCurrency(calculateNetProfit())}</h4>
                                                </div>
                                                <div class="icon-box ${calculateNetProfit() >= 0 ? 'bg-success-light' : 'bg-danger-light'} rounded p-2">
                                                    <i class="bi bi-cash-stack ${calculateNetProfit() >= 0 ? 'text-success' : 'text-danger'} fs-4"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <div class="card bg-light">
                                        <div class="card-body py-3">
                                            <div class="d-flex justify-content-between">
                                                <div>
                                                    <h6 class="card-title mb-0 text-muted">Margem de Lucro</h6>
                                                    <h4 class="mt-2 mb-0 ${calculateProfitMargin() >= 20 ? 'text-success' : calculateProfitMargin() >= 0 ? 'text-warning' : 'text-danger'}" id="profit-margin">${calculateProfitMargin().toFixed(1)}%</h4>
                                                </div>
                                                <div class="icon-box ${calculateProfitMargin() >= 20 ? 'bg-success-light' : calculateProfitMargin() >= 0 ? 'bg-warning-light' : 'bg-danger-light'} rounded p-2">
                                                    <i class="bi bi-percent ${calculateProfitMargin() >= 20 ? 'text-success' : calculateProfitMargin() >= 0 ? 'text-warning' : 'text-danger'} fs-4"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Receitas vs Despesas</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="revenue-expense-chart" height="300"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Distribuição de Despesas</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="expense-distribution-chart" height="300"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Receitas por Categoria</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="revenue-by-category-chart" height="250"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Lucratividade de Projetos</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="project-profitability-chart" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Receitas</h5>
                            <button id="btn-add-receita" class="btn btn-sm btn-success">
                                <i class="bi bi-plus-circle"></i> Nova Receita
                            </button>
                        </div>
                        <div class="card-body">
                            <div id="add-revenue-form-container" style="display: none;" class="mb-3">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Adicionar Nova Receita</h6>
                                    </div>
                                    <div class="card-body">
                                        <form id="revenue-form">
                                            <input type="hidden" id="revenue-id">
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="revenue-date" class="form-label">Data</label>
                                                    <input type="date" class="form-control" id="revenue-date" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="revenue-amount" class="form-label">Valor (R$)</label>
                                                    <input type="number" step="0.01" class="form-control" id="revenue-amount" required>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="revenue-category" class="form-label">Categoria</label>
                                                    <select class="form-select" id="revenue-category" required>
                                                        <option value="Projetos">Projetos</option>
                                                        <option value="Manutenção">Manutenção</option>
                                                        <option value="Consultoria">Consultoria</option>
                                                        <option value="Vendas">Vendas</option>
                                                        <option value="Outros">Outros</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="revenue-payment-method" class="form-label">Método de Pagamento</label>
                                                    <select class="form-select" id="revenue-payment-method" required>
                                                        <option value="Dinheiro">Dinheiro</option>
                                                        <option value="Cartão">Cartão</option>
                                                        <option value="Transferência">Transferência</option>
                                                        <option value="Boleto">Boleto</option>
                                                        <option value="Pix">Pix</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="revenue-description" class="form-label">Descrição</label>
                                                <textarea class="form-control" id="revenue-description" rows="2" required></textarea>
                                            </div>
                                            <div class="d-flex justify-content-end">
                                                <button type="button" id="btn-cancel-receita" class="btn btn-outline-secondary me-2">Cancelar</button>
                                                <button type="button" id="btn-save-receita" class="btn btn-success">Salvar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Descrição</th>
                                            <th>Categoria</th>
                                            <th class="text-end">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody id="revenue-table-body">
                                        ${renderRevenueTableRows()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Despesas</h5>
                            <button id="btn-add-despesa" class="btn btn-sm btn-danger">
                                <i class="bi bi-plus-circle"></i> Nova Despesa
                            </button>
                        </div>
                        <div class="card-body">
                            <div id="add-expense-form-container" style="display: none;" class="mb-3">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Adicionar Nova Despesa</h6>
                                    </div>
                                    <div class="card-body">
                                        <form id="expense-form">
                                            <input type="hidden" id="expense-id">
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="expense-date" class="form-label">Data</label>
                                                    <input type="date" class="form-control" id="expense-date" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="expense-amount" class="form-label">Valor (R$)</label>
                                                    <input type="number" step="0.01" class="form-control" id="expense-amount" required>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="expense-category" class="form-label">Categoria</label>
                                                    <select class="form-select" id="expense-category" required>
                                                        <option value="Materiais">Materiais</option>
                                                        <option value="Mão de Obra">Mão de Obra</option>
                                                        <option value="Equipamentos">Equipamentos</option>
                                                        <option value="Aluguel">Aluguel</option>
                                                        <option value="Serviços">Serviços</option>
                                                        <option value="Impostos">Impostos</option>
                                                        <option value="Outros">Outros</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="expense-payment-method" class="form-label">Método de Pagamento</label>
                                                    <select class="form-select" id="expense-payment-method" required>
                                                        <option value="Dinheiro">Dinheiro</option>
                                                        <option value="Cartão">Cartão</option>
                                                        <option value="Transferência">Transferência</option>
                                                        <option value="Boleto">Boleto</option>
                                                        <option value="Pix">Pix</option>
                                                        <option value="Débito Automático">Débito Automático</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="expense-supplier" class="form-label">Fornecedor</label>
                                                    <input type="text" class="form-control" id="expense-supplier" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="expense-description" class="form-label">Descrição</label>
                                                    <textarea class="form-control" id="expense-description" rows="1" required></textarea>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-end">
                                                <button type="button" id="btn-cancel-despesa" class="btn btn-outline-secondary me-2">Cancelar</button>
                                                <button type="button" id="btn-save-despesa" class="btn btn-danger">Salvar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Descrição</th>
                                            <th>Categoria</th>
                                            <th class="text-end">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody id="expense-table-body">
                                        ${renderExpenseTableRows()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    financeContainer.innerHTML = html;
}

// Inicializar gráficos
function initializeCharts() {
    // Configurar cores para gráficos
    const chartColors = {
        revenue: 'rgba(40, 167, 69, 0.7)',
        expense: 'rgba(220, 53, 69, 0.7)',
        profit: 'rgba(23, 162, 184, 0.7)',
        categories: [
            'rgba(40, 167, 69, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(23, 162, 184, 0.7)',
            'rgba(111, 66, 193, 0.7)',
            'rgba(253, 126, 20, 0.7)',
            'rgba(32, 201, 151, 0.7)',
            'rgba(220, 53, 69, 0.7)'
        ]
    };
    
    // Registrar plugin de datalabels globalmente
    Chart.register(ChartDataLabels);
    
    // Configurações globais para Chart.js
    Chart.defaults.font.family = "'Poppins', 'Helvetica', 'Arial', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 4;
    Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold' };
    
    // Gráfico de Receitas vs Despesas
    const revenueExpenseCtx = document.getElementById('revenue-expense-chart');
    if (revenueExpenseCtx) {
        const { labels, revenueData, expenseData, profitData } = getRevenueExpenseChartData();
        
        charts.revenueExpense = new Chart(revenueExpenseCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Receitas',
                        data: revenueData,
                        backgroundColor: chartColors.revenue,
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Despesas',
                        data: expenseData,
                        backgroundColor: chartColors.expense,
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Lucro',
                        data: profitData,
                        type: 'line',
                        backgroundColor: 'transparent',
                        borderColor: chartColors.profit,
                        borderWidth: 2,
                        pointBackgroundColor: chartColors.profit,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += 'R$ ' + formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    },
                    datalabels: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Distribuição de Despesas
    const expenseDistributionCtx = document.getElementById('expense-distribution-chart');
    if (expenseDistributionCtx) {
        const { labels, data } = getExpenseDistributionChartData();
        
        charts.expenseDistribution = new Chart(expenseDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: chartColors.categories,
                    borderColor: 'white',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: R$ ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function(value, context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return percentage >= 5 ? `${percentage}%` : '';
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    // Gráfico de Receitas por Categoria
    const revenueByCategoryCtx = document.getElementById('revenue-by-category-chart');
    if (revenueByCategoryCtx) {
        const { labels, data } = getRevenueByCategoryChartData();
        
        charts.revenueByCategory = new Chart(revenueByCategoryCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Receita',
                    data: data,
                    backgroundColor: chartColors.categories,
                    borderColor: chartColors.categories.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    label += 'R$ ' + formatCurrency(context.parsed.x);
                                }
                                return label;
                            }
                        }
                    },
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                        formatter: function(value) {
                            return 'R$ ' + formatCurrency(value);
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + formatCurrency(value);
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Lucratividade de Projetos
    const projectProfitabilityCtx = document.getElementById('project-profitability-chart');
    if (projectProfitabilityCtx) {
        const { labels, data } = getProjectProfitabilityChartData();
        
        charts.projectProfitability = new Chart(projectProfitabilityCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Margem de Lucro (%)',
                    data: data,
                    backgroundColor: data.map(value => 
                        value >= 30 ? 'rgba(40, 167, 69, 0.7)' : 
                        value >= 20 ? 'rgba(32, 201, 151, 0.7)' : 
                        value >= 10 ? 'rgba(255, 193, 7, 0.7)' : 
                        'rgba(220, 53, 69, 0.7)'
                    ),
                    borderColor: data.map(value => 
                        value >= 30 ? 'rgba(40, 167, 69, 1)' : 
                        value >= 20 ? 'rgba(32, 201, 151, 1)' : 
                        value >= 10 ? 'rgba(255, 193, 7, 1)' : 
                        'rgba(220, 53, 69, 1)'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Margem de Lucro: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    },
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                        formatter: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Obter dados para o gráfico de Receitas vs Despesas
function getRevenueExpenseChartData() {
    let labels = [];
    let revenueData = [];
    let expenseData = [];
    let profitData = [];
    
    if (currentPeriod === 'mensal') {
        // Dados diários para o mês atual
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            labels.push(day);
            
            const dayRevenue = financeData.receitas
                .filter(item => {
                    const itemDate = new Date(item.data);
                    return itemDate.getFullYear() === currentYear && 
                           itemDate.getMonth() === currentMonth && 
                           itemDate.getDate() === day;
                })
                .reduce((sum, item) => sum + item.valor, 0);
            
            const dayExpense = financeData.despesas
                .filter(item => {
                    const itemDate = new Date(item.data);
                    return itemDate.getFullYear() === currentYear && 
                           itemDate.getMonth() === currentMonth && 
                           itemDate.getDate() === day;
                })
                .reduce((sum, item) => sum + item.valor, 0);
            
            revenueData.push(dayRevenue);
            expenseData.push(dayExpense);
            profitData.push(dayRevenue - dayExpense);
        }
    } else if (currentPeriod === 'trimestral') {
        // Dados mensais para o trimestre atual
        const startMonth = Math.floor(currentMonth / 3) * 3;
        
        for (let month = startMonth; month < startMonth + 3; month++) {
            const date = new Date(currentYear, month, 1);
            labels.push(getMonthName(month).substring(0, 3));
            
            const monthRevenue = financeData.receitas
                .filter(item => {
                    const itemDate = new Date(item.data);
                    return itemDate.getFullYear() === currentYear && 
                           itemDate.getMonth() === month;
                })
                .reduce((sum, item) => sum + item.valor, 0);
            
            const monthExpense = financeData.despesas
                .filter(item => {
                    const itemDate = new Date(item.data);
                    return itemDate.getFullYear() === currentYear && 
                           itemDate.getMonth() === month;
                })
                .reduce((sum, item) => sum + item.valor, 0);
            
            revenueData.push(monthRevenue);
            expenseData.push(monthExpense);
            profitData.push(monthRevenue - monthExpense);
        }
    } else if (currentPeriod === 'anual') {
        // Dados mensais para o ano atual
        for (let month = 0; month < 12; month++) {
            labels.push(getMonthName(month).substring(0, 3));
            
            const monthRevenue = financeData.receitas
                .filter(item => {
                    const itemDate = new Date(item.data);
                    return itemDate.getFullYear() === currentYear && 
                           itemDate.getMonth() === month;
                })
                .reduce((sum, item) => sum + item.valor, 0);
            
            const monthExpense = financeData.despesas
                .filter(item => {
                    const itemDate = new Date(item.data);
                    return itemDate.getFullYear() === currentYear && 
                           itemDate.getMonth() === month;
                })
                .reduce((sum, item) => sum + item.valor, 0);
            
            revenueData.push(monthRevenue);
            expenseData.push(monthExpense);
            profitData.push(monthRevenue - monthExpense);
        }
    }
    
    return { labels, revenueData, expenseData, profitData };
}

// Obter dados para o gráfico de Distribuição de Despesas
function getExpenseDistributionChartData() {
    // Agrupar despesas por categoria
    const expensesByCategory = {};
    
    // Filtrar despesas pelo período atual
    const filteredExpenses = filterFinanceDataByPeriod(financeData.despesas);
    
    // Agrupar por categoria
    filteredExpenses.forEach(expense => {
        if (!expensesByCategory[expense.categoria]) {
            expensesByCategory[expense.categoria] = 0;
        }
        expensesByCategory[expense.categoria] += expense.valor;
    });
    
    // Converter para arrays para o gráfico
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    
    return { labels, data };
}

// Obter dados para o gráfico de Receitas por Categoria
function getRevenueByCategoryChartData() {
    // Agrupar receitas por categoria
    const revenuesByCategory = {};
    
    // Filtrar receitas pelo período atual
    const filteredRevenues = filterFinanceDataByPeriod(financeData.receitas);
    
    // Agrupar por categoria
    filteredRevenues.forEach(revenue => {
        if (!revenuesByCategory[revenue.categoria]) {
            revenuesByCategory[revenue.categoria] = 0;
        }
        revenuesByCategory[revenue.categoria] += revenue.valor;
    });
    
    // Converter para arrays para o gráfico
    const labels = Object.keys(revenuesByCategory);
    const data = Object.values(revenuesByCategory);
    
    return { labels, data };
}

// Obter dados para o gráfico de Lucratividade de Projetos
function getProjectProfitabilityChartData() {
    // Filtrar projetos concluídos
    const completedProjects = financeData.projetos
        .filter(project => project.status === 'Concluído')
        .sort((a, b) => b.margem_lucro - a.margem_lucro)
        .slice(0, 5); // Top 5 projetos mais lucrativos
    
    const labels = completedProjects.map(project => project.descricao.substring(0, 15) + (project.descricao.length > 15 ? '...' : ''));
    const data = completedProjects.map(project => project.margem_lucro);
    
    return { labels, data };
}

// Filtrar dados financeiros pelo período atual
function filterFinanceDataByPeriod(data) {
    return data.filter(item => {
        const itemDate = new Date(item.data);
        
        if (currentPeriod === 'mensal') {
            return itemDate.getFullYear() === currentYear && 
                   itemDate.getMonth() === currentMonth;
        } else if (currentPeriod === 'trimestral') {
            const startMonth = Math.floor(currentMonth / 3) * 3;
            const endMonth = startMonth + 2;
            
            return itemDate.getFullYear() === currentYear && 
                   itemDate.getMonth() >= startMonth && 
                   itemDate.getMonth() <= endMonth;
        } else if (currentPeriod === 'anual') {
            return itemDate.getFullYear() === currentYear;
        }
        
        return false;
    });
}

// Atualizar gráficos
function updateCharts() {
    // Atualizar gráfico de Receitas vs Despesas
    if (charts.revenueExpense) {
        const { labels, revenueData, expenseData, profitData } = getRevenueExpenseChartData();
        
        charts.revenueExpense.data.labels = labels;
        charts.revenueExpense.data.datasets[0].data = revenueData;
        charts.revenueExpense.data.datasets[1].data = expenseData;
        charts.revenueExpense.data.datasets[2].data = profitData;
        charts.revenueExpense.update();
    }
    
    // Atualizar gráfico de Distribuição de Despesas
    if (charts.expenseDistribution) {
        const { labels, data } = getExpenseDistributionChartData();
        
        charts.expenseDistribution.data.labels = labels;
        charts.expenseDistribution.data.datasets[0].data = data;
        charts.expenseDistribution.update();
    }
    
    // Atualizar gráfico de Receitas por Categoria
    if (charts.revenueByCategory) {
        const { labels, data } = getRevenueByCategoryChartData();
        
        charts.revenueByCategory.data.labels = labels;
        charts.revenueByCategory.data.datasets[0].data = data;
        charts.revenueByCategory.update();
    }
    
    // Atualizar totais
    document.getElementById('total-revenue').textContent = `R$ ${formatCurrency(calculateTotalRevenue())}`;
    document.getElementById('total-expense').textContent = `R$ ${formatCurrency(calculateTotalExpense())}`;
    document.getElementById('net-profit').textContent = `R$ ${formatCurrency(calculateNetProfit())}`;
    document.getElementById('profit-margin').textContent = `${calculateProfitMargin().toFixed(1)}%`;
    
    // Atualizar tabelas
    document.getElementById('revenue-table-body').innerHTML = renderRevenueTableRows();
    document.getElementById('expense-table-body').innerHTML = renderExpenseTableRows();
    
    // Atualizar label do período atual
    document.getElementById('current-period-label').textContent = getCurrentPeriodLabel();
}

// Destacar período selecionado
function highlightSelectedPeriod() {
    const periodButtons = document.querySelectorAll('.period-selector');
    periodButtons.forEach(button => {
        if (button.getAttribute('data-period') === currentPeriod) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Navegar entre períodos
function navigatePeriod(direction) {
    if (currentPeriod === 'mensal') {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                currentYear--;
                currentMonth = 11;
            } else {
                currentMonth--;
            }
        } else {
            if (currentMonth === 11) {
                currentYear++;
                currentMonth = 0;
            } else {
                currentMonth++;
            }
        }
    } else if (currentPeriod === 'trimestral') {
        const currentQuarter = Math.floor(currentMonth / 3);
        
        if (direction === 'prev') {
            if (currentQuarter === 0) {
                currentYear--;
                currentMonth = 9; // Q4 do ano anterior
            } else {
                currentMonth = (currentQuarter - 1) * 3;
            }
        } else {
            if (currentQuarter === 3) {
                currentYear++;
                currentMonth = 0; // Q1 do próximo ano
            } else {
                currentMonth = (currentQuarter + 1) * 3;
            }
        }
    } else if (currentPeriod === 'anual') {
        if (direction === 'prev') {
            currentYear--;
        } else {
            currentYear++;
        }
    }
    
    updateCharts();
}

// Obter label do período atual
function getCurrentPeriodLabel() {
    if (currentPeriod === 'mensal') {
        return `${getMonthName(currentMonth)} ${currentYear}`;
    } else if (currentPeriod === 'trimestral') {
        const quarter = Math.floor(currentMonth / 3) + 1;
        return `${quarter}º Trimestre ${currentYear}`;
    } else if (currentPeriod === 'anual') {
        return `Ano ${currentYear}`;
    }
    
    return '';
}

// Calcular receita total do período atual
function calculateTotalRevenue() {
    const filteredRevenues = filterFinanceDataByPeriod(financeData.receitas);
    return filteredRevenues.reduce((sum, item) => sum + item.valor, 0);
}

// Calcular despesa total do período atual
function calculateTotalExpense() {
    const filteredExpenses = filterFinanceDataByPeriod(financeData.despesas);
    return filteredExpenses.reduce((sum, item) => sum + item.valor, 0);
}

// Calcular lucro líquido do período atual
function calculateNetProfit() {
    return calculateTotalRevenue() - calculateTotalExpense();
}

// Calcular margem de lucro do período atual
function calculateProfitMargin() {
    const totalRevenue = calculateTotalRevenue();
    if (totalRevenue === 0) return 0;
    
    return (calculateNetProfit() / totalRevenue) * 100;
}

// Renderizar linhas da tabela de receitas
function renderRevenueTableRows() {
    const filteredRevenues = filterFinanceDataByPeriod(financeData.receitas)
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5); // Mostrar apenas as 5 receitas mais recentes
    
    if (filteredRevenues.length === 0) {
        return `<tr><td colspan="4" class="text-center">Nenhuma receita registrada neste período</td></tr>`;
    }
    
    return filteredRevenues.map(revenue => `
        <tr>
            <td>${formatDate(revenue.data)}</td>
            <td>${revenue.descricao}</td>
            <td><span class="badge bg-success-light text-success">${revenue.categoria}</span></td>
            <td class="text-end">R$ ${formatCurrency(revenue.valor)}</td>
        </tr>
    `).join('');
}

// Renderizar linhas da tabela de despesas
function renderExpenseTableRows() {
    const filteredExpenses = filterFinanceDataByPeriod(financeData.despesas)
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5); // Mostrar apenas as 5 despesas mais recentes
    
    if (filteredExpenses.length === 0) {
        return `<tr><td colspan="4" class="text-center">Nenhuma despesa registrada neste período</td></tr>`;
    }
    
    return filteredExpenses.map(expense => `
        <tr>
            <td>${formatDate(expense.data)}</td>
            <td>${expense.descricao}</td>
            <td><span class="badge bg-danger-light text-danger">${expense.categoria}</span></td>
            <td class="text-end">R$ ${formatCurrency(expense.valor)}</td>
        </tr>
    `).join('');
}

// Mostrar formulário para adicionar receita
function showAddRevenueForm() {
    // Limpar formulário
    document.getElementById('revenue-id').value = '';
    document.getElementById('revenue-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('revenue-amount').value = '';
    document.getElementById('revenue-category').value = 'Projetos';
    document.getElementById('revenue-payment-method').value = 'Transferência';
    document.getElementById('revenue-description').value = '';
    
    // Mostrar formulário
    document.getElementById('add-revenue-form-container').style.display = 'block';
}

// Ocultar formulário de receita
function hideAddRevenueForm() {
    document.getElementById('add-revenue-form-container').style.display = 'none';
}

// Salvar receita do formulário
function saveRevenueForm() {
    // Obter valores do formulário
    const revenueId = document.getElementById('revenue-id').value;
    const date = document.getElementById('revenue-date').value;
    const amount = parseFloat(document.getElementById('revenue-amount').value);
    const category = document.getElementById('revenue-category').value;
    const paymentMethod = document.getElementById('revenue-payment-method').value;
    const description = document.getElementById('revenue-description').value;
    
    // Validar campos obrigatórios
    if (!date || !amount || !category || !paymentMethod || !description) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (revenueId) {
        // Atualizar receita existente
        const index = financeData.receitas.findIndex(r => r.id === parseInt(revenueId));
        if (index !== -1) {
            financeData.receitas[index] = {
                ...financeData.receitas[index],
                data: new Date(date).toISOString(),
                valor: amount,
                categoria: category,
                metodo_pagamento: paymentMethod,
                descricao: description
            };
        }
    } else {
        // Adicionar nova receita
        const newId = financeData.receitas.length > 0 ? Math.max(...financeData.receitas.map(r => r.id)) + 1 : 1;
        financeData.receitas.push({
            id: newId,
            data: new Date(date).toISOString(),
            valor: amount,
            categoria: category,
            descricao: description,
            metodo_pagamento: paymentMethod,
            status: 'Recebido'
        });
    }
    
    // Salvar alterações
    saveFinanceData();
    
    // Atualizar interface
    updateCharts();
    
    // Ocultar formulário
    hideAddRevenueForm();
}

// Mostrar formulário para adicionar despesa
function showAddExpenseForm() {
    // Limpar formulário
    document.getElementById('expense-id').value = '';
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = 'Materiais';
    document.getElementById('expense-payment-method').value = 'Transferência';
    document.getElementById('expense-supplier').value = '';
    document.getElementById('expense-description').value = '';
    
    // Mostrar formulário
    document.getElementById('add-expense-form-container').style.display = 'block';
}

// Ocultar formulário de despesa
function hideAddExpenseForm() {
    document.getElementById('add-expense-form-container').style.display = 'none';
}

// Salvar despesa do formulário
function saveExpenseForm() {
    // Obter valores do formulário
    const expenseId = document.getElementById('expense-id').value;
    const date = document.getElementById('expense-date').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const paymentMethod = document.getElementById('expense-payment-method').value;
    const supplier = document.getElementById('expense-supplier').value;
    const description = document.getElementById('expense-description').value;
    
    // Validar campos obrigatórios
    if (!date || !amount || !category || !paymentMethod || !supplier || !description) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (expenseId) {
        // Atualizar despesa existente
        const index = financeData.despesas.findIndex(e => e.id === parseInt(expenseId));
        if (index !== -1) {
            financeData.despesas[index] = {
                ...financeData.despesas[index],
                data: new Date(date).toISOString(),
                valor: amount,
                categoria: category,
                metodo_pagamento: paymentMethod,
                fornecedor: supplier,
                descricao: description
            };
        }
    } else {
        // Adicionar nova despesa
        const newId = financeData.despesas.length > 0 ? Math.max(...financeData.despesas.map(e => e.id)) + 1 : 1;
        financeData.despesas.push({
            id: newId,
            data: new Date(date).toISOString(),
            valor: amount,
            categoria: category,
            descricao: description,
            fornecedor: supplier,
            metodo_pagamento: paymentMethod,
            status: 'Pago'
        });
    }
    
    // Salvar alterações
    saveFinanceData();
    
    // Atualizar interface
    updateCharts();
    
    // Ocultar formulário
    hideAddExpenseForm();
}

// Exportar relatório financeiro
function exportFinanceReport(format) {
    alert(`Exportação de relatório em formato ${format.toUpperCase()} será implementada em breve.`);
}

// Funções auxiliares
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getMonthName(month) {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[month];
}

// Exportar funções para uso em outros módulos
window.financeModule = {
    init: initFinanceModule,
    updateCharts: updateCharts,
    saveFinanceData: saveFinanceData,
    exportReport: exportFinanceReport
};
