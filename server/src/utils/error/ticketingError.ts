import { AppError } from '.'

const TicketUsed: AppError = {
    code: 'TICKETING_ERROR_TICKET_USED',
    message: 'The ticket is used',
    internal: false,
    severity: 'app',
    status: 400,
}

const InvalidTicketToken: AppError = {
    code: 'TICKETING_ERROR_INVALID_TICKET_TOKEN',
    message: 'The ticket token is invalid',
    internal: false,
    severity: 'app',
    status: 400,
}

export const TicketingError = {
    TicketUsed,
    InvalidTicketToken,
}
