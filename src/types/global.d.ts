export {}

declare global {
  interface User {
    uid: string
    name: string
    carnet: string
    carrera: string
    email: string
    password: string
    role: string
  }

  interface Month {
    id?: string
    charges: Charge[]
    dueDate: string
    paid: boolean
    paidDate?: string
    card?: string
    totalFee?: number
    ticketUrl?: string
    cardNumber?: string
    cardExpDate?: string
  }

  interface Charge {
    description: string
    fee: number
  }

  interface Card {
    id: string
    number: string
    name: string
    expDate: string
    cvv: string
  }
}
