import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import CommonUtils from '../../../utils/CommonUtils'
import { handleAddNewShelfService } from '../../../service/appService';
import './Modal.scss';
import Loading from "../../../components/Loading"

export default function ModalCreateShelf({ isOpen, toggle, className, setKeyRefToNewShelf }) {
    // const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
    // const [listAuthors, setListAuthors] = useState({})
    // const [listShelfs, setListShelfs] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [inputForm, setInputForm] = useState({
        name: '',
        location: '',
        description: ''
    })
    const [errMessage, setErrorMessage] = useState({
        name: '',
        location: '',
        description: ''
    })

    const handleOnchange = (type, even) => {
        setInputForm({ ...inputForm, [type]: even.target.value })
    }

    const handleClose = () => {
        toggle()
        setInputForm({
            ...inputForm,
            name: '',
            location: '',
            description: ''
        })
        setErrorMessage({
            name: '',
            location: '',
            description: ''
        })
    }

    const handleCreateNewShelf = async () => {
        let { name, location, description } = inputForm
        if (!name) {
            setErrorMessage({
                name: '',
                location: '',
                description: '',
                name: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!location) {
            setErrorMessage({
                name: '',
                location: '',
                description: '',
                location: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!description) {
            setErrorMessage({
                name: '',
                location: '',
                description: '',
                description: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!isNaN(name)) {
            setErrorMessage({
                name: '',
                location: '',
                description: '',
                name: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        try {
            setIsLoading(true)
            let response = await handleAddNewShelfService({
                ...inputForm
            })
            setIsLoading(false)
            if (response && response.data && response.data.errCode === 0) {
                toast.success(language === languages.EN ? response.data.messageEN : response.data.messageVI)
                setKeyRefToNewShelf(inputForm.name)
                handleClose()
            } else {
                toast.error(language === languages.EN ? response.data.messageEN : response.data.messageVI)
            }
        } catch (error) {
            console.log(error)
        }


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
            <ModalHeader toggle={handleClose}><FormatedText id="modal.titleCreateShelf" /></ModalHeader>
            <ModalBody>

                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-3"><FormatedText id="manage.addShelf" /></div>
                        <div className="col-6">
                            <label><FormatedText id="manage.name" /></label>
                            <input value={inputForm.name} onChange={(e) => handleOnchange('name', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.name}</p>
                        </div>

                        <div className="col-6">
                            <label><FormatedText id="manage.location" /></label>
                            <textarea value={inputForm.location} onChange={(e) => handleOnchange('location', e)} className="form-control" />
                            <p style={{ color: 'red' }}>{errMessage.location}</p>
                        </div>
                        <div className="col-12">
                            <label><FormatedText id="manage.description" /></label>
                            <textarea value={inputForm.description} onChange={(e) => handleOnchange('description', e)} className="form-control" />
                            <p style={{ color: 'red' }}>{errMessage.description}</p>
                        </div>

                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                <Button color="primary" className='btn-create' onClick={() => handleCreateNewShelf()}><FormatedText id="modal.create" /></Button>
            </ModalFooter>
        </Modal>
        </>
    )
}
