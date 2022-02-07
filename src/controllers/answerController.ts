import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository";
import { AppError } from "../errors/AppError"

class AnswerController { 
    /* route Params => Parâmetros que compôe a rota
     routes.get("/answers/:value")
     
     Query Params => Busca, Paginacao, não obrigatórios
     chave=valor
    */
    async execute(request: Request, response: Response) {
        const { value } = request.params
        const { u } = request.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u),
        })

        if (!surveyUser) {
            throw new AppError("Survey user not found");
        }

        surveyUser.value = Number(value)
        await surveysUsersRepository.save(surveyUser)

        return response.json(surveyUser)
    }
}

export { AnswerController }