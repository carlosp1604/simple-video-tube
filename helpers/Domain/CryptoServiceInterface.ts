export interface CryptoServiceInterface {
  hash(password: string): Promise<string>
  compare(password: string, hashedPassword: string): Promise<boolean>
}