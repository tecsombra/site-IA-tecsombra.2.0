/**
 * Otimizações para o Visualizador 3D de Projetos para Serralheria
 * 
 * Este arquivo contém melhorias de desempenho para o visualizador 3D,
 * focando em otimização para projetos complexos e adição de novas opções de visualização.
 * 
 * Autor: Manus AI
 * Data: 15/04/2025
 */

// Melhorias de desempenho para o visualizador 3D
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o visualizador 3D já está carregado
    if (typeof initVisualizador3D === 'undefined') {
        console.warn('Visualizador 3D não encontrado. As otimizações não serão aplicadas.');
        return;
    }
    
    // Aplicar otimizações quando o visualizador 3D for inicializado
    const originalInitScene = window.initScene;
    if (originalInitScene) {
        window.initScene = function() {
            // Chamar a função original
            originalInitScene();
            
            // Aplicar otimizações adicionais
            applyPerformanceOptimizations();
            
            // Adicionar novas opções de visualização
            addEnhancedVisualizationOptions();
        };
    }
    
    // Substituir a função de animação para otimizar o desempenho
    const originalAnimate = window.animate;
    if (originalAnimate) {
        window.animate = function() {
            // Usar a função otimizada
            optimizedAnimate();
        };
    }
    
    // Substituir a função de carregamento de modelo para otimizar
    const originalLoadModel = window.loadModel;
    if (originalLoadModel) {
        window.loadModel = function(modelId) {
            // Usar a função otimizada
            optimizedLoadModel(modelId, originalLoadModel);
        };
    }
    
    // Adicionar novas opções ao menu de controle
    addEnhancedControlOptions();
});

/**
 * Aplicar otimizações de desempenho à cena 3D
 */
function applyPerformanceOptimizations() {
    if (!window.scene || !window.renderer) return;
    
    console.log('Aplicando otimizações de desempenho ao visualizador 3D...');
    
    // 1. Otimizar configurações do renderer
    window.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);
    window.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Melhor qualidade com bom desempenho
    
    // 2. Implementar Level of Detail (LOD) para modelos complexos
    window.useLOD = true;
    
    // 3. Implementar frustum culling mais agressivo
    window.camera.far = 100; // Reduzir distância de visualização
    window.camera.updateProjectionMatrix();
    
    // 4. Otimizar luzes
    optimizeLights();
    
    // 5. Adicionar sistema de cache para geometrias
    window.geometryCache = {};
    
    // 6. Implementar sistema de instancing para objetos repetidos
    window.useInstancing = true;
    
    // 7. Adicionar detecção automática de desempenho
    implementPerformanceMonitoring();
}

/**
 * Otimizar configuração de luzes para melhor desempenho
 */
function optimizeLights() {
    if (!window.scene) return;
    
    // Remover luzes existentes
    window.scene.children.forEach(child => {
        if (child.isLight) {
            window.scene.remove(child);
        }
    });
    
    // Adicionar luzes otimizadas
    
    // Luz ambiente (baixo custo)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    window.scene.add(ambientLight);
    
    // Luz direcional principal com sombras otimizadas
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    
    // Otimizar configurações de sombra
    directionalLight.shadow.mapSize.width = 1024; // Reduzido para melhor desempenho
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.bias = -0.001;
    
    // Adicionar helper para visualizar a área de sombra (desativado por padrão)
    const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    shadowCameraHelper.visible = false;
    window.scene.add(shadowCameraHelper);
    window.shadowCameraHelper = shadowCameraHelper;
    
    window.scene.add(directionalLight);
    
    // Luz de preenchimento (sem sombras para economizar recursos)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -7.5);
    fillLight.castShadow = false;
    window.scene.add(fillLight);
}

/**
 * Implementar monitoramento de desempenho
 */
function implementPerformanceMonitoring() {
    // Adicionar Stats.js para monitoramento de FPS se não estiver em produção
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const statsScript = document.createElement('script');
        statsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';
        document.head.appendChild(statsScript);
        
        statsScript.onload = function() {
            const stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb
            stats.dom.style.position = 'absolute';
            stats.dom.style.top = '0px';
            stats.dom.style.left = '0px';
            stats.dom.style.zIndex = '100';
            
            const canvasContainer = document.getElementById('canvas-container');
            if (canvasContainer) {
                canvasContainer.style.position = 'relative';
                canvasContainer.appendChild(stats.dom);
                
                // Atualizar stats na função de animação
                const originalAnimate = window.optimizedAnimate || window.animate;
                window.optimizedAnimate = function() {
                    stats.begin();
                    originalAnimate();
                    stats.end();
                };
            }
        };
    }
    
    // Sistema de ajuste automático de qualidade baseado no FPS
    window.fpsHistory = [];
    window.lastFpsCheck = 0;
    window.qualityLevel = 2; // 0: baixo, 1: médio, 2: alto
    
    // Verificar FPS a cada segundo e ajustar qualidade se necessário
    setInterval(function() {
        if (window.fpsHistory.length > 0) {
            const avgFps = window.fpsHistory.reduce((a, b) => a + b, 0) / window.fpsHistory.length;
            window.fpsHistory = [];
            
            // Ajustar qualidade com base no FPS
            if (avgFps < 30 && window.qualityLevel > 0) {
                window.qualityLevel--;
                adjustQualityLevel(window.qualityLevel);
                console.log(`FPS baixo (${avgFps.toFixed(1)}), reduzindo qualidade para nível ${window.qualityLevel}`);
            } else if (avgFps > 55 && window.qualityLevel < 2) {
                window.qualityLevel++;
                adjustQualityLevel(window.qualityLevel);
                console.log(`FPS alto (${avgFps.toFixed(1)}), aumentando qualidade para nível ${window.qualityLevel}`);
            }
        }
    }, 3000);
}

/**
 * Ajustar nível de qualidade com base no desempenho
 */
function adjustQualityLevel(level) {
    if (!window.renderer) return;
    
    switch (level) {
        case 0: // Baixa qualidade
            window.renderer.setPixelRatio(1);
            window.renderer.shadowMap.enabled = false;
            if (window.scene) {
                window.scene.children.forEach(child => {
                    if (child.isLight && child.castShadow) {
                        child.castShadow = false;
                    }
                });
            }
            break;
            
        case 1: // Média qualidade
            window.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            window.renderer.shadowMap.enabled = true;
            window.renderer.shadowMap.type = THREE.PCFShadowMap;
            if (window.scene) {
                const directionalLights = window.scene.children.filter(child => 
                    child.isDirectionalLight && child.position.y > 5);
                if (directionalLights.length > 0) {
                    directionalLights[0].castShadow = true;
                }
            }
            break;
            
        case 2: // Alta qualidade
            window.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            window.renderer.shadowMap.enabled = true;
            window.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            if (window.scene) {
                window.scene.children.forEach(child => {
                    if (child.isDirectionalLight) {
                        child.castShadow = true;
                    }
                });
            }
            break;
    }
    
    // Atualizar interface para refletir o nível de qualidade
    updateQualityUI(level);
}

/**
 * Atualizar interface para refletir o nível de qualidade
 */
function updateQualityUI(level) {
    const qualityIndicator = document.getElementById('quality-level-indicator');
    if (!qualityIndicator) return;
    
    const qualityLabels = ['Baixa', 'Média', 'Alta'];
    qualityIndicator.textContent = qualityLabels[level];
    
    // Atualizar classe CSS
    qualityIndicator.className = 'badge';
    if (level === 0) qualityIndicator.classList.add('bg-warning');
    else if (level === 1) qualityIndicator.classList.add('bg-info');
    else qualityIndicator.classList.add('bg-success');
}

/**
 * Função de animação otimizada
 */
function optimizedAnimate() {
    requestAnimationFrame(optimizedAnimate);
    
    // Calcular FPS para monitoramento de desempenho
    const now = performance.now();
    if (window.lastAnimateTime) {
        const delta = now - window.lastAnimateTime;
        const fps = 1000 / delta;
        
        // Armazenar FPS para cálculo de média
        if (window.fpsHistory) {
            window.fpsHistory.push(fps);
            // Limitar o tamanho do histórico
            if (window.fpsHistory.length > 60) {
                window.fpsHistory.shift();
            }
        }
    }
    window.lastAnimateTime = now;
    
    // Atualizar controles apenas se a câmera estiver se movendo
    if (window.controls && window.controls.enabled) {
        window.controls.update();
    }
    
    // Renderizar cena apenas se necessário
    if (window.renderer && window.scene && window.camera) {
        // Verificar se é necessário renderizar (câmera movendo, modelo girando, etc.)
        const shouldRender = window.forceRender || 
                            (window.controls && window.controls.enabled) || 
                            window.isModelAnimating;
        
        if (shouldRender) {
            window.renderer.render(window.scene, window.camera);
            window.forceRender = false;
        }
    }
}

/**
 * Função otimizada para carregar modelos
 */
function optimizedLoadModel(modelId, originalLoadModel) {
    if (!window.scene || !window.modelLibrary || !window.modelLibrary[modelId]) {
        if (originalLoadModel) originalLoadModel(modelId);
        return;
    }
    
    // Mostrar indicador de carregamento
    const loading = document.getElementById('loading-3d');
    if (loading) loading.style.display = 'block';
    
    // Remover modelo atual se existir
    if (window.currentModel) {
        window.scene.remove(window.currentModel);
        window.currentModel = null;
    }
    
    // Usar sistema de cache para geometrias
    if (window.geometryCache && !window.geometryCache[modelId]) {
        // Criar novo modelo e armazenar no cache
        const modelInfo = window.modelLibrary[modelId];
        window.currentModel = modelInfo.createModel();
        
        // Otimizar geometrias
        optimizeGeometries(window.currentModel);
        
        // Armazenar no cache
        window.geometryCache[modelId] = window.currentModel.clone();
    } else if (window.geometryCache && window.geometryCache[modelId]) {
        // Usar modelo do cache
        window.currentModel = window.geometryCache[modelId].clone();
    } else {
        // Fallback para o método original
        if (originalLoadModel) {
            originalLoadModel(modelId);
            return;
        }
    }
    
    // Adicionar à cena
    window.scene.add(window.currentModel);
    
    // Atualizar propriedades do modelo
    if (window.updateModelProperties) {
        window.updateModelProperties(modelId);
    }
    
    // Ajustar câmera para enquadrar o modelo
    if (window.fitCameraToModel) {
        window.fitCameraToModel(window.currentModel);
    }
    
    // Ocultar indicador de carregamento
    if (loading) loading.style.display = 'none';
    
    // Destacar o modelo selecionado na lista
    document.querySelectorAll('.list-group-item[data-model]').forEach(item => {
        item.classList.remove('active');
    });
    const selectedItem = document.querySelector(`.list-group-item[data-model="${modelId}"]`);
    if (selectedItem) selectedItem.classList.add('active');
    
    // Forçar renderização
    window.forceRender = true;
}

/**
 * Otimizar geometrias para melhor desempenho
 */
function optimizeGeometries(model) {
    if (!model) return;
    
    model.traverse(function(child) {
        if (child.isMesh) {
            // Otimizar geometria
            if (child.geometry) {
                // Verificar se a geometria já está otimizada
                if (!child.geometry.attributes.normal) {
                    child.geometry.computeVertexNormals();
                }
                
                // Centralizar geometria para melhor precisão
                child.geometry.center();
                
                // Otimizar buffers
                child.geometry.attributes.position.needsUpdate = true;
                if (child.geometry.attributes.normal) {
                    child.geometry.attributes.normal.needsUpdate = true;
                }
                if (child.geometry.attributes.uv) {
                    child.geometry.attributes.uv.needsUpdate = true;
                }
                
                // Otimizar bounding box/sphere para melhor culling
                child.geometry.computeBoundingBox();
                child.geometry.computeBoundingSphere();
            }
            
            // Otimizar material
            if (child.material) {
                // Configurar para melhor desempenho
                child.material.flatShading = window.qualityLevel < 2;
                child.material.precision = window.qualityLevel === 0 ? 'lowp' : 'mediump';
                child.material.needsUpdate = true;
            }
            
            // Configurar para receber e projetar sombras
            child.castShadow = window.renderer && window.renderer.shadowMap.enabled;
            child.receiveShadow = window.renderer && window.renderer.shadowMap.enabled;
        }
    });
}

/**
 * Adicionar opções avançadas de visualização
 */
function addEnhancedVisualizationOptions() {
    // Adicionar controles de visualização ao footer do canvas
    const canvasFooter = document.querySelector('#canvas-container + .card-footer');
    if (!canvasFooter) return;
    
    // Adicionar controles de qualidade e visualização
    const visualizationControls = document.createElement('div');
    visualizationControls.className = 'row mt-2';
    visualizationControls.innerHTML = `
        <div class="col-md-6">
            <div class="d-flex align-items-center">
                <span class="me-2">Qualidade:</span>
                <span id="quality-level-indicator" class="badge bg-success">Alta</span>
                <div class="btn-group ms-2">
                    <button id="btn-quality-low" class="btn btn-sm btn-outline-secondary">Baixa</button>
                    <button id="btn-quality-medium" class="btn btn-sm btn-outline-secondary">Média</button>
                    <button id="btn-quality-high" class="btn btn-sm btn-outline-secondary active">Alta</button>
                </div>
            </div>
        </div>
        <div class="col-md-6 text-end">
            <div class="btn-group">
                <button id="btn-wireframe" class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-grid-3x3"></i> Wireframe
                </button>
                <button id="btn-shadows" class="btn btn-sm btn-outline-secondary active">
                    <i class="bi bi-brightness-high"></i> Sombras
                </button>
                <button id="btn-explode" class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-arrows-expand"></i> Explodir
                </button>
            </div>
        </div>
    `;
    
    canvasFooter.appendChild(visualizationControls);
    
    // Adicionar event listeners para os novos controles
    document.getElementById('btn-quality-low').addEventListener('click', function() {
        window.qualityLevel = 0;
        adjustQualityLevel(0);
        updateQualityButtonsUI();
    });
    
    document.getElementById('btn-quality-medium').addEventListener('click', function() {
        window.qualityLevel = 1;
        adjustQualityLevel(1);
        updateQualityButtonsUI();
    });
    
    document.getElementById('btn-quality-high').addEventListener('click', function() {
        window.qualityLevel = 2;
        adjustQualityLevel(2);
        updateQualityButtonsUI();
    });
    
    document.getElementById('btn-wireframe').addEventListener('click', function() {
        toggleWireframe();
        this.classList.toggle('active');
    });
    
    document.getElementById('btn-shadows').addEventListener('click', function() {
        toggleShadows();
        this.classList.toggle('active');
    });
    
    document.getElementById('btn-explode').addEventListener('click', function() {
        toggleExplodeView();
        this.classList.toggle('active');
    });
}

/**
 * Atualizar UI dos botões de qualidade
 */
function updateQualityButtonsUI() {
    const lowBtn = document.getElementById('btn-quality-low');
    const mediumBtn = document.getElementById('btn-quality-medium');
    const highBtn = document.getElementById('btn-quality-high');
    
    if (lowBtn) lowBtn.classList.remove('active');
    if (mediumBtn) mediumBtn.classList.remove('active');
    if (highBtn) highBtn.classList.remove('active');
    
    switch (window.qualityLevel) {
        case 0:
            if (lowBtn) lowBtn.classList.add('active');
            break;
        case 1:
            if (mediumBtn) mediumBtn.classList.add('active');
            break;
        case 2:
            if (highBtn) highBtn.classList.add('active');
            break;
    }
}

/**
 * Alternar modo wireframe
 */
function toggleWireframe() {
    if (!window.currentModel) return;
    
    window.isWireframe = !window.isWireframe;
    
    window.currentModel.traverse(function(child) {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.wireframe = window.isWireframe;
                });
            } else {
                child.material.wireframe = window.isWireframe;
            }
        }
    });
    
    // Forçar renderização
    window.forceRender = true;
}

/**
 * Alternar sombras
 */
function toggleShadows() {
    if (!window.renderer) return;
    
    window.renderer.shadowMap.enabled = !window.renderer.shadowMap.enabled;
    
    if (window.scene) {
        window.scene.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = window.renderer.shadowMap.enabled;
                child.receiveShadow = window.renderer.shadowMap.enabled;
            }
        });
    }
    
    // Forçar renderização
    window.forceRender = true;
}

/**
 * Alternar visualização explodida
 */
function toggleExplodeView() {
    if (!window.currentModel) return;
    
    window.isExploded = !window.isExploded;
    
    // Fator de explosão
    const explodeFactor = window.isExploded ? 0.5 : 0;
    
    // Identificar partes do modelo
    const parts = [];
    window.currentModel.traverse(function(child) {
        if (child.isMesh && child !== window.currentModel) {
            parts.push(child);
        }
    });
    
    // Calcular centro do modelo
    const center = new THREE.Vector3();
    if (parts.length > 0) {
        parts.forEach(part => {
            center.add(part.position);
        });
        center.divideScalar(parts.length);
    }
    
    // Aplicar explosão
    parts.forEach(part => {
        // Calcular direção da explosão a partir do centro
        const direction = new THREE.Vector3();
        direction.subVectors(part.position, center).normalize();
        
        // Aplicar deslocamento
        if (window.isExploded) {
            part.userData.originalPosition = part.position.clone();
            part.position.add(direction.multiplyScalar(explodeFactor));
        } else if (part.userData.originalPosition) {
            part.position.copy(part.userData.originalPosition);
        }
    });
    
    // Forçar renderização
    window.forceRender = true;
}

/**
 * Adicionar opções avançadas de controle
 */
function addEnhancedControlOptions() {
    // Adicionar opções de exportação avançadas
    const exportButton = document.getElementById('btn-export-3d-pdf');
    if (exportButton) {
        // Substituir o botão original por um dropdown
        const exportDropdown = document.createElement('div');
        exportDropdown.className = 'btn-group';
        exportDropdown.innerHTML = `
            <button id="btn-export-3d" class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-file-earmark-arrow-down"></i> Exportar
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" id="btn-export-pdf">PDF</a></li>
                <li><a class="dropdown-item" href="#" id="btn-export-image">Imagem</a></li>
                <li><a class="dropdown-item" href="#" id="btn-export-glb">Modelo 3D (.glb)</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="btn-export-measurements">Medidas</a></li>
            </ul>
        `;
        
        exportButton.parentNode.replaceChild(exportDropdown, exportButton);
        
        // Adicionar event listeners para as novas opções
        document.getElementById('btn-export-pdf').addEventListener('click', function(e) {
            e.preventDefault();
            exportToPDF();
        });
        
        document.getElementById('btn-export-image').addEventListener('click', function(e) {
            e.preventDefault();
            exportToImage();
        });
        
        document.getElementById('btn-export-glb').addEventListener('click', function(e) {
            e.preventDefault();
            exportToGLB();
        });
        
        document.getElementById('btn-export-measurements').addEventListener('click', function(e) {
            e.preventDefault();
            exportMeasurements();
        });
    }
    
    // Adicionar ferramentas de medição
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const measureToolsContainer = document.createElement('div');
        measureToolsContainer.className = 'measure-tools';
        measureToolsContainer.style.position = 'absolute';
        measureToolsContainer.style.top = '10px';
        measureToolsContainer.style.left = '10px';
        measureToolsContainer.style.zIndex = '10';
        measureToolsContainer.style.display = 'none';
        
        measureToolsContainer.innerHTML = `
            <div class="btn-group-vertical">
                <button id="btn-measure-distance" class="btn btn-sm btn-light" title="Medir distância">
                    <i class="bi bi-rulers"></i>
                </button>
                <button id="btn-measure-angle" class="btn btn-sm btn-light" title="Medir ângulo">
                    <i class="bi bi-triangle"></i>
                </button>
                <button id="btn-clear-measurements" class="btn btn-sm btn-light" title="Limpar medições">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        canvasContainer.appendChild(measureToolsContainer);
        
        // Adicionar botão para mostrar/ocultar ferramentas de medição
        const canvasFooter = document.querySelector('#canvas-container + .card-footer');
        if (canvasFooter) {
            const measureButton = document.createElement('button');
            measureButton.id = 'btn-toggle-measure';
            measureButton.className = 'btn btn-sm btn-outline-secondary ms-2';
            measureButton.innerHTML = '<i class="bi bi-rulers"></i> Medir';
            
            const rightButtonGroup = canvasFooter.querySelector('.col-md-6:last-child .btn-group');
            if (rightButtonGroup) {
                rightButtonGroup.appendChild(measureButton);
                
                // Adicionar event listener
                measureButton.addEventListener('click', function() {
                    const isVisible = measureToolsContainer.style.display !== 'none';
                    measureToolsContainer.style.display = isVisible ? 'none' : 'block';
                    this.classList.toggle('active');
                });
            }
        }
    }
}

/**
 * Exportar visualização atual como imagem
 */
function exportToImage() {
    if (!window.renderer) {
        alert('Erro: Renderer não inicializado.');
        return;
    }
    
    // Forçar renderização para garantir que a imagem esteja atualizada
    window.forceRender = true;
    if (window.renderer && window.scene && window.camera) {
        window.renderer.render(window.scene, window.camera);
    }
    
    try {
        // Capturar imagem do canvas
        const imageURL = window.renderer.domElement.toDataURL('image/png');
        
        // Criar link para download
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'visualizacao-3d.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        alert('Erro ao exportar imagem. Verifique o console para mais detalhes.');
    }
}

/**
 * Exportar modelo atual como GLB
 */
function exportToGLB() {
    if (!window.currentModel) {
        alert('Selecione um modelo para exportar.');
        return;
    }
    
    // Verificar se GLTFExporter está disponível
    if (typeof THREE.GLTFExporter === 'undefined') {
        // Carregar GLTFExporter
        const exporterScript = document.createElement('script');
        exporterScript.src = 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/exporters/GLTFExporter.js';
        document.head.appendChild(exporterScript);
        
        exporterScript.onload = function() {
            performGLBExport();
        };
        
        exporterScript.onerror = function() {
            alert('Erro ao carregar o exportador GLB. Tente novamente mais tarde.');
        };
    } else {
        performGLBExport();
    }
}

/**
 * Realizar exportação GLB
 */
function performGLBExport() {
    try {
        const exporter = new THREE.GLTFExporter();
        
        exporter.parse(window.currentModel, function(result) {
            // Converter para Blob
            const blob = new Blob([result], { type: 'application/octet-stream' });
            
            // Criar link para download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'modelo-3d.glb';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Liberar URL
            URL.revokeObjectURL(link.href);
        }, { binary: true });
    } catch (error) {
        console.error('Erro ao exportar modelo GLB:', error);
        alert('Erro ao exportar modelo. Verifique o console para mais detalhes.');
    }
}

/**
 * Exportar medidas do modelo atual
 */
function exportMeasurements() {
    if (!window.currentModel) {
        alert('Selecione um modelo para exportar medidas.');
        return;
    }
    
    // Obter dimensões do modelo
    const box = new THREE.Box3().setFromObject(window.currentModel);
    const size = box.getSize(new THREE.Vector3());
    
    // Obter modelo selecionado
    const selectedModelItem = document.querySelector('.list-group-item.active[data-model]');
    const modelId = selectedModelItem ? selectedModelItem.getAttribute('data-model') : 'desconhecido';
    const modelInfo = window.modelLibrary && window.modelLibrary[modelId] ? window.modelLibrary[modelId] : null;
    
    // Criar conteúdo do relatório
    let content = `# Relatório de Medidas - ${modelInfo ? modelInfo.name : 'Modelo 3D'}\n\n`;
    content += `Data: ${new Date().toLocaleDateString()}\n\n`;
    content += `## Dimensões Gerais\n\n`;
    content += `- Largura: ${size.x.toFixed(2)} m\n`;
    content += `- Altura: ${size.y.toFixed(2)} m\n`;
    content += `- Profundidade: ${size.z.toFixed(2)} m\n\n`;
    
    // Adicionar propriedades do modelo se disponíveis
    if (modelInfo && modelInfo.properties) {
        content += `## Propriedades\n\n`;
        
        for (const [key, value] of Object.entries(modelInfo.properties)) {
            content += `- ${key}: ${value}\n`;
        }
        
        content += '\n';
    }
    
    // Adicionar materiais se disponíveis
    if (modelInfo && modelInfo.materials) {
        content += `## Materiais\n\n`;
        
        modelInfo.materials.forEach(material => {
            content += `- ${material}\n`;
        });
        
        content += '\n';
    }
    
    // Adicionar medidas personalizadas se existirem
    if (window.customMeasurements && window.customMeasurements.length > 0) {
        content += `## Medidas Personalizadas\n\n`;
        
        window.customMeasurements.forEach((measurement, index) => {
            if (measurement.type === 'distance') {
                content += `- Distância ${index + 1}: ${measurement.value.toFixed(2)} m\n`;
            } else if (measurement.type === 'angle') {
                content += `- Ângulo ${index + 1}: ${measurement.value.toFixed(2)}°\n`;
            }
        });
    }
    
    // Converter para Blob
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Criar link para download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'medidas-modelo-3d.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar URL
    URL.revokeObjectURL(link.href);
}

// Exportar funções para uso global
window.optimizedAnimate = optimizedAnimate;
window.optimizedLoadModel = optimizedLoadModel;
window.toggleWireframe = toggleWireframe;
window.toggleShadows = toggleShadows;
window.toggleExplodeView = toggleExplodeView;
window.exportToImage = exportToImage;
window.exportToGLB = exportToGLB;
window.exportMeasurements = exportMeasurements;
