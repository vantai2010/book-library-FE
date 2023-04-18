import React, { useState, useRef, useEffect } from 'react'
import './CommentForm.scss'
import Comment from './Comment'
import { Modal } from 'antd'
import FormatedText from '../../components/FormatedText/FormatedText'
import { languages } from '../../utils/constant'
import { useSelector } from 'react-redux'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import { getAllCommentByRoomIdService, postOneCommentByRoomService, deleteOneCommentByIdService } from "../../service/appService";
import moment from 'moment'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router'
import _ from 'lodash'


export default function CommentForm({ roomId, socket, bookId }) {
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const [listComment, setListComment] = useState([])
    const [showCheckDelete, setShowCheckDelete] = useState(false)
    const idMessDelete = useRef()
    const [comment, setComment] = useState('')

    const handleShowModalCheckDelete = () => {
        setShowCheckDelete(true)
    }

    const handleSetRefMess = (id) => {
        idMessDelete.current = id
    }

    const getAllCommentByRoomId = async () => {
        let res = await getAllCommentByRoomIdService(roomId)
        if (res && res.data && res.data.errCode === 0) {
            // let getLlistComment = res.data.data
            // getLlistComment = getLlistComment.map

            setListComment(res.data.data)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }
    useEffect(() => {
        getAllCommentByRoomId()
        socket?.on('update-comment', () => {
            getAllCommentByRoomId()
        })

    }, [roomId])

    const getListReplies = commentId => {
        return listComment.filter(item => item.parentId === commentId)
    }

    const hanlePostComment = async () => {
        if (!userInfor || _.isEmpty(userInfor)) {
            toast.info(language === languages.EN ? 'You must login to use this service' : 'Bạn phải đăng nhập để sử dụng tính năng này')
            return
        }
        if (comment.trim() === '' || comment.length === 0) {
            return
        }
        let timeNow = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
        let res = await postOneCommentByRoomService({
            time: timeNow,
            content: comment,
            roomId: roomId
        })
        if (res && res.data && res.data.errCode === 0) {
            getAllCommentByRoomId()
            setComment('')
            socket?.emit('post-message', { roomId: roomId })
        }
    }

    const handleDeleteComment = async () => {
        let res = await deleteOneCommentByIdService(idMessDelete.current)
        if (res && res.data && res.data.errCode === 0) {
            socket?.emit('delete-comment', { roomId: roomId })
            setShowCheckDelete(false)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            hanlePostComment()
        }
    }

    return (
        <>
            <Modal title={language === languages.EN ? textEN.bookInfor.checkTitle : textVI.bookInfor.checkTitle} open={showCheckDelete} onOk={() => handleDeleteComment()} onCancel={() => setShowCheckDelete(false)}>
                <p><FormatedText id="bookInfor.checkDelete" /></p>
            </Modal>
            <div className="book-comment-content" >
                <div className="user-comment col-12">
                    <div className="col-2 col-lg-1">
                    </div>
                    <input
                        className="col-6 col-lg-8"
                        type="text"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        onKeyDown={(e) => handleEnter(e)}
                        placeholder={language === languages.EN ? textEN.bookInfor.commentPlaceholder : textVI.bookInfor.commentPlaceholder}
                        row="5"
                    />
                    <button className="col-3 col-lg-2" onClick={hanlePostComment}>
                        <FormatedText id="bookInfor.comment" />
                    </button>
                </div>
                <div className="user-comment-complete">
                    {
                        listComment && listComment.length > 0 &&
                        listComment.map(item => {
                            if (!item.parentId) {
                                return (
                                    <Comment
                                        handleShowModalCheckDelete={handleShowModalCheckDelete}
                                        handleSetRefMess={handleSetRefMess}
                                        listComments={listComment}
                                        key={item.id}
                                        listReplies={getListReplies(item.id)}
                                        dataCurrentComment={item}
                                        socket={socket}
                                        bookId={bookId}
                                    />
                                )
                            }
                        })
                    }
                </div>
            </div>
        </>
    )
}
