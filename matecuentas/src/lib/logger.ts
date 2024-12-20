type LogLevel = 'log' | 'error' | 'warn' | 'info'

class Logger {
  private logToConsole(level: LogLevel, ...args: any[]) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}]`
    
    console[level](prefix, ...args)
  }

  log(...args: any[]) {
    this.logToConsole('log', ...args)
  }

  error(...args: any[]) {
    this.logToConsole('error', ...args)
  }

  warn(...args: any[]) {
    this.logToConsole('warn', ...args)
  }

  info(...args: any[]) {
    this.logToConsole('info', ...args)
  }
}

export const logger = new Logger()

