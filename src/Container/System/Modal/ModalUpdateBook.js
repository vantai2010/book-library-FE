import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchListGenderThunk, fetchListRoleThunk } from '../../../store/slice/appSlice';
import { languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import CommonUtils from '../../../utils/CommonUtils'
import { handleUpdateBookService } from '../../../service/appService';
import './Modal.scss';
import Select from 'react-select';
import _ from 'lodash'
import Loading from "../../../components/Loading"

export default function ModalUpdateBook({ isOpen, toggle, className, setKeyRefToNewBook, book, listCategories, listAuthors, listShelfs, setCurrentCategory }) {
    const language = useSelector(state => state.app.language)
    let selectedObtionAuthor = {
        value: book.authorId,
        label: !_.isEmpty(book.authorData) && book.authorData.name + ' (' + book.authorData.birthDay + ')'
    }
    let selectedObtionCategory = {
        value: book.categoryId,
        label: !_.isEmpty(book.categoryData) && language === languages.EN ? book.categoryData.valueEn : !_.isEmpty(book.categoryData) && language === languages.VI ? book.categoryData.valueVi : ''
    }
    let selectedObtionShelf = {
        value: !_.isEmpty(book.bookInforData) && book.bookInforData.shelfId,
        label: !_.isEmpty(book.bookInforData) && !_.isEmpty(book.bookInforData.shelfData) && book.bookInforData.shelfData.name
    }

    const [inputForm, setInputForm] = useState({
        name: book.name,
        quantity: book.quantity,
        description: !_.isEmpty(book.bookInforData) && book.bookInforData.description,
        roomId: !_.isEmpty(book.bookInforData) && book.bookInforData.roomId
    })
    const [image, setImage] = useState(book.image)
    const [obtionAuthor, setObtionAuthor] = useState([])
    const [selectedAuthor, setSelectedAuthor] = useState(selectedObtionAuthor)
    const [isLoading , setIsLoading] = useState(false)
    const [obtionCategory, setObtionCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(selectedObtionCategory)

    const [obtionShelf, setObtionShelf] = useState([])
    const [selectedShelf, setSelectedShelf] = useState(selectedObtionShelf)

    const [errMessage, setErrMessage] = useState({
        name: '',
        categoryId: '',
        authorId: '',
        shelfId: '',
        roomId: '',
        quantity: '',
        description: '',
        image: '',
    })

    useEffect(() => {
        let authors = []
        if (listAuthors && listAuthors.length > 0) {
            listAuthors.forEach(author => {
                let obtions = {}
                obtions.value = author.id
                obtions.label = author.name + ' (' + author.birthDay + ')'
                authors.push(obtions)
            })
        }
        setObtionAuthor(authors)

    }, [listAuthors])

    useEffect(() => {
        let authors = []
        if (listShelfs && listShelfs.length > 0) {
            listShelfs.forEach(shelf => {
                let obtions = {}
                obtions.value = shelf.id
                obtions.label = shelf.name
                authors.push(obtions)
            })
        }
        setObtionShelf(authors)

    }, [listShelfs])

    useEffect(() => {
        let authors = []
        if (listCategories && listCategories.length > 0) {
            if (language === languages.VI) {
                listCategories.forEach(category => {
                    let obtions = {}
                    obtions.value = category.keyMap
                    obtions.label = category.valueVi
                    authors.push(obtions)
                })
            }
            if (language === languages.EN) {
                listCategories.forEach(category => {
                    let obtions = {}
                    obtions.value = category.keyMap
                    obtions.label = category.valueEn
                    authors.push(obtions)
                })
            }
        }
        setObtionCategory(authors)

    }, [listCategories])

    useEffect(() => {
        setInputForm({
            name: book.name,
            quantity: book.quantity,
            description: !_.isEmpty(book.bookInforData) && book.bookInforData.description,
            roomId: !_.isEmpty(book.bookInforData) && book.bookInforData.roomId
        })
        setImage(book.image)
        setSelectedAuthor(selectedObtionAuthor)
        setSelectedCategory(selectedObtionCategory)
        setSelectedShelf(selectedObtionShelf)
    }, [book])

    const handleOnchange = (type, even) => {
        setInputForm({ ...inputForm, [type]: even.target.value })
    }

    const handleClose = () => {
        setInputForm({
            name: book.name,
            categoryId: book.categoryId,
            quantity: book.quantity,
            description: !_.isEmpty(book.bookInforData) && book.bookInforData.description,
            roomId: !_.isEmpty(book.bookInforData) && book.bookInforData.roomId
        })
        setImage(book.image)
        setErrMessage({
            name: '',
            categoryId: '',
            authorId: '',
            shelfId: '',
            roomId: '',
            quantity: '',
            description: '',
            image: '',
        })
        setSelectedAuthor(selectedObtionAuthor)
        setSelectedShelf(selectedObtionShelf)
        setSelectedCategory(selectedObtionCategory)
        toggle()
    }

    const handleOnchangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            // let objectUrl = URL.createObjectURL(file)
            setImage(base64)
            // setPreviewImgUrl(objectUrl)

        }

    }

    const handleUpdateAuthor = async () => {
        let { name, roomId, quantity, description } = inputForm
        if (!name) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                name: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })

            return
        }
        if (!selectedCategory.value) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                categoryId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!selectedAuthor.value) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                authorId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!selectedShelf.value) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                shelfId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!roomId) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                roomId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!quantity) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                quantity: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!description) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                description: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!image) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                image: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!isNaN(name)) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                name: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (isNaN(quantity)) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                quantity: language === languages.EN ? 'This field must be a number' : "Trường này phải là số"
            })
            return
        }
        if (!isNaN(description)) {
            setErrMessage({
                name: '',
                categoryId: '',
                authorId: '',
                shelfId: '',
                roomId: '',
                quantity: '',
                description: '',
                image: '',
                description: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        try {
            setIsLoading(true)
            let response = await handleUpdateBookService({
                ...inputForm,
                id: book.id,
                authorId: selectedAuthor.value,
                shelfId: selectedShelf.value,
                categoryId: selectedCategory.value,
                image
            })
            setIsLoading(false)
            if (response && response.data && response.data.errCode === 0) {
                toast.success(language === languages.EN ? response.data.messageEN : response.data.messageVI)
                setCurrentCategory(selectedCategory.value)
                setKeyRefToNewBook(inputForm.name + selectedCategory.value)
                handleClose()
            } else {
                toast.error(language === languages.EN ? response.data.messageEN : response.data.messageVI)
            }
        } catch (error) {
            console.log(error)
        }


    }



    const handleChangeAuthor = (selectedOption) => {
        setSelectedAuthor(selectedOption)
    };

    const handleChangeShelf = (selectedOption) => {
        setSelectedShelf(selectedOption)
    }

    const handleChangeCategory = (selectedOption) => {
        setSelectedCategory(selectedOption)
    }

    return (
        <>
        {
            isLoading && <Loading />
        }
        <Modal
            isOpen={isOpen}
            toggle={handleClose}
            className={className}
            size={'lg'}
        >
            <ModalHeader toggle={handleClose}><FormatedText id="modal.titleUpdateBook" /></ModalHeader>
            <ModalBody>

                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <label><FormatedText id="manage.name" /></label>
                            <input value={inputForm.name} onChange={(e) => handleOnchange('name', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.name}</p>
                        </div>
                        <div className="col-3">
                            <label><FormatedText id="manage.category" /></label>
                            <Select
                                value={selectedCategory}
                                onChange={handleChangeCategory}
                                options={obtionCategory}
                            />
                            <p style={{ color: 'red' }}>{errMessage.categoryId}</p>
                        </div>
                        <div className="col-3">
                            <label><FormatedText id="manage.author" /></label>
                            <Select
                                value={selectedAuthor}
                                onChange={handleChangeAuthor}
                                options={obtionAuthor}
                            />
                            <p style={{ color: 'red' }}>{errMessage.authorId}</p>

                        </div>
                        <div className="col-4">
                            <label><FormatedText id="manage.shelf" /></label>
                            <Select
                                value={selectedShelf}
                                onChange={handleChangeShelf}
                                options={obtionShelf}
                            />
                            <p style={{ color: 'red' }}>{errMessage.shelfId}</p>

                        </div>
                        <div className="col-4">
                            <label><FormatedText id="manage.room" /></label>
                            <input value={inputForm.roomId} onChange={(e) => handleOnchange('roomId', e)} className="form-control" />
                            <p style={{ color: 'red' }}>{errMessage.roomId}</p>
                        </div>
                        <div className="col-4">
                            <label><FormatedText id="manage.quantity" /></label>
                            <input value={inputForm.quantity} onChange={(e) => handleOnchange('quantity', e)} className="form-control" />
                            <p style={{ color: 'red' }}>{errMessage.quantity}</p>
                        </div>
                        <div className="col-6">
                            <label><FormatedText id="manage.description" /></label>
                            <textarea value={inputForm.description} onChange={(e) => handleOnchange('description', e)} className="form-control" />
                            <p style={{ color: 'red' }}>{errMessage.description}</p>
                        </div>


                        <div className="col-3">
                            <label><FormatedText id="manage.image" /></label>
                            <p style={{ color: 'red' }}>{errMessage.image}</p>

                            <div className="preview-img-container">
                                <input id="choise-image" className="form-control" type="file" hidden
                                    onChange={(e) => handleOnchangeImage(e)}
                                />
                                <label htmlFor="choise-image" className="btn-choise-image"><FormatedText id="manage.choise" /><i className="fas fa-upload"></i></label>
                                <div className="preview-image" style={{ backgroundImage: `url(${image})` }}>
                                    {/* <img className="preview-image" src={`${this.state.previewImgUrl}`}/> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                <Button color="primary" className='btn-create' onClick={() => handleUpdateAuthor()}><FormatedText id="modal.update" /></Button>
            </ModalFooter>
        </Modal>
        </>
    )
}
