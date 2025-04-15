/**
 * Módulo de Gestão de Clientes
 * 
 * Este módulo implementa funcionalidades para gerenciamento
 * de clientes e histórico de projetos.
 */

class GestaoClientes {
    constructor() {
        this.clientes = [];
        this.carregarDadosLocais();
        this.configurarEventos();
    }

    /**
     * Carrega dados de clientes do armazenamento local
     */
    carregarDadosLocais() {
        const dadosClientes = localStorage.getItem('serralheria_clientes');
        if (dadosClientes) {
            try {
                this.clientes = JSON.parse(dadosClientes);
            } catch (e) {
                console.error('Erro ao carregar dados de clientes:', e);
                this.clientes = [];
            }
        }
    }

    /**
     * Salva dados de clientes no armazenamento local
     */
    salvarDadosLocais() {
        localStorage.setItem('serralheria_clientes', JSON.stringify(this.clientes));
    }

    /**
     * Configura eventos para os elementos da interface
     */
    configurarEventos() {
        // Formulário de cadastro de cliente
        const formCliente = document.getElementById('formCliente');
        if (formCliente) {
            formCliente.addEventListener('submit', (e) => {
                e.preventDefault();
                this.cadastrarCliente();
            });
        }

        // Botão de pesquisa de cliente
        const btnPesquisarCliente = document.getElementById('btnPesquisarCliente');
        if (btnPesquisarCliente) {
            btnPesquisarCliente.addEventListener('click', () => {
                const termo = document.getElementById('pesquisaCliente').value;
                this.pesquisarClientes(termo);
            });
        }
    }

    /**
     * Cadastra um novo cliente
     */
    cadastrarCliente() {
        const nome = document.getElementById('nomeCliente').value;
        const email = document.getElementById('emailCliente').value;
        const telefone = document.getElementById('telefoneCliente').value;
        const endereco = document.getElementById('enderecoCliente').value;

        if (!nome) {
            alert('Nome do cliente é obrigatório');
            return;
        }

        const novoCliente = {
            id: Date.now(),
            nome,
            email,
            telefone,
            endereco,
            dataCadastro: new Date().toISOString(),
            projetos: []
        };

        this.clientes.push(novoCliente);
        this.salvarDadosLocais();
        this.limparFormularioCliente();
        this.atualizarListaClientes();

        alert(`Cliente ${nome} cadastrado com sucesso!`);
    }

    /**
     * Limpa o formulário de cadastro de cliente
     */
    limparFormularioCliente() {
        const formCliente = document.getElementById('formCliente');
        if (formCliente) {
            formCliente.reset();
        }
    }

    /**
     * Atualiza a lista de clientes na interface
     */
    atualizarListaClientes() {
        const listaClientes = document.getElementById('listaClientes');
        if (!listaClientes) return;

        listaClientes.innerHTML = '';

        if (this.clientes.length === 0) {
            listaClientes.innerHTML = '<p class="text-center">Nenhum cliente cadastrado</p>';
            return;
        }

        this.clientes.forEach(cliente => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${cliente.nome}</h5>
                    <div>
                        <button class="btn btn-sm btn-primary btn-editar-cliente" data-id="${cliente.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-excluir-cliente" data-id="${cliente.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p><strong>Email:</strong> ${cliente.email || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco || 'Não informado'}</p>
                    <p><strong>Data de Cadastro:</strong> ${this.formatarData(cliente.dataCadastro)}</p>
                    <p><strong>Projetos:</strong> ${cliente.projetos.length}</p>
                    <button class="btn btn-outline-secondary btn-ver-projetos" data-id="${cliente.id}">
                        Ver Projetos
                    </button>
                </div>
            `;

            listaClientes.appendChild(card);

            // Adicionar eventos aos botões
            card.querySelector('.btn-editar-cliente').addEventListener('click', () => {
                this.editarCliente(cliente.id);
            });

            card.querySelector('.btn-excluir-cliente').addEventListener('click', () => {
                this.excluirCliente(cliente.id);
            });

            card.querySelector('.btn-ver-projetos').addEventListener('click', () => {
                this.verProjetosCliente(cliente.id);
            });
        });
    }

    /**
     * Pesquisa clientes por termo
     * @param {string} termo - Termo de pesquisa
     */
    pesquisarClientes(termo) {
        const listaClientes = document.getElementById('listaClientes');
        if (!listaClientes) return;

        if (!termo) {
            this.atualizarListaClientes();
            return;
        }

        const termoBusca = termo.toLowerCase();
        const clientesFiltrados = this.clientes.filter(cliente => 
            cliente.nome.toLowerCase().includes(termoBusca) ||
            (cliente.email && cliente.email.toLowerCase().includes(termoBusca)) ||
            (cliente.telefone && cliente.telefone.includes(termoBusca))
        );

        listaClientes.innerHTML = '';

        if (clientesFiltrados.length === 0) {
            listaClientes.innerHTML = '<p class="text-center">Nenhum cliente encontrado</p>';
            return;
        }

        clientesFiltrados.forEach(cliente => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${cliente.nome}</h5>
                    <div>
                        <button class="btn btn-sm btn-primary btn-editar-cliente" data-id="${cliente.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-excluir-cliente" data-id="${cliente.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p><strong>Email:</strong> ${cliente.email || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco || 'Não informado'}</p>
                    <p><strong>Data de Cadastro:</strong> ${this.formatarData(cliente.dataCadastro)}</p>
                    <p><strong>Projetos:</strong> ${cliente.projetos.length}</p>
                    <button class="btn btn-outline-secondary btn-ver-projetos" data-id="${cliente.id}">
                        Ver Projetos
                    </button>
                </div>
            `;

            listaClientes.appendChild(card);

            // Adicionar eventos aos botões
            card.querySelector('.btn-editar-cliente').addEventListener('click', () => {
                this.editarCliente(cliente.id);
            });

            card.querySelector('.btn-excluir-cliente').addEventListener('click', () => {
                this.excluirCliente(cliente.id);
            });

            card.querySelector('.btn-ver-projetos').addEventListener('click', () => {
                this.verProjetosCliente(cliente.id);
            });
        });
    }

    /**
     * Edita um cliente existente
     * @param {number} id - ID do cliente
     */
    editarCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (!cliente) {
            alert('Cliente não encontrado');
            return;
        }

        // Preencher formulário com dados do cliente
        document.getElementById('nomeCliente').value = cliente.nome;
        document.getElementById('emailCliente').value = cliente.email || '';
        document.getElementById('telefoneCliente').value = cliente.telefone || '';
        document.getElementById('enderecoCliente').value = cliente.endereco || '';

        // Alterar formulário para modo de edição
        const formCliente = document.getElementById('formCliente');
        formCliente.dataset.modo = 'edicao';
        formCliente.dataset.clienteId = id;

        // Alterar texto do botão
        const btnSubmit = formCliente.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Atualizar Cliente';

        // Adicionar botão de cancelar
        if (!document.getElementById('btnCancelarEdicao')) {
            const btnCancelar = document.createElement('button');
            btnCancelar.id = 'btnCancelarEdicao';
            btnCancelar.className = 'btn btn-outline-secondary me-2';
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.type = 'button';
            btnCancelar.addEventListener('click', () => {
                this.cancelarEdicaoCliente();
            });

            btnSubmit.parentNode.insertBefore(btnCancelar, btnSubmit);
        }

        // Alterar evento de submit do formulário
        formCliente.onsubmit = (e) => {
            e.preventDefault();
            this.atualizarCliente(id);
        };

        // Rolar até o formulário
        formCliente.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Cancela a edição de um cliente
     */
    cancelarEdicaoCliente() {
        const formCliente = document.getElementById('formCliente');
        formCliente.reset();
        formCliente.dataset.modo = 'cadastro';
        delete formCliente.dataset.clienteId;

        // Restaurar texto do botão
        const btnSubmit = formCliente.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Cadastrar Cliente';

        // Remover botão de cancelar
        const btnCancelar = document.getElementById('btnCancelarEdicao');
        if (btnCancelar) {
            btnCancelar.remove();
        }

        // Restaurar evento de submit
        formCliente.onsubmit = (e) => {
            e.preventDefault();
            this.cadastrarCliente();
        };
    }

    /**
     * Atualiza os dados de um cliente
     * @param {number} id - ID do cliente
     */
    atualizarCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (!cliente) {
            alert('Cliente não encontrado');
            return;
        }

        cliente.nome = document.getElementById('nomeCliente').value;
        cliente.email = document.getElementById('emailCliente').value;
        cliente.telefone = document.getElementById('telefoneCliente').value;
        cliente.endereco = document.getElementById('enderecoCliente').value;

        this.salvarDadosLocais();
        this.atualizarListaClientes();
        this.cancelarEdicaoCliente();

        alert(`Cliente ${cliente.nome} atualizado com sucesso!`);
    }

    /**
     * Exclui um cliente
     * @param {number} id - ID do cliente
     */
    excluirCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (!cliente) {
            alert('Cliente não encontrado');
            return;
        }

        if (!confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)) {
            return;
        }

        this.clientes = this.clientes.filter(c => c.id !== id);
        this.salvarDadosLocais();
        this.atualizarListaClientes();

        alert(`Cliente ${cliente.nome} excluído com sucesso!`);
    }

    /**
     * Exibe os projetos de um cliente
     * @param {number} id - ID do cliente
     */
    verProjetosCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (!cliente) {
            alert('Cliente não encontrado');
            return;
        }

        const modalProjetos = document.getElementById('modalProjetos');
        if (!modalProjetos) {
            alert('Modal de projetos não encontrado');
            return;
        }

        const modalTitle = modalProjetos.querySelector('.modal-title');
        modalTitle.textContent = `Projetos de ${cliente.nome}`;

        const modalBody = modalProjetos.querySelector('.modal-body');
        modalBody.innerHTML = '';

        if (cliente.projetos.length === 0) {
            modalBody.innerHTML = '<p class="text-center">Este cliente não possui projetos</p>';
        } else {
            cliente.projetos.forEach(projeto => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${projeto.nome}</h5>
                        <span class="badge ${this.getBadgeClass(projeto.nivel_risco)}">${projeto.nivel_risco.toUpperCase()}</span>
                    </div>
                    <div class="card-body">
                        <p><strong>Data:</strong> ${this.formatarData(projeto.data_criacao)}</p>
                        <p><strong>Dimensões:</strong> ${projeto.comprimento}m × ${projeto.largura}m</p>
                        <p><strong>Altura Máxima:</strong> ${projeto.altura_maxima}m</p>
                        <p><strong>Valor Total:</strong> R$ ${projeto.valor_total.toFixed(2)}</p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-primary me-2 btn-ver-orcamento" data-id="${projeto.id}">
                                Ver Orçamento
                            </button>
                            <button class="btn btn-sm btn-outline-secondary btn-visualizar-projeto" data-id="${projeto.id}">
                                Visualizar
                            </button>
                        </div>
                    </div>
                `;

                modalBody.appendChild(card);

                // Adicionar eventos aos botões
                card.querySelector('.btn-ver-orcamento').addEventListener('click', () => {
                    this.verOrcamentoProjeto(projeto.id);
                });

                card.querySelector('.btn-visualizar-projeto').addEventListener('click', () => {
                    this.visualizarProjeto(projeto.id);
                });
            });
        }

        // Exibir modal
        const modal = new bootstrap.Modal(modalProjetos);
        modal.show();
    }

    /**
     * Visualiza um projeto
     * @param {number} id - ID do projeto
     */
    visualizarProjeto(id) {
        // Implementação depende do visualizador de projetos
        alert('Funcionalidade de visualização de projeto será implementada em breve');
    }

    /**
     * Visualiza o orçamento de um projeto
     * @param {number} id - ID do projeto
     */
    verOrcamentoProjeto(id) {
        // Redirecionar para a página de orçamento
        window.open(`/api/orcamentos/${id}/pdf`, '_blank');
    }

    /**
     * Adiciona um projeto a um cliente
     * @param {number} clienteId - ID do cliente
     * @param {Object} projeto - Dados do projeto
     */
    adicionarProjetoCliente(clienteId, projeto) {
        const cliente = this.clientes.find(c => c.id === clienteId);
        if (!cliente) {
            console.error('Cliente não encontrado');
            return false;
        }

        cliente.projetos.push(projeto);
        this.salvarDadosLocais();
        return true;
    }

    /**
     * Retorna a classe CSS para o badge de nível de risco
     * @param {string} nivelRisco - Nível de risco
     * @returns {string} Classe CSS
     */
    getBadgeClass(nivelRisco) {
        switch (nivelRisco.toLowerCase()) {
            case 'baixo':
                return 'bg-success';
            case 'medio':
                return 'bg-warning text-dark';
            case 'alto':
                return 'bg-orange text-white';
            case 'muito_alto':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    /**
     * Formata uma data ISO para exibição
     * @param {string} dataISO - Data em formato ISO
     * @returns {string} Data formatada
     */
    formatarData(dataISO) {
        if (!dataISO) return 'Data não informada';
        
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR');
    }

    /**
     * Retorna um cliente pelo ID
     * @param {number} id - ID do cliente
     * @returns {Object|null} Cliente encontrado ou null
     */
    getClientePorId(id) {
        return this.clientes.find(c => c.id === id) || null;
    }

    /**
     * Retorna um cliente pelo nome
     * @param {string} nome - Nome do cliente
     * @returns {Object|null} Cliente encontrado ou null
     */
    getClientePorNome(nome) {
        return this.clientes.find(c => c.nome.toLowerCase() === nome.toLowerCase()) || null;
    }

    /**
     * Retorna todos os clientes
     * @returns {Array} Lista de clientes
     */
    getTodosClientes() {
        return [...this.clientes];
    }
}

// Exportar para uso no navegador
if (typeof window !== 'undefined') {
    window.GestaoClientes = GestaoClientes;
}

// Exportar para uso com Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GestaoClientes;
}
