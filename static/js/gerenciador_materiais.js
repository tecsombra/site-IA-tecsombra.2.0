// Módulo de Gerenciamento de Materiais
// Este módulo permite cadastrar, editar, excluir e gerenciar materiais personalizados
// para uso nos projetos de serralheria

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o módulo quando o DOM estiver carregado
    initMaterialsModule();
});

// Variáveis globais
let materialsList = [];
let materialCategories = [
    'Perfil Estrutural',
    'Perfil Decorativo',
    'Chapa',
    'Vidro',
    'Acessório',
    'Consumível',
    'Acabamento'
];

let materialUnits = [
    'metro',
    'metro²',
    'unidade',
    'kg',
    'litro',
    'peça'
];

// Função principal de inicialização
function initMaterialsModule() {
    // Carregar materiais do localStorage ou do servidor
    loadMaterials();
    
    // Configurar listeners de eventos
    setupEventListeners();
    
    // Renderizar a interface inicial
    renderMaterialsInterface();
}

// Carregar materiais do armazenamento
function loadMaterials() {
    // Tentar carregar do localStorage primeiro (para demonstração)
    const storedMaterials = localStorage.getItem('serralheria_materials');
    
    if (storedMaterials) {
        materialsList = JSON.parse(storedMaterials);
    } else {
        // Carregar materiais padrão se não houver dados salvos
        loadDefaultMaterials();
    }
}

// Carregar materiais padrão
function loadDefaultMaterials() {
    materialsList = [
        // Perfis estruturais - Metalon quadrado
        { id: 1, name: 'Metalon Quadrado 20x20', category: 'Perfil Estrutural', type: 'Metalon Quadrado', dimensions: '20x20', thickness: '1.20', price: 15.50, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 2, name: 'Metalon Quadrado 30x30', category: 'Perfil Estrutural', type: 'Metalon Quadrado', dimensions: '30x30', thickness: '1.20', price: 22.75, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 3, name: 'Metalon Quadrado 40x40', category: 'Perfil Estrutural', type: 'Metalon Quadrado', dimensions: '40x40', thickness: '1.20', price: 32.90, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 4, name: 'Metalon Quadrado 50x50', category: 'Perfil Estrutural', type: 'Metalon Quadrado', dimensions: '50x50', thickness: '1.50', price: 45.60, unit: 'metro', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        { id: 5, name: 'Metalon Quadrado 60x60', category: 'Perfil Estrutural', type: 'Metalon Quadrado', dimensions: '60x60', thickness: '1.50', price: 58.30, unit: 'metro', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        
        // Perfis estruturais - Metalon retangular
        { id: 6, name: 'Metalon Retangular 20x30', category: 'Perfil Estrutural', type: 'Metalon Retangular', dimensions: '20x30', thickness: '1.20', price: 19.80, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 7, name: 'Metalon Retangular 30x40', category: 'Perfil Estrutural', type: 'Metalon Retangular', dimensions: '30x40', thickness: '1.20', price: 28.50, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 8, name: 'Metalon Retangular 40x60', category: 'Perfil Estrutural', type: 'Metalon Retangular', dimensions: '40x60', thickness: '1.50', price: 42.90, unit: 'metro', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        { id: 9, name: 'Metalon Retangular 50x70', category: 'Perfil Estrutural', type: 'Metalon Retangular', dimensions: '50x70', thickness: '1.50', price: 55.40, unit: 'metro', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        
        // Vigas U e enrijecidas
        { id: 10, name: 'Viga U 50x25x2.65', category: 'Perfil Estrutural', type: 'Viga U', dimensions: '50x25', thickness: '2.65', price: 32.80, unit: 'metro', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 11, name: 'Viga U 75x40x3.00', category: 'Perfil Estrutural', type: 'Viga U', dimensions: '75x40', thickness: '3.00', price: 48.60, unit: 'metro', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 12, name: 'Viga U 100x50x3.35', category: 'Perfil Estrutural', type: 'Viga U', dimensions: '100x50', thickness: '3.35', price: 65.30, unit: 'metro', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 13, name: 'Viga U Enrijecida 75x40x15x2.65', category: 'Perfil Estrutural', type: 'Viga U Enrijecida', dimensions: '75x40x15', thickness: '2.65', price: 52.40, unit: 'metro', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 14, name: 'Viga U Enrijecida 100x50x17x3.00', category: 'Perfil Estrutural', type: 'Viga U Enrijecida', dimensions: '100x50x17', thickness: '3.00', price: 72.80, unit: 'metro', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        
        // Chapas
        { id: 15, name: 'Chapa Galvanizada #18', category: 'Chapa', type: 'Chapa Galvanizada', dimensions: '1200x3000', thickness: '1.20', price: 120.00, unit: 'metro²', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 16, name: 'Chapa Galvanizada #20', category: 'Chapa', type: 'Chapa Galvanizada', dimensions: '1200x3000', thickness: '0.90', price: 95.00, unit: 'metro²', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 17, name: 'Chapa Preta #18', category: 'Chapa', type: 'Chapa Preta', dimensions: '1200x3000', thickness: '1.20', price: 110.00, unit: 'metro²', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        { id: 18, name: 'Chapa Preta #20', category: 'Chapa', type: 'Chapa Preta', dimensions: '1200x3000', thickness: '0.90', price: 85.00, unit: 'metro²', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        
        // Tubos redondos
        { id: 19, name: 'Tubo Redondo 1"', category: 'Perfil Estrutural', type: 'Tubo Redondo', dimensions: '1 polegada', thickness: '1.20', price: 18.50, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 20, name: 'Tubo Redondo 1.1/2"', category: 'Perfil Estrutural', type: 'Tubo Redondo', dimensions: '1.5 polegada', thickness: '1.50', price: 28.90, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 21, name: 'Tubo Redondo 2"', category: 'Perfil Estrutural', type: 'Tubo Redondo', dimensions: '2 polegadas', thickness: '1.50', price: 38.70, unit: 'metro', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        
        // Consumíveis
        { id: 22, name: 'Eletrodo 6013', category: 'Consumível', type: 'Eletrodo', dimensions: '2.5mm', thickness: 'N/A', price: 25.00, unit: 'kg', supplier: 'GOLDONI', lastUpdate: new Date().toISOString() },
        { id: 23, name: 'Disco de Corte 7"', category: 'Consumível', type: 'Disco', dimensions: '7 polegadas', thickness: 'N/A', price: 12.50, unit: 'unidade', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        { id: 24, name: 'Parafuso Autobrocante', category: 'Fixação', type: 'Parafuso', dimensions: '4.2x13', thickness: 'N/A', price: 0.35, unit: 'unidade', supplier: 'SILFER', lastUpdate: new Date().toISOString() },
        
        // Acabamentos
        { id: 25, name: 'Tinta Anticorrosiva', category: 'Acabamento', type: 'Tinta', dimensions: 'N/A', thickness: 'N/A', price: 85.00, unit: 'litro', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        { id: 26, name: 'Primer Universal', category: 'Acabamento', type: 'Primer', dimensions: 'N/A', thickness: 'N/A', price: 65.00, unit: 'litro', supplier: 'KASIFER', lastUpdate: new Date().toISOString() },
        
        // Vidros
        { id: 27, name: 'Vidro Temperado 8mm', category: 'Vidro', type: 'Vidro Temperado', dimensions: 'Sob medida', thickness: '8.00', price: 220.00, unit: 'metro²', supplier: 'VIDROMAX', lastUpdate: new Date().toISOString() },
        { id: 28, name: 'Vidro Laminado 10mm', category: 'Vidro', type: 'Vidro Laminado', dimensions: 'Sob medida', thickness: '10.00', price: 320.00, unit: 'metro²', supplier: 'VIDROMAX', lastUpdate: new Date().toISOString() }
    ];
    
    // Salvar no localStorage
    saveMaterials();
}

// Salvar materiais no armazenamento
function saveMaterials() {
    localStorage.setItem('serralheria_materials', JSON.stringify(materialsList));
    
    // Aqui também poderia enviar para o servidor via API
    // sendMaterialsToServer(materialsList);
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Botão para adicionar novo material
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btn-add-material') {
            showAddMaterialForm();
        }
        
        // Botão para salvar novo material
        if (e.target && e.target.id === 'btn-save-material') {
            saveMaterialForm();
        }
        
        // Botão para cancelar formulário
        if (e.target && e.target.id === 'btn-cancel-material') {
            hideAddMaterialForm();
        }
        
        // Botões de edição
        if (e.target && e.target.classList.contains('btn-edit-material')) {
            const materialId = parseInt(e.target.getAttribute('data-id'));
            editMaterial(materialId);
        }
        
        // Botões de exclusão
        if (e.target && e.target.classList.contains('btn-delete-material')) {
            const materialId = parseInt(e.target.getAttribute('data-id'));
            deleteMaterial(materialId);
        }
        
        // Filtros de categoria
        if (e.target && e.target.classList.contains('material-category-filter')) {
            const category = e.target.getAttribute('data-category');
            filterMaterialsByCategory(category);
        }
    });
    
    // Pesquisa de materiais
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'material-search') {
            const searchTerm = e.target.value.toLowerCase();
            searchMaterials(searchTerm);
        }
    });
}

// Renderizar a interface de gerenciamento de materiais
function renderMaterialsInterface() {
    const materialsContainer = document.getElementById('materials-management-container');
    if (!materialsContainer) return;
    
    let html = `
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-box-seam"></i> Gerenciamento de Materiais</h5>
                <button id="btn-add-material" class="btn btn-primary btn-sm">
                    <i class="bi bi-plus-circle"></i> Novo Material
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input type="text" id="material-search" class="form-control" placeholder="Pesquisar materiais...">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="d-flex flex-wrap justify-content-end">
                            <button class="btn btn-outline-secondary btn-sm me-1 mb-1 material-category-filter" data-category="all">Todos</button>
                            ${materialCategories.map(category => 
                                `<button class="btn btn-outline-secondary btn-sm me-1 mb-1 material-category-filter" data-category="${category}">${category}</button>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div id="add-material-form-container" style="display: none;" class="mb-4">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h6 class="mb-0" id="material-form-title">Adicionar Novo Material</h6>
                        </div>
                        <div class="card-body">
                            <form id="material-form">
                                <input type="hidden" id="material-id">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="material-name" class="form-label">Nome do Material</label>
                                        <input type="text" class="form-control" id="material-name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="material-category" class="form-label">Categoria</label>
                                        <select class="form-select" id="material-category" required>
                                            ${materialCategories.map(category => 
                                                `<option value="${category}">${category}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="material-type" class="form-label">Tipo</label>
                                        <input type="text" class="form-control" id="material-type" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="material-dimensions" class="form-label">Dimensões</label>
                                        <input type="text" class="form-control" id="material-dimensions">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="material-thickness" class="form-label">Espessura</label>
                                        <input type="text" class="form-control" id="material-thickness">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="material-price" class="form-label">Preço Unitário</label>
                                        <div class="input-group">
                                            <span class="input-group-text">R$</span>
                                            <input type="number" step="0.01" class="form-control" id="material-price" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="material-unit" class="form-label">Unidade</label>
                                        <select class="form-select" id="material-unit" required>
                                            ${materialUnits.map(unit => 
                                                `<option value="${unit}">${unit}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="material-supplier" class="form-label">Fornecedor</label>
                                        <input type="text" class="form-control" id="material-supplier">
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <button type="button" id="btn-cancel-material" class="btn btn-outline-secondary me-2">Cancelar</button>
                                    <button type="button" id="btn-save-material" class="btn btn-primary">Salvar Material</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Tipo</th>
                                <th>Dimensões</th>
                                <th>Espessura</th>
                                <th>Preço</th>
                                <th>Unidade</th>
                                <th>Fornecedor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="materials-table-body">
                            ${renderMaterialsTableRows(materialsList)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    materialsContainer.innerHTML = html;
}

// Renderizar linhas da tabela de materiais
function renderMaterialsTableRows(materials) {
    if (!materials || materials.length === 0) {
        return `<tr><td colspan="9" class="text-center">Nenhum material encontrado</td></tr>`;
    }
    
    return materials.map(material => `
        <tr>
            <td>${material.name}</td>
            <td>${material.category}</td>
            <td>${material.type}</td>
            <td>${material.dimensions}</td>
            <td>${material.thickness}</td>
            <td>R$ ${material.price.toFixed(2)}</td>
            <td>${material.unit}</td>
            <td>${material.supplier || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit-material" data-id="${material.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-material" data-id="${material.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Mostrar formulário para adicionar material
function showAddMaterialForm() {
    // Limpar formulário
    document.getElementById('material-form-title').textContent = 'Adicionar Novo Material';
    document.getElementById('material-id').value = '';
    document.getElementById('material-name').value = '';
    document.getElementById('material-category').value = materialCategories[0];
    document.getElementById('material-type').value = '';
    document.getElementById('material-dimensions').value = '';
    document.getElementById('material-thickness').value = '';
    document.getElementById('material-price').value = '';
    document.getElementById('material-unit').value = materialUnits[0];
    document.getElementById('material-supplier').value = '';
    
    // Mostrar formulário
    document.getElementById('add-material-form-container').style.display = 'block';
}

// Ocultar formulário
function hideAddMaterialForm() {
    document.getElementById('add-material-form-container').style.display = 'none';
}

// Salvar material do formulário
function saveMaterialForm() {
    // Obter valores do formulário
    const materialId = document.getElementById('material-id').value;
    const name = document.getElementById('material-name').value;
    const category = document.getElementById('material-category').value;
    const type = document.getElementById('material-type').value;
    const dimensions = document.getElementById('material-dimensions').value;
    const thickness = document.getElementById('material-thickness').value;
    const price = parseFloat(document.getElementById('material-price').value);
    const unit = document.getElementById('material-unit').value;
    const supplier = document.getElementById('material-supplier').value;
    
    // Validar campos obrigatórios
    if (!name || !category || !type || !price || !unit) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (materialId) {
        // Atualizar material existente
        const index = materialsList.findIndex(m => m.id === parseInt(materialId));
        if (index !== -1) {
            materialsList[index] = {
                ...materialsList[index],
                name,
                category,
                type,
                dimensions,
                thickness,
                price,
                unit,
                supplier,
                lastUpdate: new Date().toISOString()
            };
        }
    } else {
        // Adicionar novo material
        const newId = materialsList.length > 0 ? Math.max(...materialsList.map(m => m.id)) + 1 : 1;
        materialsList.push({
            id: newId,
            name,
            category,
            type,
            dimensions,
            thickness,
            price,
            unit,
            supplier,
            lastUpdate: new Date().toISOString()
        });
    }
    
    // Salvar alterações
    saveMaterials();
    
    // Atualizar interface
    updateMaterialsTable();
    
    // Ocultar formulário
    hideAddMaterialForm();
}

// Atualizar tabela de materiais
function updateMaterialsTable() {
    const tableBody = document.getElementById('materials-table-body');
    if (tableBody) {
        tableBody.innerHTML = renderMaterialsTableRows(materialsList);
    }
}

// Editar material
function editMaterial(materialId) {
    const material = materialsList.find(m => m.id === materialId);
    if (!material) return;
    
    // Preencher formulário com dados do material
    document.getElementById('material-form-title').textContent = 'Editar Material';
    document.getElementById('material-id').value = material.id;
    document.getElementById('material-name').value = material.name;
    document.getElementById('material-category').value = material.category;
    document.getElementById('material-type').value = material.type;
    document.getElementById('material-dimensions').value = material.dimensions || '';
    document.getElementById('material-thickness').value = material.thickness || '';
    document.getElementById('material-price').value = material.price;
    document.getElementById('material-unit').value = material.unit;
    document.getElementById('material-supplier').value = material.supplier || '';
    
    // Mostrar formulário
    document.getElementById('add-material-form-container').style.display = 'block';
}

// Excluir material
function deleteMaterial(materialId) {
    if (confirm('Tem certeza que deseja excluir este material?')) {
        materialsList = materialsList.filter(m => m.id !== materialId);
        saveMaterials();
        updateMaterialsTable();
    }
}

// Filtrar materiais por categoria
function filterMaterialsByCategory(category) {
    const tableBody = document.getElementById('materials-table-body');
    if (!tableBody) return;
    
    let filteredMaterials;
    
    if (category === 'all') {
        filteredMaterials = materialsList;
    } else {
        filteredMaterials = materialsList.filter(m => m.category === category);
    }
    
    tableBody.innerHTML = renderMaterialsTableRows(filteredMaterials);
}

// Pesquisar materiais
function searchMaterials(searchTerm) {
    const tableBody = document.getElementById('materials-table-body');
    if (!tableBody) return;
    
    if (!searchTerm) {
        tableBody.innerHTML = renderMaterialsTableRows(materialsList);
        return;
    }
    
    const filteredMaterials = materialsList.filter(m => 
        m.name.toLowerCase().includes(searchTerm) ||
        m.type.toLowerCase().includes(searchTerm) ||
        m.category.toLowerCase().includes(searchTerm) ||
        m.dimensions.toLowerCase().includes(searchTerm) ||
        (m.supplier && m.supplier.toLowerCase().includes(searchTerm))
    );
    
    tableBody.innerHTML = renderMaterialsTableRows(filteredMaterials);
}

// Exportar materiais para CSV
function exportMaterialsToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Cabeçalho
    csvContent += "ID,Nome,Categoria,Tipo,Dimensões,Espessura,Preço,Unidade,Fornecedor,Última Atualização\n";
    
    // Dados
    materialsList.forEach(material => {
        csvContent += `${material.id},"${material.name}","${material.category}","${material.type}","${material.dimensions}","${material.thickness}",${material.price},"${material.unit}","${material.supplier}","${material.lastUpdate}"\n`;
    });
    
    // Criar link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "materiais_serralheria.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Importar materiais de CSV
function importMaterialsFromCSV(csvFile) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        
        // Pular cabeçalho
        const newMaterials = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            
            const columns = lines[i].split(',');
            
            // Processar colunas considerando possíveis aspas
            let processedColumns = [];
            let inQuotes = false;
            let currentValue = '';
            
            for (let j = 0; j < columns.length; j++) {
                let value = columns[j];
                
                if (value.startsWith('"') && value.endsWith('"') && value.length > 1) {
                    // Valor completo entre aspas
                    processedColumns.push(value.substring(1, value.length - 1));
                } else if (value.startsWith('"')) {
                    // Início de valor com aspas
                    inQuotes = true;
                    currentValue = value.substring(1);
                } else if (value.endsWith('"') && inQuotes) {
                    // Fim de valor com aspas
                    inQuotes = false;
                    currentValue += ',' + value.substring(0, value.length - 1);
                    processedColumns.push(currentValue);
                    currentValue = '';
                } else if (inQuotes) {
                    // Meio de valor com aspas
                    currentValue += ',' + value;
                } else {
                    // Valor sem aspas
                    processedColumns.push(value);
                }
            }
            
            if (processedColumns.length >= 9) {
                newMaterials.push({
                    id: parseInt(processedColumns[0]),
                    name: processedColumns[1],
                    category: processedColumns[2],
                    type: processedColumns[3],
                    dimensions: processedColumns[4],
                    thickness: processedColumns[5],
                    price: parseFloat(processedColumns[6]),
                    unit: processedColumns[7],
                    supplier: processedColumns[8],
                    lastUpdate: processedColumns[9] || new Date().toISOString()
                });
            }
        }
        
        if (newMaterials.length > 0) {
            if (confirm(`Importar ${newMaterials.length} materiais? Isso substituirá os materiais existentes.`)) {
                materialsList = newMaterials;
                saveMaterials();
                updateMaterialsTable();
            }
        } else {
            alert('Nenhum material encontrado no arquivo CSV.');
        }
    };
    
    reader.readAsText(csvFile);
}

// Função para obter lista de materiais para uso em outros módulos
function getMaterialsList() {
    return materialsList;
}

// Função para obter um material específico por ID
function getMaterialById(materialId) {
    return materialsList.find(m => m.id === materialId);
}

// Função para atualizar o preço de um material
function updateMaterialPrice(materialId, newPrice) {
    const index = materialsList.findIndex(m => m.id === materialId);
    if (index !== -1) {
        materialsList[index].price = newPrice;
        materialsList[index].lastUpdate = new Date().toISOString();
        saveMaterials();
        return true;
    }
    return false;
}

// Exportar funções para uso em outros módulos
window.materialsModule = {
    init: initMaterialsModule,
    getMaterialsList: getMaterialsList,
    getMaterialById: getMaterialById,
    updateMaterialPrice: updateMaterialPrice,
    exportToCSV: exportMaterialsToCSV,
    importFromCSV: importMaterialsFromCSV
};
