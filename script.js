function definirPrioridade(){

let problema = document.getElementById("problema").value
let prioridade = document.getElementById("prioridade")

if(problema == 3){
prioridade.value = "Grave"
}

else if(problema == 2){
prioridade.value = "Média"
}

else{
prioridade.value = "Leve"
}

}

function gerarChamado(){

let numero = Math.floor(Math.random()*9000)+1000

alert("Chamado aberto com sucesso! Número: "+numero)

}