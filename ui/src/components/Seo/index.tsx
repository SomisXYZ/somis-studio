import Head from 'next/head'
export interface SeoProps {
    title?: string | undefined
    description?: string | undefined
    image?: string | undefined
    page?: string | undefined
}

export const Seo = ({
    seo = {
        title: 'Somis | The Fastest NFT Marketplace on Sui',
        description: 'The Fastest NFT Marketplace on Sui',
        // Because og:image only accept absolute url, so we need to add domain here
        image: 'https://somis-image-production.s3.us-east-2.amazonaws.com/logo.png',
    },
}: {
    seo: SeoProps
}) => {
    return (
        <Head>
            <title>{seo.title ? `${seo.title} | Somis` : 'Somis | The Fastest NFT Marketplace on Sui'}</title>
            <meta name="description" content={seo.description ?? 'The Fastest NFT Marketplace on Sui'} />
            <meta
                property="og:title"
                content={
                    seo.title ? `${seo.title} | ${seo.page ?? 'Somis'}` : 'Somis | The Fastest NFT Marketplace on Sui'
                }
            />
            <meta property="og:description" content={seo.description ?? 'The Fastest NFT Marketplace on Sui'} />
            <meta
                property="og:image"
                content={seo.image ?? 'https://somis-image-production.s3.us-east-2.amazonaws.com/logo.png'}
            />
            {seo.image ? (
                <>
                    <meta property="og:image:width" content="200" />
                    <meta property="og:image:height" content="200" />
                </>
            ) : null}
        </Head>
    )
}
