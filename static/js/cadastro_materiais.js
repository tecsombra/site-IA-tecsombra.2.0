/**
 * Cadastro de Materiais Personalizados para Serralheria
 * 
 * Este módulo permite que os usuários cadastrem, editem e gerenciem materiais personalizados
 * para uso no sistema de estimativa automática.
 * 
 * Autor: Manus AI
 * Data: 15/04/2025
 */

// Inicializar o módulo quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o sistema de estimativa automática já está carregado
    if (typeof window.estimatorData === 'undefined') {
        console.warn('Sistema de estimativa automática não encontrado. O cadastro de materiais não será inicializado.');
        return;
    }
    
    // Criar interface para cadastro de materiais
    createMaterialsInterface();
    
    // Configurar listeners de eventos
    setupMaterialsEventListeners();
    
    console.log('Módulo de cadastro de materiais personalizados inicializado com sucesso.');
});

/**
 * Criar interface para cadastro de materiais
 */
function createMaterialsInterface() {
    // Verificar se o container principal existe
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    // Criar container para o módulo de materiais
    const materialsContainer = document.createElement('div');
    materialsContainer.id = 'materials-container';
    materialsContainer.className = 'module-container';
    materialsContainer.style.display = 'none';
    
    // Adicionar HTML para o módulo de materiais
    materialsContainer.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-8">
                <h4 class="mb-3"><i class="bi bi-box-seam"></i> Cadastro de Materiais</h4>
            </div>
            <div class="col-md-4 text-end">
                <button id="btn-add-material" class="btn btn-primary btn-sm">
                    <i class="bi bi-plus-circle"></i> Novo Material
                </button>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Categorias</h5>
                        <button id="btn-add-category" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>
                    <div class="card-body p-0">
                        <div id="materials-categories" class="list-group list-group-flush">
                            <button class="list-group-item list-group-item-action active" data-category="all">
                                Todos os Materiais <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="perfis">
                                Perfis Metálicos <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="chapas">
                                Chapas <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="tubos">
                                Tubos <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="telhas">
                                Telhas <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="fixacao">
                                Fixação <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="acabamento">
                                Acabamento <span class="badge bg-secondary float-end">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" data-category="outros">
                                Outros <span class="badge bg-secondary float-end">0</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Filtros</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="filter-name" class="form-label">Nome do Material</label>
                            <input type="text" class="form-control" id="filter-name" placeholder="Buscar...">
                        </div>
                        
                        <div class="mb-3">
                            <label for="filter-unit" class="form-label">Unidade</label>
                            <select class="form-select" id="filter-unit">
                                <option value="">Todas</option>
                                <option value="m">Metro (m)</option>
                                <option value="m²">Metro Quadrado (m²)</option>
                                <option value="kg">Quilograma (kg)</option>
                                <option value="un">Unidade (un)</option>
                                <option value="l">Litro (l)</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="filter-price" class="form-label">Preço Máximo</label>
                            <input type="range" class="form-range" id="filter-price" min="0" max="1000" step="10" value="1000">
                            <div class="d-flex justify-content-between">
                                <small>R$ 0</small>
                                <small id="filter-price-value">R$ 1000</small>
                            </div>
                        </div>
                        
                        <button id="btn-apply-filters" class="btn btn-outline-primary w-100">
                            <i class="bi bi-funnel"></i> Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Lista de Materiais</h5>
                        <div class="btn-group">
                            <button id="btn-import-materials" class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-upload"></i> Importar
                            </button>
                            <button id="btn-export-materials" class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-download"></i> Exportar
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col" style="width: 40%">Nome</th>
                                        <th scope="col" style="width: 15%">Preço</th>
                                        <th scope="col" style="width: 15%">Unidade</th>
                                        <th scope="col" style="width: 15%">Peso</th>
                                        <th scope="col" style="width: 15%">Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="materials-list">
                                    <tr>
                                        <td colspan="5" class="text-center py-3">
                                            <div class="text-muted">Carregando materiais...</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span id="materials-count">0</span> materiais encontrados
                            </div>
                            <div class="btn-group">
                                <button id="btn-prev-page" class="btn btn-sm btn-outline-secondary" disabled>
                                    <i class="bi bi-chevron-left"></i>
                                </button>
                                <button id="btn-next-page" class="btn btn-sm btn-outline-secondary" disabled>
                                    <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Detalhes do Material</h5>
                    </div>
                    <div class="card-body">
                        <div id="material-details">
                            <div class="text-center py-4">
                                <div class="text-muted">Selecione um material para ver os detalhes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal para adicionar/editar material -->
        <div class="modal fade" id="material-modal" tabindex="-1" aria-labelledby="material-modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="material-modal-label">Novo Material</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <form id="material-form">
                            <input type="hidden" id="material-id">
                            
                            <div class="mb-3">
                                <label for="material-name" class="form-label">Nome do Material *</label>
                                <input type="text" class="form-control" id="material-name" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="material-category" class="form-label">Categoria *</label>
                                <select class="form-select" id="material-category" required>
                                    <option value="perfis">Perfis Metálicos</option>
                                    <option value="chapas">Chapas</option>
                                    <option value="tubos">Tubos</option>
                                    <option value="telhas">Telhas</option>
                                    <option value="fixacao">Fixação</option>
                                    <option value="acabamento">Acabamento</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="material-price" class="form-label">Preço *</label>
                                    <div class="input-group">
                                        <span class="input-group-text">R$</span>
                                        <input type="number" step="0.01" min="0.01" class="form-control" id="material-price" required>
                                    </div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <label for="material-unit" class="form-label">Unidade *</label>
                                    <select class="form-select" id="material-unit" required>
                                        <option value="m">Metro (m)</option>
                                        <option value="m²">Metro Quadrado (m²)</option>
                                        <option value="kg">Quilograma (kg)</option>
                                        <option value="un">Unidade (un)</option>
                                        <option value="l">Litro (l)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="material-weight" class="form-label">Peso (kg) *</label>
                                    <input type="number" step="0.01" min="0.01" class="form-control" id="material-weight" required>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <label for="material-density" class="form-label">Densidade (kg/m³)</label>
                                    <input type="number" step="0.01" min="0" class="form-control" id="material-density">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="material-description" class="form-label">Descrição</label>
                                <textarea class="form-control" id="material-description" rows="3"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="material-supplier" class="form-label">Fornecedor</label>
                                <input type="text" class="form-control" id="material-supplier">
                            </div>
                            
                            <div class="mb-3">
                                <label for="material-code" class="form-label">Código de Referência</label>
                                <input type="text" class="form-control" id="material-code">
                            </div>
                            
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="material-custom" checked>
                                    <label class="form-check-label" for="material-custom">
                                        Material Personalizado
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btn-save-material">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal para adicionar categoria -->
        <div class="modal fade" id="category-modal" tabindex="-1" aria-labelledby="category-modal-label" aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="category-modal-label">Nova Categoria</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <form id="category-form">
                            <div class="mb-3">
                                <label for="category-name" class="form-label">Nome da Categoria *</label>
                                <input type="text" class="form-control" id="category-name" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btn-save-category">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal para importar materiais -->
        <div class="modal fade" id="import-modal" tabindex="-1" aria-labelledby="import-modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="import-modal-label">Importar Materiais</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="import-format" class="form-label">Formato</label>
                            <select class="form-select" id="import-format">
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="import-data" class="form-label">Dados</label>
                            <textarea class="form-control" id="import-data" rows="10" placeholder="Cole os dados aqui..."></textarea>
                        </div>
                        
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="import-replace">
                            <label class="form-check-label" for="import-replace">
                                Substituir materiais existentes
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btn-confirm-import">Importar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar ao container principal
    mainContainer.appendChild(materialsContainer);
    
    // Adicionar link de navegação para o módulo de materiais
    addMaterialsNavLink();
}

/**
 * Adicionar link de navegação para o módulo de materiais
 */
function addMaterialsNavLink() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se o link já existe
    if (document.getElementById('nav-materials')) return;
    
    // Criar link para o módulo de materiais
    const materialsLink = document.createElement('li');
    materialsLink.className = 'nav-item';
    materialsLink.id = 'nav-materials';
    materialsLink.innerHTML = `
        <a class="nav-link" href="#" data-module="materials">
            <i class="bi bi-box-seam"></i> Materiais
        </a>
    `;
    
    // Adicionar link ao menu de navegação
    navbarNav.appendChild(materialsLink);
}

/**
 * Configurar listeners de eventos para o módulo de materiais
 */
function setupMaterialsEventListeners() {
    // Listener para navegação entre módulos
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('[data-module="materials"]')) {
            e.preventDefault();
            showMaterialsModule();
        }
    });
    
    // Listener para o botão de adicionar material
    document.getElementById('btn-add-material')?.addEventListener('click', function() {
        openMaterialModal();
    });
    
    // Listener para o botão de adicionar categoria
    document.getElementById('btn-add-category')?.addEventListener('click', function() {
        openCategoryModal();
    });
    
    // Listener para o botão de salvar material
    document.getElementById('btn-save-material')?.addEventListener('click', function() {
        saveMaterial();
    });
    
    // Listener para o botão de salvar categoria
    document.getElementById('btn-save-category')?.addEventListener('click', function() {
        saveCategory();
    });
    
    // Listener para filtro de preço
    document.getElementById('filter-price')?.addEventListener('input', function() {
        document.getElementById('filter-price-value').textContent = `R$ ${this.value}`;
    });
    
    // Listener para o botão de aplicar filtros
    document.getElementById('btn-apply-filters')?.addEventListener('click', function() {
        applyFilters();
    });
    
    // Listener para seleção de categoria
    document.getElementById('materials-categories')?.addEventListener('click', function(e) {
        if (e.target && e.target.closest('[data-category]')) {
            const categoryButton = e.target.closest('[data-category]');
            selectCategory(categoryButton.getAttribute('data-category'));
        }
    });
    
    // Listener para botões de importação/exportação
    document.getElementById('btn-import-materials')?.addEventListener('click', function() {
        openImportModal();
    });
    
    document.getElementById('btn-export-materials')?.addEventListener('click', function() {
        exportMaterials();
    });
    
    document.getElementById('btn-confirm-import')?.addEventListener('click', function() {
        importMaterials();
    });
    
    // Listener para ações na lista de materiais
    document.getElementById('materials-list')?.addEventListener('click', function(e) {
        // Botão de editar
        if (e.target && e.target.closest('.btn-edit-material')) {
            const materialId = e.target.closest('.btn-edit-material').getAttribute('data-id');
            editMaterial(materialId);
        }
        
        // Botão de excluir
        if (e.target && e.target.closest('.btn-delete-material')) {
            const materialId = e.target.closest('.btn-delete-material').getAttribute('data-id');
            deleteMaterial(materialId);
        }
        
        // Clique na linha para ver detalhes
        if (e.target && e.target.closest('tr[data-id]') && 
            !e.target.closest('.btn-edit-material') && 
            !e.target.closest('.btn-delete-material')) {
            const materialId = e.target.closest('tr[data-id]').getAttribute('data-id');
            showMaterialDetails(materialId);
        }
    });
    
    // Listener para paginação
    document.getElementById('btn-prev-page')?.addEventListener('click', function() {
        navigateToPage('prev');
    });
    
    document.getElementById('btn-next-page')?.addEventListener('click', function() {
        navigateToPage('next');
    });
}

/**
 * Mostrar o módulo de materiais
 */
function showMaterialsModule() {
    // Ocultar todos os módulos
    document.querySelectorAll('.module-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Mostrar o módulo de materiais
    const materialsContainer = document.getElementById('materials-container');
    if (materialsContainer) {
        materialsContainer.style.display = 'block';
    }
    
    // Atualizar links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const materialsLink = document.querySelector('[data-module="materials"]');
    if (materialsLink) {
        materialsLink.classList.add('active');
    }
    
    // Carregar lista de materiais
    loadMaterials();
}

// Variáveis para controle de paginação e filtros
let currentPage = 1;
let itemsPerPage = 10;
let currentCategory = 'all';
let currentFilters = {};

/**
 * Carregar lista de materiais
 */
function loadMaterials() {
    // Obter materiais do estimatorData
    const materials = window.estimatorData.materials;
    
    // Converter para array
    const materialsArray = [];
    for (const [key, value] of Object.entries(materials)) {
        materialsArray.push({
            id: key,
            name: key,
            ...value
        });
    }
    
    // Aplicar filtros
    let filteredMaterials = materialsArray;
    
    // Filtrar por categoria
    if (currentCategory !== 'all') {
        filteredMaterials = filteredMaterials.filter(material => 
            material.category === currentCategory);
    }
    
    // Aplicar outros filtros
    if (currentFilters.name) {
        filteredMaterials = filteredMaterials.filter(material => 
            material.name.toLowerCase().includes(currentFilters.name.toLowerCase()));
    }
    
    if (currentFilters.unit) {
        filteredMaterials = filteredMaterials.filter(material => 
            material.unit === currentFilters.unit);
    }
    
    if (currentFilters.maxPrice) {
        filteredMaterials = filteredMaterials.filter(material => 
            material.price <= currentFilters.maxPrice);
    }
    
    // Ordenar por nome
    filteredMaterials.sort((a, b) => a.name.localeCompare(b.name));
    
    // Atualizar contagem
    document.getElementById('materials-count').textContent = filteredMaterials.length;
    
    // Atualizar contagens por categoria
    updateCategoryCounts(materialsArray);
    
    // Paginar resultados
    const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredMaterials.length);
    const paginatedMaterials = filteredMaterials.slice(startIndex, endIndex);
    
    // Atualizar controles de paginação
    document.getElementById('btn-prev-page').disabled = currentPage <= 1;
    document.getElementById('btn-next-page').disabled = currentPage >= totalPages;
    
    // Renderizar lista
    renderMaterialsList(paginatedMaterials);
}

/**
 * Renderizar lista de materiais
 */
function renderMaterialsList(materials) {
    const materialsListElement = document.getElementById('materials-list');
    if (!materialsListElement) return;
    
    if (materials.length === 0) {
        materialsListElement.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-3">
                    <div class="text-muted">Nenhum material encontrado</div>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    materials.forEach(material => {
        html += `
            <tr data-id="${material.id}">
                <td>${material.name}</td>
                <td>R$ ${material.price.toFixed(2)}</td>
                <td>${material.unit}</td>
                <td>${material.weight.toFixed(2)} kg</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary btn-edit-material" data-id="${material.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-delete-material" data-id="${material.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    materialsListElement.innerHTML = html;
}

/**
 * Atualizar contagens por categoria
 */
function updateCategoryCounts(materials) {
    // Contar materiais por categoria
    const categoryCounts = {
        'all': materials.length,
        'perfis': 0,
        'chapas': 0,
        'tubos': 0,
        'telhas': 0,
        'fixacao': 0,
        'acabamento': 0,
        'outros': 0
    };
    
    // Contar materiais em cada categoria
    materials.forEach(material => {
        const category = material.category || 'outros';
        if (categoryCounts[category] !== undefined) {
            categoryCounts[category]++;
        } else {
            // Categoria personalizada
            categoryCounts[category] = 1;
        }
    });
    
    // Atualizar badges
    document.querySelectorAll('#materials-categories [data-category]').forEach(button => {
        const category = button.getAttribute('data-category');
        const badge = button.querySelector('.badge');
        if (badge) {
            badge.textContent = categoryCounts[category] || 0;
        }
    });
}

/**
 * Selecionar categoria
 */
function selectCategory(category) {
    // Atualizar botões de categoria
    document.querySelectorAll('#materials-categories [data-category]').forEach(button => {
        button.classList.remove('active');
    });
    
    const selectedButton = document.querySelector(`#materials-categories [data-category="${category}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Atualizar categoria atual
    currentCategory = category;
    currentPage = 1;
    
    // Recarregar materiais
    loadMaterials();
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    const nameFilter = document.getElementById('filter-name').value;
    const unitFilter = document.getElementById('filter-unit').value;
    const maxPriceFilter = parseInt(document.getElementById('filter-price').value);
    
    currentFilters = {
        name: nameFilter,
        unit: unitFilter,
        maxPrice: maxPriceFilter
    };
    
    currentPage = 1;
    loadMaterials();
}

/**
 * Navegar para página
 */
function navigateToPage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }
    
    loadMaterials();
}

/**
 * Abrir modal para adicionar material
 */
function openMaterialModal(material = null) {
    const modal = new bootstrap.Modal(document.getElementById('material-modal'));
    
    // Limpar formulário
    document.getElementById('material-form').reset();
    
    if (material) {
        // Modo de edição
        document.getElementById('material-modal-label').textContent = 'Editar Material';
        document.getElementById('material-id').value = material.id;
        document.getElementById('material-name').value = material.name;
        document.getElementById('material-category').value = material.category || 'outros';
        document.getElementById('material-price').value = material.price;
        document.getElementById('material-unit').value = material.unit;
        document.getElementById('material-weight').value = material.weight;
        document.getElementById('material-density').value = material.density || '';
        document.getElementById('material-description').value = material.description || '';
        document.getElementById('material-supplier').value = material.supplier || '';
        document.getElementById('material-code').value = material.code || '';
        document.getElementById('material-custom').checked = material.custom !== false;
    } else {
        // Modo de adição
        document.getElementById('material-modal-label').textContent = 'Novo Material';
        document.getElementById('material-id').value = '';
        document.getElementById('material-custom').checked = true;
    }
    
    modal.show();
}

/**
 * Abrir modal para adicionar categoria
 */
function openCategoryModal() {
    const modal = new bootstrap.Modal(document.getElementById('category-modal'));
    document.getElementById('category-form').reset();
    modal.show();
}

/**
 * Salvar material
 */
function saveMaterial() {
    // Validar formulário
    const form = document.getElementById('material-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Obter valores do formulário
    const id = document.getElementById('material-id').value;
    const name = document.getElementById('material-name').value;
    const category = document.getElementById('material-category').value;
    const price = parseFloat(document.getElementById('material-price').value);
    const unit = document.getElementById('material-unit').value;
    const weight = parseFloat(document.getElementById('material-weight').value);
    const density = document.getElementById('material-density').value ? 
        parseFloat(document.getElementById('material-density').value) : null;
    const description = document.getElementById('material-description').value;
    const supplier = document.getElementById('material-supplier').value;
    const code = document.getElementById('material-code').value;
    const custom = document.getElementById('material-custom').checked;
    
    // Criar objeto de material
    const material = {
        price,
        unit,
        weight,
        category,
        custom
    };
    
    // Adicionar campos opcionais
    if (density) material.density = density;
    if (description) material.description = description;
    if (supplier) material.supplier = supplier;
    if (code) material.code = code;
    
    // Determinar ID/nome do material
    const materialId = id || name;
    
    // Adicionar/atualizar material
    window.estimatorData.materials[materialId] = material;
    
    // Salvar dados
    if (window.saveEstimatorData) {
        window.saveEstimatorData();
    }
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('material-modal'));
    if (modal) {
        modal.hide();
    }
    
    // Recarregar lista
    loadMaterials();
    
    // Mostrar mensagem de sucesso
    showToast('Material salvo com sucesso!', 'success');
}

/**
 * Salvar categoria
 */
function saveCategory() {
    // Validar formulário
    const form = document.getElementById('category-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Obter nome da categoria
    const categoryName = document.getElementById('category-name').value;
    
    // Gerar ID da categoria (slug)
    const categoryId = categoryName.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9]/g, '-') // Substituir caracteres especiais por hífen
        .replace(/-+/g, '-') // Remover hífens duplicados
        .replace(/^-|-$/g, ''); // Remover hífens no início e fim
    
    // Verificar se a categoria já existe
    const existingCategory = document.querySelector(`#materials-categories [data-category="${categoryId}"]`);
    if (existingCategory) {
        showToast('Esta categoria já existe!', 'danger');
        return;
    }
    
    // Adicionar categoria à lista
    const categoriesList = document.getElementById('materials-categories');
    if (categoriesList) {
        const newCategory = document.createElement('button');
        newCategory.className = 'list-group-item list-group-item-action';
        newCategory.setAttribute('data-category', categoryId);
        newCategory.innerHTML = `
            ${categoryName} <span class="badge bg-secondary float-end">0</span>
        `;
        
        categoriesList.appendChild(newCategory);
    }
    
    // Adicionar ao select de categorias
    const categorySelect = document.getElementById('material-category');
    if (categorySelect) {
        const option = document.createElement('option');
        option.value = categoryId;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
    }
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('category-modal'));
    if (modal) {
        modal.hide();
    }
    
    // Mostrar mensagem de sucesso
    showToast('Categoria adicionada com sucesso!', 'success');
}

/**
 * Editar material
 */
function editMaterial(materialId) {
    // Obter material
    const material = window.estimatorData.materials[materialId];
    if (!material) return;
    
    // Abrir modal de edição
    openMaterialModal({
        id: materialId,
        name: materialId,
        ...material
    });
}

/**
 * Excluir material
 */
function deleteMaterial(materialId) {
    // Confirmar exclusão
    if (!confirm(`Tem certeza que deseja excluir o material "${materialId}"?`)) {
        return;
    }
    
    // Excluir material
    delete window.estimatorData.materials[materialId];
    
    // Salvar dados
    if (window.saveEstimatorData) {
        window.saveEstimatorData();
    }
    
    // Recarregar lista
    loadMaterials();
    
    // Mostrar mensagem de sucesso
    showToast('Material excluído com sucesso!', 'success');
}

/**
 * Mostrar detalhes do material
 */
function showMaterialDetails(materialId) {
    // Obter material
    const material = window.estimatorData.materials[materialId];
    if (!material) return;
    
    // Obter container de detalhes
    const detailsContainer = document.getElementById('material-details');
    if (!detailsContainer) return;
    
    // Renderizar detalhes
    detailsContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h5>${materialId}</h5>
                <p class="text-muted">${material.category ? getCategoryName(material.category) : 'Sem categoria'}</p>
            </div>
            <div class="col-md-6 text-end">
                <div class="btn-group">
                    <button class="btn btn-outline-primary btn-edit-material" data-id="${materialId}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-delete-material" data-id="${materialId}">
                        <i class="bi bi-trash"></i> Excluir
                    </button>
                </div>
            </div>
        </div>
        
        <hr>
        
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Preço</h6>
                        <p class="card-text fs-4">R$ ${material.price.toFixed(2)}</p>
                        <p class="card-text text-muted">por ${material.unit}</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Peso</h6>
                        <p class="card-text fs-4">${material.weight.toFixed(2)} kg</p>
                        <p class="card-text text-muted">por ${material.unit}</p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Densidade</h6>
                        <p class="card-text fs-4">${material.density ? material.density.toFixed(2) : 'N/A'}</p>
                        <p class="card-text text-muted">kg/m³</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <h6>Descrição</h6>
                <p>${material.description || 'Sem descrição'}</p>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-6">
                <h6>Fornecedor</h6>
                <p>${material.supplier || 'Não especificado'}</p>
            </div>
            
            <div class="col-md-6">
                <h6>Código de Referência</h6>
                <p>${material.code || 'Não especificado'}</p>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-12">
                <div class="alert ${material.custom ? 'alert-info' : 'alert-warning'} mb-0">
                    <i class="bi ${material.custom ? 'bi-person' : 'bi-shield-lock'}"></i>
                    ${material.custom ? 'Material personalizado' : 'Material padrão do sistema'}
                </div>
            </div>
        </div>
    `;
    
    // Adicionar event listeners para os botões
    detailsContainer.querySelector('.btn-edit-material')?.addEventListener('click', function() {
        editMaterial(materialId);
    });
    
    detailsContainer.querySelector('.btn-delete-material')?.addEventListener('click', function() {
        deleteMaterial(materialId);
    });
}

/**
 * Obter nome da categoria a partir do ID
 */
function getCategoryName(categoryId) {
    const categoryMap = {
        'perfis': 'Perfis Metálicos',
        'chapas': 'Chapas',
        'tubos': 'Tubos',
        'telhas': 'Telhas',
        'fixacao': 'Fixação',
        'acabamento': 'Acabamento',
        'outros': 'Outros'
    };
    
    return categoryMap[categoryId] || categoryId;
}

/**
 * Abrir modal de importação
 */
function openImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('import-modal'));
    document.getElementById('import-data').value = '';
    document.getElementById('import-replace').checked = false;
    modal.show();
}

/**
 * Importar materiais
 */
function importMaterials() {
    const format = document.getElementById('import-format').value;
    const data = document.getElementById('import-data').value;
    const replace = document.getElementById('import-replace').checked;
    
    if (!data) {
        showToast('Por favor, insira os dados para importação.', 'danger');
        return;
    }
    
    try {
        let materials;
        
        if (format === 'json') {
            // Importar de JSON
            materials = JSON.parse(data);
        } else if (format === 'csv') {
            // Importar de CSV
            materials = parseCSV(data);
        }
        
        if (!materials || typeof materials !== 'object') {
            throw new Error('Formato de dados inválido.');
        }
        
        // Aplicar importação
        if (replace) {
            // Substituir todos os materiais personalizados
            for (const [key, value] of Object.entries(window.estimatorData.materials)) {
                if (value.custom) {
                    delete window.estimatorData.materials[key];
                }
            }
        }
        
        // Adicionar novos materiais
        let importCount = 0;
        
        for (const [key, value] of Object.entries(materials)) {
            // Verificar se é um objeto válido
            if (typeof value !== 'object' || !value.price || !value.unit || !value.weight) {
                continue;
            }
            
            // Marcar como personalizado
            value.custom = true;
            
            // Adicionar ao estimatorData
            window.estimatorData.materials[key] = value;
            importCount++;
        }
        
        // Salvar dados
        if (window.saveEstimatorData) {
            window.saveEstimatorData();
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('import-modal'));
        if (modal) {
            modal.hide();
        }
        
        // Recarregar lista
        loadMaterials();
        
        // Mostrar mensagem de sucesso
        showToast(`${importCount} materiais importados com sucesso!`, 'success');
    } catch (error) {
        showToast(`Erro ao importar materiais: ${error.message}`, 'danger');
    }
}

/**
 * Exportar materiais
 */
function exportMaterials() {
    // Obter materiais personalizados
    const customMaterials = {};
    
    for (const [key, value] of Object.entries(window.estimatorData.materials)) {
        if (value.custom) {
            customMaterials[key] = value;
        }
    }
    
    // Verificar se há materiais para exportar
    if (Object.keys(customMaterials).length === 0) {
        showToast('Não há materiais personalizados para exportar.', 'warning');
        return;
    }
    
    // Converter para JSON
    const json = JSON.stringify(customMaterials, null, 2);
    
    // Criar link para download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materiais_personalizados.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Mostrar mensagem de sucesso
    showToast('Materiais exportados com sucesso!', 'success');
}

/**
 * Analisar dados CSV
 */
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Verificar headers mínimos
    const requiredHeaders = ['nome', 'preco', 'unidade', 'peso'];
    const headerMap = {};
    
    requiredHeaders.forEach(required => {
        const index = headers.findIndex(header => 
            header.toLowerCase().includes(required) || 
            header.toLowerCase().replace(/[çã]/g, 'ca').includes(required));
        
        if (index === -1) {
            throw new Error(`Cabeçalho "${required}" não encontrado.`);
        }
        
        headerMap[required] = index;
    });
    
    // Mapear outros headers
    const optionalHeaders = ['categoria', 'descricao', 'fornecedor', 'codigo', 'densidade'];
    optionalHeaders.forEach(optional => {
        const index = headers.findIndex(header => 
            header.toLowerCase().includes(optional) || 
            header.toLowerCase().replace(/[çãéí]/g, match => {
                if (match === 'ç') return 'c';
                if (match === 'ã') return 'a';
                if (match === 'é') return 'e';
                if (match === 'í') return 'i';
                return match;
            }).includes(optional));
        
        headerMap[optional] = index;
    });
    
    // Processar linhas
    const materials = {};
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(value => value.trim());
        
        // Obter valores
        const name = values[headerMap.nome];
        if (!name) continue;
        
        const price = parseFloat(values[headerMap.preco]);
        const unit = values[headerMap.unidade];
        const weight = parseFloat(values[headerMap.peso]);
        
        // Verificar valores obrigatórios
        if (isNaN(price) || !unit || isNaN(weight)) continue;
        
        // Criar material
        const material = {
            price,
            unit,
            weight,
            custom: true
        };
        
        // Adicionar campos opcionais
        if (headerMap.categoria !== -1 && values[headerMap.categoria]) {
            material.category = values[headerMap.categoria];
        }
        
        if (headerMap.descricao !== -1 && values[headerMap.descricao]) {
            material.description = values[headerMap.descricao];
        }
        
        if (headerMap.fornecedor !== -1 && values[headerMap.fornecedor]) {
            material.supplier = values[headerMap.fornecedor];
        }
        
        if (headerMap.codigo !== -1 && values[headerMap.codigo]) {
            material.code = values[headerMap.codigo];
        }
        
        if (headerMap.densidade !== -1 && values[headerMap.densidade]) {
            const density = parseFloat(values[headerMap.densidade]);
            if (!isNaN(density)) {
                material.density = density;
            }
        }
        
        // Adicionar ao resultado
        materials[name] = material;
    }
    
    return materials;
}

/**
 * Mostrar mensagem toast
 */
function showToast(message, type = 'info') {
    // Verificar se o container de toasts existe
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        // Criar container
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Criar toast
    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
    `;
    
    // Adicionar ao container
    toastContainer.appendChild(toast);
    
    // Inicializar e mostrar
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
    
    // Remover após ocultar
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Exportar funções para uso global
window.showMaterialsModule = showMaterialsModule;
window.loadMaterials = loadMaterials;
window.openMaterialModal = openMaterialModal;
window.saveMaterial = saveMaterial;
window.deleteMaterial = deleteMaterial;
