import localFont from '@next/font/local'

export const JetBrainsMono = localFont({
    src: [
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-Italic.ttf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-MediumItalic.ttf',
            weight: '500',
            style: 'italic',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-SemiBoldItalic.ttf',
            weight: '600',
            style: 'italic',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-BoldItalic.ttf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-ExtraBold.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/jbm/JetBrainsMono-ExtraBoldItalic.ttf',
            weight: '800',
            style: 'italic',
        },
    ],
    variable: '--font-jetbrains-mono',
    display: 'fallback',
})

export const PPMonumentExtended = localFont({
    src: [
        {
            path: '../../styles/fonts/ppm/PPMonumentExtended-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/ppm/PPMonumentExtended-LightItalic.otf',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../../styles/fonts/ppm/PPMonumentExtended-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/ppm/PPMonumentExtended-RegularItalic.otf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../styles/fonts/ppm/PPMonumentExtended-Black.otf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/ppm/PPMonumentExtended-BlackItalic.otf',
            weight: '900',
            style: 'italic',
        },
    ],
    display: 'fallback',
})

export const SpaceGrotesk = localFont({
    src: [
        {
            path: '../../styles/fonts/sg/SpaceGrotesk-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/sg/SpaceGrotesk-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/sg/SpaceGrotesk-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/sg/SpaceGrotesk-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../styles/fonts/sg/SpaceGrotesk-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
    display: 'fallback',
})
