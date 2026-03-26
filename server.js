const express = require('express') 
const cors = require('cors') 
const { Sequelize, DataTypes } = require('sequelize') 

// conexão com banco 
const sequelize = new Sequelize('db_projeto', 'root', '', { 
    host: 'localhost', 
    dialect: 'mysql' 
}) 

// modelo 
const Ticket = sequelize.define('Ticket', { 
    titulo: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    descricao: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    }, 
    status: { 
        type: DataTypes.ENUM('aberto', 'em andamento', 'fechado'), 
        defaultValue: 'aberto' 
    }, 
    cliente: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, 
    telefone: { 
        type: DataTypes.STRING 
    }, 
    mensagem: {             
        type: DataTypes.TEXT 
    } 
}) 

// servidor 
const app = express() 
app.use(cors()) 
app.use(express.json()) 

const port = 3001 

// rotas 
app.get('/tickets', async (req, res) => { 
    const todosOsTickets = await Ticket.findAll() 
    res.json(todosOsTickets) 
}) 

app.get('/tickets/abertos', async (req, res) => { 
    const AbertoTickets = await Ticket.findAll({ where: { status: 'aberto' } }) 
    res.json(AbertoTickets) 
}) 

app.get('/tickets/em-andamento', async (req, res) => { 
    const EmAndamentoTickets = await Ticket.findAll({ where: { status: 'em andamento' } }) 
    res.json(EmAndamentoTickets) 
}) 

app.get('/tickets/fechados', async (req, res) => { 
    const FechadoTickets = await Ticket.findAll({ where: { status: 'fechado' } }) 
    res.json(FechadoTickets) 
}) 

app.post('/tickets', async (req, res) => { 
    try { 
        const { titulo, descricao, status, cliente, email, telefone, mensagem } = req.body 
        const novoTicket = await Ticket.create({ titulo, descricao, status: status || 'aberto', cliente, email, telefone, mensagem }) 

        res.status(201).json({ 
            message: 'Ticket criado com sucesso', 
            ticket: novoTicket 
        }) 

    } catch (error) { 
        res.status(500).json({ 
            message: 'Erro ao criar ticket', 
            error: error.message 
        }) 
    } 
}) 

app.post('/tickets/cliente', async (req, res) => { 
    try { 
        const { titulo, descricao, cliente, email, telefone } = req.body 
        const novoTicket = await Ticket.create({ titulo, descricao, status : 'aberto', cliente, email, telefone }) 

        res.status(201).json({ 
            message: 'Ticket criado com sucesso', 
            ticket: novoTicket 
        }) 

    } catch (error) { 
        res.status(500).json({ 
            message: 'Erro ao criar ticket', 
            error: error.message 
        }) 
    } 
}) 

app.put("/tickets/:id", async (req, res) => { 
    try { 
        const { id } = req.params 
        const updates = req.body 

        const [updated] = await Ticket.update( 
            updates, 
            { where: { id: id } } 
        ) 
    
        if (updated) { 
            const ticketAtualizado = await Ticket.findByPk(id) 
            return res.status(200).json({ 
                message: "Ticket atualizado com sucesso.", 
                ticket: ticketAtualizado 
            }) 
        } 

        // Caso updated seja 0, pode ser que o ticket não exista ou não tenha havido mudança real 
        const ticketExistente = await Ticket.findByPk(id) 
        if (ticketExistente) { 
            return res.status(200).json({ 
                message: "Ticket sem alterações ou já estava nesse estado.", 
                ticket: ticketExistente 
            }) 
        } 

        return res.status(404).json({ erro: "Ticket não encontrado" }) 
    } catch (error) { 
        console.error("Erro no PUT /tickets/:id:", error) 
        res.status(500).json({ erro: "Erro ao atualizar ticket.", detalhes: error.message }) 
    } 
}) 

// iniciar servidor 
sequelize.sync().then(() => { 
    console.log('Banco Online.') 
    app.listen(port, () => { 
        console.log(`Porta: ${port}`) 
    }) 
}).catch((error) => { 
    console.error('Banco Offline') 
    console.error(error) 
})
