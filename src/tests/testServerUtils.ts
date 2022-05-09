import {DefaultRequestBody, ResponseComposition, rest, RestContext} from "msw";

const authErrorResponse = (res: ResponseComposition<DefaultRequestBody>, ctx: RestContext) => {
    return res(
        ctx.status(401),
        ctx.json({
            success: false,
            message: "You are not authorised",
        })
    )
}

const unknownErrorResponse = (res: ResponseComposition<DefaultRequestBody>, ctx: RestContext) => {
    return res(
        ctx.status(404),
        ctx.json({
            success: false,
            message: "Unknown Error",
        })
    )
}

const validationErrorResponse = (res: ResponseComposition<DefaultRequestBody>, ctx: RestContext) => {
    return res(
        ctx.status(422),
        ctx.json({
            success: false,
            message: "Validation error",
        })
    )
}

export const authErrorHandlers = [
    rest.get('*', async (req, res, ctx) => authErrorResponse(res, ctx)),
    rest.post('*', async (req, res, ctx) => authErrorResponse(res, ctx)),
    rest.patch('*', async (req, res, ctx) => authErrorResponse(res, ctx)),
    rest.put('*', async (req, res, ctx) => authErrorResponse(res, ctx)),
    rest.delete('*', async (req, res, ctx) => authErrorResponse(res, ctx)),
]

export const unknownErrorHandlers = [
    rest.get('*', async (req, res, ctx) => unknownErrorResponse(res, ctx)),
    rest.post('*', async (req, res, ctx) => unknownErrorResponse(res, ctx)),
    rest.patch('*', async (req, res, ctx) => unknownErrorResponse(res, ctx)),
    rest.put('*', async (req, res, ctx) => unknownErrorResponse(res, ctx)),
    rest.delete('*', async (req, res, ctx) => unknownErrorResponse(res, ctx)),
]

export const validationErrorHandlers = [
    rest.get('*', async (req, res, ctx) => validationErrorResponse(res, ctx)),
    rest.post('*', async (req, res, ctx) => validationErrorResponse(res, ctx)),
    rest.patch('*', async (req, res, ctx) => validationErrorResponse(res, ctx)),
    rest.put('*',  async(req, res, ctx) => validationErrorResponse(res, ctx)),
    rest.delete('*', async (req, res, ctx) => validationErrorResponse(res, ctx)),
]