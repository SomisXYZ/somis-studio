import { ISqsService } from '~/aws/sqs.service'

export class MockSqsService implements ISqsService {
    async indexNft(_address: string, _force = false) {
        // noop
    }

    async indexCollection(_address: string, _force = false) {
        // noop
    }

    async indexWallet(_address: string) {
        // noop
    }
}
