export type Config = {
  turnstile: {
    siteKey: string
  },
  features: {
    login: boolean,
    forgotPassword: boolean,
    demo: boolean
  }
}