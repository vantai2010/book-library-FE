import React from 'react'
import { textVI } from '../../translations/vi'
import { textEN } from '../../translations/en'
import { useSelector } from 'react-redux'
import { languages } from '../../utils/constant'

export default function FormatedText({ id }) {
    const language = useSelector(state => state.app.language)
    const path = id.split('.')

    return (
        <>
            {
                language === languages.EN ? path.reduce((obj, key) => obj && obj[key], textEN)
                    :
                    path.reduce((obj, key) => obj && obj[key], textVI)
            }
        </>
    )
}
