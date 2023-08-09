import { CommissionAddressType, getCommissionMarketplaceByAddress } from '~/utils/nft'
import { ReactSVG } from 'react-svg'
import somisLogo from '@assets/icons/marketplaces/somis.svg'
import clutchyLogo from '@assets/icons/marketplaces/clutchy.svg'
import hyperspaceLogo from '@assets/icons/marketplaces/hyperspace.svg'
import bluemoveLogo from '@assets/icons/marketplaces/bluemove.svg'
import { loadSVG } from '~/utils/helpers'
import clsx from 'clsx'

const display = false

export const CommissionMarketplaceIcon = ({
    commissionMarketplaceAddress,
    size = 25,
}: {
    commissionMarketplaceAddress?: string | null
    size?: number
}) => {
    const commissionMarketplace = getCommissionMarketplaceByAddress(commissionMarketplaceAddress)
    if (!commissionMarketplace || !display) {
        return null
    }
    const icon = (): any => {
        switch (commissionMarketplace) {
            case CommissionAddressType.somis:
                return somisLogo
            case CommissionAddressType.clutchy:
                return clutchyLogo
            case CommissionAddressType.hyperspace:
                return hyperspaceLogo
            case CommissionAddressType.bluemove:
                return bluemoveLogo
            default:
                return null
        }
    }

    return (
        (icon() && (
            <div title={commissionMarketplace}>
                <ReactSVG
                    src={loadSVG(icon())}
                    style={{ width: size, height: size }}
                    beforeInjection={(svg) => {
                        svg.setAttribute('width', size.toString())
                        svg.setAttribute('height', size.toString())
                    }}
                    className={clsx('rounded-full', 'overflow-hidden')}
                />
            </div>
        )) ||
        null
    )
}

CommissionMarketplaceIcon.displayName = 'CommissionMarketplaceIcon'
