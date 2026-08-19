
const CORES = {
    'Universal': '#ec4899',
    'Escola Pública': '#38bdf8',
    'Escola Pública - Negros': '#a78bfa',
    'Negros': '#facc15',
    'PcD': '#4ade80',
    'Total': '#f97316'
};

const els = {
    heroSubtitulo: document.getElementById('heroSubtitulo'),
    kpis: document.getElementById('kpis'),
    curso: document.getElementById('filtroCurso'),
    cota: document.getElementById('filtroCota'),
    busca: document.getElementById('filtroBusca'),
    tabela: document.querySelector('#tabelaDados tbody'),
    salarios: document.querySelector('#tabelaSalarios tbody'),
    analise: document.getElementById('analiseCurso'),
    perguntas: document.getElementById('perguntas')
};

const TODAS = 'Todas as cotas';
const ORDEM_COTA = ['Total', 'Universal', 'Escola Pública', 'Escola Pública - Negros', 'Negros', 'PcD'];

const estado = {
    cursoId: db.cursos[0].id,
    cota: TODAS,
    busca: '',
    ordem: { campo: 'ano', asc: false }
};

const graficos = {};

const num = valor => (typeof valor === 'number' && Number.isFinite(valor) ? valor : null);
const texto = valor => (num(valor) === null ? '—' : valor.toLocaleString('pt-BR'));
const decimal = valor => (num(valor) === null ? '—' : valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
const rotuloAno = ano => ano.replace('_primavera', ' (primavera)');
const decimal2 = valor => (num(valor) === null ? '—' : valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const moeda = valor => (num(valor) === null ? '—' : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }));

const cursoAtual = () => db.cursos.find(curso => curso.id === Number(estado.cursoId));

function relacao(registro) {
    if (num(registro.vagas) === null || num(registro.candidatos) === null || registro.vagas === 0) return null;
    return registro.candidatos / registro.vagas;
}

function linhas(curso) {
    return curso.cotas.flatMap(cota => cota.tipoCota.map(item => ({
        ano: cota.ano,
        curso: curso.nome,
        cota: item.tipo,
        vagas: num(item.vagas),
        candidatos: num(item.candidatos),
        notaMinima: num(item.notaMinima),
        relacao: relacao(item)
    })));
}

function serie(curso, tipoCota) {
    return curso.cotas
        .map(cota => {
            const item = cota.tipoCota.find(tipo => tipo.tipo === tipoCota);
            return {
                ano: cota.ano,
                relacao: item ? relacao(item) : null,
                notaMinima: item ? num(item.notaMinima) : null,
                vagas: item ? num(item.vagas) : null,
                candidatos: item ? num(item.candidatos) : null
            };
        })
        .sort((a, b) => a.ano.localeCompare(b.ano));
}

function media(valores) {
    const validos = valores.filter(valor => num(valor) !== null);
    if (!validos.length) return null;
    return validos.reduce((soma, valor) => soma + valor, 0) / validos.length;
}

function desvioPadrao(valores) {
    const validos = valores.filter(valor => num(valor) !== null);
    if (validos.length < 2) return null;
    const m = media(validos);
    return Math.sqrt(validos.reduce((soma, valor) => soma + (valor - m) ** 2, 0) / validos.length);
}

function correlacao(pares) {
    const validos = pares.filter(([x, y]) => num(x) !== null && num(y) !== null);
    if (validos.length < 3) return null;
    const mediaX = media(validos.map(par => par[0]));
    const mediaY = media(validos.map(par => par[1]));
    let covariancia = 0;
    let varX = 0;
    let varY = 0;
    validos.forEach(([x, y]) => {
        covariancia += (x - mediaX) * (y - mediaY);
        varX += (x - mediaX) ** 2;
        varY += (y - mediaY) ** 2;
    });
    if (varX === 0 || varY === 0) return null;
    return covariancia / Math.sqrt(varX * varY);
}

function tiposDeCota(curso) {
    const tipos = new Set();
    curso.cotas.forEach(cota => cota.tipoCota.forEach(item => tipos.add(item.tipo)));
    return [...tipos];
}

function montarFiltros() {
    els.curso.innerHTML = db.cursos
        .map(curso => `<option value="${curso.id}">${curso.nome} — ${curso.modalidade}</option>`)
        .join('');
    els.curso.value = String(estado.cursoId);

    const tipos = [TODAS, ...ORDEM_COTA.filter(tipo => tiposDeCota(cursoAtual()).includes(tipo))];
    if (!tipos.includes(estado.cota)) estado.cota = TODAS;

    els.cota.innerHTML = tipos
        .map(tipo => `
            <button type="button" class="botao-cota${tipo === estado.cota ? ' ativo' : ''}"
                style="--cor: ${CORES[tipo] ?? '#e4e4e7'}" data-cota="${tipo}">${tipo}</button>`)
        .join('');
}

function montarKpis(curso) {
    const dados = serie(curso, 'Total');
    const ultimo = dados[dados.length - 1];
    const pico = dados.reduce((maior, atual) => (num(atual.relacao) !== null && (!maior || atual.relacao > maior.relacao) ? atual : maior), null);
    const notasUniversal = serie(curso, 'Universal').map(item => item.notaMinima);

    const cartoes = [
        { titulo: 'Concorrência atual', valor: `${decimal(ultimo?.relacao)} cand./vaga`, detalhe: rotuloAno(ultimo?.ano ?? '') },
        { titulo: 'Pico histórico', valor: `${decimal(pico?.relacao)} cand./vaga`, detalhe: rotuloAno(pico?.ano ?? '') },
        { titulo: 'Concorrência média', valor: `${decimal(media(dados.map(item => item.relacao)))} cand./vaga`, detalhe: `${dados.length} anos analisados` },
        { titulo: 'Nota mínima média (universal)', valor: texto(Math.round(media(notasUniversal) ?? NaN)), detalhe: 'pontos' }
    ];

    els.kpis.innerHTML = cartoes
        .map(cartao => `
            <div class="col-sm-6 col-lg-3">
                <div class="kpi-card">
                    <span class="kpi-titulo">${cartao.titulo}</span>
                    <strong class="kpi-valor">${cartao.valor}</strong>
                    <span class="kpi-detalhe">${cartao.detalhe}</span>
                </div>
            </div>`)
        .join('');
}

function opcoesBase(tituloY) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { labels: { color: '#f4f4f5' } },
            tooltip: { backgroundColor: '#18181b', borderColor: '#3f3f46', borderWidth: 1 }
        },
        scales: {
            x: {
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                title: { display: true, text: 'Ano', color: '#f4f4f5' }
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                title: { display: true, text: tituloY, color: '#f4f4f5' }
            }
        }
    };
}

function desenharGraficos(curso) {
    const tipos = tiposDeCota(curso).filter(tipo => tipo !== 'Total');
    const anos = curso.cotas.map(cota => cota.ano).sort((a, b) => a.localeCompare(b));
    const rotulos = anos.map(rotuloAno);

    const linhasDatasets = ['Total', ...tipos].map(tipo => ({
        label: tipo,
        data: serie(curso, tipo).map(item => item.relacao),
        borderColor: CORES[tipo] ?? '#e4e4e7',
        backgroundColor: CORES[tipo] ?? '#e4e4e7',
        borderWidth: tipo === 'Total' ? 3 : 2,
        tension: 0.35,
        spanGaps: true,
        hidden: estado.cota === TODAS ? false : tipo !== 'Total' && tipo !== estado.cota
    }));

    graficos.linha?.destroy();
    graficos.linha = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: { labels: rotulos, datasets: linhasDatasets },
        options: opcoesBase('Candidatos por vaga')
    });

    const cotaGrafico = estado.cota === TODAS ? 'Total' : estado.cota;
    const dadosCota = serie(curso, cotaGrafico);
    graficos.barra?.destroy();
    graficos.barra = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: rotulos,
            datasets: [
                { label: `Vagas (${cotaGrafico})`, data: dadosCota.map(item => item.vagas), backgroundColor: '#38bdf8' },
                { label: `Candidatos (${cotaGrafico})`, data: dadosCota.map(item => item.candidatos), backgroundColor: '#ec4899' }
            ]
        },
        options: opcoesBase('Quantidade')
    });

    graficos.nota?.destroy();
    graficos.nota = new Chart(document.getElementById('notaChart'), {
        type: 'line',
        data: {
            labels: rotulos,
            datasets: tipos.map(tipo => ({
                label: tipo,
                data: serie(curso, tipo).map(item => item.notaMinima),
                borderColor: CORES[tipo] ?? '#e4e4e7',
                backgroundColor: CORES[tipo] ?? '#e4e4e7',
                borderWidth: 2,
                tension: 0.35,
                spanGaps: true
            }))
        },
        options: opcoesBase('Nota mínima (pontos)')
    });
}

function montarTabela(curso) {
    const busca = estado.busca.trim().toLowerCase();
    const { campo, asc } = estado.ordem;

    const dados = linhas(curso)
        .filter(linha => estado.cota === TODAS || linha.cota === estado.cota)
        .filter(linha => !busca || `${rotuloAno(linha.ano)} ${linha.cota}`.toLowerCase().includes(busca))
        .sort((a, b) => {
            const valorA = a[campo];
            const valorB = b[campo];
            if (valorA === null && valorB === null) return 0;
            if (valorA === null) return 1;
            if (valorB === null) return -1;
            const comparacao = typeof valorA === 'string' ? valorA.localeCompare(valorB) : valorA - valorB;
            if (comparacao !== 0) return asc ? comparacao : -comparacao;
            return ORDEM_COTA.indexOf(a.cota) - ORDEM_COTA.indexOf(b.cota);
        });

    if (!dados.length) {
        els.tabela.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4">Nenhum registro encontrado.</td></tr>';
        return;
    }

    els.tabela.innerHTML = dados
        .map(linha => `
            <tr${linha.cota === 'Total' ? ' class="linha-total"' : ''}>
                <td>${rotuloAno(linha.ano)}</td>
                <td>${linha.curso}</td>
                <td><span class="badge-cota" style="--cor: ${CORES[linha.cota] ?? '#e4e4e7'}">${linha.cota}</span></td>
                <td class="text-end">${texto(linha.vagas)}</td>
                <td class="text-end">${texto(linha.candidatos)}</td>
                <td class="text-end">${decimal(linha.relacao)}</td>
                <td class="text-end">${texto(linha.notaMinima)}</td>
            </tr>`)
        .join('');
}

function montarSalarios(curso) {
    if (!curso.salariosAtuais.length) {
        els.salarios.innerHTML = '<tr><td colspan="3" class="text-center text-secondary py-4">Nenhum salário cadastrado no banco de dados.</td></tr>';
        return;
    }

    els.salarios.innerHTML = curso.salariosAtuais
        .map(salario => `
            <tr>
                <td>${salario.cargo}</td>
                <td class="text-end">${moeda(salario.salario)}</td>
                <td>${salario.referencia ?? '—'}</td>
            </tr>`)
        .join('');
}

function montarPerguntas(curso) {
    const tipos = tiposDeCota(curso).filter(tipo => tipo !== 'Total');
    const total = serie(curso, 'Total');

    const porCota = tipos.map(tipo => {
        const dados = serie(curso, tipo).filter(item => num(item.relacao) !== null);
        const primeiro = dados[0];
        const ultimo = dados[dados.length - 1];
        return {
            tipo,
            media: media(dados.map(item => item.relacao)),
            desvio: desvioPadrao(dados.map(item => item.relacao)),
            variacao: primeiro && ultimo && primeiro.relacao ? (ultimo.relacao - primeiro.relacao) / primeiro.relacao * 100 : null,
            primeiro,
            ultimo
        };
    }).filter(item => num(item.media) !== null);

    const maisConcorrida = [...porCota].sort((a, b) => b.media - a.media)[0];
    const menosConcorrida = [...porCota].sort((a, b) => a.media - b.media)[0];
    const maiorCrescimento = [...porCota].filter(item => num(item.variacao) !== null).sort((a, b) => b.variacao - a.variacao)[0];
    const maiorQueda = [...porCota].filter(item => num(item.variacao) !== null).sort((a, b) => a.variacao - b.variacao)[0];
    const maisEstavel = [...porCota].filter(item => num(item.desvio) !== null).sort((a, b) => a.desvio - b.desvio)[0];
    const anoPico = [...total].filter(item => num(item.relacao) !== null).sort((a, b) => b.relacao - a.relacao)[0];
    const anoMenor = [...total].filter(item => num(item.relacao) !== null).sort((a, b) => a.relacao - b.relacao)[0];

    const universal = serie(curso, 'Universal');
    const r = correlacao(universal.map(item => [item.relacao, item.notaMinima]));
    const forca = r === null ? null : Math.abs(r) >= 0.7 ? 'forte' : Math.abs(r) >= 0.4 ? 'moderada' : 'fraca';
    const sentido = r === null ? null : r > 0 ? 'positiva' : 'negativa';

    const perguntas = [
        {
            titulo: 'Qual cota apresentou maior concorrência?',
            resposta: `${maisConcorrida.tipo}, com média de ${decimal(maisConcorrida.media)} candidatos por vaga entre ${rotuloAno(total[0].ano)} e ${rotuloAno(total[total.length - 1].ano)}.`
        },
        {
            titulo: 'Qual cota apresentou menor concorrência?',
            resposta: `${menosConcorrida.tipo}, com média de ${decimal(menosConcorrida.media)} candidatos por vaga — em vários anos a procura ficou abaixo do número de vagas ofertadas.`
        },
        {
            titulo: 'Qual cota apresentou maior crescimento?',
            resposta: maiorCrescimento.variacao > 0
                ? `${maiorCrescimento.tipo}, variando de ${decimal(maiorCrescimento.primeiro.relacao)} em ${rotuloAno(maiorCrescimento.primeiro.ano)} para ${decimal(maiorCrescimento.ultimo.relacao)} em ${rotuloAno(maiorCrescimento.ultimo.ano)} (${decimal(maiorCrescimento.variacao)}%).`
                : `Nenhuma cota cresceu entre o primeiro e o último ano com dados: todas ficaram estáveis ou caíram. A que melhor se manteve foi ${maiorCrescimento.tipo} (${decimal(maiorCrescimento.variacao)}%, de ${decimal(maiorCrescimento.primeiro.relacao)} em ${rotuloAno(maiorCrescimento.primeiro.ano)} para ${decimal(maiorCrescimento.ultimo.relacao)} em ${rotuloAno(maiorCrescimento.ultimo.ano)}).`
        },
        {
            titulo: 'Houve queda de concorrência?',
            resposta: `Sim. A maior queda foi em ${maiorQueda.tipo}: de ${decimal(maiorQueda.primeiro.relacao)} em ${rotuloAno(maiorQueda.primeiro.ano)} para ${decimal(maiorQueda.ultimo.relacao)} em ${rotuloAno(maiorQueda.ultimo.ano)} (${decimal(maiorQueda.variacao)}%). A concorrência total do curso também caiu de ${decimal(total[0].relacao)} para ${decimal(total[total.length - 1].relacao)}.`
        },
        {
            titulo: 'Qual cota foi mais estável?',
            resposta: `${maisEstavel.tipo}, com desvio padrão de apenas ${decimal(maisEstavel.desvio)} candidatos por vaga ao longo da série.`
        },
        {
            titulo: 'Qual ano teve maior concorrência?',
            resposta: `${rotuloAno(anoPico.ano)}, com ${decimal(anoPico.relacao)} candidatos por vaga no total. O menor valor foi em ${rotuloAno(anoMenor.ano)}, com ${decimal(anoMenor.relacao)}.`
        },
        {
            titulo: 'Existe relação entre concorrência e nota mínima?',
            resposta: r === null
                ? 'Não há dados suficientes de nota mínima para calcular a correlação.'
                : `A correlação de Pearson entre concorrência e nota mínima na ampla concorrência é ${decimal2(r)} (${forca}, ${sentido}). Ou seja, anos com mais candidatos por vaga tendem a exigir ${r > 0 ? 'notas maiores' : 'notas menores'}.`
        },
        {
            titulo: 'Quais outros insights aparecem nos dados?',
            resposta: `As cotas raciais e PcD exigem notas mínimas bem abaixo da ampla concorrência e recebem menos candidatos que o número de vagas, sendo o caminho mais acessível de ingresso. Já a cota de escola pública ficou tão ou mais disputada que a universal em vários anos. A ampliação de vagas totais (de ${texto(total[0].vagas)} para ${texto(total[total.length - 1].vagas)}) explica boa parte da redução da concorrência recente.`
        }
    ];

    els.perguntas.innerHTML = perguntas
        .map(pergunta => `
            <div class="col-md-6">
                <div class="question-card">
                    <h5>${pergunta.titulo}</h5>
                    <p>${pergunta.resposta}</p>
                </div>
            </div>`)
        .join('');
}

function renderizar() {
    const curso = cursoAtual();
    const anos = curso.cotas.map(cota => cota.ano).sort((a, b) => a.localeCompare(b));

    els.heroSubtitulo.textContent = `${curso.nome} (${curso.modalidade}) - UEPG (${rotuloAno(anos[0])}-${rotuloAno(anos[anos.length - 1])})`;
    montarKpis(curso);
    desenharGraficos(curso);
    montarTabela(curso);
    montarSalarios(curso);
    montarPerguntas(curso);
    els.analise.textContent = curso.analise;
}

els.curso.addEventListener('change', evento => {
    estado.cursoId = evento.target.value;
    montarFiltros();
    renderizar();
});

els.cota.addEventListener('click', evento => {
    const botao = evento.target.closest('.botao-cota');
    if (!botao) return;
    estado.cota = botao.dataset.cota;
    montarFiltros();
    renderizar();
});

els.busca.addEventListener('input', evento => {
    estado.busca = evento.target.value;
    montarTabela(cursoAtual());
});

document.querySelectorAll('#tabelaDados th[data-ordenar]').forEach(cabecalho => {
    cabecalho.addEventListener('click', () => {
        const campo = cabecalho.dataset.ordenar;
        estado.ordem = { campo, asc: estado.ordem.campo === campo ? !estado.ordem.asc : true };
        montarTabela(cursoAtual());
    });
});

montarFiltros();
renderizar();
