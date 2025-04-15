// Catálogo Expandido de Materiais para Estruturas Metálicas
// Este arquivo contém uma lista abrangente de materiais comuns utilizados em serralheria e estruturas metálicas

const materiaisCatalogo = [
    // PERFIS ESTRUTURAIS
    // Perfis I e H
    {
        id: 101,
        nome: "Perfil I Laminado W150x13",
        categoria: "Perfil Estrutural",
        tipo: "Perfil I",
        dimensoes: "150x75mm",
        espessura: "5.0mm",
        peso: "13.0kg/m",
        preco: 185.50,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Perfil I laminado para estruturas de médio porte, ideal para vigas e colunas.",
        aplicacoes: "Estruturas industriais, mezaninos, suporte para lajes.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 102,
        nome: "Perfil I Laminado W200x15",
        categoria: "Perfil Estrutural",
        tipo: "Perfil I",
        dimensoes: "200x100mm",
        espessura: "5.2mm",
        peso: "15.0kg/m",
        preco: 215.80,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Perfil I laminado para estruturas de médio a grande porte.",
        aplicacoes: "Vigas principais, estruturas de galpões, edifícios.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 103,
        nome: "Perfil H Laminado W250x25.3",
        categoria: "Perfil Estrutural",
        tipo: "Perfil H",
        dimensoes: "250x250mm",
        espessura: "8.0mm",
        peso: "25.3kg/m",
        preco: 310.40,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Perfil H laminado para estruturas de grande porte, com alta resistência.",
        aplicacoes: "Pilares principais, estruturas de edifícios altos, pontes.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 104,
        nome: "Perfil H Laminado W310x38.7",
        categoria: "Perfil Estrutural",
        tipo: "Perfil H",
        dimensoes: "310x310mm",
        espessura: "10.0mm",
        peso: "38.7kg/m",
        preco: 425.60,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Perfil H laminado para estruturas de grande porte com cargas elevadas.",
        aplicacoes: "Pilares principais, estruturas de edifícios altos, pontes.",
        ultima_atualizacao: new Date().toISOString()
    },

    // Perfis U e U Enrijecido
    {
        id: 105,
        nome: "Perfil U Laminado 50x25x2.65",
        categoria: "Perfil Estrutural",
        tipo: "Perfil U",
        dimensoes: "50x25mm",
        espessura: "2.65mm",
        peso: "2.71kg/m",
        preco: 32.80,
        unidade: "metro",
        fornecedor: "GOLDONI",
        descricao: "Perfil U laminado para estruturas leves e suportes.",
        aplicacoes: "Suportes, estruturas leves, acabamentos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 106,
        nome: "Perfil U Laminado 75x40x3.00",
        categoria: "Perfil Estrutural",
        tipo: "Perfil U",
        dimensoes: "75x40mm",
        espessura: "3.00mm",
        peso: "4.87kg/m",
        preco: 48.60,
        unidade: "metro",
        fornecedor: "GOLDONI",
        descricao: "Perfil U laminado para estruturas médias e suportes.",
        aplicacoes: "Estruturas secundárias, suportes, terças.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 107,
        nome: "Perfil U Laminado 100x50x3.35",
        categoria: "Perfil Estrutural",
        tipo: "Perfil U",
        dimensoes: "100x50mm",
        espessura: "3.35mm",
        peso: "6.59kg/m",
        preco: 65.30,
        unidade: "metro",
        fornecedor: "GOLDONI",
        descricao: "Perfil U laminado para estruturas médias e suportes.",
        aplicacoes: "Estruturas secundárias, suportes, terças.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 108,
        nome: "Perfil U Enrijecido 75x40x15x2.65",
        categoria: "Perfil Estrutural",
        tipo: "Perfil U Enrijecido",
        dimensoes: "75x40x15mm",
        espessura: "2.65mm",
        peso: "5.24kg/m",
        preco: 52.40,
        unidade: "metro",
        fornecedor: "GOLDONI",
        descricao: "Perfil U enrijecido para maior resistência à flambagem.",
        aplicacoes: "Terças, longarinas, estruturas de cobertura.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 109,
        nome: "Perfil U Enrijecido 100x50x17x3.00",
        categoria: "Perfil Estrutural",
        tipo: "Perfil U Enrijecido",
        dimensoes: "100x50x17mm",
        espessura: "3.00mm",
        peso: "7.36kg/m",
        preco: 72.80,
        unidade: "metro",
        fornecedor: "GOLDONI",
        descricao: "Perfil U enrijecido para maior resistência à flambagem.",
        aplicacoes: "Terças, longarinas, estruturas de cobertura.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 110,
        nome: "Perfil U Enrijecido 150x60x20x3.35",
        categoria: "Perfil Estrutural",
        tipo: "Perfil U Enrijecido",
        dimensoes: "150x60x20mm",
        espessura: "3.35mm",
        peso: "10.85kg/m",
        preco: 108.50,
        unidade: "metro",
        fornecedor: "GOLDONI",
        descricao: "Perfil U enrijecido para maior resistência à flambagem.",
        aplicacoes: "Terças, longarinas, estruturas de cobertura.",
        ultima_atualizacao: new Date().toISOString()
    },

    // Cantoneiras
    {
        id: 111,
        nome: "Cantoneira Laminada L 1\" x 1/8\"",
        categoria: "Perfil Estrutural",
        tipo: "Cantoneira",
        dimensoes: "25.4x25.4mm",
        espessura: "3.18mm",
        peso: "1.21kg/m",
        preco: 18.90,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Cantoneira laminada para estruturas leves e suportes.",
        aplicacoes: "Suportes, estruturas leves, acabamentos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 112,
        nome: "Cantoneira Laminada L 1.1/2\" x 1/8\"",
        categoria: "Perfil Estrutural",
        tipo: "Cantoneira",
        dimensoes: "38.1x38.1mm",
        espessura: "3.18mm",
        peso: "1.85kg/m",
        preco: 28.70,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Cantoneira laminada para estruturas leves e suportes.",
        aplicacoes: "Suportes, estruturas leves, acabamentos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 113,
        nome: "Cantoneira Laminada L 2\" x 3/16\"",
        categoria: "Perfil Estrutural",
        tipo: "Cantoneira",
        dimensoes: "50.8x50.8mm",
        espessura: "4.76mm",
        peso: "3.66kg/m",
        preco: 45.30,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Cantoneira laminada para estruturas médias e suportes.",
        aplicacoes: "Estruturas secundárias, suportes, terças.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 114,
        nome: "Cantoneira Laminada L 3\" x 1/4\"",
        categoria: "Perfil Estrutural",
        tipo: "Cantoneira",
        dimensoes: "76.2x76.2mm",
        espessura: "6.35mm",
        peso: "7.26kg/m",
        preco: 89.50,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Cantoneira laminada para estruturas médias e suportes.",
        aplicacoes: "Estruturas secundárias, suportes, terças.",
        ultima_atualizacao: new Date().toISOString()
    },

    // METALON (TUBOS QUADRADOS E RETANGULARES)
    {
        id: 201,
        nome: "Metalon Quadrado 20x20",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Quadrado",
        dimensoes: "20x20mm",
        espessura: "1.20mm",
        peso: "0.69kg/m",
        preco: 15.50,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato quadrado.",
        aplicacoes: "Grades, portões, móveis, estruturas leves.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 202,
        nome: "Metalon Quadrado 30x30",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Quadrado",
        dimensoes: "30x30mm",
        espessura: "1.20mm",
        peso: "1.07kg/m",
        preco: 22.75,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato quadrado.",
        aplicacoes: "Grades, portões, móveis, estruturas leves.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 203,
        nome: "Metalon Quadrado 40x40",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Quadrado",
        dimensoes: "40x40mm",
        espessura: "1.20mm",
        peso: "1.45kg/m",
        preco: 32.90,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato quadrado.",
        aplicacoes: "Grades, portões, estruturas leves, corrimãos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 204,
        nome: "Metalon Quadrado 50x50",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Quadrado",
        dimensoes: "50x50mm",
        espessura: "1.50mm",
        peso: "2.25kg/m",
        preco: 45.60,
        unidade: "metro",
        fornecedor: "KASIFER",
        descricao: "Tubo de aço carbono com costura, formato quadrado.",
        aplicacoes: "Portões, estruturas médias, corrimãos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 205,
        nome: "Metalon Quadrado 60x60",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Quadrado",
        dimensoes: "60x60mm",
        espessura: "1.50mm",
        peso: "2.73kg/m",
        preco: 58.30,
        unidade: "metro",
        fornecedor: "KASIFER",
        descricao: "Tubo de aço carbono com costura, formato quadrado.",
        aplicacoes: "Portões, estruturas médias, corrimãos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 206,
        nome: "Metalon Quadrado 80x80",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Quadrado",
        dimensoes: "80x80mm",
        espessura: "2.00mm",
        peso: "4.83kg/m",
        preco: 92.40,
        unidade: "metro",
        fornecedor: "KASIFER",
        descricao: "Tubo de aço carbono com costura, formato quadrado.",
        aplicacoes: "Estruturas médias, pilares, vigas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 207,
        nome: "Metalon Retangular 20x30",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Retangular",
        dimensoes: "20x30mm",
        espessura: "1.20mm",
        peso: "0.88kg/m",
        preco: 19.80,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato retangular.",
        aplicacoes: "Grades, portões, móveis, estruturas leves.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 208,
        nome: "Metalon Retangular 30x40",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Retangular",
        dimensoes: "30x40mm",
        espessura: "1.20mm",
        peso: "1.26kg/m",
        preco: 28.50,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato retangular.",
        aplicacoes: "Grades, portões, móveis, estruturas leves.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 209,
        nome: "Metalon Retangular 40x60",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Retangular",
        dimensoes: "40x60mm",
        espessura: "1.50mm",
        peso: "2.25kg/m",
        preco: 42.90,
        unidade: "metro",
        fornecedor: "KASIFER",
        descricao: "Tubo de aço carbono com costura, formato retangular.",
        aplicacoes: "Portões, estruturas médias, corrimãos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 210,
        nome: "Metalon Retangular 50x70",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Retangular",
        dimensoes: "50x70mm",
        espessura: "1.50mm",
        peso: "2.73kg/m",
        preco: 55.40,
        unidade: "metro",
        fornecedor: "KASIFER",
        descricao: "Tubo de aço carbono com costura, formato retangular.",
        aplicacoes: "Portões, estruturas médias, corrimãos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 211,
        nome: "Metalon Retangular 80x120",
        categoria: "Perfil Estrutural",
        tipo: "Metalon Retangular",
        dimensoes: "80x120mm",
        espessura: "2.00mm",
        peso: "6.03kg/m",
        preco: 115.80,
        unidade: "metro",
        fornecedor: "KASIFER",
        descricao: "Tubo de aço carbono com costura, formato retangular.",
        aplicacoes: "Estruturas médias, vigas, pilares.",
        ultima_atualizacao: new Date().toISOString()
    },

    // TUBOS REDONDOS
    {
        id: 301,
        nome: "Tubo Redondo 1\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "25.4mm (1 polegada)",
        espessura: "1.20mm",
        peso: "0.71kg/m",
        preco: 18.50,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Grades, corrimãos, estruturas leves.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 302,
        nome: "Tubo Redondo 1.1/4\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "31.75mm (1.1/4 polegada)",
        espessura: "1.20mm",
        peso: "0.90kg/m",
        preco: 23.70,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Grades, corrimãos, estruturas leves.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 303,
        nome: "Tubo Redondo 1.1/2\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "38.1mm (1.1/2 polegada)",
        espessura: "1.50mm",
        peso: "1.35kg/m",
        preco: 28.90,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Corrimãos, estruturas leves, guarda-corpos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 304,
        nome: "Tubo Redondo 2\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "50.8mm (2 polegadas)",
        espessura: "1.50mm",
        peso: "1.82kg/m",
        preco: 38.70,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Corrimãos, estruturas médias, guarda-corpos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 305,
        nome: "Tubo Redondo 2.1/2\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "63.5mm (2.1/2 polegadas)",
        espessura: "1.50mm",
        peso: "2.28kg/m",
        preco: 48.50,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Estruturas médias, colunas, guarda-corpos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 306,
        nome: "Tubo Redondo 3\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "76.2mm (3 polegadas)",
        espessura: "2.00mm",
        peso: "3.65kg/m",
        preco: 72.30,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Estruturas médias, colunas, guarda-corpos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 307,
        nome: "Tubo Redondo 4\"",
        categoria: "Perfil Estrutural",
        tipo: "Tubo Redondo",
        dimensoes: "101.6mm (4 polegadas)",
        espessura: "2.25mm",
        peso: "5.44kg/m",
        preco: 108.60,
        unidade: "metro",
        fornecedor: "SILFER",
        descricao: "Tubo de aço carbono com costura, formato redondo.",
        aplicacoes: "Estruturas médias a pesadas, colunas.",
        ultima_atualizacao: new Date().toISOString()
    },

    // BARRAS
    {
        id: 401,
        nome: "Barra Chata 1\" x 1/8\"",
        categoria: "Barra",
        tipo: "Barra Chata",
        dimensoes: "25.4x3.18mm",
        espessura: "3.18mm",
        peso: "0.63kg/m",
        preco: 12.40,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato retangular.",
        aplicacoes: "Reforços, suportes, elementos decorativos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 402,
        nome: "Barra Chata 1.1/2\" x 1/8\"",
        categoria: "Barra",
        tipo: "Barra Chata",
        dimensoes: "38.1x3.18mm",
        espessura: "3.18mm",
        peso: "0.95kg/m",
        preco: 18.60,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato retangular.",
        aplicacoes: "Reforços, suportes, elementos decorativos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 403,
        nome: "Barra Chata 2\" x 3/16\"",
        categoria: "Barra",
        tipo: "Barra Chata",
        dimensoes: "50.8x4.76mm",
        espessura: "4.76mm",
        peso: "1.90kg/m",
        preco: 36.80,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato retangular.",
        aplicacoes: "Reforços, suportes, elementos decorativos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 404,
        nome: "Barra Chata 3\" x 1/4\"",
        categoria: "Barra",
        tipo: "Barra Chata",
        dimensoes: "76.2x6.35mm",
        espessura: "6.35mm",
        peso: "3.80kg/m",
        preco: 74.50,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato retangular.",
        aplicacoes: "Reforços, suportes, elementos estruturais.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 405,
        nome: "Barra Redonda 3/8\"",
        categoria: "Barra",
        tipo: "Barra Redonda",
        dimensoes: "9.53mm (3/8 polegada)",
        espessura: "9.53mm",
        peso: "0.56kg/m",
        preco: 10.90,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato redondo.",
        aplicacoes: "Elementos decorativos, suportes, eixos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 406,
        nome: "Barra Redonda 1/2\"",
        categoria: "Barra",
        tipo: "Barra Redonda",
        dimensoes: "12.7mm (1/2 polegada)",
        espessura: "12.7mm",
        peso: "0.99kg/m",
        preco: 19.30,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato redondo.",
        aplicacoes: "Elementos decorativos, suportes, eixos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 407,
        nome: "Barra Redonda 5/8\"",
        categoria: "Barra",
        tipo: "Barra Redonda",
        dimensoes: "15.88mm (5/8 polegada)",
        espessura: "15.88mm",
        peso: "1.55kg/m",
        preco: 30.20,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato redondo.",
        aplicacoes: "Elementos decorativos, suportes, eixos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 408,
        nome: "Barra Redonda 3/4\"",
        categoria: "Barra",
        tipo: "Barra Redonda",
        dimensoes: "19.05mm (3/4 polegada)",
        espessura: "19.05mm",
        peso: "2.23kg/m",
        preco: 43.50,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato redondo.",
        aplicacoes: "Elementos decorativos, suportes, eixos.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 409,
        nome: "Barra Quadrada 3/8\"",
        categoria: "Barra",
        tipo: "Barra Quadrada",
        dimensoes: "9.53x9.53mm",
        espessura: "9.53mm",
        peso: "0.71kg/m",
        preco: 13.80,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato quadrado.",
        aplicacoes: "Elementos decorativos, suportes, reforços.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 410,
        nome: "Barra Quadrada 1/2\"",
        categoria: "Barra",
        tipo: "Barra Quadrada",
        dimensoes: "12.7x12.7mm",
        espessura: "12.7mm",
        peso: "1.26kg/m",
        preco: 24.60,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato quadrado.",
        aplicacoes: "Elementos decorativos, suportes, reforços.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 411,
        nome: "Barra Quadrada 5/8\"",
        categoria: "Barra",
        tipo: "Barra Quadrada",
        dimensoes: "15.88x15.88mm",
        espessura: "15.88mm",
        peso: "1.97kg/m",
        preco: 38.40,
        unidade: "metro",
        fornecedor: "GERDAU",
        descricao: "Barra de aço carbono laminada, formato quadrado.",
        aplicacoes: "Elementos decorativos, suportes, reforços.",
        ultima_atualizacao: new Date().toISOString()
    },

    // CHAPAS
    {
        id: 501,
        nome: "Chapa Preta #18",
        categoria: "Chapa",
        tipo: "Chapa Preta",
        dimensoes: "1200x3000mm",
        espessura: "1.20mm",
        peso: "28.08kg/chapa",
        preco: 110.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Chapa de aço carbono laminada a quente.",
        aplicacoes: "Fechamentos, bases, estruturas diversas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 502,
        nome: "Chapa Preta #20",
        categoria: "Chapa",
        tipo: "Chapa Preta",
        dimensoes: "1200x3000mm",
        espessura: "0.90mm",
        peso: "21.06kg/chapa",
        preco: 85.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Chapa de aço carbono laminada a quente.",
        aplicacoes: "Fechamentos, bases, estruturas diversas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 503,
        nome: "Chapa Preta #16",
        categoria: "Chapa",
        tipo: "Chapa Preta",
        dimensoes: "1200x3000mm",
        espessura: "1.50mm",
        peso: "35.10kg/chapa",
        preco: 138.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Chapa de aço carbono laminada a quente.",
        aplicacoes: "Fechamentos, bases, estruturas diversas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 504,
        nome: "Chapa Galvanizada #18",
        categoria: "Chapa",
        tipo: "Chapa Galvanizada",
        dimensoes: "1200x3000mm",
        espessura: "1.20mm",
        peso: "28.08kg/chapa",
        preco: 120.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Chapa de aço carbono com revestimento de zinco.",
        aplicacoes: "Fechamentos, calhas, rufos, coberturas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 505,
        nome: "Chapa Galvanizada #20",
        categoria: "Chapa",
        tipo: "Chapa Galvanizada",
        dimensoes: "1200x3000mm",
        espessura: "0.90mm",
        peso: "21.06kg/chapa",
        preco: 95.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Chapa de aço carbono com revestimento de zinco.",
        aplicacoes: "Fechamentos, calhas, rufos, coberturas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 506,
        nome: "Chapa Galvanizada #16",
        categoria: "Chapa",
        tipo: "Chapa Galvanizada",
        dimensoes: "1200x3000mm",
        espessura: "1.50mm",
        peso: "35.10kg/chapa",
        preco: 150.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Chapa de aço carbono com revestimento de zinco.",
        aplicacoes: "Fechamentos, calhas, rufos, coberturas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 507,
        nome: "Chapa Galvalume #18",
        categoria: "Chapa",
        tipo: "Chapa Galvalume",
        dimensoes: "1200x3000mm",
        espessura: "1.20mm",
        peso: "28.08kg/chapa",
        preco: 135.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Chapa de aço carbono com revestimento de alumínio e zinco.",
        aplicacoes: "Fechamentos, coberturas, telhas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 508,
        nome: "Chapa Galvalume #20",
        categoria: "Chapa",
        tipo: "Chapa Galvalume",
        dimensoes: "1200x3000mm",
        espessura: "0.90mm",
        peso: "21.06kg/chapa",
        preco: 110.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Chapa de aço carbono com revestimento de alumínio e zinco.",
        aplicacoes: "Fechamentos, coberturas, telhas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 509,
        nome: "Chapa Xadrez #16",
        categoria: "Chapa",
        tipo: "Chapa Xadrez",
        dimensoes: "1200x3000mm",
        espessura: "1.50mm",
        peso: "37.80kg/chapa",
        preco: 165.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Chapa de aço carbono com superfície antiderrapante.",
        aplicacoes: "Pisos, escadas, rampas.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 510,
        nome: "Chapa Xadrez #14",
        categoria: "Chapa",
        tipo: "Chapa Xadrez",
        dimensoes: "1200x3000mm",
        espessura: "1.90mm",
        peso: "47.88kg/chapa",
        preco: 210.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Chapa de aço carbono com superfície antiderrapante.",
        aplicacoes: "Pisos, escadas, rampas.",
        ultima_atualizacao: new Date().toISOString()
    },

    // TELHAS
    {
        id: 601,
        nome: "Telha Trapezoidal Galvanizada 0.43mm",
        categoria: "Telha",
        tipo: "Telha Trapezoidal",
        dimensoes: "Largura útil: 980mm",
        espessura: "0.43mm",
        peso: "3.80kg/m²",
        preco: 45.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Telha de aço galvanizado com perfil trapezoidal.",
        aplicacoes: "Coberturas industriais, comerciais e residenciais.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 602,
        nome: "Telha Trapezoidal Galvanizada 0.50mm",
        categoria: "Telha",
        tipo: "Telha Trapezoidal",
        dimensoes: "Largura útil: 980mm",
        espessura: "0.50mm",
        peso: "4.42kg/m²",
        preco: 52.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Telha de aço galvanizado com perfil trapezoidal.",
        aplicacoes: "Coberturas industriais, comerciais e residenciais.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 603,
        nome: "Telha Ondulada Galvanizada 0.43mm",
        categoria: "Telha",
        tipo: "Telha Ondulada",
        dimensoes: "Largura útil: 980mm",
        espessura: "0.43mm",
        peso: "3.80kg/m²",
        preco: 42.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Telha de aço galvanizado com perfil ondulado.",
        aplicacoes: "Coberturas industriais, comerciais e residenciais.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 604,
        nome: "Telha Ondulada Galvanizada 0.50mm",
        categoria: "Telha",
        tipo: "Telha Ondulada",
        dimensoes: "Largura útil: 980mm",
        espessura: "0.50mm",
        peso: "4.42kg/m²",
        preco: 49.00,
        unidade: "metro²",
        fornecedor: "KASIFER",
        descricao: "Telha de aço galvanizado com perfil ondulado.",
        aplicacoes: "Coberturas industriais, comerciais e residenciais.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 605,
        nome: "Telha Trapezoidal Galvalume 0.43mm",
        categoria: "Telha",
        tipo: "Telha Trapezoidal",
        dimensoes: "Largura útil: 980mm",
        espessura: "0.43mm",
        peso: "3.80kg/m²",
        preco: 55.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Telha de aço galvalume com perfil trapezoidal.",
        aplicacoes: "Coberturas industriais, comerciais e residenciais.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 606,
        nome: "Telha Trapezoidal Galvalume 0.50mm",
        categoria: "Telha",
        tipo: "Telha Trapezoidal",
        dimensoes: "Largura útil: 980mm",
        espessura: "0.50mm",
        peso: "4.42kg/m²",
        preco: 62.00,
        unidade: "metro²",
        fornecedor: "GOLDONI",
        descricao: "Telha de aço galvalume com perfil trapezoidal.",
        aplicacoes: "Coberturas industriais, comerciais e residenciais.",
        ultima_atualizacao: new Date().toISOString()
    },

    // ACESSÓRIOS E CONSUMÍVEIS
    {
        id: 701,
        nome: "Eletrodo 6013 2.50mm",
        categoria: "Consumível",
        tipo: "Eletrodo",
        dimensoes: "2.50mm x 350mm",
        espessura: "2.50mm",
        peso: "1kg = aprox. 39 unidades",
        preco: 25.00,
        unidade: "kg",
        fornecedor: "GOLDONI",
        descricao: "Eletrodo revestido para soldagem de aço carbono.",
        aplicacoes: "Soldagem de estruturas metálicas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 702,
        nome: "Eletrodo 6013 3.25mm",
        categoria: "Consumível",
        tipo: "Eletrodo",
        dimensoes: "3.25mm x 350mm",
        espessura: "3.25mm",
        peso: "1kg = aprox. 23 unidades",
        preco: 24.00,
        unidade: "kg",
        fornecedor: "GOLDONI",
        descricao: "Eletrodo revestido para soldagem de aço carbono.",
        aplicacoes: "Soldagem de estruturas metálicas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 703,
        nome: "Disco de Corte 7\"",
        categoria: "Consumível",
        tipo: "Disco",
        dimensoes: "7 polegadas (178mm)",
        espessura: "1.6mm",
        peso: "0.58kg/unidade",
        preco: 12.50,
        unidade: "unidade",
        fornecedor: "SILFER",
        descricao: "Disco abrasivo para corte de metais.",
        aplicacoes: "Corte de perfis, chapas, barras.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 704,
        nome: "Disco de Corte 4.1/2\"",
        categoria: "Consumível",
        tipo: "Disco",
        dimensoes: "4.1/2 polegadas (115mm)",
        espessura: "1.0mm",
        peso: "0.22kg/unidade",
        preco: 5.80,
        unidade: "unidade",
        fornecedor: "SILFER",
        descricao: "Disco abrasivo para corte de metais.",
        aplicacoes: "Corte de perfis, chapas, barras.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 705,
        nome: "Disco de Desbaste 7\"",
        categoria: "Consumível",
        tipo: "Disco",
        dimensoes: "7 polegadas (178mm)",
        espessura: "6.4mm",
        peso: "0.78kg/unidade",
        preco: 18.90,
        unidade: "unidade",
        fornecedor: "SILFER",
        descricao: "Disco abrasivo para desbaste de metais.",
        aplicacoes: "Desbaste de soldas, preparação de superfícies.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 706,
        nome: "Disco de Desbaste 4.1/2\"",
        categoria: "Consumível",
        tipo: "Disco",
        dimensoes: "4.1/2 polegadas (115mm)",
        espessura: "6.4mm",
        peso: "0.30kg/unidade",
        preco: 8.50,
        unidade: "unidade",
        fornecedor: "SILFER",
        descricao: "Disco abrasivo para desbaste de metais.",
        aplicacoes: "Desbaste de soldas, preparação de superfícies.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 707,
        nome: "Parafuso Autobrocante 4.2x13",
        categoria: "Fixação",
        tipo: "Parafuso",
        dimensoes: "4.2x13mm",
        espessura: "4.2mm",
        peso: "0.002kg/unidade",
        preco: 0.35,
        unidade: "unidade",
        fornecedor: "SILFER",
        descricao: "Parafuso autobrocante com cabeça sextavada e arruela.",
        aplicacoes: "Fixação de telhas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 708,
        nome: "Parafuso Autobrocante 4.8x19",
        categoria: "Fixação",
        tipo: "Parafuso",
        dimensoes: "4.8x19mm",
        espessura: "4.8mm",
        peso: "0.003kg/unidade",
        preco: 0.45,
        unidade: "unidade",
        fornecedor: "SILFER",
        descricao: "Parafuso autobrocante com cabeça sextavada e arruela.",
        aplicacoes: "Fixação de telhas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 709,
        nome: "Tinta Anticorrosiva",
        categoria: "Acabamento",
        tipo: "Tinta",
        dimensoes: "N/A",
        espessura: "N/A",
        peso: "3.6kg/galão",
        preco: 85.00,
        unidade: "litro",
        fornecedor: "KASIFER",
        descricao: "Tinta anticorrosiva para proteção de estruturas metálicas.",
        aplicacoes: "Proteção de estruturas metálicas contra corrosão.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 710,
        nome: "Primer Universal",
        categoria: "Acabamento",
        tipo: "Primer",
        dimensoes: "N/A",
        espessura: "N/A",
        peso: "3.6kg/galão",
        preco: 65.00,
        unidade: "litro",
        fornecedor: "KASIFER",
        descricao: "Primer para preparação de superfícies metálicas.",
        aplicacoes: "Preparação de superfícies metálicas para pintura.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 711,
        nome: "Arame MIG 1.0mm",
        categoria: "Consumível",
        tipo: "Arame",
        dimensoes: "1.0mm",
        espessura: "1.0mm",
        peso: "15kg/rolo",
        preco: 320.00,
        unidade: "rolo",
        fornecedor: "GOLDONI",
        descricao: "Arame para soldagem MIG de aço carbono.",
        aplicacoes: "Soldagem de estruturas metálicas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 712,
        nome: "Arame MIG 0.8mm",
        categoria: "Consumível",
        tipo: "Arame",
        dimensoes: "0.8mm",
        espessura: "0.8mm",
        peso: "15kg/rolo",
        preco: 340.00,
        unidade: "rolo",
        fornecedor: "GOLDONI",
        descricao: "Arame para soldagem MIG de aço carbono.",
        aplicacoes: "Soldagem de estruturas metálicas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    },
    {
        id: 713,
        nome: "Vareta TIG ER70S-6",
        categoria: "Consumível",
        tipo: "Vareta",
        dimensoes: "2.4mm x 1000mm",
        espessura: "2.4mm",
        peso: "5kg/pacote",
        preco: 180.00,
        unidade: "kg",
        fornecedor: "GOLDONI",
        descricao: "Vareta para soldagem TIG de aço carbono.",
        aplicacoes: "Soldagem de estruturas metálicas, chapas, perfis.",
        ultima_atualizacao: new Date().toISOString()
    }
];

// Exportar o catálogo para uso em outros módulos
window.materiaisCatalogo = materiaisCatalogo;
