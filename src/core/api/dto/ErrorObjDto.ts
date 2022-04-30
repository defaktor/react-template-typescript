interface IErrorBase {
  status_code: number
  status_text: string
}

interface IErrorWithOutFormFields extends IErrorBase {
  status?: never
  form_fields?: never
}

interface IErrorFormFields extends IErrorBase {
  status: string
  form_fields: {
    [key: string]: string[]
  }
}

export type ErrorBaseResponseDto = IErrorWithOutFormFields | IErrorFormFields
