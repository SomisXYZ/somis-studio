import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link } from '~/components'

interface Props {
    content: string
}

export const Readmore = ({ content }: Props): React.ReactElement => {
    const [hasShowMoreBtn, setHasShowMoreBtn] = useState(false)
    const [desc, setDesc] = useState(content)
    const length = 300
    useEffect(() => {
        if (content.length > length) {
            setHasShowMoreBtn(true)
            setDesc(content.slice(0, length) + '...')
        }
    }, [content])

    const onClick = () => {
        setDesc(content)
        setHasShowMoreBtn(false)
    }

    return (
        <div className={clsx('flex')}>
            <span className={clsx('font-ppm', 'text-light-tertiary', 'dark:text-dark-tertiary')}>
                <span className="pr-2">{desc}</span>
                {hasShowMoreBtn && (
                    <Link title="Read more" onClick={onClick} showIcon={false} bold className={clsx('inline-block')} />
                )}
            </span>
        </div>
    )
}
