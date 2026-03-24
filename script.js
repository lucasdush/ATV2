function definirPrioridade(){
    let problema = parseInt(document.getElementById("problema").value)
    let prioridade = document.getElementById("prioridade")

    if(problema === 3){
        prioridade.value = "Grave"
    } else if(problema === 2){
        prioridade.value = "Média"
    } else {
        prioridade.value = "Leve"
    }
}

function gerarChamado(event){
    event.preventDefault()

    let numero = Math.floor(Math.random()*9000)+1000

    let chamado = {
        numero: numero,
        cliente: document.getElementById("cliente").value,
        tipo: document.getElementById("tipo").value,
        prioridade: document.getElementById("prioridade").value,
        status: "Aberto"
    }

    let chamados = JSON.parse(localStorage.getItem("chamados")) || []
    chamados.push(chamado)
    localStorage.setItem("chamados", JSON.stringify(chamados))

    document.getElementById("resultado").innerText = "Chamado Nº " + numero + " criado com sucesso!"

    document.querySelector("form").reset()
    document.getElementById("prioridade").value = ""
}

function carregarChamados(){
    let tabela = document.getElementById("tabela")
    if(!tabela) return

    tabela.innerHTML = ""

    let chamados = JSON.parse(localStorage.getItem("chamados")) || []

    //   FINALIZADOS
    chamados
    .filter(c => c.status === "Finalizado")
    .forEach(c => {

        let linha = `
        <tr>
            <td>${c.numero}</td>
            <td>${c.cliente}</td>
            <td>${c.tipo}</td>
            <td>${c.prioridade}</td>
            <td>${c.status}</td>
        </tr>`

        tabela.innerHTML += linha
    })
}

window.onload = carregarChamados