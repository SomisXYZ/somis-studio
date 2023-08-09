import helmet from 'helmet'

import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { asyncContext } from './utils/asyncContext'
import { LoggerService } from './utils/logger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.use(helmet())
    app.use(asyncContext)

    const loggerService = await app.resolve(LoggerService)
    const port = process.env.PORT != null ? parseInt(process.env.PORT) : 3000
    await app.listen(port)
    loggerService.info(`Running in port: ${port}`)
}
bootstrap()
