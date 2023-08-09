import { AppError } from '.'

const FileSizeExceccedLimit: AppError = {
    code: 'INPUT_FILE_SIZE_EXCECCED_LIMIT',
    message: 'File size excecced limit',
    internal: false,
    status: 400,
    severity: 'app',
}

const FileTypeNotSupported: AppError = {
    code: 'INPUT_FILE_TYPE_NOT_SUPPORTED',
    message: 'File type not supported',
    internal: false,
    status: 400,
    severity: 'app',
}

const InputFieldMissing: AppError = {
    code: 'INPUT_FIELD_MISSING',
    message: 'Input field is missing',
    internal: false,
    status: 400,
    severity: 'app',
}

const InputInvalid: AppError = {
    code: 'INPUT_INVALID',
    message: 'Input is invalid',
    internal: false,
    status: 400,
    severity: 'app',
}

export const InputError = {
    FileSizeExceccedLimit,
    FileTypeNotSupported,
    InputFieldMissing,
    InputInvalid,
}
