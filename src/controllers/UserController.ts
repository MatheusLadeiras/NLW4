import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { UsersRepository } from "../repositories/UserRepository"

class UserController {
    async create(req: Request, res: Response) {
        const { name, email } = req.body
        const usersRepository = getCustomRepository(UsersRepository)
        const userAlreadyExists = await usersRepository.findOne({
            email
        })
        const user = usersRepository.create({
            name, email
        })

        if (userAlreadyExists) {
            return res.status(400).json({
                error: "User already exists!"
            })
        }

        await usersRepository.save(user)
        return res.status(201).json(user)
    }
}

export { UserController }

/* Pra testar o envio de users no postman você deve  
1) Colocar o http://localhost:3333/users no local pras páginas
2) Colocar o método post
3) Selecionar a opção raw que vai estar em body, junto disso, no final da barra de opções onde se encontra o raw, onde tem a setinha pra baixo, selecione JSON 
4) É obrigatório colocar ao menos o name
Exemplo do body:
{
    "name": "matheus",
    "email": "matheus.ladeiras@gmil.com"
}
  */