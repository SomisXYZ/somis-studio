import useTranslation from 'next-translate/useTranslation'
import { Container } from '~/components'
import { Tab } from '~/components/Tabs'
import { UserOwnedPage } from '../OwnedPage'

export const UserContent = () => {
    const { t } = useTranslation('user')
    const tabs = [
        {
            title: t('tabs.owned'),
            content: <UserOwnedPage />,
        },
        // {
        //     title: t('tabs.activity'),
        //     content: (
        //         <Flex justifyContent="center" alignItems="center">
        //             {t('common:empty.noData')}
        //         </Flex>
        //     ),
        // },
        // {
        //     title: t('tabs.offers'),
        //     content: (
        //         <Flex justifyContent="center" alignItems="center">
        //             {t('common:empty.noData')}
        //         </Flex>
        //     ),
        //     disabled: true,
        // },
    ]
    return (
        <Container fullWidth overflow="inherit">
            <Tab tabs={tabs} disableFullWidth />
        </Container>
    )
}
