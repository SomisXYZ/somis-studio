import { Module } from '@nestjs/common'

import { DateTimeScalar } from '~/utils/graphql/dateTime.scalar'
import { PriceScalar } from '~/utils/graphql/price.scalar'

@Module({
    providers: [DateTimeScalar, PriceScalar],
})
export class CommonModule {}
