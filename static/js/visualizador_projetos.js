/**
 * Visualizador de Projetos para Serralheria
 * 
 * Este módulo implementa funcionalidades para visualização
 * e manipulação de projetos de serralheria em 2D.
 */

class VisualizadorProjetos {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container com ID ${containerId} não encontrado`);
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.escala = 20; // pixels por centímetro
        this.offsetX = 50;
        this.offsetY = 50;
        this.arrastando = false;
        this.ultimoX = 0;
        this.ultimoY = 0;
        
        this.projeto = null;
        this.elementos = [];
        
        this.inicializarEventos();
        this.redimensionarCanvas();
    }
    
    /**
     * Inicializa os eventos de interação com o canvas
     */
    inicializarEventos() {
        window.addEventListener('resize', () => this.redimensionarCanvas());
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.arrastando = true;
            this.ultimoX = e.clientX;
            this.ultimoY = e.clientY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.arrastando) {
                const deltaX = e.clientX - this.ultimoX;
                const deltaY = e.clientY - this.ultimoY;
                
                this.offsetX += deltaX;
                this.offsetY += deltaY;
                
                this.ultimoX = e.clientX;
                this.ultimoY = e.clientY;
                
                this.renderizar();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.arrastando = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.arrastando = false;
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Ajustar escala com base no scroll
            const delta = e.deltaY > 0 ? -1 : 1;
            const fatorEscala = 1.1;
            
            // Calcular nova escala
            const novaEscala = delta > 0 
                ? this.escala * fatorEscala 
                : this.escala / fatorEscala;
            
            // Limitar escala
            if (novaEscala >= 5 && novaEscala <= 100) {
                this.escala = novaEscala;
                this.renderizar();
            }
        });
    }
    
    /**
     * Redimensiona o canvas para ocupar todo o container
     */
    redimensionarCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.renderizar();
    }
    
    /**
     * Carrega um projeto para visualização
     * @param {Object} projeto - Dados do projeto
     */
    carregarProjeto(projeto) {
        this.projeto = projeto;
        this.elementos = [];
        
        // Criar elementos básicos com base nas dimensões do projeto
        if (projeto.comprimento && projeto.largura) {
            // Adicionar estrutura básica
            this.elementos.push({
                tipo: 'retangulo',
                x: 0,
                y: 0,
                largura: projeto.comprimento * 100, // converter para cm
                altura: projeto.largura * 100,      // converter para cm
                cor: '#3498db',
                espessura: 2,
                preenchimento: 'rgba(52, 152, 219, 0.1)',
                nome: 'Estrutura Principal'
            });
            
            // Adicionar elementos baseados na altura
            if (projeto.altura_maxima > 0) {
                // Adicionar colunas nos cantos
                const alturaColuna = projeto.altura_maxima * 100; // converter para cm
                const larguraColuna = 10; // 10cm
                
                // Coluna 1 (canto superior esquerdo)
                this.elementos.push({
                    tipo: 'retangulo',
                    x: 0,
                    y: 0,
                    largura: larguraColuna,
                    altura: alturaColuna,
                    cor: '#2c3e50',
                    espessura: 2,
                    preenchimento: 'rgba(44, 62, 80, 0.7)',
                    nome: 'Coluna 1'
                });
                
                // Coluna 2 (canto superior direito)
                this.elementos.push({
                    tipo: 'retangulo',
                    x: projeto.comprimento * 100 - larguraColuna,
                    y: 0,
                    largura: larguraColuna,
                    altura: alturaColuna,
                    cor: '#2c3e50',
                    espessura: 2,
                    preenchimento: 'rgba(44, 62, 80, 0.7)',
                    nome: 'Coluna 2'
                });
                
                // Coluna 3 (canto inferior esquerdo)
                this.elementos.push({
                    tipo: 'retangulo',
                    x: 0,
                    y: projeto.largura * 100 - larguraColuna,
                    largura: larguraColuna,
                    altura: alturaColuna,
                    cor: '#2c3e50',
                    espessura: 2,
                    preenchimento: 'rgba(44, 62, 80, 0.7)',
                    nome: 'Coluna 3'
                });
                
                // Coluna 4 (canto inferior direito)
                this.elementos.push({
                    tipo: 'retangulo',
                    x: projeto.comprimento * 100 - larguraColuna,
                    y: projeto.largura * 100 - larguraColuna,
                    largura: larguraColuna,
                    altura: alturaColuna,
                    cor: '#2c3e50',
                    espessura: 2,
                    preenchimento: 'rgba(44, 62, 80, 0.7)',
                    nome: 'Coluna 4'
                });
            }
        }
        
        this.renderizar();
    }
    
    /**
     * Adiciona um elemento ao projeto
     * @param {Object} elemento - Elemento a ser adicionado
     */
    adicionarElemento(elemento) {
        this.elementos.push(elemento);
        this.renderizar();
    }
    
    /**
     * Renderiza o projeto no canvas
     */
    renderizar() {
        if (!this.ctx) return;
        
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar grade
        this.desenharGrade();
        
        // Desenhar elementos
        this.elementos.forEach(elemento => {
            this.desenharElemento(elemento);
        });
        
        // Desenhar informações do projeto
        this.desenharInformacoesProjeto();
    }
    
    /**
     * Desenha uma grade de referência no canvas
     */
    desenharGrade() {
        const largura = this.canvas.width;
        const altura = this.canvas.height;
        
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;
        
        // Linhas verticais
        for (let x = this.offsetX % (this.escala * 10); x < largura; x += this.escala * 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, altura);
            this.ctx.stroke();
        }
        
        // Linhas horizontais
        for (let y = this.offsetY % (this.escala * 10); y < altura; y += this.escala * 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(largura, y);
            this.ctx.stroke();
        }
        
        // Linhas de grade menores
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 0.25;
        
        // Linhas verticais menores
        for (let x = this.offsetX % this.escala; x < largura; x += this.escala) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, altura);
            this.ctx.stroke();
        }
        
        // Linhas horizontais menores
        for (let y = this.offsetY % this.escala; y < altura; y += this.escala) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(largura, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Desenha um elemento no canvas
     * @param {Object} elemento - Elemento a ser desenhado
     */
    desenharElemento(elemento) {
        switch (elemento.tipo) {
            case 'retangulo':
                this.desenharRetangulo(elemento);
                break;
            case 'linha':
                this.desenharLinha(elemento);
                break;
            case 'circulo':
                this.desenharCirculo(elemento);
                break;
            case 'texto':
                this.desenharTexto(elemento);
                break;
        }
    }
    
    /**
     * Desenha um retângulo no canvas
     * @param {Object} elemento - Dados do retângulo
     */
    desenharRetangulo(elemento) {
        const x = this.offsetX + elemento.x * this.escala / 100;
        const y = this.offsetY + elemento.y * this.escala / 100;
        const largura = elemento.largura * this.escala / 100;
        const altura = elemento.altura * this.escala / 100;
        
        this.ctx.strokeStyle = elemento.cor || '#000';
        this.ctx.lineWidth = elemento.espessura || 1;
        
        if (elemento.preenchimento) {
            this.ctx.fillStyle = elemento.preenchimento;
            this.ctx.fillRect(x, y, largura, altura);
        }
        
        this.ctx.strokeRect(x, y, largura, altura);
        
        // Adicionar nome do elemento
        if (elemento.nome) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(elemento.nome, x + 5, y + 15);
        }
    }
    
    /**
     * Desenha uma linha no canvas
     * @param {Object} elemento - Dados da linha
     */
    desenharLinha(elemento) {
        const x1 = this.offsetX + elemento.x1 * this.escala / 100;
        const y1 = this.offsetY + elemento.y1 * this.escala / 100;
        const x2 = this.offsetX + elemento.x2 * this.escala / 100;
        const y2 = this.offsetY + elemento.y2 * this.escala / 100;
        
        this.ctx.strokeStyle = elemento.cor || '#000';
        this.ctx.lineWidth = elemento.espessura || 1;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Adicionar nome do elemento
        if (elemento.nome) {
            const xMedio = (x1 + x2) / 2;
            const yMedio = (y1 + y2) / 2;
            
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(elemento.nome, xMedio, yMedio - 5);
        }
    }
    
    /**
     * Desenha um círculo no canvas
     * @param {Object} elemento - Dados do círculo
     */
    desenharCirculo(elemento) {
        const x = this.offsetX + elemento.x * this.escala / 100;
        const y = this.offsetY + elemento.y * this.escala / 100;
        const raio = elemento.raio * this.escala / 100;
        
        this.ctx.strokeStyle = elemento.cor || '#000';
        this.ctx.lineWidth = elemento.espessura || 1;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, raio, 0, Math.PI * 2);
        
        if (elemento.preenchimento) {
            this.ctx.fillStyle = elemento.preenchimento;
            this.ctx.fill();
        }
        
        this.ctx.stroke();
        
        // Adicionar nome do elemento
        if (elemento.nome) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(elemento.nome, x - raio, y - raio - 5);
        }
    }
    
    /**
     * Desenha texto no canvas
     * @param {Object} elemento - Dados do texto
     */
    desenharTexto(elemento) {
        const x = this.offsetX + elemento.x * this.escala / 100;
        const y = this.offsetY + elemento.y * this.escala / 100;
        
        this.ctx.fillStyle = elemento.cor || '#000';
        this.ctx.font = `${elemento.tamanho || 12}px ${elemento.fonte || 'Arial'}`;
        this.ctx.fillText(elemento.texto, x, y);
    }
    
    /**
     * Desenha informações do projeto no canvas
     */
    desenharInformacoesProjeto() {
        if (!this.projeto) return;
        
        const infoX = 10;
        const infoY = this.canvas.height - 100;
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(infoX, infoY, 300, 90);
        this.ctx.strokeStyle = '#333';
        this.ctx.strokeRect(infoX, infoY, 300, 90);
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText(`Projeto: ${this.projeto.nome}`, infoX + 10, infoY + 20);
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Dimensões: ${this.projeto.comprimento}m × ${this.projeto.largura}m`, infoX + 10, infoY + 40);
        this.ctx.fillText(`Altura máxima: ${this.projeto.altura_maxima}m`, infoX + 10, infoY + 60);
        this.ctx.fillText(`Nível de risco: ${this.projeto.nivel_risco.toUpperCase()}`, infoX + 10, infoY + 80);
    }
    
    /**
     * Exporta a visualização atual como imagem
     * @returns {string} URL da imagem em formato base64
     */
    exportarImagem() {
        return this.canvas.toDataURL('image/png');
    }
}

// Exportar para uso no navegador
if (typeof window !== 'undefined') {
    window.VisualizadorProjetos = VisualizadorProjetos;
}

// Exportar para uso com Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualizadorProjetos;
}
