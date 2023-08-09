import BigNumber from 'bignumber.js'

export function isValidBid(floor: string, step: string, bid: string): boolean {
    const floorBn = new BigNumber(floor)
    const stepBn = new BigNumber(step)
    const bidBn = new BigNumber(bid)

    const diff = bidBn.minus(floorBn)
    const factor = diff.div(stepBn)

    return factor.decimalPlaces() === 0
}
