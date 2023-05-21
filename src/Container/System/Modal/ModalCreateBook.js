import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import CommonUtils from '../../../utils/CommonUtils'
import { handleAddNewBookService } from '../../../service/appService';
import './Modal.scss';
import Select from 'react-select';
import Loading from "../../../components/Loading"

export default function ModalCreateBook({ isOpen, toggle, className, setKeyRefToNewBook, listCategories, listAuthors, listShelfs, setCurrentCategory }) {
    const language = useSelector(state => state.app.language)

    const [inputForm, setInputForm] = useState({
        name: '',
        quantity: '',
        description: '',
        roomId: ''
    })
    const [isLoading, setIsLoading ] = useState(false)
    const [image, setImage] = useState(null)
    const [obtionAuthor, setObtionAuthor] = useState([])
    const [selectedAuthor, setSelectedAuthor] = useState({})
    const [obtionCategory, setObtionCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({})

    const [obtionShelf, setObtionShelf] = useState([])
    const [selectedShelf, setSelectedShelf] = useState({})

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

        // setInputForm({ ...inputForm, shelfId: listShelfs[0] && listShelfs[0].id })

    }, [listAuthors])

    useEffect(() => {
        let shelfs = []
        if (listShelfs && listShelfs.length > 0) {
            listShelfs.forEach(shelf => {
                let obtions = {}
                obtions.value = shelf.id
                obtions.label = shelf.name
                shelfs.push(obtions)
            })
        }
        setObtionShelf(shelfs)
    }, [listShelfs])

    useEffect(() => {
        let categories = []
        if (listCategories && listCategories.length > 0) {
            if (language === languages.EN) {
                listCategories.forEach(category => {
                    let obtions = {}
                    obtions.value = category.keyMap
                    obtions.label = category.valueEn
                    categories.push(obtions)
                })
            }
            if (language === languages.VI) {
                listCategories.forEach(category => {
                    let obtions = {}
                    obtions.value = category.keyMap
                    obtions.label = category.valueVi
                    categories.push(obtions)
                })
            }
        }
        setObtionCategory(categories)
    }, [listCategories])



    const handleOnchange = (type, even) => {
        setInputForm({ ...inputForm, [type]: even.target.value })
    }

    const handleClose = () => {
        toggle()
        setInputForm({
            ...inputForm,
            name: '',
            quantity: '',
            description: '',
            roomId: ''
        })
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
        setImage(null)
        setSelectedAuthor({})
        setSelectedCategory({})
        setSelectedShelf({})
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

    const handleCreateNewAuthor = async () => {
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
            let response = await handleAddNewBookService({
                ...inputForm,
                authorId: selectedAuthor.value,
                categoryId: selectedCategory.value,
                shelfId: selectedShelf.value,
                image: image
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




    const handleChangeShelf = (selectedOption) => {
        setSelectedShelf(selectedOption)
    }

    const handleChangeCategory = (selectedOption) => {
        setSelectedCategory(selectedOption)
    }

    const handleChangeAuthor = (selectedOption) => {
        setSelectedAuthor(selectedOption)
    };

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
            <ModalHeader toggle={handleClose}><FormatedText id="modal.titleCreateBook" /></ModalHeader>
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
                <Button color="primary" className='btn-create' onClick={() => handleCreateNewAuthor()}><FormatedText id="modal.create" /></Button>
            </ModalFooter>
        </Modal>
        </>
    )
}
