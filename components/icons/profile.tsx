import * as React from "react"
import Svg, { SvgProps, Path, G } from "react-native-svg"

const ChevronRight = (props: SvgProps) => (
    <Svg viewBox='0 0 24 24' {...props}>
        <Path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='m9 18 6-6-6-6'
        />
    </Svg>
)

const HeartOutlined = (props: SvgProps) => (
    <Svg viewBox='0 0 24 24' {...props}>
        <Path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M7.75 3.5C5.127 3.5 3 5.76 3 8.547 3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79-.78-1.654-2.39-2.79-4.25-2.79'
        />
    </Svg>
)

const QuestionCircleOutlined = (props: SvgProps) => (
    <Svg viewBox='0 0 24 24' {...props}>
        <G
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
        >
            <Path d='M12 13.496c0-2.003 2-1.503 2-3.506 0-2.659-4-2.659-4 0m2 6.007v-.5' />
            <Path d='M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0' />
        </G>
    </Svg>
)

const LockOutlined = (props: SvgProps) => (
    <Svg viewBox='0 0 24 24' {...props}>
        <Path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M8 10V8c0-2.761 1.239-5 4-5 2.094 0 3.313 1.288 3.78 3.114M3.5 17.8v-4.6c0-1.12 0-1.68.218-2.107a2 2 0 0 1 .874-.875c.428-.217.988-.217 2.108-.217h10.6c1.12 0 1.68 0 2.108.217a2 2 0 0 1 .874.874c.218.428.218.988.218 2.108v4.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C18.98 21 18.42 21 17.3 21H6.7c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3.5 19.481 3.5 18.921 3.5 17.8M16 14v3'
        />
    </Svg>
)

const MapOutlined = (props: SvgProps) => (
    <Svg viewBox='0 0 24 24' {...props}>
        <Path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M3 8.593c0-1.527 0-2.29.393-2.735.139-.159.308-.285.497-.372 1.416-.653 3.272 1.066 4.77 1.013q.296-.011.587-.082c2.184-.535 3.552-3.08 5.798-3.39 1.287-.18 2.7.598 3.904 1.014.99.342 1.485.513 1.768.92S21 5.91 21 6.99v8.422c0 1.526 0 2.29-.393 2.735a1.5 1.5 0 0 1-.497.371c-1.416.653-3.272-1.065-4.77-1.012a3 3 0 0 0-.587.081c-2.184.535-3.552 3.08-5.798 3.391-1.281.178-4.847-.75-5.672-1.935C3 18.636 3 18.096 3 17.014zm6-2.052v14.255m6-17.615v14.255'
        />
    </Svg>
)

export {
    ChevronRight,
    HeartOutlined,
    QuestionCircleOutlined,
    LockOutlined,
    MapOutlined,
}
