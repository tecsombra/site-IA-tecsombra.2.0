/**
 * Refinamentos para o Sistema de Estimativa Automática para Serralheria
 * 
 * Este arquivo contém melhorias nos algoritmos de cálculo para estimativas mais precisas,
 * considerando fatores adicionais como o espaçamento entre tesouras e terças.
 * 
 * Autor: Manus AI
 * Data: 15/04/2025
 */

// Aplicar refinamentos quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o sistema de estimativa automática já está carregado
    if (typeof calculateEstimate === 'undefined') {
        console.warn('Sistema de estimativa automática não encontrado. Os refinamentos não serão aplicados.');
        return;
    }
    
    // Substituir funções originais por versões refinadas
    window.originalCalculateEstimate = window.calculateEstimate;
    window.calculateEstimate = refinedCalculateEstimate;
    
    window.originalCalculateMaterialsEstimate = window.calculateMaterialsEstimate;
    window.calculateMaterialsEstimate = refinedCalculateMaterialsEstimate;
    
    window.originalCalculateLaborEstimate = window.calculateLaborEstimate;
    window.calculateLaborEstimate = refinedCalculateLaborEstimate;
    
    window.originalCalculateTimelineEstimate = window.calculateTimelineEstimate;
    window.calculateTimelineEstimate = refinedCalculateTimelineEstimate;
    
    // Adicionar novos campos ao formulário
    addRefinedFormFields();
    
    // Adicionar novos materiais e atualizar preços
    updateMaterialsDatabase();
    
    console.log('Refinamentos do sistema de estimativa automática aplicados com sucesso.');
});

/**
 * Adicionar campos refinados ao formulário de estimativa
 */
function addRefinedFormFields() {
    // Localizar o formulário
    const form = document.getElementById('project-details-form');
    if (!form) return;
    
    // Localizar o ponto de inserção (antes do botão de calcular)
    const calculateButton = document.getElementById('btn-calculate-estimate');
    if (!calculateButton) return;
    
    // Criar container para campos avançados
    const advancedFieldsContainer = document.createElement('div');
    advancedFieldsContainer.id = 'advanced-fields-container';
    advancedFieldsContainer.className = 'mb-3';
    advancedFieldsContainer.style.display = 'none';
    
    // Adicionar campos avançados
    advancedFieldsContainer.innerHTML = `
        <div class="card mb-3 bg-light">
            <div class="card-header">
                <h6 class="mb-0">Parâmetros Avançados</h6>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="tesouras-spacing" class="form-label">Espaçamento entre Tesouras (m)</label>
                        <input type="number" step="0.1" min="1" max="6" class="form-control" id="tesouras-spacing" value="4.5">
                        <small class="form-text text-muted">Padrão: 4.5m (entre 3m e 6m)</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="tercas-spacing" class="form-label">Espaçamento entre Terças (m)</label>
                        <input type="number" step="0.1" min="1" max="2.5" class="form-control" id="tercas-spacing" value="1.8">
                        <small class="form-text text-muted">Padrão: 1.8m (entre 1.5m e 2.5m)</small>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="material-waste" class="form-label">Fator de Desperdício (%)</label>
                        <input type="number" step="1" min="0" max="30" class="form-control" id="material-waste" value="10">
                        <small class="form-text text-muted">Padrão: 10% (entre 5% e 20%)</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="labor-efficiency" class="form-label">Eficiência da Mão de Obra (%)</label>
                        <input type="number" step="5" min="50" max="100" class="form-control" id="labor-efficiency" value="85">
                        <small class="form-text text-muted">Padrão: 85% (entre 70% e 100%)</small>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="roof-inclination" class="form-label">Inclinação do Telhado (%)</label>
                        <input type="number" step="1" min="5" max="100" class="form-control" id="roof-inclination" value="10">
                        <small class="form-text text-muted">Padrão: 10% (entre 5% e 30%)</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="wind-region" class="form-label">Região de Vento (NBR 6123)</label>
                        <select class="form-select" id="wind-region">
                            <option value="1">Região I (Vo = 30 m/s)</option>
                            <option value="2">Região II (Vo = 35 m/s)</option>
                            <option value="3" selected>Região III (Vo = 40 m/s)</option>
                            <option value="4">Região IV (Vo = 45 m/s)</option>
                            <option value="5">Região V (Vo = 50 m/s)</option>
                        </select>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="terrain-type" class="form-label">Tipo de Terreno</label>
                        <select class="form-select" id="terrain-type">
                            <option value="A">A - Liso (mar, lagos)</option>
                            <option value="B" selected>B - Terreno aberto</option>
                            <option value="C">C - Terreno com obstáculos</option>
                            <option value="D">D - Zona urbana</option>
                            <option value="E">E - Centro de grande cidade</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="soil-type" class="form-label">Tipo de Solo</label>
                        <select class="form-select" id="soil-type">
                            <option value="rochoso">Rochoso</option>
                            <option value="firme" selected>Firme</option>
                            <option value="normal">Normal</option>
                            <option value="mole">Mole</option>
                            <option value="arenoso">Arenoso</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar botão para mostrar/ocultar campos avançados
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.id = 'btn-toggle-advanced';
    toggleButton.className = 'btn btn-outline-secondary w-100 mb-3';
    toggleButton.innerHTML = '<i class="bi bi-sliders"></i> Mostrar Parâmetros Avançados';
    
    // Adicionar event listener para o botão
    toggleButton.addEventListener('click', function() {
        const container = document.getElementById('advanced-fields-container');
        if (container) {
            const isVisible = container.style.display !== 'none';
            container.style.display = isVisible ? 'none' : 'block';
            this.innerHTML = isVisible ? 
                '<i class="bi bi-sliders"></i> Mostrar Parâmetros Avançados' : 
                '<i class="bi bi-sliders"></i> Ocultar Parâmetros Avançados';
        }
    });
    
    // Inserir elementos no formulário
    form.insertBefore(toggleButton, calculateButton);
    form.insertBefore(advancedFieldsContainer, calculateButton);
}

/**
 * Atualizar banco de dados de materiais com novos itens e preços atualizados
 */
function updateMaterialsDatabase() {
    if (!window.estimatorData || !window.estimatorData.materials) return;
    
    // Novos materiais a serem adicionados
    const newMaterials = {
        'Perfil Z 150x60x20': { price: 55.0, unit: 'm', weight: 3.2 },
        'Perfil Z 200x75x20': { price: 68.0, unit: 'm', weight: 4.0 },
        'Perfil U Enrijecido 100x40x17': { price: 52.0, unit: 'm', weight: 3.2 },
        'Perfil U Enrijecido 150x60x20': { price: 65.0, unit: 'm', weight: 4.5 },
        'Telha Trapezoidal TP40': { price: 55.0, unit: 'm²', weight: 5.2 },
        'Telha Trapezoidal TP25': { price: 48.0, unit: 'm²', weight: 4.3 },
        'Telha Termoacústica 30mm': { price: 120.0, unit: 'm²', weight: 10.5 },
        'Telha Zipada': { price: 85.0, unit: 'm²', weight: 6.2 },
        'Parafuso Autobrocante': { price: 0.8, unit: 'un', weight: 0.01 },
        'Parafuso Estrutural': { price: 3.5, unit: 'un', weight: 0.05 },
        'Chumbador Mecânico': { price: 8.5, unit: 'un', weight: 0.15 },
        'Chumbador Químico': { price: 45.0, unit: 'un', weight: 0.5 },
        'Primer Anticorrosivo': { price: 85.0, unit: 'l', weight: 1.0 },
        'Tinta Esmalte Industrial': { price: 95.0, unit: 'l', weight: 1.2 }
    };
    
    // Adicionar novos materiais ao banco de dados
    for (const [key, value] of Object.entries(newMaterials)) {
        window.estimatorData.materials[key] = value;
    }
    
    // Atualizar preços de materiais existentes (inflação, etc.)
    const priceUpdates = {
        'Metalon 30x30': 25.0,
        'Metalon 40x40': 35.0,
        'Metalon 40x60': 48.0,
        'Tubo Redondo 2"': 42.0,
        'Perfil U 100x40': 52.0,
        'Perfil I 150x15': 92.0,
        'Chapa #18': 195.0,
        'Chapa #16': 235.0,
        'Telha Galvanizada': 52.0
    };
    
    // Aplicar atualizações de preço
    for (const [key, value] of Object.entries(priceUpdates)) {
        if (window.estimatorData.materials[key]) {
            window.estimatorData.materials[key].price = value;
        }
    }
    
    // Salvar dados atualizados
    if (window.saveEstimatorData) {
        window.saveEstimatorData();
    }
}

/**
 * Versão refinada da função de cálculo de estimativa
 */
function refinedCalculateEstimate() {
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
    
    // Obter parâmetros avançados (se disponíveis)
    const tesouraSpacing = document.getElementById('tesouras-spacing') ? 
        parseFloat(document.getElementById('tesouras-spacing').value) : 4.5;
    
    const tercaSpacing = document.getElementById('tercas-spacing') ? 
        parseFloat(document.getElementById('tercas-spacing').value) : 1.8;
    
    const materialWaste = document.getElementById('material-waste') ? 
        parseFloat(document.getElementById('material-waste').value) / 100 : 0.1;
    
    const laborEfficiency = document.getElementById('labor-efficiency') ? 
        parseFloat(document.getElementById('labor-efficiency').value) / 100 : 0.85;
    
    const roofInclination = document.getElementById('roof-inclination') ? 
        parseFloat(document.getElementById('roof-inclination').value) / 100 : 0.1;
    
    const windRegion = document.getElementById('wind-region') ? 
        document.getElementById('wind-region').value : '3';
    
    const terrainType = document.getElementById('terrain-type') ? 
        document.getElementById('terrain-type').value : 'B';
    
    const soilType = document.getElementById('soil-type') ? 
        document.getElementById('soil-type').value : 'firme';
    
    // Validar campos obrigatórios
    if (!projectType || !projectName || !width || !height || 
        (window.estimatorData.projectTypes[projectType].needsLength && !length)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Calcular área e perímetro
    const area = width * height;
    const perimeter = 2 * (width + height);
    
    // Calcular volume (se aplicável)
    const volume = length > 0 ? width * height * length : 0;
    
    // Obter fatores de risco
    const complexityFactor = window.estimatorData.riskFactors.complexity[complexity].factor;
    const locationFactor = window.estimatorData.riskFactors.location[location].factor;
    const qualityFactor = window.estimatorData.riskFactors.quality[quality].factor;
    const finishingFactor = window.estimatorData.riskFactors.finishing[finishing].factor;
    const urgencyFactor = window.estimatorData.riskFactors.urgency[urgency].factor;
    
    // Calcular fator de risco total (refinado)
    const totalRiskFactor = (
        complexityFactor * 0.25 + 
        locationFactor * 0.2 + 
        qualityFactor * 0.15 + 
        finishingFactor * 0.15 + 
        urgencyFactor * 0.25
    );
    
    // Obter fatores base do tipo de projeto
    const projectTypeInfo = window.estimatorData.projectTypes[projectType];
    const baseMaterialFactor = projectTypeInfo.baseMaterialFactor;
    const baseLaborFactor = projectTypeInfo.baseLaborFactor;
    const baseTimelineDays = projectTypeInfo.baseTimelineDays;
    
    // Calcular estimativa de materiais (refinada)
    const materialsEstimate = refinedCalculateMaterialsEstimate(
        projectType, width, height, length, area, perimeter, 
        baseMaterialFactor, qualityFactor, hasGlass,
        tesouraSpacing, tercaSpacing, roofInclination, 
        windRegion, terrainType, materialWaste
    );
    
    // Calcular estimativa de mão de obra (refinada)
    const laborEstimate = refinedCalculateLaborEstimate(
        projectType, area, volume, baseLaborFactor, 
        complexityFactor, locationFactor, hasCustomDesign, includesInstallation,
        laborEfficiency, soilType
    );
    
    // Calcular estimativa de cronograma (refinada)
    const timelineEstimate = refinedCalculateTimelineEstimate(
        baseTimelineDays, urgencyFactor, complexityFactor, 
        locationFactor, hasCustomDesign, includesInstallation,
        laborEfficiency, soilType, windRegion
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
    
    // Calcular margem de lucro (refinada)
    // Ajuste dinâmico baseado no risco, complexidade e tamanho do projeto
    let profitMarginBase = 0.3; // 30% base
    
    // Ajustar com base no risco
    const riskAdjustment = (totalRiskFactor - 1) * 0.1;
    
    // Ajustar com base no tamanho do projeto (projetos maiores podem ter margens menores)
    const sizeAdjustment = Math.max(-0.05, Math.min(0.05, 0.05 - Math.log10(totalCost / 10000) * 0.02));
    
    // Ajustar com base na complexidade
    const complexityAdjustment = (complexityFactor - 1) * 0.05;
    
    // Calcular margem final
    const profitMargin = Math.max(0.15, Math.min(0.45, profitMarginBase + riskAdjustment + sizeAdjustment + complexityAdjustment));
    const profit = totalCost * profitMargin;
    
    // Calcular preço final
    const finalPrice = totalCost + profit;
    
    // Criar objeto de estimativa refinado
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
        advancedParams: {
            tesouraSpacing,
            tercaSpacing,
            materialWaste,
            laborEfficiency,
            roofInclination,
            windRegion,
            terrainType,
            soilType
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
        riskFactor: totalRiskFactor,
        version: '2.0' // Indicar que é uma estimativa refinada
    };
    
    // Armazenar estimativa atual
    window.currentEstimate = estimate;
    
    // Exibir resultado
    displayRefinedEstimateResult(estimate);
}

/**
 * Versão refinada da função de cálculo de estimativa de materiais
 */
function refinedCalculateMaterialsEstimate(
    projectType, width, height, length, area, perimeter, 
    baseMaterialFactor, qualityFactor, hasGlass,
    tesouraSpacing, tercaSpacing, roofInclination, 
    windRegion, terrainType, materialWaste
) {
    const projectTypeInfo = window.estimatorData.projectTypes[projectType];
    const defaultMaterials = projectTypeInfo.defaultMaterials;
    const materials = [];
    let totalCost = 0;
    let totalWeight = 0;
    
    // Fator de dimensão refinado (projetos maiores usam mais material por m²)
    const dimensionFactor = Math.min(1.5, Math.max(1.0, Math.log10(area + 1) * 0.5 + 1));
    
    // Fator de desperdício (agora parametrizado)
    const wasteFactor = 1 + materialWaste;
    
    // Fator de vento (baseado na região de vento da NBR 6123)
    const windFactor = 1 + (parseInt(windRegion) - 1) * 0.1;
    
    // Fator de inclinação do telhado
    const inclinationFactor = 1 + roofInclination * 2;
    
    // Calcular número de tesouras e terças para estruturas
    let tesouraCount = 0;
    let tercaCount = 0;
    
    if (projectType === 'cobertura' || projectType === 'estrutura') {
        // Calcular número de tesouras
        tesouraCount = Math.ceil(length / tesouraSpacing) + 1;
        
        // Calcular comprimento real da água do telhado (considerando a inclinação)
        const roofHeight = (width / 2) * roofInclination;
        const roofLength = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(roofHeight, 2));
        
        // Calcular número de terças por água
        const tercaCountPerSide = Math.ceil(roofLength / tercaSpacing) + 1;
        
        // Número total de terças (duas águas)
        tercaCount = tercaCountPerSide * 2 - 1; // -1 porque a terça da cumeeira é compartilhada
    }
    
    // Calcular quantidade de material principal (estrutura)
    const mainMaterial = defaultMaterials[0];
    const mainMaterialInfo = window.estimatorData.materials[mainMaterial];
    
    let mainMaterialQuantity;
    
    if (projectType === 'cobertura' || projectType === 'estrutura') {
        // Para coberturas e estruturas, usar cálculo baseado em tesouras
        mainMaterialQuantity = tesouraCount * width * 1.5 * baseMaterialFactor * dimensionFactor;
    } else if (projectTypeInfo.needsLength && length > 0) {
        // Para projetos 3D (com comprimento)
        mainMaterialQuantity = (perimeter * 1.5 + length * 2) * baseMaterialFactor * dimensionFactor;
    } else {
        // Para projetos 2D (sem comprimento)
        mainMaterialQuantity = perimeter * 1.5 * baseMaterialFactor * dimensionFactor;
    }
    
    // Ajustar pela qualidade e desperdício
    mainMaterialQuantity *= qualityFactor * wasteFactor;
    
    // Ajustar pelo fator de vento para estruturas
    if (projectType === 'cobertura' || projectType === 'estrutura') {
        mainMaterialQuantity *= windFactor;
    }
    
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
    const secondaryMaterialInfo = window.estimatorData.materials[secondaryMaterial];
    
    let secondaryMaterialQuantity;
    
    if (projectType === 'cobertura' || projectType === 'estrutura') {
        // Para coberturas e estruturas, usar cálculo baseado em terças
        secondaryMaterialQuantity = tercaCount * length * baseMaterialFactor * dimensionFactor;
    } else if (projectTypeInfo.needsLength && length > 0) {
        // Para projetos 3D (com comprimento)
        secondaryMaterialQuantity = (area * 0.5 + length * 1.2) * baseMaterialFactor * dimensionFactor;
    } else {
        // Para projetos 2D (sem comprimento)
        secondaryMaterialQuantity = area * 0.7 * baseMaterialFactor * dimensionFactor;
    }
    
    // Ajustar pela qualidade e desperdício
    secondaryMaterialQuantity *= qualityFactor * wasteFactor;
    
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
    
    // Calcular quantidade de material de fechamento/cobertura
    let closingMaterial;
    let closingMaterialInfo;
    let closingMaterialQuantity;
    
    if (projectType === 'cobertura') {
        // Para coberturas, usar telha apropriada
        closingMaterial = 'Telha Trapezoidal TP40';
        closingMaterialInfo = window.estimatorData.materials[closingMaterial];
        closingMaterialQuantity = area * inclinationFactor * wasteFactor;
    } else if (hasGlass) {
        // Se tem vidro, usar vidro como fechamento
        closingMaterial = 'Vidro Temperado 8mm';
        closingMaterialInfo = window.estimatorData.materials[closingMaterial];
        closingMaterialQuantity = area * 0.7 * wasteFactor;
    } else if (defaultMaterials.length > 2) {
        // Usar o terceiro material padrão
        closingMaterial = defaultMaterials[2];
        closingMaterialInfo = window.estimatorData.materials[closingMaterial];
        
        if (closingMaterialInfo.unit === 'm²') {
            // Material em m² (chapas, telhas)
            closingMaterialQuantity = area * 0.9 * wasteFactor;
        } else {
            // Material em metros lineares
            closingMaterialQuantity = area * 0.5 * wasteFactor;
        }
    } else {
        // Usar chapa como padrão
        closingMaterial = 'Chapa #18';
        closingMaterialInfo = window.estimatorData.materials[closingMaterial];
        closingMaterialQuantity = area * 0.9 * wasteFactor;
    }
    
    // Ajustar pela qualidade
    closingMaterialQuantity *= qualityFactor;
    
    const closingMaterialCost = closingMaterialQuantity * closingMaterialInfo.price;
    const closingMaterialWeight = closingMaterialQuantity * closingMaterialInfo.weight;
    
    materials.push({
        name: closingMaterial,
        quantity: closingMaterialQuantity.toFixed(2),
        unit: closingMaterialInfo.unit,
        unitPrice: closingMaterialInfo.price.toFixed(2),
        totalPrice: closingMaterialCost.toFixed(2),
        weight: closingMaterialWeight.toFixed(2)
    });
    
    totalCost += closingMaterialCost;
    totalWeight += closingMaterialWeight;
    
    // Adicionar materiais de fixação (parafusos, eletrodos, etc.)
    const fixingMaterials = [
        { name: 'Eletrodo (kg)', factor: 0.05 },
        { name: 'Disco de Corte', factor: 0.02 },
        { name: 'Parafusos e Fixadores', factor: 0.1 }
    ];
    
    fixingMaterials.forEach(item => {
        const materialInfo = window.estimatorData.materials[item.name];
        const quantity = (totalWeight * item.factor) * wasteFactor;
        const cost = quantity * materialInfo.price;
        
        materials.push({
            name: item.name,
            quantity: quantity.toFixed(2),
            unit: materialInfo.unit,
            unitPrice: materialInfo.price.toFixed(2),
            totalPrice: cost.toFixed(2),
            weight: (quantity * materialInfo.weight).toFixed(2)
        });
        
        totalCost += cost;
        totalWeight += quantity * materialInfo.weight;
    });
    
    // Adicionar materiais específicos para coberturas
    if (projectType === 'cobertura' || projectType === 'estrutura') {
        // Adicionar calhas e rufos
        const gutterLength = length * 2;
        const gutterPrice = 35.0; // Preço por metro
        const gutterCost = gutterLength * gutterPrice;
        
        materials.push({
            name: 'Calhas e Rufos',
            quantity: gutterLength.toFixed(2),
            unit: 'm',
            unitPrice: gutterPrice.toFixed(2),
            totalPrice: gutterCost.toFixed(2),
            weight: (gutterLength * 2).toFixed(2) // Peso aproximado
        });
        
        totalCost += gutterCost;
        totalWeight += gutterLength * 2;
        
        // Adicionar parafusos autobrocantes para telhas
        const screwCount = Math.ceil(area * 6); // 6 parafusos por m²
        const screwPrice = 0.8; // Preço unitário
        const screwCost = screwCount * screwPrice;
        
        materials.push({
            name: 'Parafuso Autobrocante',
            quantity: screwCount.toString(),
            unit: 'un',
            unitPrice: screwPrice.toFixed(2),
            totalPrice: screwCost.toFixed(2),
            weight: (screwCount * 0.01).toFixed(2) // Peso aproximado
        });
        
        totalCost += screwCost;
        totalWeight += screwCount * 0.01;
    }
    
    // Adicionar materiais para acabamento
    if (projectType !== 'estrutura') {
        // Calcular quantidade de tinta/acabamento
        const paintArea = totalWeight / 10; // Aproximadamente 1 litro para cada 10kg de estrutura
        const paintName = 'Tinta (Galão)';
        const paintInfo = window.estimatorData.materials[paintName];
        const paintQuantity = Math.ceil(paintArea / 3.6); // Galões de 3.6 litros
        const paintCost = paintQuantity * paintInfo.price;
        
        materials.push({
            name: paintName,
            quantity: paintQuantity.toString(),
            unit: paintInfo.unit,
            unitPrice: paintInfo.price.toFixed(2),
            totalPrice: paintCost.toFixed(2),
            weight: (paintQuantity * paintInfo.weight).toFixed(2)
        });
        
        totalCost += paintCost;
        totalWeight += paintQuantity * paintInfo.weight;
    }
    
    return {
        materials,
        totalCost,
        totalWeight,
        tesouraCount,
        tercaCount,
        wasteFactor,
        windFactor,
        inclinationFactor
    };
}

/**
 * Versão refinada da função de cálculo de estimativa de mão de obra
 */
function refinedCalculateLaborEstimate(
    projectType, area, volume, baseLaborFactor, 
    complexityFactor, locationFactor, hasCustomDesign, includesInstallation,
    laborEfficiency, soilType
) {
    const laborHours = {};
    let totalHours = 0;
    let totalCost = 0;
    
    // Fator de eficiência da mão de obra
    const efficiencyFactor = 1 / laborEfficiency;
    
    // Fator de solo (afeta instalação)
    const soilFactors = {
        'rochoso': 1.5,
        'firme': 1.0,
        'normal': 1.2,
        'mole': 1.3,
        'arenoso': 1.4
    };
    const soilFactor = soilFactors[soilType] || 1.0;
    
    // Calcular horas base de acordo com o tipo de projeto e dimensões
    let baseHours;
    if (volume > 0) {
        // Projetos 3D (com volume)
        baseHours = Math.sqrt(volume) * 8 * baseLaborFactor;
    } else {
        // Projetos 2D (sem volume)
        baseHours = Math.sqrt(area) * 5 * baseLaborFactor;
    }
    
    // Ajustar pelas condições do projeto
    baseHours *= complexityFactor * locationFactor * efficiencyFactor;
    
    // Adicionar horas extras para design personalizado
    if (hasCustomDesign) {
        baseHours *= 1.3;
    }
    
    // Distribuir horas entre diferentes tipos de mão de obra
    const laborDistribution = {
        'Serralheiro': 0.4,
        'Soldador': 0.3,
        'Pintor': 0.1,
        'Ajudante': 0.2
    };
    
    // Se inclui instalação, ajustar distribuição
    if (includesInstallation) {
        laborDistribution['Instalador'] = 0.2;
        laborDistribution['Serralheiro'] = 0.3;
        laborDistribution['Soldador'] = 0.2;
        laborDistribution['Ajudante'] = 0.2;
        
        // Adicionar horas para instalação
        baseHours *= 1.3 * soilFactor;
    }
    
    // Calcular horas e custos por tipo de mão de obra
    for (const [laborType, percentage] of Object.entries(laborDistribution)) {
        const hours = baseHours * percentage;
        const rate = window.estimatorData.laborRates[laborType];
        const cost = hours * rate;
        
        laborHours[laborType] = {
            hours: hours.toFixed(2),
            rate: rate.toFixed(2),
            cost: cost.toFixed(2)
        };
        
        totalHours += hours;
        totalCost += cost;
    }
    
    return {
        laborHours,
        totalHours,
        totalCost,
        efficiencyFactor,
        soilFactor
    };
}

/**
 * Versão refinada da função de cálculo de estimativa de cronograma
 */
function refinedCalculateTimelineEstimate(
    baseTimelineDays, urgencyFactor, complexityFactor, 
    locationFactor, hasCustomDesign, includesInstallation,
    laborEfficiency, soilType, windRegion
) {
    // Fator de eficiência da mão de obra
    const efficiencyFactor = 1 / laborEfficiency;
    
    // Fator de solo (afeta instalação)
    const soilFactors = {
        'rochoso': 1.5,
        'firme': 1.0,
        'normal': 1.2,
        'mole': 1.3,
        'arenoso': 1.4
    };
    const soilFactor = soilFactors[soilType] || 1.0;
    
    // Fator de vento (afeta instalação)
    const windFactor = 1 + (parseInt(windRegion) - 1) * 0.05;
    
    // Calcular dias base ajustados pela urgência
    let totalDays = baseTimelineDays / urgencyFactor;
    
    // Ajustar pela complexidade e localização
    totalDays *= (complexityFactor * 0.7 + locationFactor * 0.3);
    
    // Ajustar pela eficiência da mão de obra
    totalDays *= efficiencyFactor;
    
    // Adicionar dias extras para design personalizado
    if (hasCustomDesign) {
        totalDays += baseTimelineDays * 0.3;
    }
    
    // Adicionar dias para instalação
    if (includesInstallation) {
        totalDays += baseTimelineDays * 0.4 * soilFactor * windFactor;
    }
    
    // Arredondar para cima
    totalDays = Math.ceil(totalDays);
    
    // Calcular datas
    const today = new Date();
    
    // Data de início (próximo dia útil)
    const startDate = getNextWorkingDay(today);
    
    // Data de fabricação (50% do tempo)
    const fabricationDays = Math.ceil(totalDays * 0.5);
    const fabricationDate = addWorkingDays(startDate, fabricationDays);
    
    // Data de instalação (se aplicável)
    let installationDate = null;
    if (includesInstallation) {
        const installationDays = Math.ceil(totalDays * 0.3);
        installationDate = addWorkingDays(fabricationDate, installationDays);
    }
    
    // Data de conclusão
    const completionDate = addWorkingDays(startDate, totalDays);
    
    // Criar cronograma detalhado
    const timeline = {
        totalDays,
        startDate: formatDate(startDate),
        fabricationDate: formatDate(fabricationDate),
        installationDate: installationDate ? formatDate(installationDate) : null,
        completionDate: formatDate(completionDate),
        milestones: [
            {
                name: 'Início do Projeto',
                date: formatDate(startDate),
                percentage: 0
            },
            {
                name: 'Preparação de Materiais',
                date: formatDate(addWorkingDays(startDate, Math.ceil(totalDays * 0.2))),
                percentage: 20
            },
            {
                name: 'Fabricação',
                date: formatDate(fabricationDate),
                percentage: 50
            }
        ]
    };
    
    // Adicionar marcos para instalação se aplicável
    if (includesInstallation) {
        timeline.milestones.push({
            name: 'Início da Instalação',
            date: formatDate(addWorkingDays(fabricationDate, 1)),
            percentage: 60
        });
        
        timeline.milestones.push({
            name: 'Instalação Concluída',
            date: formatDate(installationDate),
            percentage: 80
        });
    }
    
    // Adicionar marco de conclusão
    timeline.milestones.push({
        name: 'Conclusão do Projeto',
        date: formatDate(completionDate),
        percentage: 100
    });
    
    return timeline;
}

/**
 * Exibir resultado da estimativa refinada
 */
function displayRefinedEstimateResult(estimate) {
    // Verificar se a função original existe
    if (window.displayEstimateResult) {
        // Chamar a função original primeiro
        window.displayEstimateResult(estimate);
    }
    
    // Adicionar informações refinadas
    const resultContainer = document.getElementById('estimate-result');
    if (!resultContainer) return;
    
    // Verificar se é uma estimativa refinada
    if (estimate.version !== '2.0') return;
    
    // Adicionar seção de parâmetros avançados
    const advancedParamsSection = document.createElement('div');
    advancedParamsSection.className = 'mt-4';
    advancedParamsSection.innerHTML = `
        <h5>Parâmetros Avançados Utilizados</h5>
        <div class="table-responsive">
            <table class="table table-sm">
                <tbody>
                    <tr>
                        <th>Espaçamento entre Tesouras:</th>
                        <td>${estimate.advancedParams.tesouraSpacing} m</td>
                        <th>Espaçamento entre Terças:</th>
                        <td>${estimate.advancedParams.tercaSpacing} m</td>
                    </tr>
                    <tr>
                        <th>Fator de Desperdício:</th>
                        <td>${(estimate.advancedParams.materialWaste * 100).toFixed(0)}%</td>
                        <th>Eficiência da Mão de Obra:</th>
                        <td>${(estimate.advancedParams.laborEfficiency * 100).toFixed(0)}%</td>
                    </tr>
                    <tr>
                        <th>Inclinação do Telhado:</th>
                        <td>${(estimate.advancedParams.roofInclination * 100).toFixed(0)}%</td>
                        <th>Região de Vento:</th>
                        <td>Região ${estimate.advancedParams.windRegion}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Adicionar à seção de resultado
    const alertElement = resultContainer.querySelector('.alert');
    if (alertElement) {
        alertElement.appendChild(advancedParamsSection);
    }
    
    // Atualizar seção de materiais estimados
    const materialsContainer = document.getElementById('materials-estimate');
    if (materialsContainer && estimate.materials.tesouraCount > 0) {
        // Adicionar informações sobre tesouras e terças
        const structureInfoSection = document.createElement('div');
        structureInfoSection.className = 'mb-3 p-3 bg-light rounded';
        structureInfoSection.innerHTML = `
            <h6>Informações da Estrutura</h6>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Tesouras:</strong> ${estimate.materials.tesouraCount} unidades</p>
                    <p><strong>Espaçamento:</strong> ${estimate.advancedParams.tesouraSpacing} m</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Terças:</strong> ${estimate.materials.tercaCount} unidades</p>
                    <p><strong>Espaçamento:</strong> ${estimate.advancedParams.tercaSpacing} m</p>
                </div>
            </div>
        `;
        
        // Inserir no início do container
        if (materialsContainer.firstChild) {
            materialsContainer.insertBefore(structureInfoSection, materialsContainer.firstChild);
        } else {
            materialsContainer.appendChild(structureInfoSection);
        }
    }
    
    // Atualizar seção de análise de riscos
    const riskContainer = document.getElementById('risk-analysis');
    if (riskContainer) {
        // Adicionar informações sobre fatores de ajuste
        const factorsSection = document.createElement('div');
        factorsSection.className = 'mt-3';
        factorsSection.innerHTML = `
            <h6>Fatores de Ajuste</h6>
            <div class="table-responsive">
                <table class="table table-sm">
                    <tbody>
                        <tr>
                            <th>Fator de Desperdício:</th>
                            <td>${(estimate.materials.wasteFactor).toFixed(2)}x</td>
                        </tr>
                        <tr>
                            <th>Fator de Vento:</th>
                            <td>${(estimate.materials.windFactor).toFixed(2)}x</td>
                        </tr>
                        <tr>
                            <th>Fator de Inclinação:</th>
                            <td>${(estimate.materials.inclinationFactor).toFixed(2)}x</td>
                        </tr>
                        <tr>
                            <th>Fator de Eficiência:</th>
                            <td>${(estimate.labor.efficiencyFactor).toFixed(2)}x</td>
                        </tr>
                        <tr>
                            <th>Fator de Solo:</th>
                            <td>${(estimate.labor.soilFactor).toFixed(2)}x</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        // Adicionar ao final do container
        riskContainer.appendChild(factorsSection);
    }
}

/**
 * Funções auxiliares para cálculo de datas
 */
function getNextWorkingDay(date) {
    const result = new Date(date);
    result.setDate(result.getDate() + 1);
    
    // Pular finais de semana
    const dayOfWeek = result.getDay();
    if (dayOfWeek === 0) { // Domingo
        result.setDate(result.getDate() + 1);
    } else if (dayOfWeek === 6) { // Sábado
        result.setDate(result.getDate() + 2);
    }
    
    return result;
}

function addWorkingDays(date, days) {
    const result = new Date(date);
    let remainingDays = days;
    
    while (remainingDays > 0) {
        result.setDate(result.getDate() + 1);
        
        // Pular finais de semana
        const dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            remainingDays--;
        }
    }
    
    return result;
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR');
}

// Exportar funções para uso global
window.refinedCalculateEstimate = refinedCalculateEstimate;
window.refinedCalculateMaterialsEstimate = refinedCalculateMaterialsEstimate;
window.refinedCalculateLaborEstimate = refinedCalculateLaborEstimate;
window.refinedCalculateTimelineEstimate = refinedCalculateTimelineEstimate;
window.displayRefinedEstimateResult = displayRefinedEstimateResult;
