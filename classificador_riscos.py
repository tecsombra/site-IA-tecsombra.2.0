import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

class ClassificadorRiscos:
    """
    Implementação avançada do classificador de riscos para projetos de serralheria.
    Combina regras baseadas em conhecimento com aprendizado de máquina para
    classificação mais precisa e adaptativa.
    """
    
    def __init__(self):
        self.modelo_path = 'modelo_classificacao_riscos.joblib'
        self.scaler_path = 'scaler_classificacao_riscos.joblib'
        
        # Inicializar modelo e scaler
        if os.path.exists(self.modelo_path) and os.path.exists(self.scaler_path):
            self.modelo = joblib.load(self.modelo_path)
            self.scaler = joblib.load(self.scaler_path)
            self.modelo_treinado = True
        else:
            self.modelo = RandomForestClassifier(n_estimators=100, random_state=42)
            self.scaler = StandardScaler()
            self.modelo_treinado = False
            self._treinar_modelo_inicial()
    
    def _treinar_modelo_inicial(self):
        """
        Treina o modelo inicial com dados sintéticos baseados nas regras de negócio.
        Isso permite que o modelo funcione mesmo sem dados históricos reais.
        """
        # Gerar dados sintéticos baseados nas regras de classificação
        X = []
        y = []
        
        # Gerar exemplos para cada nível de risco
        # Risco Baixo
        for _ in range(50):
            altura = np.random.uniform(0, 0.5)
            complexidade = np.random.uniform(0, 0.3)  # 0=baixa, 0.5=média, 1=alta
            ambiente = np.random.uniform(0, 0.3)      # 0=controlado, 0.5=externo, 1=externo_adverso
            X.append([altura, complexidade, ambiente])
            y.append(0)  # 0 = baixo
        
        # Risco Médio
        for _ in range(50):
            altura = np.random.uniform(0.5, 2.0)
            complexidade = np.random.uniform(0, 0.6)
            ambiente = np.random.uniform(0, 0.6)
            X.append([altura, complexidade, ambiente])
            y.append(1)  # 1 = médio
        
        # Risco Alto
        for _ in range(50):
            altura = np.random.uniform(2.0, 6.0)
            complexidade = np.random.uniform(0.3, 0.8)
            ambiente = np.random.uniform(0.3, 0.8)
            X.append([altura, complexidade, ambiente])
            y.append(2)  # 2 = alto
        
        # Risco Muito Alto
        for _ in range(50):
            altura = np.random.uniform(6.0, 15.0)
            complexidade = np.random.uniform(0.5, 1.0)
            ambiente = np.random.uniform(0.5, 1.0)
            X.append([altura, complexidade, ambiente])
            y.append(3)  # 3 = muito alto
        
        # Converter para arrays numpy
        X = np.array(X)
        y = np.array(y)
        
        # Normalizar os dados
        X_scaled = self.scaler.fit_transform(X)
        
        # Treinar o modelo
        self.modelo.fit(X_scaled, y)
        self.modelo_treinado = True
        
        # Salvar o modelo e o scaler
        joblib.dump(self.modelo, self.modelo_path)
        joblib.dump(self.scaler, self.scaler_path)
    
    def _converter_categorias(self, projeto):
        """
        Converte categorias textuais em valores numéricos para o modelo.
        """
        # Converter complexidade
        complexidade_map = {
            'baixa': 0.0,
            'media': 0.5,
            'alta': 1.0
        }
        complexidade = complexidade_map.get(projeto.get('complexidade', 'baixa').lower(), 0.0)
        
        # Converter ambiente
        ambiente_map = {
            'controlado': 0.0,
            'externo': 0.5,
            'externo_adverso': 1.0
        }
        ambiente = ambiente_map.get(projeto.get('ambiente', 'controlado').lower(), 0.0)
        
        return complexidade, ambiente
    
    def _classificar_por_regras(self, altura, complexidade, ambiente):
        """
        Classificação baseada em regras de negócio.
        Retorna nível de risco e fator multiplicador.
        """
        # Converter complexidade e ambiente para valores categóricos para as regras
        complexidade_cat = 'baixa'
        if complexidade > 0.7:
            complexidade_cat = 'alta'
        elif complexidade > 0.3:
            complexidade_cat = 'media'
        
        ambiente_cat = 'controlado'
        if ambiente > 0.7:
            ambiente_cat = 'externo_adverso'
        elif ambiente > 0.3:
            ambiente_cat = 'externo'
        
        # Lógica de classificação baseada na altura
        if altura <= 0.5:
            nivel_risco = 'baixo'
            fator = 1.0
            justificativa = "Trabalho ao nível do solo ou altura mínima."
        elif altura <= 2.0:
            nivel_risco = 'medio'
            fator = 1.2
            justificativa = "Trabalho em baixa altura, abaixo do limite da NR-35."
        elif altura <= 6.0:
            nivel_risco = 'alto'
            fator = 1.4
            justificativa = "Trabalho em altura conforme NR-35 (acima de 2m)."
        else:
            nivel_risco = 'muito_alto'
            fator = 1.8
            justificativa = "Trabalho em grande altura (acima de 6m)."
        
        # Ajustes baseados em outros fatores
        if complexidade_cat == 'alta':
            fator += 0.1
            justificativa += " Complexidade alta aumenta o risco."
        
        if ambiente_cat == 'externo_adverso':
            fator += 0.1
            justificativa += " Condições ambientais adversas aumentam o risco."
        
        return nivel_risco, min(fator, 2.0), justificativa
    
    def _classificar_por_modelo(self, altura, complexidade, ambiente):
        """
        Classificação usando o modelo de machine learning.
        Retorna o nível de risco como um índice (0-3).
        """
        if not self.modelo_treinado:
            return None
        
        # Preparar os dados para o modelo
        X = np.array([[altura, complexidade, ambiente]])
        X_scaled = self.scaler.transform(X)
        
        # Fazer a predição
        nivel_risco_idx = self.modelo.predict(X_scaled)[0]
        
        # Converter índice para nível de risco
        nivel_risco_map = {
            0: 'baixo',
            1: 'medio',
            2: 'alto',
            3: 'muito_alto'
        }
        
        # Converter índice para fator multiplicador
        fator_map = {
            0: 1.0,  # baixo
            1: 1.2,  # médio
            2: 1.4,  # alto
            3: 1.8   # muito alto
        }
        
        nivel_risco = nivel_risco_map[nivel_risco_idx]
        fator_base = fator_map[nivel_risco_idx]
        
        # Ajustes finos baseados em complexidade e ambiente
        ajuste = 0
        if complexidade > 0.7:  # alta complexidade
            ajuste += 0.1
        if ambiente > 0.7:  # ambiente externo adverso
            ajuste += 0.1
        
        fator = min(fator_base + ajuste, 2.0)
        
        # Gerar justificativa
        justificativa = self._gerar_justificativa(nivel_risco, altura, complexidade, ambiente)
        
        return nivel_risco, fator, justificativa
    
    def _gerar_justificativa(self, nivel_risco, altura, complexidade, ambiente):
        """
        Gera uma justificativa textual para a classificação de risco.
        """
        justificativa = ""
        
        # Justificativa baseada na altura
        if nivel_risco == 'baixo':
            justificativa = "Trabalho ao nível do solo ou altura mínima."
        elif nivel_risco == 'medio':
            justificativa = "Trabalho em baixa altura, abaixo do limite da NR-35."
        elif nivel_risco == 'alto':
            justificativa = "Trabalho em altura conforme NR-35 (acima de 2m)."
        else:  # muito_alto
            justificativa = "Trabalho em grande altura (acima de 6m)."
        
        # Adicionar detalhes sobre complexidade
        if complexidade > 0.7:
            justificativa += " Complexidade alta aumenta o risco."
        elif complexidade > 0.3:
            justificativa += " Complexidade média considerada na avaliação."
        
        # Adicionar detalhes sobre ambiente
        if ambiente > 0.7:
            justificativa += " Condições ambientais adversas aumentam o risco."
        elif ambiente > 0.3:
            justificativa += " Ambiente externo considerado na avaliação."
        
        return justificativa
    
    def atualizar_modelo(self, novos_dados):
        """
        Atualiza o modelo com novos dados de projetos classificados.
        
        Parâmetros:
        - novos_dados: lista de tuplas (características, classificação)
          onde características é uma lista [altura, complexidade, ambiente]
          e classificação é o nível de risco (0-3)
        """
        if not novos_dados:
            return False
        
        # Extrair características e classificações
        X = []
        y = []
        
        for dados, classificacao in novos_dados:
            X.append(dados)
            y.append(classificacao)
        
        X = np.array(X)
        y = np.array(y)
        
        # Atualizar o scaler com os novos dados
        X_scaled = self.scaler.transform(X)
        
        # Atualizar o modelo (treinamento incremental)
        self.modelo.fit(X_scaled, y)
        
        # Salvar o modelo e o scaler atualizados
        joblib.dump(self.modelo, self.modelo_path)
        joblib.dump(self.scaler, self.scaler_path)
        
        return True
    
    def classificar(self, projeto):
        """
        Classifica o nível de risco do projeto com base em suas características.
        Combina a abordagem baseada em regras com o modelo de machine learning.
        
        Parâmetros:
        - projeto: dicionário com informações do projeto
        
        Retorna:
        - nivel_risco: string ('baixo', 'medio', 'alto', 'muito_alto')
        - fator_multiplicador: float (valor entre 1.0 e 2.0)
        - justificativa: string explicando a classificação
        """
        # Extrair características do projeto
        altura = projeto.get('altura_maxima', 0)
        complexidade_valor, ambiente_valor = self._converter_categorias(projeto)
        
        # Classificação baseada em regras
        nivel_regras, fator_regras, justificativa_regras = self._classificar_por_regras(
            altura, complexidade_valor, ambiente_valor
        )
        
        # Classificação baseada no modelo (se disponível)
        if self.modelo_treinado:
            nivel_modelo, fator_modelo, justificativa_modelo = self._classificar_por_modelo(
                altura, complexidade_valor, ambiente_valor
            )
            
            # Combinar as duas abordagens (média ponderada)
            # Inicialmente, damos mais peso às regras (70%) do que ao modelo (30%)
            # À medida que o modelo for sendo treinado com mais dados reais,
            # essa ponderação pode ser ajustada para dar mais peso ao modelo
            peso_regras = 0.7
            peso_modelo = 0.3
            
            # Converter níveis para índices para fazer a média
            nivel_map = {
                'baixo': 0,
                'medio': 1,
                'alto': 2,
                'muito_alto': 3
            }
            nivel_regras_idx = nivel_map[nivel_regras]
            nivel_modelo_idx = nivel_map[nivel_modelo]
            
            # Calcular média ponderada
            nivel_combinado_idx = round(nivel_regras_idx * peso_regras + nivel_modelo_idx * peso_modelo)
            
            # Converter de volta para string
            nivel_combinado = list(nivel_map.keys())[nivel_combinado_idx]
            
            # Calcular fator combinado
            fator_combinado = fator_regras * peso_regras + fator_modelo * peso_modelo
            
            # Usar a justificativa mais detalhada
            justificativa = justificativa_modelo if len(justificativa_modelo) > len(justificativa_regras) else justificativa_regras
            
            return {
                'nivel_risco': nivel_combinado,
                'fator_multiplicador': min(fator_combinado, 2.0),
                'justificativa': justificativa
            }
        else:
            # Se o modelo não estiver treinado, usar apenas as regras
            return {
                'nivel_risco': nivel_regras,
                'fator_multiplicador': fator_regras,
                'justificativa': justificativa_regras
            }

# Função para calcular preço com risco
def calcular_preco_com_risco(preco_base, nivel_risco):
    """
    Aplica o fator de risco ao preço base.
    
    Parâmetros:
    - preco_base: float (preço sem considerar o risco)
    - nivel_risco: dicionário retornado pela função classificar_risco
    
    Retorna:
    - preco_final: float (preço ajustado pelo fator de risco)
    """
    return preco_base * nivel_risco['fator_multiplicador']

# Exemplo de uso
if __name__ == "__main__":
    # Criar instância do classificador
    classificador = ClassificadorRiscos()
    
    # Exemplo de projeto
    projeto = {
        'altura_maxima': 4.5,
        'complexidade': 'alta',
        'ambiente': 'externo_adverso'
    }
    
    # Classificar o risco
    resultado = classificador.classificar(projeto)
    
    print(f"Nível de risco: {resultado['nivel_risco']}")
    print(f"Fator multiplicador: {resultado['fator_multiplicador']}")
    print(f"Justificativa: {resultado['justificativa']}")
    
    # Exemplo de cálculo de preço com risco
    preco_base = 10000.0
    preco_final = calcular_preco_com_risco(preco_base, resultado)
    
    print(f"Preço base: R$ {preco_base:.2f}")
    print(f"Preço final com risco: R$ {preco_final:.2f}")
