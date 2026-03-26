const API_URL = 'http://localhost:3001/tickets'

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

async function gerarChamado(event){
    event.preventDefault()

    const ticket = {
        cliente: document.getElementById("cliente").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        titulo: document.getElementById("tipo").value,
        descricao: document.getElementById("descricao").value,
        status: "aberto"
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket)
        })

        if(response.ok) {
            const data = await response.json()
            document.getElementById("resultado").innerText = "Chamado Nº " + data.ticket.id + " criado com sucesso!"
            document.querySelector("form").reset()
            document.getElementById("prioridade").value = ""
        } else {
            document.getElementById("resultado").innerText = "Erro ao criar chamado."
        }
    } catch (error) {
        console.error("Erro ao enviar chamado:", error)
        document.getElementById("resultado").innerText = "Erro ao conectar com o servidor."
    }
}

async function carregarChamados(){
    const tabela = document.getElementById("tabela")
    if(!tabela) return

    tabela.innerHTML = "Carregando..."

    try {
        const response = await fetch(`${API_URL}/abertos`)
        const tickets = await response.json()

        tabela.innerHTML = ""

        tickets.forEach(t => {
            const linha = `
            <tr>
                <td>${t.id}</td>
                <td>${t.cliente}</td>
                <td>${t.titulo}</td>
                <td>${t.descricao}</td>
                <td>${t.status}</td>
                <td>
                    <button onclick="finalizar(${t.id})">Finalizar</button>
                </td>
            </tr>`
            tabela.innerHTML += linha
        })
    } catch (error) {
        console.error("Erro ao carregar chamados:", error)
        tabela.innerHTML = "Erro ao carregar chamados do servidor."
    }
}

async function carregarEncerrados(){
    const tabela = document.getElementById("tabela")
    if(!tabela) return

    tabela.innerHTML = "Carregando..."

    try {
        const response = await fetch(`${API_URL}/fechados`)
        const tickets = await response.json()

        tabela.innerHTML = ""

        tickets.forEach(t => {
            const linha = `
            <tr>
                <td>${t.id}</td>
                <td>${t.cliente}</td>
                <td>${t.titulo}</td>
                <td>${t.descricao}</td>
                <td>${t.status}</td>
            </tr>`
            tabela.innerHTML += linha
        })
    } catch (error) {
        console.error("Erro ao carregar encerrados:", error)
        tabela.innerHTML = "Erro ao carregar chamados do servidor."
    }
}

async function finalizar(id){
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'fechado' })
        })

        if(response.ok) {
            carregarChamados()
        } else {
            alert("Erro ao finalizar chamado.")
        }
    } catch (error) {
        console.error("Erro ao finalizar chamado:", error)
        alert("Erro ao conectar com o servidor.")
    }
}
