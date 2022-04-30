export interface IAuthState {
  credentials: {
    token: string | null
  }
}

export const authInitialState: IAuthState = {
  credentials: {
    token: null,
  },
}
