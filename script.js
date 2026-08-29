const temaBtn = document.getElementById("theme-btn");

const inputFrete = document.getElementById("text-input");
const addFreteBtn = document.getElementById("add-frete-btn");

const freteContainer = document.getElementById("fretes-container");

let fretes = [];


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
        if(!checkbox.checkbox && frete.coletado){
            checkbox.checked = true;

            alert("Não é possível desmarcar o pedido enquanto a coleta estiver confirmada.");
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

            alert("Não é possível confirmar uma coleta sem confirmar o pedido.");
            //trocar alert por modal
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

            const editarBtnTabela = document.createElement("button");
            const editarBtnIcon = document.createElement("span");

            editarBtnIcon.classList.add("material-symbols-outlined")
            editarBtnIcon.textContent = "edit";

            editarBtnTabela.appendChild(editarBtnIcon);


            const excluirBtnTabela = document.createElement("button");
            const excluirBtnIcon = document.createElement("span");

            excluirBtnIcon.classList.add("material-symbols-outlined");
            excluirBtnIcon.textContent = "delete";

            excluirBtnTabela.appendChild(excluirBtnIcon);

            tdAcoes.appendChild(editarBtnTabela);
            tdAcoes.appendChild(excluirBtnTabela);

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

carregarFretes();
criarTabelaFrete();

/* FIX
    INPUT LONGO = OVERFLOW 
*/
