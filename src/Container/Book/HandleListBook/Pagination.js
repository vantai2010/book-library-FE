import React, { useEffect, useRef } from 'react'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { useState } from 'react'
import './HandleListBook.scss'
import { getLengthListBooksService } from '../../../service/appService'

export default function Pagination({ setPage, categoryId }) {

    const [currentPage, setCurrentPage] = useState(1)
    const [listPage, setListPage] = useState([])
    const lengthListBooks = useRef()
    const getLengthListBooks = async () => {
        try {
            let res = await getLengthListBooksService(categoryId)
            if (res && res.data && res.data.errCode === 0) {
                lengthListBooks.current = res.data.data
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(async () => {
        await getLengthListBooks(categoryId)
        let totelPage = Math.ceil(+lengthListBooks.current / 20)
        let list = []
        for (let i = 0; i < totelPage; i++) {
            list.push(i + 1)
        }
        setListPage(list)
    }, [lengthListBooks.current])

    useEffect(() => {
        setPage(currentPage)
    }, [currentPage])

    return (
        <div className="pagination-container">
            <div className="pagination-body">
                <button className="btn-icon-paginate" style={{ border: 'none', fontSize: '15px', backgroundColor: 'transparent' }} disabled={currentPage <= 1 ? true : false} onClick={() => setCurrentPage(currentPage - 1)}><FcPrevious /></button>
                {
                    listPage && listPage.length > 0 &&
                    listPage.map(item => {
                        return (
                            <span className="btn"
                                style={currentPage === item ? { color: 'red', fontSize: '1.3rem', textAlign: 'center' } : {}}
                                onClick={() => setCurrentPage(item)}
                            >
                                {item}
                            </span>
                        )
                    })
                }
                <button className="btn-icon-paginate" style={{ border: 'none', fontSize: '15px', backgroundColor: 'transparent' }} disabled={currentPage === listPage[listPage.length - 1] ? true : false} onClick={() => setCurrentPage(currentPage + 1)}><FcNext /></button>
            </div>
        </div>
    )
}
