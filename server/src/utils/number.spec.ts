import { isValidBid } from './number'

describe('Number utils', () => {
    describe('isBidValid', () => {
        describe.each([
            ['10', '2', '14', true],
            ['10', '2', '15', false],
            ['0.1', '0.1', '0.5', true],
            ['1', '0.1', '15.1', true],
            ['1', '0.3', '2.2', true],
            ['1', '0.3', '2.1', false],
        ])(
            '%# isBidVaild floor: %i, step: %i, bid: %i',
            (floor: string, step: string, bid: string, result: boolean) => {
                it('should return: %s', () => {
                    expect(isValidBid(floor, step, bid)).toBe(result)
                })
            },
        )
    })
})
