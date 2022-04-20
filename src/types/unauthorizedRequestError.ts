class UnauthorizedRequestError extends Error {
    constructor(msg: string | undefined) {
        super(msg);
    }
}

export { UnauthorizedRequestError }