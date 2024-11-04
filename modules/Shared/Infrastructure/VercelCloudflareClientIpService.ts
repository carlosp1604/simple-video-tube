import { ClientIpServiceInterface, FALLBACK_IP_ADDRESS } from '~/modules/Shared/Domain/ClientIpServiceInterface'
import { NextApiRequest } from 'next'

export class VercelCloudflareClientIpService implements ClientIpServiceInterface {
  /**
   * Returns the real IP address of the client.
   * @param request - The incoming request.
   * @param cfProxy - Whether the client is behind a Cloudflare proxy.
   * @returns The real IP address of the client.
   */
  public getClientIp = (request: NextApiRequest, cfProxy = false): string => {
    const headers = request.headers

    /**
     * Cloudflare only headers.
     */
    if (cfProxy && headers['cf-connecting-ip']) {
      return headers['cf-connecting-ip'] as string
    }

    if (headers['x-real-ip']) {
      return headers['x-real-ip'] as string
    }

    if (headers['x-forwarded-for']) {
      return headers['x-forwarded-for'] as string
    }

    if (headers['x-vercel-forwarded-for']) {
      return headers['x-vercel-forwarded-for'] as string
    }

    if (headers['x-vercel-proxied-for']) {
      return headers['x-vercel-proxied-for'] as string
    }

    return FALLBACK_IP_ADDRESS
  }
}
