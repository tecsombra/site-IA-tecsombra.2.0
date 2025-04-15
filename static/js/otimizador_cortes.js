/**
 * Otimizador de Cortes para Perfis de Alumínio
 * 
 * Este módulo implementa um algoritmo de otimização de cortes para
 * minimizar o desperdício de material em projetos de serralheria.
 */

class OtimizadorCortes {
    constructor() {
        this.tamanhoBarraPadrao = 6000; // Tamanho padrão de barras em mm
        this.toleranciaCorte = 3; // Tolerância de corte em mm
    }

    /**
     * Define o tamanho padrão das barras
     * @param {number} tamanho - Tamanho em mm
     */
    setTamanhoBarraPadrao(tamanho) {
        this.tamanhoBarraPadrao = tamanho;
    }

    /**
     * Define a tolerância de corte
     * @param {number} tolerancia - Tolerância em mm
     */
    setToleranciaCorte(tolerancia) {
        this.toleranciaCorte = tolerancia;
    }

    /**
     * Otimiza o corte de perfis para minimizar desperdício
     * @param {Array} pecas - Array de objetos {tamanho, quantidade, descricao}
     * @returns {Object} Resultado da otimização
     */
    otimizarCortes(pecas) {
        // Validar entrada
        if (!Array.isArray(pecas) || pecas.length === 0) {
            return {
                erro: "Lista de peças vazia ou inválida",
                barras: [],
                desperdicio: 0,
                eficiencia: 0
            };
        }

        // Expandir peças conforme quantidade
        let todasPecas = [];
        pecas.forEach(peca => {
            for (let i = 0; i < peca.quantidade; i++) {
                todasPecas.push({
                    tamanho: peca.tamanho + this.toleranciaCorte,
                    descricao: peca.descricao,
                    id: `${peca.descricao}-${i+1}`
                });
            }
        });

        // Ordenar peças do maior para o menor
        todasPecas.sort((a, b) => b.tamanho - a.tamanho);

        // Algoritmo First-Fit Decreasing
        let barras = [];
        let desperdicio = 0;

        todasPecas.forEach(peca => {
            let alocada = false;

            // Tentar alocar em uma barra existente
            for (let i = 0; i < barras.length; i++) {
                if (barras[i].espacoRestante >= peca.tamanho) {
                    barras[i].pecas.push(peca);
                    barras[i].espacoRestante -= peca.tamanho;
                    barras[i].espacoUtilizado += peca.tamanho;
                    alocada = true;
                    break;
                }
            }

            // Se não foi possível alocar, criar nova barra
            if (!alocada) {
                const novaBarra = {
                    id: barras.length + 1,
                    tamanhoTotal: this.tamanhoBarraPadrao,
                    espacoRestante: this.tamanhoBarraPadrao - peca.tamanho,
                    espacoUtilizado: peca.tamanho,
                    pecas: [peca]
                };
                barras.push(novaBarra);
            }
        });

        // Calcular desperdício e eficiência
        barras.forEach(barra => {
            desperdicio += barra.espacoRestante;
            barra.desperdicio = barra.espacoRestante;
            barra.eficiencia = (barra.espacoUtilizado / this.tamanhoBarraPadrao) * 100;
        });

        const totalBarras = barras.length;
        const totalMaterial = totalBarras * this.tamanhoBarraPadrao;
        const eficienciaGlobal = ((totalMaterial - desperdicio) / totalMaterial) * 100;

        return {
            barras: barras,
            totalBarras: totalBarras,
            desperdicio: desperdicio,
            eficiencia: eficienciaGlobal,
            tamanhoBarraPadrao: this.tamanhoBarraPadrao
        };
    }

    /**
     * Gera um plano de corte visual
     * @param {Object} resultado - Resultado da otimização
     * @returns {Array} Representação visual do plano de corte
     */
    gerarPlanoCorte(resultado) {
        if (!resultado || !resultado.barras) {
            return [];
        }

        const planoCorte = [];

        resultado.barras.forEach(barra => {
            const pecasVisuais = [];
            let posicaoAtual = 0;

            barra.pecas.forEach(peca => {
                pecasVisuais.push({
                    id: peca.id,
                    descricao: peca.descricao,
                    tamanho: peca.tamanho - this.toleranciaCorte, // Remover tolerância para exibição
                    tamanhoReal: peca.tamanho,
                    posicaoInicio: posicaoAtual,
                    posicaoFim: posicaoAtual + peca.tamanho
                });
                posicaoAtual += peca.tamanho;
            });

            // Adicionar sobra como uma "peça" especial
            if (barra.desperdicio > 0) {
                pecasVisuais.push({
                    id: `sobra-${barra.id}`,
                    descricao: "Sobra",
                    tamanho: barra.desperdicio,
                    tamanhoReal: barra.desperdicio,
                    posicaoInicio: posicaoAtual,
                    posicaoFim: this.tamanhoBarraPadrao,
                    eSobra: true
                });
            }

            planoCorte.push({
                id: barra.id,
                tamanhoTotal: this.tamanhoBarraPadrao,
                eficiencia: barra.eficiencia.toFixed(2),
                pecas: pecasVisuais
            });
        });

        return planoCorte;
    }

    /**
     * Gera um relatório de corte em formato texto
     * @param {Object} resultado - Resultado da otimização
     * @returns {string} Relatório de corte
     */
    gerarRelatorioCorte(resultado) {
        if (!resultado || !resultado.barras) {
            return "Não foi possível gerar o relatório de corte.";
        }

        let relatorio = "PLANO DE CORTE DE PERFIS\n";
        relatorio += "=======================\n\n";
        relatorio += `Tamanho padrão das barras: ${resultado.tamanhoBarraPadrao}mm\n`;
        relatorio += `Total de barras necessárias: ${resultado.totalBarras}\n`;
        relatorio += `Eficiência global: ${resultado.eficiencia.toFixed(2)}%\n`;
        relatorio += `Desperdício total: ${resultado.desperdicio}mm (${(resultado.desperdicio / 1000).toFixed(2)}m)\n\n`;

        resultado.barras.forEach(barra => {
            relatorio += `BARRA #${barra.id} - Eficiência: ${barra.eficiencia.toFixed(2)}%\n`;
            relatorio += "---------------------------------------------\n";
            
            barra.pecas.forEach(peca => {
                const tamanhoExibicao = peca.tamanho - this.toleranciaCorte;
                relatorio += `- ${peca.descricao}: ${tamanhoExibicao}mm (com tolerância: ${peca.tamanho}mm)\n`;
            });
            
            relatorio += `- Sobra: ${barra.desperdicio}mm\n\n`;
        });

        return relatorio;
    }
}

// Exportar para uso no navegador
if (typeof window !== 'undefined') {
    window.OtimizadorCortes = OtimizadorCortes;
}

// Exportar para uso com Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OtimizadorCortes;
}
