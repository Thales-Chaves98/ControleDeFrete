const temaBtn = document.getElementById("theme-btn");

const inputFrete = document.getElementById("text-input");
const addFreteBtn = document.getElementById("add-frete-btn");

const freteContainer = document.getElementById("fretes-container");

let fretes = [];



addFreteBtn.addEventListener('click', (e) => {
    e.preventDefault();

    criarObjetoFrete();

});


function criarObjetoFrete(){
    const lugarFrete = inputFrete.value.trim().toUpperCase();
    const pedido = false;
    const coletado = false;
    const hrPedido = null;
    const hrColetado = null;

    if(lugarFrete === "") return;

    const frete = {
        id: gerarId(),
        lugarFrete,
        pedido,
        coletado,
        hrPedido,
        hrColetado
    }

    fretes.push(frete);
    criarTabelaFrete();
    console.log(fretes);

}

function criarTabelaFrete(){
    if(fretes.length > 0){
        freteContainer.innerHTML = '';
        
        const tabelaFrete = document.createElement("table");
        tabelaFrete.classList.add("tabela-frete");
        
        const tabelaHeader = document.createElement("thead");
        tabelaHeader.classList.add("tabela-header");

        const trHeader = document.createElement("tr");
        
        const colunas = ["FRETE", "PEDIDO", "FEITO", "AÇÕES"];
        
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
            pedidoCheckbox.id = `pedido-${frete.id}`;

            const spanPedido = document.createElement("span")
            spanPedido.textContent = frete.hrPedido;

            labelPedido.htmlFor = `pedido-${frete.id}`;

            labelPedido.appendChild(pedidoCheckbox);
            labelPedido.appendChild(spanPedido);
            tdPedido.appendChild(labelPedido);
            trBody.appendChild(tdPedido);

            //FEITO
            const tdFeito = document.createElement("td");

            const labelFeito = document.createElement("label");

            const feitoCheckbox = document.createElement("input");
            feitoCheckbox.type = "checkbox";
            feitoCheckbox.id = `feito-${frete.id}`;

            const spanFeito = document.createElement("span")
            spanFeito.textContent = frete.hrColetado;

            labelFeito.htmlFor = `feito-${frete.id}`;

            labelFeito.appendChild(feitoCheckbox);
            labelFeito.appendChild(spanFeito);
            tdFeito.appendChild(labelFeito);
            trBody.appendChild(tdFeito);

        });

        tabelaFrete.appendChild(tabelaHeader);
        tabelaFrete.appendChild(tabelaBody);

        freteContainer.appendChild(tabelaFrete);
    }
}

function gerarId(){
    return crypto.randomUUID();
}