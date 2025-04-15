/**
 * Processador de Documentos Técnicos para o Módulo de Orçamentos com IA
 * 
 * Este módulo é responsável por:
 * - Processar arquivos PDF e imagens de plantas técnicas
 * - Extrair dimensões, tipos de materiais e quantidades
 * - Reconhecer elementos estruturais em plantas
 * - Calcular automaticamente dimensões e quantidades
 */

class ProcessadorDocumentos {
    constructor() {
        this.tiposArquivosSuportados = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/tiff',
            'image/bmp'
        ];
        
        this.elementosReconhecidos = {
            estruturais: ['viga', 'coluna', 'pilar', 'treliça', 'perfil', 'metalon'],
            fechamentos: ['chapa', 'telha', 'grade', 'tela', 'vidro'],
            fixacao: ['parafuso', 'solda', 'rebite', 'porca', 'arruela']
        };
        
        this.resultadosAnalise = {
            dimensoes: {},
            elementos: [],
            materiais: [],
            area: 0,
            perimetro: 0
        };
    }
    
    /**
     * Verifica se o tipo de arquivo é suportado
     * @param {string} tipoArquivo - MIME type do arquivo
     * @returns {boolean} - Verdadeiro se o tipo for suportado
     */
    verificarTipoArquivo(tipoArquivo) {
        return this.tiposArquivosSuportados.includes(tipoArquivo);
    }
    
    /**
     * Processa um arquivo e extrai informações
     * @param {File} arquivo - Objeto File do arquivo a ser processado
     * @returns {Promise} - Promise com os resultados da análise
     */
    processarArquivo(arquivo) {
        return new Promise((resolve, reject) => {
            if (!this.verificarTipoArquivo(arquivo.type)) {
                reject(new Error(`Tipo de arquivo não suportado: ${arquivo.type}`));
                return;
            }
            
            // Criar FormData para envio do arquivo
            const formData = new FormData();
            formData.append('arquivo', arquivo);
            
            // Enviar para o backend processar
            fetch('/api/analisar-documento', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao processar o documento');
                }
                return response.json();
            })
            .then(data => {
                this.resultadosAnalise = data;
                resolve(data);
            })
            .catch(error => {
                console.error('Erro ao processar documento:', error);
                reject(error);
            });
        });
    }
    
    /**
     * Extrai dimensões de um documento
     * @param {Object} dadosDocumento - Dados extraídos do documento
     * @returns {Object} - Dimensões extraídas
     */
    extrairDimensoes(dadosDocumento) {
        // Esta função será implementada no backend
        // Aqui apenas simulamos o retorno
        return {
            comprimento: dadosDocumento.comprimento || 0,
            largura: dadosDocumento.largura || 0,
            altura: dadosDocumento.altura || 0,
            area: dadosDocumento.area || 0
        };
    }
    
    /**
     * Reconhece elementos estruturais em uma planta
     * @param {Object} dadosDocumento - Dados extraídos do documento
     * @returns {Array} - Lista de elementos reconhecidos
     */
    reconhecerElementos(dadosDocumento) {
        // Esta função será implementada no backend
        // Aqui apenas simulamos o retorno
        return dadosDocumento.elementos || [];
    }
    
    /**
     * Estima materiais necessários com base nos elementos reconhecidos
     * @param {Array} elementos - Lista de elementos reconhecidos
     * @returns {Array} - Lista de materiais estimados
     */
    estimarMateriais(elementos) {
        // Esta função será implementada no backend
        // Aqui apenas simulamos o retorno
        return elementos.map(elemento => ({
            tipo: elemento.tipo,
            quantidade: elemento.quantidade,
            unidade: elemento.unidade,
            material_sugerido: elemento.material_sugerido
        }));
    }
    
    /**
     * Calcula o custo estimado dos materiais
     * @param {Array} materiais - Lista de materiais estimados
     * @returns {Object} - Custos estimados
     */
    calcularCustoEstimado(materiais) {
        // Esta função será implementada no backend
        // Aqui apenas simulamos o retorno
        let custoTotal = 0;
        
        materiais.forEach(material => {
            custoTotal += material.custo_unitario * material.quantidade;
        });
        
        return {
            custoMateriais: custoTotal,
            custoMaoDeObra: custoTotal * 0.4, // 40% do custo de materiais
            custoTotal: custoTotal * 1.4 // Materiais + mão de obra
        };
    }
    
    /**
     * Gera um relatório completo da análise
     * @returns {Object} - Relatório completo
     */
    gerarRelatorio() {
        return {
            dimensoes: this.resultadosAnalise.dimensoes,
            elementos: this.resultadosAnalise.elementos,
            materiais: this.resultadosAnalise.materiais,
            custos: this.calcularCustoEstimado(this.resultadosAnalise.materiais),
            metadados: {
                dataAnalise: new Date().toISOString(),
                versaoProcessador: '1.0.0'
            }
        };
    }
}

// Inicializar o processador de documentos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário de upload
    const uploadForm = document.getElementById('documentUploadForm');
    const fileInput = document.getElementById('documentFile');
    const dropZone = document.getElementById('dropZone');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const analysisResults = document.getElementById('analysisResults');
    
    // Instanciar o processador de documentos
    const processador = new ProcessadorDocumentos();
    
    // Configurar eventos de drag and drop
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.classList.add('highlight');
        }
        
        function unhighlight() {
            dropZone.classList.remove('highlight');
        }
        
        // Manipular o evento de soltar arquivo
        dropZone.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                fileInput.files = files;
                handleFileSelect();
            }
        }
    }
    
    // Manipular seleção de arquivo via input
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect, false);
    }
    
    function handleFileSelect() {
        if (fileInput.files.length === 0) return;
        
        const file = fileInput.files[0];
        
        // Verificar se o tipo de arquivo é suportado
        if (!processador.verificarTipoArquivo(file.type)) {
            alert('Tipo de arquivo não suportado. Por favor, envie um PDF ou imagem.');
            return;
        }
        
        // Mostrar barra de progresso
        if (uploadProgress) {
            uploadProgress.style.display = 'block';
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';
        }
        
        // Simular progresso (será substituído pela implementação real)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${progress}%`;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Processar o arquivo
                processador.processarArquivo(file)
                    .then(resultados => {
                        // Exibir resultados
                        exibirResultadosAnalise(resultados);
                    })
                    .catch(error => {
                        console.error('Erro ao processar arquivo:', error);
                        alert('Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.');
                        
                        if (uploadProgress) {
                            uploadProgress.style.display = 'none';
                        }
                    });
            }
        }, 100);
    }
    
    // Função para exibir os resultados da análise
    function exibirResultadosAnalise(resultados) {
        if (!analysisResults) return;
        
        // Limpar resultados anteriores
        analysisResults.innerHTML = '';
        
        // Criar elementos para exibir os resultados
        const container = document.createElement('div');
        container.className = 'analysis-results-container';
        
        // Cabeçalho
        const header = document.createElement('h4');
        header.textContent = 'Resultados da Análise';
        container.appendChild(header);
        
        // Dimensões
        const dimensoesSection = document.createElement('div');
        dimensoesSection.className = 'analysis-section';
        
        const dimensoesTitle = document.createElement('h5');
        dimensoesTitle.textContent = 'Dimensões Detectadas';
        dimensoesSection.appendChild(dimensoesTitle);
        
        const dimensoesList = document.createElement('ul');
        dimensoesList.className = 'list-group';
        
        for (const [key, value] of Object.entries(resultados.dimensoes)) {
            const item = document.createElement('li');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            const label = document.createElement('span');
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'badge bg-primary rounded-pill';
            valueSpan.textContent = `${value} ${key === 'area' ? 'm²' : 'm'}`;
            
            item.appendChild(label);
            item.appendChild(valueSpan);
            dimensoesList.appendChild(item);
        }
        
        dimensoesSection.appendChild(dimensoesList);
        container.appendChild(dimensoesSection);
        
        // Elementos reconhecidos
        const elementosSection = document.createElement('div');
        elementosSection.className = 'analysis-section mt-4';
        
        const elementosTitle = document.createElement('h5');
        elementosTitle.textContent = 'Elementos Reconhecidos';
        elementosSection.appendChild(elementosTitle);
        
        const elementosTable = document.createElement('table');
        elementosTable.className = 'table table-striped';
        
        const tableHead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        ['Tipo', 'Quantidade', 'Dimensões', 'Material Sugerido'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        tableHead.appendChild(headerRow);
        elementosTable.appendChild(tableHead);
        
        const tableBody = document.createElement('tbody');
        
        resultados.elementos.forEach(elemento => {
            const row = document.createElement('tr');
            
            const tipoCell = document.createElement('td');
            tipoCell.textContent = elemento.tipo;
            row.appendChild(tipoCell);
            
            const quantidadeCell = document.createElement('td');
            quantidadeCell.textContent = elemento.quantidade;
            row.appendChild(quantidadeCell);
            
            const dimensoesCell = document.createElement('td');
            dimensoesCell.textContent = elemento.dimensoes;
            row.appendChild(dimensoesCell);
            
            const materialCell = document.createElement('td');
            materialCell.textContent = elemento.material_sugerido;
            row.appendChild(materialCell);
            
            tableBody.appendChild(row);
        });
        
        elementosTable.appendChild(tableBody);
        elementosSection.appendChild(elementosTable);
        container.appendChild(elementosSection);
        
        // Materiais estimados
        const materiaisSection = document.createElement('div');
        materiaisSection.className = 'analysis-section mt-4';
        
        const materiaisTitle = document.createElement('h5');
        materiaisTitle.textContent = 'Materiais Estimados';
        materiaisSection.appendChild(materiaisTitle);
        
        const materiaisTable = document.createElement('table');
        materiaisTable.className = 'table table-striped';
        
        const materiaisTableHead = document.createElement('thead');
        const materiaisHeaderRow = document.createElement('tr');
        
        ['Material', 'Quantidade', 'Unidade', 'Custo Unitário', 'Custo Total'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            materiaisHeaderRow.appendChild(th);
        });
        
        materiaisTableHead.appendChild(materiaisHeaderRow);
        materiaisTable.appendChild(materiaisTableHead);
        
        const materiaisTableBody = document.createElement('tbody');
        
        resultados.materiais.forEach(material => {
            const row = document.createElement('tr');
            
            const materialCell = document.createElement('td');
            materialCell.textContent = material.tipo;
            row.appendChild(materialCell);
            
            const quantidadeCell = document.createElement('td');
            quantidadeCell.textContent = material.quantidade;
            row.appendChild(quantidadeCell);
            
            const unidadeCell = document.createElement('td');
            unidadeCell.textContent = material.unidade;
            row.appendChild(unidadeCell);
            
            const custoUnitarioCell = document.createElement('td');
            custoUnitarioCell.textContent = `R$ ${material.custo_unitario.toFixed(2)}`;
            row.appendChild(custoUnitarioCell);
            
            const custoTotalCell = document.createElement('td');
            custoTotalCell.textContent = `R$ ${(material.quantidade * material.custo_unitario).toFixed(2)}`;
            row.appendChild(custoTotalCell);
            
            materiaisTableBody.appendChild(row);
        });
        
        materiaisTable.appendChild(materiaisTableBody);
        materiaisSection.appendChild(materiaisTable);
        container.appendChild(materiaisSection);
        
        // Custos estimados
        const custosSection = document.createElement('div');
        custosSection.className = 'analysis-section mt-4';
        
        const custosTitle = document.createElement('h5');
        custosTitle.textContent = 'Custos Estimados';
        custosSection.appendChild(custosTitle);
        
        const custosList = document.createElement('ul');
        custosList.className = 'list-group';
        
        const custos = resultados.custos || {
            custoMateriais: 0,
            custoMaoDeObra: 0,
            custoTotal: 0
        };
        
        [
            { label: 'Custo de Materiais', value: custos.custoMateriais },
            { label: 'Custo de Mão de Obra', value: custos.custoMaoDeObra },
            { label: 'Custo Total Estimado', value: custos.custoTotal }
        ].forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            const label = document.createElement('span');
            label.textContent = item.label;
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'badge bg-success rounded-pill';
            valueSpan.textContent = `R$ ${item.value.toFixed(2)}`;
            
            listItem.appendChild(label);
            listItem.appendChild(valueSpan);
            custosList.appendChild(listItem);
        });
        
        custosSection.appendChild(custosList);
        container.appendChild(custosSection);
        
        // Botões de ação
        const actionsSection = document.createElement('div');
        actionsSection.className = 'analysis-actions mt-4 d-flex justify-content-between';
        
        const useResultsBtn = document.createElement('button');
        useResultsBtn.className = 'btn btn-primary';
        useResultsBtn.innerHTML = '<i class="bi bi-check-circle"></i> Usar Resultados no Orçamento';
        useResultsBtn.addEventListener('click', () => {
            // Implementar integração com o módulo de orçamentos
            alert('Resultados aplicados ao orçamento!');
        });
        
        const newAnalysisBtn = document.createElement('button');
        newAnalysisBtn.className = 'btn btn-secondary';
        newAnalysisBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Nova Análise';
        newAnalysisBtn.addEventListener('click', () => {
            // Limpar formulário e resultados
            if (uploadForm) uploadForm.reset();
            analysisResults.innerHTML = '';
            if (uploadProgress) uploadProgress.style.display = 'none';
        });
        
        actionsSection.appendChild(newAnalysisBtn);
        actionsSection.appendChild(useResultsBtn);
        container.appendChild(actionsSection);
        
        // Adicionar container ao elemento de resultados
        analysisResults.appendChild(container);
        analysisResults.style.display = 'block';
        
        // Ocultar barra de progresso
        if (uploadProgress) {
            uploadProgress.style.display = 'none';
        }
    }
});
