import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveyRepository"

class SurveyController {
    async create(req: Request, res: Response) {
        const { title, description } = req.body 

        const surveysRepository = getCustomRepository(SurveysRepository)
        const survey = surveysRepository.create({
            title, description
        })

        await surveysRepository.save(survey)

        return res.status(201).json(survey)
    }

    async show(req: Request, res: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository)
        const all = await surveysRepository.find()

        return res.json(all)
    }
}

export { SurveyController }

/* Pra testar o envio de surveys no postman você deve  
1) Colocar o http://localhost:3333/surveys no local pras páginas
2) Colocar o método get
3) Selecionar a opção raw que vai estar em body, junto disso, no final da barra de opções onde se encontra o raw, onde tem a setinha pra baixo, selecione JSON 
4) É obrigatório colocar ao menos o title
Exemplo do body:
{
   "title": " Queremos ouvir sua opinião",
   "description": "De 0 a 10, quanto você recomendaria a Rocketseat/"
}
Já para ver as surveys, você deve usar o método get, selecionar "none" em body e estar em http://localhost:3333/surveys 
*/