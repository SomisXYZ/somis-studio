export const getColumnNumberByBreakpoint = (breakpoint: string): number => {
    if (breakpoint === 'sm') return 2
    if (breakpoint === 'md') return 3
    if (breakpoint === 'lg') return 4
    if (breakpoint === 'xl') return 5
    if (breakpoint === '2xl') return 6
    return 2
}
