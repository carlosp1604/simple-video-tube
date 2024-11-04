import { NextApiRequest } from 'next'

export const FALLBACK_IP_ADDRESS = '0.0.0.0'

export interface ClientIpServiceInterface {
  /**
   * Returns the real IP address of the client.
   * @param request - The incoming request.
   * @param cfProxy - Whether the client is behind a Cloudflare proxy.
   * @returns The real IP address of the client.
   */
  getClientIp (request: NextApiRequest, cfProxy: boolean): string
}
