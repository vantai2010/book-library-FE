import React, { useState } from 'react'
import Avatar from '../../components/Avatar'
import './CommentForm.scss'
import { useSelector } from 'react-redux';
import { languages } from '../../utils/constant';
import FormatedText from '../../components/FormatedText/FormatedText';
import { postOneCommentByRoomService } from '../../service/appService';
import { toast } from 'react-toastify';
import { AiOutlineCheck } from 'react-icons/ai'
import moment from 'moment';
import { user_role } from '../../utils/constant';

export default function Comment({ handleShowModalCheckDelete, handleSetRefMess, dataCurrentComment, listComments, socket, listReplies, bookId }) {

    const [showReply, setShowReply] = useState(false)
    const listUserOnline = useSelector(state => state.app.listUserOnline)
    const userInfor = useSelector(state => state.auth.userInfor)
    const language = useSelector(state => state.app.language)
    const [content, setContent] = useState('')
    const handleDelete = (id) => {
        handleSetRefMess(id)
        handleShowModalCheckDelete()
    }

    const getListReplies = commentId => {
        return listComments.filter(item => item.parentId === commentId)
    }

    const handleReply = async () => {
        let timeNow = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
        let res = await postOneCommentByRoomService({
            roomId: dataCurrentComment.roomId,
            content: content,
            parentId: dataCurrentComment.id,
            time: timeNow
        })
        if (res && res.data && res.data.errCode === 0) {
            setShowReply(false)
            setContent('')
            console.log(dataCurrentComment.id)
            socket?.emit('reply-comment', {
                roomId: dataCurrentComment.roomId,
                receiverId: dataCurrentComment.userCommentData?.id,
                senderId: userInfor.id,
                firstNameSender: userInfor?.firstName,
                lastNameSender: userInfor?.lastName,
                bookId: bookId
            })
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleEnterInputReply = (e) => {
        if (e.keyCode === 13) {
            handleReply()
        }
    }

    // console.log(dataCurrentComment)
    let nameEN = dataCurrentComment?.userCommentData?.firstName + ' ' + dataCurrentComment?.userCommentData?.lastName
    let nameVI = dataCurrentComment?.userCommentData?.lastName + ' ' + dataCurrentComment?.userCommentData?.firstName
    return (
        <>
            <div className="comment-content" >
                <div className=" comment-img">
                    <Avatar dataUser={{ image: dataCurrentComment.userCommentData?.image, genderId: dataCurrentComment.userCommentData?.genderId }} />
                    {listUserOnline?.some(item => item.userId === dataCurrentComment.userCommentData?.id) ? <div className="status-avatar-comment"></div> : ''}
                </div>
                <div className="mx-3 comment-text-right">
                    <div className="comment-text">
                        <div className="comment-text-title">
                            <p>{language === languages.EN ? nameEN : nameVI} {dataCurrentComment.userCommentData?.roleId === user_role.ADMIN ? <AiOutlineCheck className="blue-tick-form" /> : ''}</p>
                            <p>{dataCurrentComment?.time}</p>
                        </div>
                        <p>{dataCurrentComment?.content}</p>
                    </div>
                    <div className="comment-action">
                        {
                            userInfor && dataCurrentComment && userInfor.id !== dataCurrentComment.userCommentData?.id &&
                            <button onClick={() => setShowReply(!showReply)}><FormatedText id="comment.reply" /></button>
                        }
                        {
                            userInfor && dataCurrentComment && userInfor.id === dataCurrentComment.userCommentData?.id &&
                            <button onClick={() => handleDelete(dataCurrentComment?.id)}><FormatedText id="comment.delete" /></button>
                        }
                    </div>
                    {
                        showReply &&
                        <div className="comment-reply-form-input">
                            <textarea type="text" className='form-control input-reply-comment' onChange={e => setContent(e.target.value)} onKeyDown={(e) => handleEnterInputReply(e)} />
                            <button className="btn btn-primary my-2" onClick={handleReply}><FormatedText id="comment.reply" /></button>
                        </div>
                    }
                    <div className="comment-reply-container">
                        {
                            listReplies && listReplies.length > 0 &&
                            listReplies.map(item => {

                                return <Comment
                                    handleShowModalCheckDelete={handleShowModalCheckDelete}
                                    handleSetRefMess={handleSetRefMess}
                                    listComments={listComments}
                                    key={item.id}
                                    listReplies={getListReplies(item.id)}
                                    dataCurrentComment={item}
                                    bookId={bookId}
                                    socket={socket}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
