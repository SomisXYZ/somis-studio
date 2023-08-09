import clsx from 'clsx'
import React from 'react'
import { Flex } from '../Flex'
import { Typography } from '../Typography'
import styles from './FormSection.module.scss'

export interface FormSectionProps {
    title: string
    name: string
    description?: string
    helper?: string
    error?: string
    children: React.ReactNode
    focus?: boolean
}

export const FormSection = ({ title, description, name, helper, error, children, focus = true }: FormSectionProps) => {
    return (
        <Flex fullWidth flexDirection="column" className={clsx(focus && styles['form-section-focus'])} gap={2}>
            <Typography
                variant="md"
                component="label"
                htmlFor={name}
                bold
                transform="uppercase"
                color="none"
                className="group-hover:text-primary text-light dark:text-dark-gray"
            >
                {title}
            </Typography>
            {description ? (
                <Typography variant="sm" color="gray" className="pt-1">
                    {description}
                </Typography>
            ) : null}
            {children}
            {error || helper ? (
                <Typography variant="md" bold color={error ? 'error' : 'gray'}>
                    {error || helper}
                </Typography>
            ) : null}
        </Flex>
    )
}
