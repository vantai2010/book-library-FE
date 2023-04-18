import React from 'react'
import HomeHeader from './HomePage/HomeHeader'
import HomeFooter from './HomePage/HomeFooter'
import FormatedText from '../components/FormatedText/FormatedText'

export default function NotFound() {
    return (
        <>
            <HomeHeader />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <p style={{ color: 'blue', fontWeight: 'bold', fontSize: '100px' }}>404</p>
                <p style={{ fontWeight: 'bold', fontSize: '70px' }}><FormatedText id="notFound" /></p>
            </div>
            <HomeFooter />
        </>
    )
}
