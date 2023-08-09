import { Notification, NotificationType } from '~/gql/generated/graphql'
import welcomeDark from '@assets/icons/notification/welcome_dark.svg'
import welcome from '@assets/icons/notification/welcome_light.svg'
import otherDark from '@assets/icons/notification/other_dark.svg'
import other from '@assets/icons/notification/other_light.svg'
import rewardDark from '@assets/icons/notification/reward_dark.svg'
import reward from '@assets/icons/notification/reward_light.svg'
// import bidLostDark from '@assets/icons/notification/bid_lost_dark.svg'
// import bidLost from '@assets/icons/notification/bid_lost_light.svg'

export const handleNotificationIcon = (notification: Notification, isDark: boolean) => {
    const { type } = notification
    switch (type) {
        case NotificationType.Welcome:
            return isDark ? welcomeDark : welcome
        case NotificationType.Other:
            return isDark ? otherDark : other
        case NotificationType.Crew3XpReceived:
            return isDark ? rewardDark : reward
        default:
            return notification?.metadata?.nftImageUrl ?? ''
    }
}
