// Arquivo JavaScript para integrar a interface web com o backend
// Este arquivo faz a ponte entre o frontend e os componentes de IA

document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const projectForm = document.getElementById('projectForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const resultSection = document.getElementById('resultSection');
    const generateQuoteBtn = document.getElementById('generateQuoteBtn');
    const saveProjectBtn = document.getElementById('saveProjectBtn');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');

    // Inicializar eventos
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeProject();
    });

    newAnalysisBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        projectForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    generateQuoteBtn.addEventListener('click', function() {
        const projectId = this.dataset.projectId;
        if (projectId) {
            generatePdf(projectId);
        } else {
            saveProjectAndGeneratePdf();
        }
    });

    saveProjectBtn.addEventListener('click', function() {
        saveProject();
    });

    // Toggle para opções avançadas
    document.getElementById('toggleAdvancedOptions').addEventListener('click', function() {
        const advancedOptions = document.querySelector('.advanced-options');
        if (advancedOptions.style.display === 'block') {
            advancedOptions.style.display = 'none';
            this.innerHTML = '<i class="bi bi-gear"></i> Opções Avançadas';
        } else {
            advancedOptions.style.display = 'block';
            this.innerHTML = '<i class="bi bi-gear-fill"></i> Ocultar Opções Avançadas';
        }
    });

    // Cálculo automático de área quando comprimento e largura são informados
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const areaInput = document.getElementById('area');

    function updateArea() {
        const length = parseFloat(lengthInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        
        if (length > 0 && width > 0) {
            areaInput.value = (length * width).toFixed(2);
        }
    }

    lengthInput.addEventListener('input', updateArea);
    widthInput.addEventListener('input', updateArea);
});

// Função principal para analisar o projeto
function analyzeProject() {
    // Mostrar overlay de carregamento
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Obter dados do formulário
    const projectData = {
        nome: document.getElementById('projectName').value,
        cliente: document.getElementById('clientName').value,
        altura_maxima: parseFloat(document.getElementById('maxHeight').value),
        complexidade: document.getElementById('complexity').value,
        ambiente: document.getElementById('environment').value,
        comprimento: parseFloat(document.getElementById('length').value) || 0,
        largura: parseFloat(document.getElementById('width').value) || 0,
        area: parseFloat(document.getElementById('area').value) || 0,
        margem_lucro: parseFloat(document.getElementById('profitMargin').value) || 30,
        custo_mao_obra_percentual: parseFloat(document.getElementById('laborCostPercentage').value) || 40,
        aliquota_imposto: parseFloat(document.getElementById('taxRate').value) || 6
    };

    // Enviar dados para o backend via API
    fetch('/api/analisar-projeto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na análise do projeto');
        }
        return response.json();
    })
    .then(data => {
        // Exibir resultados
        displayResults(data);
        
        // Ocultar overlay de carregamento
        document.getElementById('loadingOverlay').style.display = 'none';
        
        // Mostrar seção de resultados
        document.getElementById('resultSection').style.display = 'block';
        
        // Rolar até os resultados
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
        
        // Armazenar dados para uso posterior
        window.currentAnalysisResult = data;
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao analisar o projeto. Por favor, tente novamente.');
        document.getElementById('loadingOverlay').style.display = 'none';
    });
}

// Função para exibir os resultados na interface
function displayResults(result) {
    // Exibir informações do projeto
    document.getElementById('resultProjectName').textContent = result.projeto.nome;
    document.getElementById('resultClientName').textContent = result.projeto.cliente || 'Não informado';
    
    let dimensionsText = '';
    if (result.projeto.comprimento > 0 && result.projeto.largura > 0) {
        dimensionsText = `${result.projeto.comprimento}m × ${result.projeto.largura}m (${result.projeto.area.toFixed(2)}m²)`;
    } else {
        dimensionsText = `${result.projeto.area.toFixed(2)}m²`;
    }
    document.getElementById('resultDimensions').textContent = dimensionsText;
    
    document.getElementById('resultComplexity').textContent = capitalizeFirstLetter(result.projeto.complexidade);
    
    let ambienteText = '';
    if (result.projeto.ambiente === 'controlado') {
        ambienteText = 'Controlado (Oficina)';
    } else if (result.projeto.ambiente === 'externo') {
        ambienteText = 'Externo';
    } else {
        ambienteText = 'Externo com Condições Adversas';
    }
    document.getElementById('resultEnvironment').textContent = ambienteText;
    
    // Exibir informações de risco
    const riskBadgeContainer = document.getElementById('riskBadgeContainer');
    riskBadgeContainer.innerHTML = '';
    
    const riskBadge = document.createElement('span');
    riskBadge.className = `risk-badge risk-${result.projeto.nivel_risco}`;
    
    let riskText = '';
    if (result.projeto.nivel_risco === 'baixo') {
        riskText = 'RISCO BAIXO';
    } else if (result.projeto.nivel_risco === 'medio') {
        riskText = 'RISCO MÉDIO';
    } else if (result.projeto.nivel_risco === 'alto') {
        riskText = 'RISCO ALTO';
    } else {
        riskText = 'RISCO MUITO ALTO';
    }
    
    riskBadge.textContent = riskText;
    riskBadgeContainer.appendChild(riskBadge);
    
    document.getElementById('resultRiskFactor').textContent = `${result.projeto.fator_multiplicador.toFixed(2)}x`;
    document.getElementById('resultRiskJustification').textContent = result.projeto.justificativa;
    
    // Exibir materiais
    const materialsTableBody = document.getElementById('materialsTableBody');
    materialsTableBody.innerHTML = '';
    
    result.materiais_estimados.forEach(material => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = material.nome;
        row.appendChild(nameCell);
        
        const quantityCell = document.createElement('td');
        quantityCell.textContent = material.quantidade;
        row.appendChild(quantityCell);
        
        const unitCell = document.createElement('td');
        unitCell.textContent = material.unidade;
        row.appendChild(unitCell);
        
        const unitPriceCell = document.createElement('td');
        unitPriceCell.textContent = formatCurrency(material.valor_unitario);
        row.appendChild(unitPriceCell);
        
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = formatCurrency(material.valor_total);
        row.appendChild(totalPriceCell);
        
        materialsTableBody.appendChild(row);
    });
    
    // Exibir custos
    document.getElementById('resultMaterialsCost').textContent = formatCurrency(result.valor_materiais);
    document.getElementById('resultLaborCost').textContent = formatCurrency(result.valor_mao_obra);
    document.getElementById('resultSubtotal').textContent = formatCurrency(result.subtotal);
    document.getElementById('resultRiskAdjustment').textContent = formatCurrency(result.valor_com_risco - result.subtotal);
    document.getElementById('resultTaxes').textContent = formatCurrency(result.valor_impostos);
    document.getElementById('resultProfit').textContent = formatCurrency(result.valor_lucro);
    document.getElementById('resultTotalCost').textContent = formatCurrency(result.valor_total);
}

// Função para salvar o projeto
function saveProject() {
    if (!window.currentAnalysisResult) {
        alert('Nenhuma análise disponível para salvar.');
        return;
    }

    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Extrair dados do projeto da análise atual
    const projectData = {
        nome: window.currentAnalysisResult.projeto.nome,
        cliente: window.currentAnalysisResult.projeto.cliente,
        altura_maxima: window.currentAnalysisResult.projeto.altura_maxima,
        complexidade: window.currentAnalysisResult.projeto.complexidade,
        ambiente: window.currentAnalysisResult.projeto.ambiente,
        descricao: `Área: ${window.currentAnalysisResult.projeto.area}m², Comprimento: ${window.currentAnalysisResult.projeto.comprimento}m, Largura: ${window.currentAnalysisResult.projeto.largura}m`
    };

    // Enviar para a API
    fetch('/api/projetos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar o projeto');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('loadingOverlay').style.display = 'none';
        alert('Projeto salvo com sucesso!');
        
        // Armazenar ID do projeto para uso posterior
        document.getElementById('generateQuoteBtn').dataset.projectId = data.id;
        document.getElementById('saveProjectBtn').disabled = true;
        document.getElementById('saveProjectBtn').innerHTML = '<i class="bi bi-check-circle"></i> Projeto Salvo';
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao salvar o projeto. Por favor, tente novamente.');
        document.getElementById('loadingOverlay').style.display = 'none';
    });
}

// Função para salvar o projeto e gerar PDF
function saveProjectAndGeneratePdf() {
    if (!window.currentAnalysisResult) {
        alert('Nenhuma análise disponível para gerar orçamento.');
        return;
    }

    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Primeiro salvar o projeto
    const projectData = {
        nome: window.currentAnalysisResult.projeto.nome,
        cliente: window.currentAnalysisResult.projeto.cliente,
        altura_maxima: window.currentAnalysisResult.projeto.altura_maxima,
        complexidade: window.currentAnalysisResult.projeto.complexidade,
        ambiente: window.currentAnalysisResult.projeto.ambiente,
        descricao: `Área: ${window.currentAnalysisResult.projeto.area}m², Comprimento: ${window.currentAnalysisResult.projeto.comprimento}m, Largura: ${window.currentAnalysisResult.projeto.largura}m`
    };

    fetch('/api/projetos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar o projeto');
        }
        return response.json();
    })
    .then(data => {
        // Agora criar o orçamento
        const orcamentoData = {
            projeto_id: data.id,
            itens: window.currentAnalysisResult.materiais_estimados.map(material => ({
                material_id: material.material_id || 1, // Fallback para ID 1 se não existir
                quantidade: parseFloat(material.quantidade),
                valor_unitario: material.valor_unitario,
                valor_total: material.valor_total
            })),
            margem_lucro: window.currentAnalysisResult.margem_lucro
        };

        return fetch('/api/orcamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orcamentoData)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar o orçamento');
        }
        return response.json();
    })
    .then(data => {
        // Gerar PDF do orçamento
        generatePdf(data.id);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao gerar o orçamento. Por favor, tente novamente.');
        document.getElementById('loadingOverlay').style.display = 'none';
    });
}

// Função para gerar PDF do orçamento
function generatePdf(orcamentoId) {
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Redirecionar para o endpoint de PDF
    window.location.href = `/api/orcamentos/${orcamentoId}/pdf`;
    
    // Ocultar overlay após um tempo (para dar tempo de iniciar o download)
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 1500);
}

// Funções utilitárias
function formatCurrency(value) {
    return `R$ ${parseFloat(value).toFixed(2)}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
