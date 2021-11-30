import express, {Request, Response} from 'express';
import { stringify } from 'querystring';
import cors from 'cors';
const app = express();
import 'dotenv/config'

const port = process.env.PORT || 3333

app.listen(port, () => console.log(`Servidor iniciado... ${port}`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(function(request, response, next) {
    console.log(request.method, request.url);
    next();
    });

app.get('/', (request: Request, response: Response) => {
 response.send('OK');
}); 


       


class Messages {
    id:number
    title:string
    description:string

    constructor(id:number,title:string,description:string) {
        this.id = id
        this.title = title
        this.description = description
    }
}

class User {
    id:number
    name:string
    pass:string
    messages: Messages[] = []

   constructor(id:number,name:string,pass:string) {
       this.id=id
       this.name=name
       this.pass=pass
       
   }

}

const users:User[] = []

const user2: User = new User(1,"kaian","123")
users.push(user2)

let id: number = 1

const recados: Messages[] = []
let idMessage: number = 0



app.get('/users/:id',(req:Request , res: Response)=>{

    
    
    const id = Number(req.params.id)
    console.log(users[id])
    
    let pessoaRetornada: User | undefined = users.find((user)=> user.id == id)

    if (pessoaRetornada) {
        const {messages, ...usuario} = pessoaRetornada
        res.send(`Resultado: ${JSON.stringify(usuario)}`)
    }
    else {
        res.status(404).send(`usuario nao encontrado`)
    }
    

})

app.get('/users',(req:Request , res: Response)=>{
    let allUsers = []
    allUsers = users.map((users) =>{
        
        const {messages,pass, ...userSemM} = users
        return userSemM
        
    })

    /* res.send(`Resultado: ${JSON.stringify(allUsers)}`)
 */
    res.status(200).json(users)
})


app.post('/users',(req:Request,res:Response)=>{

    
    const name = String(req.body.name)
    const pass = String(req.body.pass)
    
    let validacao: boolean = true
    
    
    console.log(id)
    if (name != 'undefined' || pass != 'undefined'   ) {
        
        for (let index = 0; index < users.length; index++) {
            
            if (name == users[index].name) {
               validacao = false
            }                      
            
        }  

        if (validacao) {
            id++
            let user1 = new User(id,name,pass)
            users.push(user1)
            res.send(`Adicionado`)
        }else{
            res.status(400).send(`erro`)
        }
               
        
    }

    /* res.status(400).send(`erro`)
 */
    

})


app.put('/users/:id',(req:Request,res:Response)=>{

    const name = String(req.body.name)
    const pass = String(req.body.pass)

    let indice:number = users.findIndex( users => users.id == id );

    if (indice > -1) {
        console.log(name)
        if(name != 'undefined') users[indice].name = name
        if(pass != 'undefined') users[indice].pass = pass
        
        res.status(201).json(users[indice])
    }

    

})


app.delete('/users/:id',(req:Request,res:Response)=>{

    
    const id = Number(req.params.id)
    

    const indice:number = users.findIndex( users => users.id == id );

    if(indice > -1){
        users.splice(indice,1)
        res.status(201).send('deletado')      
    }else{
        res.status(400).send('nao encontrado')
    }

    

})




app.get('/users/:userId/messages',(req:Request,res:Response)=>{

    console.log('entrou1')
    const userId = Number(req.params.userId)
    /* const id = Number(req.params.id) */
    console.log(userId)
    let indice:number = users.findIndex( users => users.id == userId );
        
            if (indice > -1){

                /* res.send(`Resultado: ${JSON.stringify(users[indice].messages)}`) */
                res.status(200).json(users[indice].messages)
            }


})

app.get('/users/:userId/messages/:id',(req:Request,res:Response)=>{

    const userId = Number(req.params.userId)
    const messageId = Number(req.params.id) 
    console.log(messageId)
    
    let indice:number = users.findIndex( users => users.id == userId );

    let indexMessage:number = users[indice].messages.findIndex( messages => messages.id == messageId );
        console.log(indexMessage)
            if (indice > -1){

                console.log('if.')
                console.log(indexMessage)
                if (indexMessage > -1) {
                    console.log('if..')
                    res.send(`Resultado: ${JSON.stringify(users[indice].messages[indexMessage])}`)
                }else{  res.status(400).send(`nao tem transações`)}

                
            }else{  res.status(400).send(`nao tem usuario`)}

   


})




app.post('/users/:userId/messages',(req:Request,res:Response)=>{

    console.log('entrou')
    const title = String(req.body.title)
    const id = Number(req.params.userId)
    const description = String(req.body.description)   
    
    
    
    console.log(id)
    if (title != 'undefined' || description != 'undefined'  ) {
        
        let indice:number = users.findIndex( users => users.id == id );
        
            if (indice > -1) {
                console.log(`id encontrado `)

                idMessage++
                let messages1 = new Messages(idMessage,title,description)
                users[indice].messages.push(messages1)
                res.send(`Mensagem Adicionada`)
                
            }

         
        
    }

    res.status(400).send(`erro`)

    

})