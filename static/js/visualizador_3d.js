// Visualizador 3D de Projetos para Serralheria
// Este módulo permite visualizar projetos de serralheria em 3D

// Importar bibliotecas necessárias (Three.js)
document.addEventListener('DOMContentLoaded', function() {
    // Carregar Three.js dinamicamente
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js';
    document.head.appendChild(threeScript);
    
    // Carregar OrbitControls para Three.js
    const orbitControlsScript = document.createElement('script');
    orbitControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/controls/OrbitControls.js';
    
    // Inicializar o módulo quando o Three.js estiver carregado
    threeScript.onload = function() {
        document.head.appendChild(orbitControlsScript);
        orbitControlsScript.onload = function() {
            // Carregar GLTFLoader para importar modelos 3D
            const gltfLoaderScript = document.createElement('script');
            gltfLoaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/loaders/GLTFLoader.js';
            document.head.appendChild(gltfLoaderScript);
            
            gltfLoaderScript.onload = function() {
                initVisualizador3D();
            };
        };
    };
});

// Variáveis globais
let scene, camera, renderer, controls;
let currentModel = null;
let modelLibrary = {};
let container3D = null;

// Função principal de inicialização
function initVisualizador3D() {
    // Criar container para o visualizador 3D se não existir
    createVisualizador3DContainer();
    
    // Inicializar a biblioteca de modelos 3D
    initModelLibrary();
    
    // Configurar listeners de eventos
    setupVisualizador3DEventListeners();
}

// Criar container para o visualizador 3D
function createVisualizador3DContainer() {
    // Verificar se o container já existe
    container3D = document.getElementById('visualizador-3d-container');
    if (container3D) return;
    
    // Criar container principal
    const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container');
    if (!mainContainer) return;
    
    container3D = document.createElement('div');
    container3D.id = 'visualizador-3d-container';
    container3D.className = 'module-container';
    container3D.style.display = 'none';
    
    // Adicionar HTML para o visualizador 3D
    container3D.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-8">
                <h4 class="mb-3"><i class="bi bi-cube"></i> Visualizador 3D de Projetos</h4>
            </div>
            <div class="col-md-4 text-end">
                <div class="btn-group">
                    <button id="btn-export-3d-pdf" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-file-pdf"></i> Exportar PDF
                    </button>
                    <button id="btn-share-3d-model" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-share"></i> Compartilhar
                    </button>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-9">
                <div class="card mb-4">
                    <div class="card-body p-0">
                        <div id="canvas-container" style="height: 500px; position: relative;">
                            <div id="loading-3d" class="position-absolute top-50 start-50 translate-middle" style="display: none;">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Carregando...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="btn-group">
                                    <button id="btn-rotate-view" class="btn btn-sm btn-outline-primary active">
                                        <i class="bi bi-arrows-move"></i> Rotacionar
                                    </button>
                                    <button id="btn-pan-view" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-hand-index"></i> Mover
                                    </button>
                                    <button id="btn-zoom-view" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-zoom-in"></i> Zoom
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-6 text-end">
                                <div class="btn-group">
                                    <button id="btn-reset-view" class="btn btn-sm btn-outline-secondary">
                                        <i class="bi bi-arrow-counterclockwise"></i> Resetar
                                    </button>
                                    <button id="btn-fullscreen" class="btn btn-sm btn-outline-secondary">
                                        <i class="bi bi-fullscreen"></i> Tela Cheia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Modelos</h5>
                    </div>
                    <div class="card-body">
                        <div class="list-group" id="model-list">
                            <button class="list-group-item list-group-item-action" data-model="portao-basculante">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">Portão Basculante</h6>
                                </div>
                                <small class="text-muted">Modelo 3D completo</small>
                            </button>
                            <button class="list-group-item list-group-item-action" data-model="portao-deslizante">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">Portão Deslizante</h6>
                                </div>
                                <small class="text-muted">Modelo 3D completo</small>
                            </button>
                            <button class="list-group-item list-group-item-action" data-model="escada-metalica">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">Escada Metálica</h6>
                                </div>
                                <small class="text-muted">Modelo 3D completo</small>
                            </button>
                            <button class="list-group-item list-group-item-action" data-model="guarda-corpo">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">Guarda-corpo</h6>
                                </div>
                                <small class="text-muted">Modelo 3D completo</small>
                            </button>
                            <button class="list-group-item list-group-item-action" data-model="mezanino">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">Mezanino</h6>
                                </div>
                                <small class="text-muted">Modelo 3D completo</small>
                            </button>
                            <button class="list-group-item list-group-item-action" data-model="cobertura">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-1">Cobertura Metálica</h6>
                                </div>
                                <small class="text-muted">Modelo 3D completo</small>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Propriedades</h5>
                    </div>
                    <div class="card-body">
                        <div id="model-properties">
                            <p class="text-muted text-center">Selecione um modelo para ver suas propriedades</p>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Materiais</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="material-select" class="form-label">Material Principal</label>
                            <select class="form-select" id="material-select">
                                <option value="metalon">Metalon</option>
                                <option value="tubo-redondo">Tubo Redondo</option>
                                <option value="cantoneira">Cantoneira</option>
                                <option value="perfil-u">Perfil U</option>
                                <option value="chapa">Chapa</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="color-select" class="form-label">Cor</label>
                            <select class="form-select" id="color-select">
                                <option value="preto">Preto</option>
                                <option value="branco">Branco</option>
                                <option value="cinza">Cinza</option>
                                <option value="marrom">Marrom</option>
                                <option value="personalizado">Personalizado</option>
                            </select>
                        </div>
                        <div class="mb-3" id="custom-color-container" style="display: none;">
                            <label for="custom-color" class="form-label">Cor Personalizada</label>
                            <input type="color" class="form-control form-control-color" id="custom-color" value="#563d7c">
                        </div>
                        <button id="btn-apply-material" class="btn btn-primary w-100">
                            Aplicar Material
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mainContainer.appendChild(container3D);
    
    // Adicionar link de navegação para o visualizador 3D
    addVisualizador3DNavLink();
}

// Adicionar link de navegação para o visualizador 3D
function addVisualizador3DNavLink() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Verificar se o link já existe
    if (document.getElementById('nav-visualizador-3d')) return;
    
    // Criar link para o módulo de visualizador 3D
    const visualizador3DLink = document.createElement('li');
    visualizador3DLink.className = 'nav-item';
    visualizador3DLink.id = 'nav-visualizador-3d';
    visualizador3DLink.innerHTML = `
        <a class="nav-link" href="#" data-module="visualizador-3d">
            <i class="bi bi-cube"></i> Visualizador 3D
        </a>
    `;
    
    // Adicionar link ao menu de navegação
    navbarNav.appendChild(visualizador3DLink);
    
    // Adicionar event listener para o link
    visualizador3DLink.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showVisualizador3D();
    });
}

// Mostrar o visualizador 3D
function showVisualizador3D() {
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
    
    // Mostrar container do visualizador 3D
    if (container3D) {
        container3D.style.display = 'block';
        
        // Inicializar a cena 3D se ainda não foi inicializada
        if (!scene) {
            initScene();
        }
    }
    
    // Atualizar links ativos no menu de navegação
    updateActiveNavLinks('visualizador-3d');
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

// Inicializar a biblioteca de modelos 3D
function initModelLibrary() {
    // Definir modelos 3D básicos para demonstração
    // Em um ambiente de produção, estes seriam carregados de um servidor
    modelLibrary = {
        'portao-basculante': {
            name: 'Portão Basculante',
            description: 'Portão basculante para garagem residencial',
            dimensions: { width: 3.0, height: 2.1, depth: 0.1 },
            materials: ['Metalon 30x30', 'Chapa #18'],
            createModel: createPortaoBasculante,
            properties: {
                'Largura': '3.0 metros',
                'Altura': '2.1 metros',
                'Material': 'Metalon 30x30',
                'Fechamento': 'Chapa #18',
                'Acabamento': 'Pintura eletrostática',
                'Automação': 'Compatível'
            }
        },
        'portao-deslizante': {
            name: 'Portão Deslizante',
            description: 'Portão deslizante para entrada de residência',
            dimensions: { width: 4.0, height: 1.8, depth: 0.05 },
            materials: ['Metalon 30x30', 'Tubo Redondo 1"'],
            createModel: createPortaoDeslizante,
            properties: {
                'Largura': '4.0 metros',
                'Altura': '1.8 metros',
                'Material': 'Metalon 30x30',
                'Detalhes': 'Tubo Redondo 1"',
                'Acabamento': 'Pintura eletrostática',
                'Automação': 'Compatível'
            }
        },
        'escada-metalica': {
            name: 'Escada Metálica',
            description: 'Escada metálica com degraus em chapa xadrez',
            dimensions: { width: 1.0, height: 3.0, depth: 2.5 },
            materials: ['Perfil U 100x40', 'Chapa Xadrez 1/8"'],
            createModel: createEscadaMetalica,
            properties: {
                'Largura': '1.0 metro',
                'Altura': '3.0 metros',
                'Comprimento': '2.5 metros',
                'Material Estrutura': 'Perfil U 100x40',
                'Material Degraus': 'Chapa Xadrez 1/8"',
                'Acabamento': 'Pintura eletrostática',
                'Corrimão': 'Tubo Redondo 1.1/2"'
            }
        },
        'guarda-corpo': {
            name: 'Guarda-corpo',
            description: 'Guarda-corpo em aço inox para sacada',
            dimensions: { width: 3.0, height: 1.1, depth: 0.05 },
            materials: ['Tubo Inox 2"', 'Vidro Temperado 8mm'],
            createModel: createGuardaCorpo,
            properties: {
                'Comprimento': '3.0 metros',
                'Altura': '1.1 metros',
                'Material': 'Tubo Inox 2"',
                'Fechamento': 'Vidro Temperado 8mm',
                'Acabamento': 'Polido',
                'Fixação': 'Aparafusada'
            }
        },
        'mezanino': {
            name: 'Mezanino',
            description: 'Estrutura metálica para mezanino comercial',
            dimensions: { width: 6.0, height: 3.0, depth: 4.0 },
            materials: ['Perfil I 150x15', 'Chapa Xadrez 3/16"'],
            createModel: createMezanino,
            properties: {
                'Largura': '6.0 metros',
                'Comprimento': '4.0 metros',
                'Altura': '3.0 metros',
                'Material Estrutura': 'Perfil I 150x15',
                'Material Piso': 'Chapa Xadrez 3/16"',
                'Capacidade': '500 kg/m²',
                'Acabamento': 'Pintura eletrostática'
            }
        },
        'cobertura': {
            name: 'Cobertura Metálica',
            description: 'Cobertura metálica com telhas galvanizadas',
            dimensions: { width: 5.0, height: 1.5, depth: 3.0 },
            materials: ['Metalon 40x60', 'Telha Galvanizada'],
            createModel: createCobertura,
            properties: {
                'Largura': '5.0 metros',
                'Comprimento': '3.0 metros',
                'Altura': '1.5 metros',
                'Material Estrutura': 'Metalon 40x60',
                'Material Cobertura': 'Telha Galvanizada',
                'Inclinação': '10%',
                'Acabamento': 'Pintura eletrostática'
            }
        }
    };
}

// Configurar listeners de eventos
function setupVisualizador3DEventListeners() {
    document.addEventListener('click', function(e) {
        // Botões de controle de visualização
        if (e.target && e.target.id === 'btn-rotate-view') {
            setControlMode('rotate');
        }
        if (e.target && e.target.id === 'btn-pan-view') {
            setControlMode('pan');
        }
        if (e.target && e.target.id === 'btn-zoom-view') {
            setControlMode('zoom');
        }
        if (e.target && e.target.id === 'btn-reset-view') {
            resetView();
        }
        if (e.target && e.target.id === 'btn-fullscreen') {
            toggleFullscreen();
        }
        
        // Botões de exportação e compartilhamento
        if (e.target && e.target.id === 'btn-export-3d-pdf') {
            exportToPDF();
        }
        if (e.target && e.target.id === 'btn-share-3d-model') {
            shareModel();
        }
        
        // Seleção de modelo
        if (e.target && e.target.closest('.list-group-item[data-model]')) {
            const modelId = e.target.closest('.list-group-item[data-model]').getAttribute('data-model');
            loadModel(modelId);
        }
        
        // Aplicar material
        if (e.target && e.target.id === 'btn-apply-material') {
            applyMaterial();
        }
    });
    
    // Listener para seleção de cor personalizada
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'color-select') {
            const customColorContainer = document.getElementById('custom-color-container');
            if (customColorContainer) {
                customColorContainer.style.display = e.target.value === 'personalizado' ? 'block' : 'none';
            }
        }
    });
}

// Inicializar a cena 3D
function initScene() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;
    
    // Criar cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Criar câmera
    camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Criar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.shadowMap.enabled = true;
    
    // Limpar o container e adicionar o canvas
    while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
    }
    canvasContainer.appendChild(renderer.domElement);
    
    // Adicionar controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Adicionar luzes
    addLights();
    
    // Adicionar grid de referência
    addGrid();
    
    // Iniciar animação
    animate();
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', onWindowResize);
}

// Adicionar luzes à cena
function addLights() {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direcional principal (simula o sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    
    // Configurar sombras
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    scene.add(directionalLight);
    
    // Luz de preenchimento (para suavizar sombras)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -7.5);
    scene.add(fillLight);
}

// Adicionar grid de referência
function addGrid() {
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);
}

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    
    // Atualizar controles
    if (controls) controls.update();
    
    // Renderizar cena
    if (renderer && scene && camera) renderer.render(scene, camera);
}

// Ajustar tamanho do renderer quando a janela é redimensionada
function onWindowResize() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer || !camera || !renderer) return;
    
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

// Definir modo de controle da câmera
function setControlMode(mode) {
    if (!controls) return;
    
    // Resetar todos os botões
    document.querySelectorAll('#btn-rotate-view, #btn-pan-view, #btn-zoom-view').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ativar o botão correspondente
    const btnId = `btn-${mode}-view`;
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add('active');
    
    // Configurar controles
    if (mode === 'rotate') {
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.enableZoom = false;
    } else if (mode === 'pan') {
        controls.enableRotate = false;
        controls.enablePan = true;
        controls.enableZoom = false;
    } else if (mode === 'zoom') {
        controls.enableRotate = false;
        controls.enablePan = false;
        controls.enableZoom = true;
    }
}

// Resetar visualização
function resetView() {
    if (!controls || !camera) return;
    
    // Resetar posição da câmera
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);
    
    // Resetar controles
    controls.reset();
}

// Alternar modo tela cheia
function toggleFullscreen() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;
    
    if (!document.fullscreenElement) {
        canvasContainer.requestFullscreen().catch(err => {
            alert(`Erro ao entrar em modo tela cheia: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Exportar para PDF
function exportToPDF() {
    alert('Exportação para PDF será implementada em breve.');
}

// Compartilhar modelo
function shareModel() {
    alert('Compartilhamento de modelo será implementado em breve.');
}

// Carregar modelo 3D
function loadModel(modelId) {
    if (!scene || !modelLibrary[modelId]) return;
    
    // Mostrar indicador de carregamento
    const loading = document.getElementById('loading-3d');
    if (loading) loading.style.display = 'block';
    
    // Remover modelo atual se existir
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    
    // Criar novo modelo
    const modelInfo = modelLibrary[modelId];
    currentModel = modelInfo.createModel();
    scene.add(currentModel);
    
    // Atualizar propriedades do modelo
    updateModelProperties(modelId);
    
    // Ajustar câmera para enquadrar o modelo
    fitCameraToModel(currentModel);
    
    // Ocultar indicador de carregamento
    if (loading) loading.style.display = 'none';
    
    // Destacar o modelo selecionado na lista
    document.querySelectorAll('.list-group-item[data-model]').forEach(item => {
        item.classList.remove('active');
    });
    const selectedItem = document.querySelector(`.list-group-item[data-model="${modelId}"]`);
    if (selectedItem) selectedItem.classList.add('active');
}

// Atualizar propriedades do modelo
function updateModelProperties(modelId) {
    const propertiesContainer = document.getElementById('model-properties');
    if (!propertiesContainer || !modelLibrary[modelId]) return;
    
    const modelInfo = modelLibrary[modelId];
    
    let html = `
        <h6 class="mb-3">${modelInfo.name}</h6>
        <p class="text-muted mb-3">${modelInfo.description}</p>
        <div class="table-responsive">
            <table class="table table-sm">
                <tbody>
    `;
    
    // Adicionar propriedades do modelo
    for (const [key, value] of Object.entries(modelInfo.properties)) {
        html += `
            <tr>
                <td class="fw-bold">${key}</td>
                <td>${value}</td>
            </tr>
        `;
    }
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    propertiesContainer.innerHTML = html;
}

// Ajustar câmera para enquadrar o modelo
function fitCameraToModel(model) {
    if (!model || !camera || !controls) return;
    
    // Calcular bounding box do modelo
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Calcular distância para enquadrar o modelo
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    
    // Ajustar para garantir que o modelo seja visível
    cameraZ *= 1.5;
    
    // Posicionar câmera
    camera.position.set(center.x, center.y + maxDim * 0.5, center.z + cameraZ);
    camera.lookAt(center);
    
    // Atualizar controles
    controls.target.copy(center);
    controls.update();
}

// Aplicar material ao modelo
function applyMaterial() {
    if (!currentModel) {
        alert('Selecione um modelo primeiro.');
        return;
    }
    
    const materialSelect = document.getElementById('material-select');
    const colorSelect = document.getElementById('color-select');
    const customColor = document.getElementById('custom-color');
    
    if (!materialSelect || !colorSelect) return;
    
    const material = materialSelect.value;
    const colorOption = colorSelect.value;
    
    // Determinar a cor a ser aplicada
    let color;
    if (colorOption === 'personalizado' && customColor) {
        color = customColor.value;
    } else {
        const colorMap = {
            'preto': 0x000000,
            'branco': 0xffffff,
            'cinza': 0x888888,
            'marrom': 0x8B4513
        };
        color = colorMap[colorOption] || 0x888888;
    }
    
    // Aplicar material ao modelo
    applyMaterialToModel(currentModel, material, color);
}

// Aplicar material ao modelo
function applyMaterialToModel(model, materialType, color) {
    if (!model) return;
    
    // Converter cor para formato THREE.js
    const threeColor = new THREE.Color(color);
    
    // Criar material baseado no tipo selecionado
    let material;
    switch (materialType) {
        case 'metalon':
            material = new THREE.MeshStandardMaterial({
                color: threeColor,
                metalness: 0.7,
                roughness: 0.3
            });
            break;
        case 'tubo-redondo':
            material = new THREE.MeshStandardMaterial({
                color: threeColor,
                metalness: 0.8,
                roughness: 0.2
            });
            break;
        case 'cantoneira':
            material = new THREE.MeshStandardMaterial({
                color: threeColor,
                metalness: 0.6,
                roughness: 0.4
            });
            break;
        case 'perfil-u':
            material = new THREE.MeshStandardMaterial({
                color: threeColor,
                metalness: 0.7,
                roughness: 0.3
            });
            break;
        case 'chapa':
            material = new THREE.MeshStandardMaterial({
                color: threeColor,
                metalness: 0.5,
                roughness: 0.5
            });
            break;
        default:
            material = new THREE.MeshStandardMaterial({
                color: threeColor,
                metalness: 0.6,
                roughness: 0.4
            });
    }
    
    // Aplicar material a todos os objetos do modelo
    model.traverse(function(child) {
        if (child.isMesh) {
            child.material = material;
        }
    });
}

// Funções para criar modelos 3D básicos
// Em um ambiente de produção, estes seriam carregados de arquivos GLTF/GLB

// Criar modelo de portão basculante
function createPortaoBasculante() {
    const group = new THREE.Group();
    
    // Estrutura principal
    const frame = new THREE.BoxGeometry(3.0, 2.1, 0.05);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.3
    });
    const frameMesh = new THREE.Mesh(frame, frameMaterial);
    group.add(frameMesh);
    
    // Detalhes horizontais
    for (let i = 0; i < 3; i++) {
        const detail = new THREE.BoxGeometry(2.8, 0.05, 0.07);
        const detailMesh = new THREE.Mesh(detail, frameMaterial);
        detailMesh.position.y = -0.5 + i * 0.5;
        detailMesh.position.z = 0.01;
        group.add(detailMesh);
    }
    
    // Detalhes verticais
    for (let i = 0; i < 4; i++) {
        const detail = new THREE.BoxGeometry(0.05, 2.0, 0.07);
        const detailMesh = new THREE.Mesh(detail, frameMaterial);
        detailMesh.position.x = -1.2 + i * 0.8;
        detailMesh.position.z = 0.01;
        group.add(detailMesh);
    }
    
    // Posicionar o grupo
    group.position.y = 1.05;
    
    return group;
}

// Criar modelo de portão deslizante
function createPortaoDeslizante() {
    const group = new THREE.Group();
    
    // Estrutura principal
    const frame = new THREE.BoxGeometry(4.0, 1.8, 0.05);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.3
    });
    const frameMesh = new THREE.Mesh(frame, frameMaterial);
    group.add(frameMesh);
    
    // Barras verticais
    const barMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.2
    });
    
    for (let i = 0; i < 20; i++) {
        const bar = new THREE.CylinderGeometry(0.01, 0.01, 1.7, 8);
        const barMesh = new THREE.Mesh(bar, barMaterial);
        barMesh.position.x = -1.9 + i * 0.2;
        barMesh.position.z = 0.03;
        barMesh.rotation.x = Math.PI / 2;
        group.add(barMesh);
    }
    
    // Trilho
    const rail = new THREE.BoxGeometry(4.5, 0.05, 0.1);
    const railMesh = new THREE.Mesh(rail, frameMaterial);
    railMesh.position.y = -0.925;
    railMesh.position.z = -0.05;
    group.add(railMesh);
    
    // Posicionar o grupo
    group.position.y = 0.9;
    
    return group;
}

// Criar modelo de escada metálica
function createEscadaMetalica() {
    const group = new THREE.Group();
    
    // Materiais
    const structureMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.7,
        roughness: 0.3
    });
    
    const stepMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.6,
        roughness: 0.5
    });
    
    // Estrutura lateral esquerda
    const leftBeam = new THREE.BoxGeometry(0.1, 3.0, 0.05);
    const leftBeamMesh = new THREE.Mesh(leftBeam, structureMaterial);
    leftBeamMesh.position.x = -0.45;
    leftBeamMesh.position.y = 1.5;
    leftBeamMesh.rotation.x = Math.PI / 6; // Inclinação da escada
    group.add(leftBeamMesh);
    
    // Estrutura lateral direita
    const rightBeam = new THREE.BoxGeometry(0.1, 3.0, 0.05);
    const rightBeamMesh = new THREE.Mesh(rightBeam, structureMaterial);
    rightBeamMesh.position.x = 0.45;
    rightBeamMesh.position.y = 1.5;
    rightBeamMesh.rotation.x = Math.PI / 6; // Inclinação da escada
    group.add(rightBeamMesh);
    
    // Degraus
    const stepCount = 10;
    const stepWidth = 1.0;
    const stepDepth = 0.25;
    const stepThickness = 0.05;
    
    for (let i = 0; i < stepCount; i++) {
        const step = new THREE.BoxGeometry(stepWidth, stepThickness, stepDepth);
        const stepMesh = new THREE.Mesh(step, stepMaterial);
        
        // Posicionar degrau na escada inclinada
        const angle = Math.PI / 6; // Mesmo ângulo da inclinação
        const yOffset = i * (3.0 / stepCount);
        
        stepMesh.position.y = yOffset;
        stepMesh.position.z = yOffset * Math.tan(angle);
        stepMesh.rotation.x = angle;
        
        group.add(stepMesh);
    }
    
    // Corrimão
    const handrailMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Corrimão esquerdo
    const leftHandrail = new THREE.CylinderGeometry(0.02, 0.02, 3.2, 8);
    const leftHandrailMesh = new THREE.Mesh(leftHandrail, handrailMaterial);
    leftHandrailMesh.position.x = -0.45;
    leftHandrailMesh.position.y = 1.5;
    leftHandrailMesh.position.z = 0.5;
    leftHandrailMesh.rotation.x = Math.PI / 6;
    group.add(leftHandrailMesh);
    
    // Corrimão direito
    const rightHandrail = new THREE.CylinderGeometry(0.02, 0.02, 3.2, 8);
    const rightHandrailMesh = new THREE.Mesh(rightHandrail, handrailMaterial);
    rightHandrailMesh.position.x = 0.45;
    rightHandrailMesh.position.y = 1.5;
    rightHandrailMesh.position.z = 0.5;
    rightHandrailMesh.rotation.x = Math.PI / 6;
    group.add(rightHandrailMesh);
    
    // Posicionar o grupo
    group.position.z = -1.25;
    
    return group;
}

// Criar modelo de guarda-corpo
function createGuardaCorpo() {
    const group = new THREE.Group();
    
    // Materiais
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        metalness: 0.9,
        roughness: 0.1
    });
    
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xAAAAAA,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.9,
        transparent: true
    });
    
    // Estrutura horizontal superior
    const topRail = new THREE.CylinderGeometry(0.025, 0.025, 3.0, 8);
    const topRailMesh = new THREE.Mesh(topRail, frameMaterial);
    topRailMesh.position.y = 1.1;
    topRailMesh.rotation.z = Math.PI / 2;
    group.add(topRailMesh);
    
    // Estrutura horizontal inferior
    const bottomRail = new THREE.CylinderGeometry(0.025, 0.025, 3.0, 8);
    const bottomRailMesh = new THREE.Mesh(bottomRail, frameMaterial);
    bottomRailMesh.position.y = 0.05;
    bottomRailMesh.rotation.z = Math.PI / 2;
    group.add(bottomRailMesh);
    
    // Montantes verticais
    for (let i = 0; i < 4; i++) {
        const post = new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8);
        const postMesh = new THREE.Mesh(post, frameMaterial);
        postMesh.position.x = -1.5 + i * 1.0;
        postMesh.position.y = 0.55;
        group.add(postMesh);
    }
    
    // Painéis de vidro
    for (let i = 0; i < 3; i++) {
        const glass = new THREE.BoxGeometry(0.95, 1.0, 0.01);
        const glassMesh = new THREE.Mesh(glass, glassMaterial);
        glassMesh.position.x = -1.0 + i * 1.0;
        glassMesh.position.y = 0.55;
        group.add(glassMesh);
    }
    
    // Posicionar o grupo
    group.position.y = 0.0;
    
    return group;
}

// Criar modelo de mezanino
function createMezanino() {
    const group = new THREE.Group();
    
    // Materiais
    const structureMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.7,
        roughness: 0.3
    });
    
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.6,
        roughness: 0.5
    });
    
    // Piso
    const floor = new THREE.BoxGeometry(6.0, 0.1, 4.0);
    const floorMesh = new THREE.Mesh(floor, floorMaterial);
    floorMesh.position.y = 3.0;
    group.add(floorMesh);
    
    // Colunas
    const columnPositions = [
        [-2.9, 0, -1.9],
        [-2.9, 0, 1.9],
        [2.9, 0, -1.9],
        [2.9, 0, 1.9]
    ];
    
    columnPositions.forEach(pos => {
        const column = new THREE.BoxGeometry(0.2, 3.0, 0.2);
        const columnMesh = new THREE.Mesh(column, structureMaterial);
        columnMesh.position.set(pos[0], 1.5, pos[2]);
        group.add(columnMesh);
    });
    
    // Vigas principais
    const mainBeamPositions = [
        [-2.9, 3.0, 0, 0, 0, 4.0],
        [2.9, 3.0, 0, 0, 0, 4.0],
        [0, 3.0, -1.9, 6.0, 0, 0],
        [0, 3.0, 1.9, 6.0, 0, 0]
    ];
    
    mainBeamPositions.forEach(pos => {
        const beam = new THREE.BoxGeometry(pos[3] || 0.2, 0.2, pos[5] || 0.2);
        const beamMesh = new THREE.Mesh(beam, structureMaterial);
        beamMesh.position.set(pos[0], pos[1], pos[2]);
        group.add(beamMesh);
    });
    
    // Vigas secundárias
    for (let i = -2; i <= 2; i++) {
        const beam = new THREE.BoxGeometry(0.1, 0.15, 3.6);
        const beamMesh = new THREE.Mesh(beam, structureMaterial);
        beamMesh.position.set(i * 1.0, 2.95, 0);
        group.add(beamMesh);
    }
    
    // Escada (simplificada)
    const stairGroup = createEscadaMetalica();
    stairGroup.scale.set(1.2, 1.0, 1.2);
    stairGroup.position.set(-2.0, 0, 0);
    group.add(stairGroup);
    
    // Guarda-corpo
    const railingGroup = createGuardaCorpo();
    railingGroup.scale.set(2.0, 1.0, 1.0);
    railingGroup.position.set(0, 3.0, 1.95);
    group.add(railingGroup);
    
    const railingGroup2 = createGuardaCorpo();
    railingGroup2.scale.set(1.33, 1.0, 1.0);
    railingGroup2.position.set(2.35, 3.0, 0);
    railingGroup2.rotation.y = Math.PI / 2;
    group.add(railingGroup2);
    
    // Posicionar o grupo
    group.position.y = 0.0;
    
    return group;
}

// Criar modelo de cobertura
function createCobertura() {
    const group = new THREE.Group();
    
    // Materiais
    const structureMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.7,
        roughness: 0.3
    });
    
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x999999,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Colunas
    const columnPositions = [
        [-2.4, 0, -1.4],
        [-2.4, 0, 1.4],
        [2.4, 0, -1.4],
        [2.4, 0, 1.4]
    ];
    
    columnPositions.forEach(pos => {
        const column = new THREE.BoxGeometry(0.1, 3.0, 0.1);
        const columnMesh = new THREE.Mesh(column, structureMaterial);
        columnMesh.position.set(pos[0], 1.5, pos[2]);
        group.add(columnMesh);
    });
    
    // Vigas principais
    const mainBeamPositions = [
        [-2.4, 3.0, 0, 0, 0, 3.0],
        [2.4, 3.0, 0, 0, 0, 3.0],
        [0, 3.0, -1.4, 5.0, 0, 0],
        [0, 3.0, 1.4, 5.0, 0, 0]
    ];
    
    mainBeamPositions.forEach(pos => {
        const beam = new THREE.BoxGeometry(pos[3] || 0.1, 0.15, pos[5] || 0.1);
        const beamMesh = new THREE.Mesh(beam, structureMaterial);
        beamMesh.position.set(pos[0], pos[1], pos[2]);
        group.add(beamMesh);
    });
    
    // Vigas de inclinação
    const slopeBeamPositions = [
        [-2.4, 3.0, 0],
        [2.4, 3.0, 0]
    ];
    
    slopeBeamPositions.forEach(pos => {
        const beam = new THREE.BoxGeometry(0.1, 0.15, 3.0);
        const beamMesh = new THREE.Mesh(beam, structureMaterial);
        beamMesh.position.set(pos[0], pos[1], pos[2]);
        beamMesh.rotation.x = Math.atan(0.3);
        group.add(beamMesh);
    });
    
    // Telhas
    const roof = new THREE.BoxGeometry(5.0, 0.02, 3.2);
    const roofMesh = new THREE.Mesh(roof, roofMaterial);
    roofMesh.position.y = 3.3;
    roofMesh.rotation.x = Math.atan(0.3);
    group.add(roofMesh);
    
    // Posicionar o grupo
    group.position.y = 0.0;
    
    return group;
}

// Exportar funções para uso em outros módulos
window.visualizador3D = {
    init: initVisualizador3D,
    show: showVisualizador3D
};
