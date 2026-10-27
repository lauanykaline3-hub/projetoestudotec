export type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Topic = {
  title: string;
  description: string;
  summary: string[];
  questions: Question[];
};

export type Subject = {
  name: string;
  icon: string;
  color: string;
  topics: Topic[];
};

export const MATERIAS_INICIAIS: Subject[] = [
  {
    name: "Matemática",
    icon: "∑",
    color: "blue",
    topics: [
      {
        title: "Porcentagem",
        description: "Aprenda a calcular descontos, acréscimos e proporções no dia a dia.",
        summary: [
          "Porcentagem significa uma quantidade em cada 100. O símbolo % quer dizer ‘por cento’: 25% representa 25 partes de um total de 100.",
          "Para calcular uma porcentagem, transforme-a em fração com denominador 100 ou em número decimal e multiplique pelo valor. Por exemplo: 20% de 150 = 0,20 × 150 = 30.",
          "Em um desconto, subtraia o valor calculado do preço inicial. Em um acréscimo, some esse valor. Exemplo: 15% de desconto em R$ 200 são R$ 30; o preço final é R$ 170."
        ],
        questions: [
          {
            prompt: "Uma mochila custa R$ 200 e recebeu 15% de desconto. Qual é o novo preço?",
            options: ["R$ 170", "R$ 185", "R$ 175", "R$ 160"],
            answer: 0,
            explanation: "15% de 200 é 30. Então, 200 − 30 = R$ 170."
          },
          {
            prompt: "Quanto é 20% de 150?",
            options: ["20", "25", "30", "35"],
            answer: 2,
            explanation: "20% corresponde a 0,2. Logo, 0,2 × 150 = 30."
          }
        ]
      },
      {
        title: "Frações",
        description: "Entenda como representar partes de um todo e operar com frações.",
        summary: [
          "Uma fração representa partes iguais de um todo. Em 3/4, o número de cima (numerador) indica quantas partes foram consideradas; o de baixo (denominador) indica em quantas partes iguais o todo foi dividido.",
          "Frações equivalentes têm valores iguais, mesmo com números diferentes. Para encontrar uma, multiplique ou divida o numerador e o denominador pelo mesmo número: 1/2 = 2/4 = 3/6.",
          "Para somar ou subtrair frações com o mesmo denominador, opere os numeradores e mantenha o denominador. Para denominadores diferentes, primeiro transforme as frações em equivalentes com o mesmo denominador."
        ],
        questions: [
          {
            prompt: "Qual fração é equivalente a 1/2?",
            options: ["2/3", "2/4", "3/5", "1/3"],
            answer: 1,
            explanation: "Multiplicando numerador e denominador por 2, temos 2/4."
          }
        ]
      },
      {
        title: "Equações do 1º grau",
        description: "Resolva equações simples isolando a incógnita.",
        summary: [
          "Uma equação é uma igualdade que contém um valor desconhecido, geralmente representado por uma letra como x. Resolver é descobrir qual número torna a igualdade verdadeira.",
          "Pense na equação como uma balança: qualquer operação feita de um lado precisa ser feita também do outro. Para deixar a incógnita sozinha, desfaça as operações na ordem inversa.",
          "Exemplo: 2x + 4 = 14. Subtraia 4 dos dois lados: 2x = 10. Depois divida por 2: x = 5. Confira substituindo: 2 × 5 + 4 = 14."
        ],
        questions: [
          {
            prompt: "Se 2x + 4 = 14, quanto vale x?",
            options: ["4", "5", "6", "7"],
            answer: 1,
            explanation: "Subtraindo 4: 2x = 10. Dividindo por 2: x = 5."
          }
        ]
      }
    ]
  },
  {
    name: "Língua Portuguesa",
    icon: "Aa",
    color: "coral",
    topics: [
      {
        title: "Interpretação de texto",
        description: "Identifique informações, ideias principais e sentidos implícitos.",
        summary: [
          "Interpretar um texto é compreender o que ele diz e como suas ideias se relacionam. Primeiro, identifique o assunto e quem está falando; depois observe o objetivo e as informações mais importantes.",
          "A ideia principal é o ponto central desenvolvido no texto. Títulos, repetições e conclusões costumam ajudar a encontrá-la, mas um detalhe isolado não resume o texto inteiro.",
          "Algumas informações estão implícitas: não aparecem diretamente, mas podem ser deduzidas por pistas e pelo contexto. Diferencie essa inferência de uma opinião pessoal sem apoio no texto."
        ],
        questions: [
          {
            prompt: "Ao identificar a ideia principal de um texto, o leitor deve buscar…",
            options: [
              "um detalhe isolado",
              "o assunto central desenvolvido",
              "a palavra mais longa",
              "a opinião do autor sobre qualquer tema"
            ],
            answer: 1,
            explanation: "A ideia principal resume o tema central desenvolvido ao longo do texto."
          }
        ]
      },
      {
        title: "Classes gramaticais",
        description: "Conheça as funções dos substantivos, verbos, adjetivos e outras classes.",
        summary: [
          "As classes gramaticais agrupam palavras conforme o papel que exercem. O substantivo nomeia seres, lugares, sentimentos e ideias; o artigo acompanha o substantivo; o adjetivo apresenta uma característica.",
          "O verbo indica ação, estado ou fenômeno, como ‘estudar’, ‘estar’ e ‘chover’. Pronomes podem substituir ou acompanhar nomes, enquanto advérbios modificam verbos, adjetivos ou outros advérbios.",
          "Observe a função da palavra na frase, pois uma mesma palavra pode mudar de classe conforme o uso. Em ‘a aluna estudiosa chegou’, ‘aluna’ nomeia uma pessoa (substantivo), ‘estudiosa’ a caracteriza (adjetivo) e ‘chegou’ indica uma ação (verbo)."
        ],
        questions: [
          {
            prompt: "Na frase ‘A aluna estudiosa chegou’, qual palavra é um adjetivo?",
            options: ["A", "aluna", "estudiosa", "chegou"],
            answer: 2,
            explanation: "‘Estudiosa’ caracteriza o substantivo ‘aluna’, por isso é um adjetivo."
          }
        ]
      },
      {
        title: "Ortografia",
        description: "Revise regras de escrita e acentuação das palavras.",
        summary: [
          "Ortografia é o conjunto de regras que orienta a escrita correta das palavras. Como alguns sons podem ser escritos de maneiras diferentes, consultar a família da palavra e o dicionário ajuda quando houver dúvida.",
          "A acentuação gráfica segue regras relacionadas à sílaba tônica, aquela pronunciada com mais força. Identificar a sílaba tônica é um bom primeiro passo antes de decidir se a palavra recebe acento.",
          "A prática de leitura também ajuda a memorizar a grafia. Por exemplo, ‘exceção’ escreve-se com ‘ç’ e apenas um ‘s’; quando uma dúvida persistir, confirme a forma em uma fonte confiável."
        ],
        questions: [
          {
            prompt: "Qual palavra está escrita corretamente?",
            options: ["excessão", "exceção", "esceção", "excesssão"],
            answer: 1,
            explanation: "A grafia correta é exceção, com ‘ç’ e apenas um ‘s’."
          }
        ]
      }
    ]
  },
  {
    name: "História",
    icon: "⌛",
    color: "gold",
    topics: [
      {
        title: "Brasil Colônia",
        description: "Estude a organização econômica e social do Brasil colonial.",
        summary: [
          "Brasil Colônia é o período em que o território brasileiro esteve sob domínio de Portugal, iniciado em 1500 e encerrado com a independência, em 1822. A ocupação e a economia foram organizadas para atender, principalmente, aos interesses portugueses.",
          "No começo, os portugueses exploraram o pau-brasil com trabalho indígena. Depois, a produção de açúcar ganhou força em grandes propriedades, com engenhos e trabalho de africanos escravizados.",
          "A sociedade colonial era desigual e baseada na escravidão. Ao longo do tempo, a mineração também ganhou importância, especialmente no século XVIII. Esses processos deixaram marcas na população, na economia e na organização do território."
        ],
        questions: [
          {
            prompt: "Qual atividade marcou o início da colonização portuguesa no Brasil?",
            options: ["Mineração de ouro", "Cultivo de café", "Extração do pau-brasil", "Produção de borracha"],
            answer: 2,
            explanation: "A extração do pau-brasil foi uma das primeiras atividades econômicas exploradas pelos portugueses."
          }
        ]
      },
      {
        title: "Revolução Industrial",
        description: "Compreenda as transformações do trabalho e da produção a partir do século XVIII.",
        summary: [
          "A Revolução Industrial foi a mudança da produção artesanal para a produção feita por máquinas em fábricas. Ela começou na Inglaterra, na segunda metade do século XVIII, e se espalhou para outros lugares.",
          "O uso de máquinas a vapor e a concentração de trabalhadores nas fábricas aumentaram a produção e mudaram o ritmo do trabalho. Também cresceram as cidades, com a migração de muitas pessoas do campo.",
          "As transformações trouxeram novos produtos e meios de transporte, mas as condições de trabalho eram frequentemente difíceis, com jornadas longas e baixos salários. Por isso, trabalhadores passaram a se organizar para reivindicar direitos."
        ],
        questions: [
          {
            prompt: "Em qual país começou a Primeira Revolução Industrial?",
            options: ["França", "Inglaterra", "Portugal", "Itália"],
            answer: 1,
            explanation: "A Primeira Revolução Industrial teve início na Inglaterra, no século XVIII."
          }
        ]
      }
    ]
  },
  {
    name: "Geografia",
    icon: "◉",
    color: "green",
    topics: [
      {
        title: "Biomas brasileiros",
        description: "Conheça as características dos principais biomas do Brasil.",
        summary: [
          "Bioma é uma grande região com clima, tipos de vegetação e formas de vida que têm características em comum. O Brasil possui seis biomas terrestres: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.",
          "A Amazônia é o maior bioma brasileiro e tem florestas extensas, muita biodiversidade e grande disponibilidade de água. O Cerrado apresenta árvores retorcidas e estação seca; a Caatinga tem espécies adaptadas à falta de água.",
          "Cada bioma tem relações próprias entre clima, solo, água, plantas e animais. Desmatamento, queimadas e outras mudanças podem ameaçar esse equilíbrio e a vida das comunidades locais."
        ],
        questions: [
          {
            prompt: "Qual é o maior bioma brasileiro em extensão territorial?",
            options: ["Caatinga", "Cerrado", "Amazônia", "Pantanal"],
            answer: 2,
            explanation: "O bioma Amazônia ocupa a maior extensão territorial do Brasil."
          }
        ]
      },
      {
        title: "Clima e vegetação",
        description: "Entenda a relação entre clima, solo e tipos de vegetação.",
        summary: [
          "Clima é o padrão das condições atmosféricas de uma região observado por muitos anos, como temperatura e chuva. Ele é diferente do tempo, que descreve as condições de um dia ou de poucos dias.",
          "A quantidade e a distribuição das chuvas, junto com a temperatura e a luz solar, influenciam a água disponível para as plantas. Por isso, regiões quentes e úmidas podem ter vegetação diferente de regiões secas ou frias.",
          "O solo e o relevo também influenciam quais plantas conseguem crescer. A vegetação, por sua vez, ajuda a proteger o solo e participa do ciclo da água. Assim, mudanças no clima ou no ambiente podem afetar todo esse conjunto."
        ],
        questions: [
          {
            prompt: "Qual fator influencia diretamente o tipo de vegetação de uma região?",
            options: ["Clima", "Idioma", "Fuso horário", "Moeda"],
            answer: 0,
            explanation: "Temperatura e disponibilidade de água, determinadas pelo clima, influenciam a vegetação."
          }
        ]
      }
    ]
  },
  {
    name: "Ciências",
    icon: "✳",
    color: "purple",
    topics: [
      {
        title: "Sistema solar",
        description: "Explore os planetas e outros corpos que orbitam o Sol.",
        summary: [
          "O Sistema Solar é formado pelo Sol e por todos os corpos que permanecem sob sua influência gravitacional, como planetas, luas, asteroides e cometas. O Sol é uma estrela e fornece luz e calor à Terra.",
          "Os oito planetas orbitam o Sol. Os quatro mais próximos — Mercúrio, Vênus, Terra e Marte — são rochosos; os mais distantes são gigantes gasosos ou gelados. Júpiter é o maior planeta.",
          "A Terra é o planeta onde vivemos e tem condições que permitem a existência de água líquida na superfície. A Lua é seu satélite natural e acompanha a Terra em seu movimento ao redor do Sol."
        ],
        questions: [
          {
            prompt: "Qual é o maior planeta do Sistema Solar?",
            options: ["Terra", "Saturno", "Júpiter", "Netuno"],
            answer: 2,
            explanation: "Júpiter é o maior planeta do Sistema Solar."
          }
        ]
      },
      {
        title: "Corpo humano",
        description: "Aprenda sobre os sistemas e órgãos do corpo humano.",
        summary: [
          "O corpo humano é formado por partes que trabalham em conjunto. Células formam tecidos, tecidos formam órgãos e órgãos atuam em sistemas, como o digestório, o respiratório e o circulatório.",
          "O coração faz parte do sistema circulatório: ele bombeia o sangue, que transporta oxigênio e nutrientes pelo corpo. Os pulmões participam da respiração, ajudando a levar oxigênio para o sangue e a eliminar gás carbônico.",
          "O sistema digestório transforma os alimentos para que o organismo possa absorver nutrientes. Já o cérebro e os nervos coordenam muitas atividades do corpo. Os sistemas dependem uns dos outros para manter o organismo funcionando."
        ],
        questions: [
          {
            prompt: "Qual órgão é responsável por bombear o sangue pelo corpo?",
            options: ["Pulmão", "Coração", "Fígado", "Rim"],
            answer: 1,
            explanation: "O coração bombeia o sangue para todo o corpo."
          }
        ]
      }
    ]
  }
];

