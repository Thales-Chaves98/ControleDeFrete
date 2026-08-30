const temaBtn = document.getElementById("theme-btn");

const inputFrete = document.getElementById("text-input");
const addFreteBtn = document.getElementById("add-frete-btn");

const freteContainer = document.getElementById("fretes-container");

const modalAlerta = document.getElementById("modal-alerta");
const modalAlertaTexto = document.getElementById("modal-alerta-texto");
const modalAlertaBtn = document.getElementById("modal-alerta-btn");

const modalExcluir = document.getElementById("modal-excluir");
const cancelarExcluirBtn = document.getElementById("cancelar-excluir-btn");
const confirmarExcluirBtn = document.getElementById("confirmar-excluir-btn");


let fretes = [];
let isTemaDark = false;

let deletarFreteId = null;
let editarFreteId = null;

temaBtn.addEventListener('click', () =>{
    isTemaDark = !isTemaDark;

    aplicarTema(isTemaDark ? "dark" : "light");
    salvarTema(isTemaDark);
});

addFreteBtn.addEventListener('click', (e) => {
    e.preventDefault();

    criarObjetoFrete();

});

freteContainer.addEventListener('change', (e) =>{
    if(!e.target.matches("input[type='checkbox']")) return;

    const checkbox = e.target;

    const freteId = checkbox.dataset.freteId;
    const tipo = checkbox.dataset.tipo;

    const frete = fretes.find(frete => frete.id === freteId);

    const span = checkbox.nextElementSibling;

    if(!frete) return;

    if(tipo === "pedido"){
        if(!checkbox.checked && frete.coletado){
            checkbox.checked = true;

            modalAlertaTexto.textContent = "NÃO É POSSÍVEL CANCELAR UM PEDIDO ENQUANTO A COLETA ESTIVER CONFIRMADA.";

            abrirModal(modalAlerta);
            //trocar alert por modal
            return;
        }

        frete.pedido = checkbox.checked;

        if(frete.pedido){
            frete.hrPedido = horaConfirmacao();

            span.textContent = frete.hrPedido;
            span.classList.remove("hidden-span");
        } else {
            frete.hrPedido = null;
            span.classList.add("hidden-span");
        }
    }

    if(tipo === "coletado"){
        if(!frete.pedido){
            checkbox.checked = false;

            modalAlertaTexto.textContent = "NÃO É POSSÍVEL CONFIRMAR UMA COLETA SEM CONFIRMAR O PEDIDO";

            abrirModal(modalAlerta);
            
            return;
        }

        frete.coletado = checkbox.checked;

        if(frete.coletado){
            frete.hrColetado = horaConfirmacao();

            span.textContent = frete.hrColetado;
            span.classList.remove("hidden-span");
        } else {
            frete.hrColetado = null;
            span.classList.add("hidden-span");
        }
    } 

    salvarFretes();
});

freteContainer.addEventListener('click', (e) => {
    const excluir = e.target.closest(".excluir-btn");
    const editar = e.target.closest(".editar-btn");
   
    if(excluir){
        const linha = excluir.closest("tr");
        const checkbox = linha.querySelector("input[type='checkbox']");
        const freteId = checkbox.dataset.freteId;

        confirmarExclusao(freteId);
    }

    if(editar){
        const linha = editar.closest("tr");
        const checkbox = linha.querySelector("input[type='checkbox']");
        const freteId = checkbox.dataset.freteId;

        editarFrete(freteId);
    }
});

modalAlertaBtn.addEventListener('click', () =>{
    fecharModal(modalAlerta);
});

cancelarExcluirBtn.addEventListener('click', () =>{
    fecharModal(modalExcluir);
    deletarFreteId = null;
});

confirmarExcluirBtn.addEventListener('click', () =>{
    if(!deletarFreteId) return;
    deletarFrete(deletarFreteId);
    deletarFreteId = null;
});


function criarObjetoFrete(){
    const lugarFrete = inputFrete.value.trim().toUpperCase();

    if(lugarFrete === "") {
        inputFrete.focus();
        return;
    }

    const frete = {
        id: gerarId(),
        lugarFrete,
        pedido: false,
        coletado: false,
        hrPedido: null,
        hrColetado: null
    }

    fretes.push(frete);
    salvarFretes();
    limparInputFrete();
    criarTabelaFrete();
}

function criarTabelaFrete(){
    if(fretes.length > 0){
        freteContainer.innerHTML = '';
        
        const tabelaFrete = document.createElement("table");
        tabelaFrete.classList.add("tabela-frete");
        
        const tabelaHeader = document.createElement("thead");
        tabelaHeader.classList.add("tabela-header");

        const trHeader = document.createElement("tr");
        
        const colunas = ["FRETE", "PEDIDO", "COLETADO", "AÇÕES"];
        
        colunas.forEach((titulo) =>{
            const th = document.createElement("th");

            th.textContent = titulo;
            trHeader.appendChild(th);
            
        });

        
        tabelaHeader.appendChild(trHeader);
       
        const tabelaBody = document.createElement("tbody");
        tabelaBody.classList.add("tabela-body");

        fretes.forEach(frete =>{
            const trBody =document.createElement("tr");

            const tdLugar = document.createElement("td");
            tdLugar.textContent = frete.lugarFrete;
            trBody.appendChild(tdLugar);

            //PEDIDO 
            const tdPedido = document.createElement("td");

            const labelPedido = document.createElement("label");

            const pedidoCheckbox = document.createElement("input");
            pedidoCheckbox.type = "checkbox";
            pedidoCheckbox.dataset.freteId = frete.id;
            pedidoCheckbox.dataset.tipo = "pedido";
            pedidoCheckbox.checked = frete.pedido;

            const spanPedido = document.createElement("span")
            spanPedido.textContent = frete.hrPedido;

            if(frete.hrPedido === null){
                spanPedido.classList.add("hidden-span");
            }

            labelPedido.appendChild(pedidoCheckbox);
            labelPedido.appendChild(spanPedido);
            tdPedido.appendChild(labelPedido);
            trBody.appendChild(tdPedido);

            //COLETADO
            const tdColetado = document.createElement("td");

            const labelColetado = document.createElement("label");

            const coletadoCheckbox = document.createElement("input");
            coletadoCheckbox.type = "checkbox";
            coletadoCheckbox.dataset.freteId = frete.id;
            coletadoCheckbox.dataset.tipo = "coletado";
            coletadoCheckbox.checked = frete.coletado;

            const spanColetado = document.createElement("span")
            spanColetado.textContent = frete.hrColetado;

            if(frete.hrColetado === null){
                spanColetado.classList.add("hidden-span");
            }

            labelColetado.appendChild(coletadoCheckbox);
            labelColetado.appendChild(spanColetado);
            tdColetado.appendChild(labelColetado);
            trBody.appendChild(tdColetado);

            //ACOES

            const tdAcoes = document.createElement("td");

            const editarBtn = document.createElement("button");
            editarBtn.classList.add("editar-btn");
            const editarBtnIcon = document.createElement("span");

            editarBtnIcon.classList.add("material-symbols-outlined")
            editarBtnIcon.textContent = "edit";

            editarBtn.appendChild(editarBtnIcon);


            const excluirBtn = document.createElement("button");
            excluirBtn.classList.add("excluir-btn");

            const excluirBtnIcon = document.createElement("span");

            excluirBtnIcon.classList.add("material-symbols-outlined");
            excluirBtnIcon.textContent = "delete";

            excluirBtn.appendChild(excluirBtnIcon);

            tdAcoes.appendChild(editarBtn);
            tdAcoes.appendChild(excluirBtn);

            trBody.appendChild(tdAcoes);
            tabelaBody.appendChild(trBody);
        });

        tabelaFrete.appendChild(tabelaHeader);
        tabelaFrete.appendChild(tabelaBody);

        freteContainer.appendChild(tabelaFrete);
    }
}

function gerarId(){
    return crypto.randomUUID();
}

function limparInputFrete(){
    inputFrete.value = "";
}

function salvarFretes(){
    localStorage.setItem("fretes", JSON.stringify(fretes));
}

function carregarFretes(){
    const fretesSalvos = localStorage.getItem("fretes");

    if(fretesSalvos){
        fretes = JSON.parse(fretesSalvos);
    }
}

function horaConfirmacao(){
    const hrAgora = new Date();

    const hr = String(hrAgora.getHours()).padStart(2, "0");
    const min = String(hrAgora.getMinutes()).padStart(2, "0");

    return `${hr}:${min}`;
}

function aplicarTema(tema){
    const temaSpan = temaBtn.querySelector("span");

    if(tema === "light"){
        temaSpan.textContent = "moon_stars";
        document.body.classList.add("light-tema");
        isTemaDark = false;
    } else{
        temaSpan.textContent = "brightness_5";
        document.body.classList.remove("light-tema");
        isTemaDark = true;
    }
}

function abrirModal(modal){
    modal.classList.add("active");
}

function fecharModal(modal){
    modal.classList.remove("active");
}

function deletarFrete(idFrete){
    fretes = fretes.filter((f) => {
        return f.id !== idFrete;
    })

    criarTabelaFrete();
    salvarFretes();
    fecharModal(modalExcluir);
}

function confirmarExclusao(idFrete){
    deletarFreteId = idFrete;
    abrirModal(modalExcluir);
}

function editarFrete(freteId){
    editarFreteId = freteId;

    const frete = fretes.find(frete => frete.id === freteId);

    if(!frete) return;

    const linha = document.querySelector(`input[data-frete-id="${freteId}"]`).closest("tr");
}

function salvarTema(tema){
    localStorage.setItem("isTemaDark", tema);
}

function carregarTema(){
    const temaSalvo = localStorage.getItem("isTemaDark");

    if(temaSalvo !== null){
        isTemaDark = temaSalvo === "true";
        aplicarTema(isTemaDark ? "dark" : "light");
    } else {
        aplicarTema("dark");
    }
}



carregarTema();
carregarFretes();
criarTabelaFrete();

/* FIX
    INPUT LONGO = OVERFLOW 
*/
