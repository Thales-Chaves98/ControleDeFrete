const temaBtn = document.getElementById("theme-btn");

const inputFrete = document.getElementById("text-input");
const addFreteBtn = document.getElementById("add-frete-btn");


let fretes = [];



addFreteBtn.addEventListener('click', (e) => {
    e.preventDefault();

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

}

function criarTabelaFrete(){
    
}

function gerarId(){
    return crypto.randomUUID();
}