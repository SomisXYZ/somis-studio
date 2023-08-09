import create from 'zustand'
import shallow from 'zustand/shallow'

export interface AlertState {
    show: boolean
    message?: string | React.ReactNode
    title: string | null
    open: () => void
    close: () => void
    setChildren: (message: string | React.ReactNode, title?: string | null) => void
}

export const useAlertState = create<AlertState>((set) => {
    return {
        show: false,
        message: '',
        title: '',
        disabled: false,
        open: () => {
            set(() => ({
                show: true,
            }))
        },
        close: () => {
            set(() => ({
                message: '',
                title: '',
                show: false,
            }))
        },
        setChildren: (message = '', title = null) => {
            set(() => ({
                message,
                title,
            }))
        },
    }
})

export const useAlert = () => {
    const controls = useAlertState(
        (store) => ({
            open: store.open,
            setChildren: store.setChildren,
        }),
        shallow,
    )

    return controls
}

export default useAlert
