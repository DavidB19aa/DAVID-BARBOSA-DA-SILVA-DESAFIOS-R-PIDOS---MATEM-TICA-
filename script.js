/* 
   ESTUDANTE: DAVID BARBOSA DA SILVA
   MATRÍCULA: 202304324468
*/

let rodadaAtual = 0;
let pontuacao = 0;
let tempoRestante;
let intervalo;
let respostaCorreta;

const config = {
    maxRodadas: 15,
    tempoInicial: 20,
    tempoMinimo: 5
};

const gerarPergunta = () => {
    const operadores = ['+', '-', '*', '/'];
    const dificuldade = Math.min(rodadaAtual, 10);
    const [num1, num2] = [Math.floor(Math.random() * (10 + dificuldade)), Math.floor(Math.random() * (10 + dificuldade)) + 1];
    const operador = operadores[Math.floor(Math.random() * operadores.length)];

    let pergunta;
    switch (operador) {
        case '+': pergunta = `${num1} + ${num2}`; respostaCorreta = num1 + num2; break;
        case '-': pergunta = `${num1} - ${num2}`; respostaCorreta = num1 - num2; break;
        case '*': pergunta = `${num1} * ${num2}`; respostaCorreta = num1 * num2; break;
        case '/': pergunta = `${num1 * num2} / ${num2}`; respostaCorreta = num1; break;
    }

    exibirPergunta(pergunta, gerarAlternativas(respostaCorreta));
};

const gerarAlternativas = (correta) => {
    const alternativas = new Set([correta]);
    while (alternativas.size < 4) alternativas.add(correta + (Math.floor(Math.random() * 10) - 5));
    return [...alternativas].sort(() => Math.random() - 0.5);
};

const exibirPergunta = (pergunta, alternativas) => {
    document.getElementById('pergunta').textContent = pergunta;
    const respostasEl = document.getElementById('respostas');
    respostasEl.innerHTML = "";
    alternativas.forEach(alternativa => {
        const botao = document.createElement('button');
        botao.textContent = alternativa;
        botao.onclick = () => verificarResposta(alternativa, botao);
        respostasEl.appendChild(botao);
    });
    resetarTempo();
};

const verificarResposta = (alternativa, botaoSelecionado) => {
    clearInterval(intervalo);
    const mensagemEl = document.getElementById('mensagem');
    if (alternativa == respostaCorreta) {
        mensagemEl.textContent = 'Correto!';
        mensagemEl.style.color = 'green';
        pontuacao++;
    } else {
        mensagemEl.textContent = `Errado! A resposta correta era ${respostaCorreta}`;
        mensagemEl.style.color = 'red';
        [...document.querySelectorAll('#respostas button')].forEach(b => {
            b.classList.toggle(b.textContent == respostaCorreta ? 'correct' : 'wrong');
        });
    }
    setTimeout(() => (rodadaAtual < config.maxRodadas ? novaRodada() : mostrarResultado()), 2000);
};

const resetarTempo = () => {
    tempoRestante = Math.max(config.tempoInicial - rodadaAtual, config.tempoMinimo);
    document.getElementById('tempo-contador').textContent = tempoRestante;
    atualizarBarraProgresso(100);

    clearInterval(intervalo);
    intervalo = setInterval(() => {
        tempoRestante--;
        document.getElementById('tempo-contador').textContent = tempoRestante;
        atualizarBarraProgresso((tempoRestante / config.tempoInicial) * 100);
        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            verificarResposta(null);
        }
    }, 1000);
};

const atualizarBarraProgresso = (percentual) => {
    document.getElementById('progresso').style.width = `${percentual}%`;
};

const mostrarResultado = () => {
    const mensagemEl = document.getElementById('mensagem');
    const percentual = (pontuacao / config.maxRodadas) * 100;
    const desempenho = percentual >= 90 ? 'Excelente!' : percentual >= 70 ? 'Muito Bom!' : percentual >= 50 ? 'Regular!' : 'Precisa Praticar!';
    mensagemEl.textContent = `${desempenho} Você acertou ${pontuacao} de ${config.maxRodadas} perguntas.`;
    document.getElementById('reiniciar-jogo').style.display = 'block';
};

const novaRodada = () => {
    document.getElementById('mensagem').textContent = '';
    rodadaAtual++;
    gerarPergunta();
};

document.getElementById('iniciar-jogo').onclick = () => {
    document.getElementById('iniciar-jogo').style.display = 'none';
    document.getElementById('barra-progresso').style.display = 'block';
    novaRodada();
};

document.getElementById('reiniciar-jogo').onclick = () => location.reload();