import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveyRepository"
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository"
import { UsersRepository } from "../repositories/UserRepository"
import { resolve } from "path"
import SendMailService from "../services/SendMailService"

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveyUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await usersRepository.findOne({ email })

        if (!user) {
            return res.status(400).json({
                error: "User does not exists"
            })
        }

        const survey = await surveyRepository.findOne({ id: survey_id })
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")

        if (!survey) {
            return res.status(400).json({
                error: "Survey does not exists"
            })
        }
        const surveyUserAlreadyExists = await surveyUsersRepository.findOne({
            where: { user_id: user.id,  value: null },
            relations: ["user", "survey"]
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",  
            link: process.env.URL_MAIL
        }
        
        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return res.json(surveyUserAlreadyExists)
        }

        // Salvar às informações na tabela surveyUser
        
        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id: survey_id
        })
        
        await surveyUsersRepository.save(surveyUser)
        
        // Enviar e-mail ao usuário

        variables.id = surveyUser.id
        await SendMailService.execute(email, survey.title, variables, npsPath)
        return res.json(surveyUser)
    }
}

export { SendMailController }

/* Pra usar o send email você deve pegar na base de dados um email que já tenha sido colocado lá dentro através de usuário pra poder executar isso
1) Colocar o http://localhost:3333/sendMail no local pras páginas
2) Colocar o método post
3) Selecionar a opção raw que vai estar em body, junto disso, no final da barra de opções onde se encontra o raw, onde tem a setinha pra baixo, selecione JSON 
4) É obrigatório colocar ao menos o email
Exemplo do body:
{
   "email": "matheus.ladeiras@gmail.com",
   "survey_id": "c209ec01-13b2-4e0b-a31f-8337c4051138"
}
Se der erro tente de novo que deve funcionar
Vai aparecer um link que leva para a guia do ethereal
*/