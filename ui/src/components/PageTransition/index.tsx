import { TransitionGroup, Transition as ReactTransition } from 'react-transition-group'
import { ReactNode } from 'react'
import { Flex } from '../Flex'

export const PageTransition = ({ children, location }: { children: ReactNode; location: string }) => {
    const TIMEOUT = 300

    return (
        <TransitionGroup style={{ position: 'relative' }}>
            <ReactTransition
                key={location}
                timeout={{
                    enter: TIMEOUT,
                    exit: TIMEOUT,
                }}
                onEntering={(node: HTMLElement) => {
                    node.style.opacity = `0`
                }}
                onEntered={(node: HTMLElement) => {
                    node.style.transition = `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`
                    node.style.opacity = `1`
                    node.style.animation = 'blink .3s linear 2'
                }}
                onExiting={(node: HTMLElement) => {
                    node.style.transition = `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`
                    node.style.opacity = `0`
                }}
            >
                <Flex className="w-full" flexDirection="column">
                    {children}
                </Flex>
            </ReactTransition>
        </TransitionGroup>
    )
}
export default PageTransition
