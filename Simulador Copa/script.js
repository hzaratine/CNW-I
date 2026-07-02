const paises = [
    "Argentina",
    "Alemanha",
    "Arábia Saudita",
    "Austrália",
    "Bélgica",
    "Brasil",
    "Canadá",
    "Camarões",
    "Coreia do Sul",
    "Costa Rica",
    "Croácia",
    "Dinamarca",
    "Equador",
    "Espanha",
    "Estados Unidos",
    "França",
    "Gana",
    "Holanda",
    "Inglaterra",
    "Irã",
    "Japão",
    "Marrocos",
    "México",
    "País de Gales",
    "Polônia",
    "Portugal",
    "Qatar",
    "Senegal",
    "Sérvia",
    "Suíça",
    "Tunísia",
    "Uruguai"
];

const gruposDiv = document.getElementById("grupos");
let chuvaAtiva = false; // Controla para não acumular animações repetidas

criarGrupos();

function criarOptionsPaises() {

    let html = '<option value="">Selecione</option>';

    paises.forEach(pais => {
        html += `<option value="${pais}">${pais}</option>`;
    });

    return html;
}

function criarOptionsPlacar() {

    let html = "";

    for(let i = 0; i <= 6; i++) {
        html += `<option value="${i}">${i}</option>`;
    }

    return html;
}

function criarGrupos() {

    const letras = ["A","B","C","D","E","F","G","H"];

    letras.forEach(letra => {

        gruposDiv.innerHTML += `
            <div class="grupo">
                <strong>Grupo ${letra}</strong>

                <select id="${letra}1">
                    ${criarOptionsPaises()}
                </select>

                <select id="${letra}2">
                    ${criarOptionsPaises()}
                </select>
            </div>
        `;
    });

}

function gerarOitavas() {

    const selects = document.querySelectorAll("#grupos select");

    let escolhidos = [];

    for(let select of selects){

        if(select.value === ""){
            alert("Preencha todos os grupos.");
            return;
        }

        escolhidos.push(select.value);
    }

    if(new Set(escolhidos).size !== escolhidos.length){
        alert("Existem países repetidos.");
        return;
    }

    const c = {
        A1: A1.value,
        A2: A2.value,
        B1: B1.value,
        B2: B2.value,
        C1: C1.value,
        C2: C2.value,
        D1: D1.value,
        D2: D2.value,
        E1: E1.value,
        E2: E2.value,
        F1: F1.value,
        F2: F2.value,
        G1: G1.value,
        G2: G2.value,
        H1: H1.value,
        H2: H2.value
    };

    const oitavas = [
        [c.A1, c.B2],
        [c.C1, c.D2],
        [c.E1, c.F2],
        [c.G1, c.H2],
        [c.B1, c.A2],
        [c.D1, c.C2],
        [c.F1, c.E2],
        [c.H1, c.G2]
    ];

    criarFase(oitavas, "oitavas", gerarQuartas);
}

function criarFase(jogos, id, callback){

    const div = document.getElementById(id);

    div.innerHTML = "";

    jogos.forEach((jogo, indice) => {

        div.innerHTML += `
            <div class="partida">

                <div>${jogo[0]}</div>

                <select class="${id}-a">
                    ${criarOptionsPlacar()}
                </select>

                x

                <select class="${id}-b">
                    ${criarOptionsPlacar()}
                </select>

                <div>${jogo[1]}</div>

            </div>
        `;

    });

    div.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", () => {
            atualizarFase(jogos, id, callback);
        });
    });

    atualizarFase(jogos, id, callback);
}

function atualizarFase(jogos, id, callback){

    const golsA = document.querySelectorAll(`.${id}-a`);
    const golsB = document.querySelectorAll(`.${id}-b`);

    let vencedores = [];

    for(let i = 0; i < jogos.length; i++){

        let a = Number(golsA[i].value);
        let b = Number(golsB[i].value);

        if(a === b){
            return;
        }

        vencedores.push(
            a > b ? jogos[i][0] : jogos[i][1]
        );
    }

    callback(vencedores);
}

function gerarQuartas(vencedores){

    const quartas = [];

    for(let i = 0; i < vencedores.length; i += 2){

        quartas.push([
            vencedores[i],
            vencedores[i + 1]
        ]);

    }

    criarFase(quartas, "quartas", gerarSemifinais);
}

function gerarSemifinais(vencedores){

    const semi = [];

    for(let i = 0; i < vencedores.length; i += 2){

        semi.push([
            vencedores[i],
            vencedores[i + 1]
        ]);

    }

    criarFase(semi, "semifinais", gerarFinal);
}

function gerarFinal(vencedores){

    criarFase(
        [[vencedores[0], vencedores[1]]],
        "final",
        mostrarCampeao
    );
}

function mostrarCampeao(vencedores){

    document.getElementById("campeao").innerHTML = vencedores[0];
    
    // Dispara o efeito de confetes caindo no fundo
    iniciarChuvaDeConfetes();
}

function preencherAutomatico() {

    let embaralhados = [...paises];

    // Embaralha os países
    for (let i = embaralhados.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [embaralhados[i], embaralhados[j]] = [embaralhados[j], embaralhados[i]];
    }

    const selects = document.querySelectorAll("#grupos select");

    selects.forEach((select, indice) => {
        select.value = embaralhados[indice];
    });

}
function abrirMenu(){
    const menu = document.getElementById("menu-lateral");

    menu.classList.toggle("aberto");
}

// Nova função para criar a chuva infinita de confetes no fundo
function iniciarChuvaDeConfetes() {
    if (chuvaAtiva) return; // Evita iniciar várias loops ao mesmo tempo caso mudem o placar de novo
    chuvaAtiva = true;

    const canvas = document.getElementById('fundo-confetes');
    const meuConfetti = confetti.create(canvas, { resize: true, useWorker: true });

    function chover() {
        meuConfetti({
            particleCount: 2,
            angle: 90,
            spread: 360,
            startVelocity: 0,
            ticks: 300,
            origin: { x: Math.random(), y: -0.1 },
            colors: ['#004d26', '#ffbc0d', '#ffffff', '#36b92a'] // Cores personalizadas do simulador
        });
        requestAnimationFrame(chover);
    }
    chover();
}

// Ativa os cliques nos botões do novo layout
document.getElementById("menu-btn").addEventListener("click", abrirMenu);
document.getElementById("btn-aleatorio").addEventListener("click", preencherAutomatico);
document.getElementById("btn-proxima").addEventListener("click", gerarOitavas);
