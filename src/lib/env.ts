/**
 * Environment Variable Validation
 * 
 * Validates required environment variables at application startup.
 * Throws clear errors if critical variables are missing.
 */

interface EnvironmentVariables {
  VITE_API_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private env: EnvironmentVariables

  private constructor() {
    this.env = this.validateEnvironment()
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  private validateEnvironment(): EnvironmentVariables {
    const apiUrl = import.meta.env.VITE_API_URL

    // Critical validation: API URL must be set
    if (!apiUrl || apiUrl.trim() === '') {
      throw new Error(
        'CRITICAL: VITE_API_URL environment variable is not set.\n' +
        'Please create a .env file with VITE_API_URL=<your-api-url>\n' +
        'Example: VITE_API_URL=https://api.yourdomain.com'
      )
    }

    // Validate URL format
    if (apiUrl.startsWith('/')) {
        // Relative path is allowed (e.g. /api/v1) for proxy usage
    } else {
        try {
          new URL(apiUrl)
        } catch (error) {
          throw new Error(
            `CRITICAL: VITE_API_URL is not a valid URL: ${apiUrl}\n` +
            'Please provide a valid URL (e.g., https://api.yourdomain.com) or a relative path (e.g., /api/v1)'
          )
        }
    }

    // Warn if using example domain in production
    if (import.meta.env.PROD && apiUrl.includes('example.com')) {
      console.error(
        'WARNING: Using example.com API URL in production build!\n' +
        'This will cause API calls to fail. Please set a valid VITE_API_URL.'
      )
    }

    return {
      VITE_API_URL: apiUrl,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
    }
  }

  public getApiUrl(): string {
    return this.env.VITE_API_URL
  }

  public isDevelopment(): boolean {
    return this.env.DEV
  }

  public isProduction(): boolean {
    return this.env.PROD
  }

  public getMode(): string {
    return this.env.MODE
  }

  public getWsUrl(): string {
    const apiUrl = this.getApiUrl()
    
    // Handle relative URLs (e.g. /api)
    if (apiUrl.startsWith('/')) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host
        return `${protocol}//${host}${apiUrl}`
    }

    // Handle absolute URLs
    // Replace http:// with ws:// and https:// with wss://
    return apiUrl
      .replace(/^http:/, 'ws:')
      .replace(/^https:/, 'wss:')
  }
}

// Export singleton instance
export const env = EnvironmentValidator.getInstance()

// Export helper functions
export const getApiUrl = () => env.getApiUrl()
export const getWsUrl = () => env.getWsUrl()
export const isDevelopment = () => env.isDevelopment()
export const isProduction = () => env.isProduction()
