import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { languages, period, keyMap_period } from '../../utils/constant'
import _ from 'lodash'
import Select from 'react-select';
import moment from 'moment'

import './Manage.scss'

import { getAllHistoryService, getAllHistoryByTimeService } from '../../service/appService'

export default function ManageHistory() {
    const language = useSelector(state => state.app.language)
    const [listHistories, setListHistories] = useState([])

    const historiesRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState([])
    const [selectedHistory, setSelectedHistory] = useState({})
    const [currentPeriod, setCurrentPeriod] = useState(period[0]?.keyMap)
    const [inputForm, setInputForm] = useState({
        startDate: '',
        endDate: ''
    })
    const [showFormFilter, setShowFormFilter] = useState(false)


    useEffect(async () => {
        let now = new Date();
        if (currentPeriod === keyMap_period.IN_THE_DATE) {
            setShowFormFilter(false)
            let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            let res = await getAllHistoryByTimeService({
                startDate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(endDate).format('YYYY-MM-DD HH:mm:ss')
            })
            if (res && res.data && res.data.errCode === 0) {
                setListHistories(res.data.data)
            } else {
                toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            }
        }

        if (currentPeriod === keyMap_period.ON_WEEK) {
            setShowFormFilter(false)
            let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1)
            let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7, 23, 59, 59, 999);
            let res = await getAllHistoryByTimeService({
                startDate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(endDate).format('YYYY-MM-DD HH:mm:ss')
            })
            if (res && res.data && res.data.errCode === 0) {
                setListHistories(res.data.data)
            } else {
                toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            }
        }
        if (currentPeriod === keyMap_period.IN_MONTHS) {
            setShowFormFilter(false)
            let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            let res = await getAllHistoryByTimeService({
                startDate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(endDate).format('YYYY-MM-DD HH:mm:ss')
            })
            if (res && res.data && res.data.errCode === 0) {
                setListHistories(res.data.data)
            } else {
                toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            }
        }
        if (currentPeriod === keyMap_period.PERIOD) {
            setShowFormFilter(true)
        }
    }, [currentPeriod, language])

    useEffect(() => {
        const handleEvent = () => {
            if (window.scrollY > 129) {
                searchRef.current.classList.add('search-fix')
            }
            else {
                searchRef.current.classList.remove('search-fix')
            }
        }
        window.addEventListener('scroll', handleEvent);
        return () => window.removeEventListener('scroll', handleEvent)
    }, [])


    useEffect(() => {
        let options = []
        if (listHistories && listHistories.length > 0) {
            listHistories.map(item => {
                let optionItem = {}
                if (language === languages.EN) {
                    optionItem.value = item.id
                    optionItem.label = `Name: ${item.userData?.firstName + ' ' + item.userData?.lastName}, Book: ${item.bookHistoryData?.name}, BorrowDate: ${item.borrowDate}, ReturnDate: ${item.returnDate}`

                }
                if (language === languages.VI) {

                    optionItem.value = item.id
                    optionItem.label = `Tên: ${item.userData?.lastName + ' ' + item.userData?.firstName}, Sách: ${item.bookHistoryData?.name}, Ngày mượn: ${item.borrowDate}, Ngày trả: ${item.returnDate}`

                }
                options.push(optionItem)
            })
            setOptionSearch(options)
        }
    }, [listHistories, language])

    const handleSearchHistory = (optionSelect) => {

        let history = historiesRef.current[optionSelect.value]
        setSelectedHistory(optionSelect)
        if (history) {
            history.classList.add('active')
            history.scrollIntoView({ block: "center" })
            setTimeout(() => {
                history.classList.remove('active')
            }, 3000)
        }
    }


    const handleGetListHistoryByPeriod = async () => {
        let { startDate, endDate } = inputForm
        if (!startDate) {
            return toast(language === languages.EN ? 'Missing information' : 'Thiếu thông tin')
        }
        if (!endDate) {
            return toast(language === languages.EN ? 'Missing information' : 'Thiếu thông tin')
        }
        if (moment(startDate.trim(), 'DD-MM-YYYY', true).isValid() && moment(endDate.trim(), 'DD-MM-YYYY', true).isValid()) {
            let startDateMoment = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss')
            let endDateMoment = moment(endDate, "DD-MM-YYYY").format('YYYY-MM-DD HH:mm:ss');
            let res = await getAllHistoryByTimeService({
                startDate: startDateMoment,
                endDate: endDateMoment
            })
            if (res && res.data && res.data.errCode === 0) {
                setListHistories(res.data.data)
                return
            } else {
                return toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            }
        }
        if (moment(startDate.trim(), 'HH:mm:ss DD-MM-YYYY', true).isValid() && moment(endDate.trim(), 'HH:mm:ss DD-MM-YYYY', true).isValid()) {
            let startDateMoment = moment(startDate, 'HH:mm:ss DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss')
            let endDateMoment = moment(endDate, "HH:mm:ss DD-MM-YYYY").format('YYYY-MM-DD HH:mm:ss');
            let res = await getAllHistoryByTimeService({
                startDate: startDateMoment,
                endDate: endDateMoment
            })
            if (res && res.data && res.data.errCode === 0) {
                setListHistories(res.data.data)
                return
            } else {
                return toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            }
        }
        if (moment(startDate.trim(), 'HH:mm DD-MM-YYYY', true).isValid() && moment(endDate.trim(), 'HH:mm DD-MM-YYYY', true).isValid()) {
            let startDateMoment = moment(startDate, 'HH:mm DD-MM-YYYY').format('YYYY-MM-DD HH:mm:ss')
            let endDateMoment = moment(endDate, "HH:mm DD-MM-YYYY").format('YYYY-MM-DD HH:mm:ss');
            let res = await getAllHistoryByTimeService({
                startDate: startDateMoment,
                endDate: endDateMoment
            })
            if (res && res.data && res.data.errCode === 0) {
                setListHistories(res.data.data)
                return
            } else {
                return toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            }
        }
        toast(language === languages.EN ? "You don't input true format, please enter back: This field should look like 03-12-2022 or 12:03 03-12-2022 or 12:03:15 03-12-2022" : 'Bạn chưa nhập đúng định dạng vui lòng nhập lại: Trường này phải có dạng như 03-12-2022 hoặc 12:03 03-12-2022 hoặc 12:03:15 03-12-2022')
    }

    return (
        <>
            <div className="manage-container">
                <div className="title text-center"><FormatedText id="manage.titleHistory" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <div className="nav-btn">
                            {
                                period && period.length > 0 &&
                                period.map((item) => {
                                    return (
                                        <button
                                            className={currentPeriod === item.keyMap ? 'select' : ''}
                                            onClick={() => setCurrentPeriod(item.keyMap)}
                                        >
                                            {language === languages.EN ? item.valueEn : item.valueVi}
                                        </button>
                                    )
                                })
                            }

                        </div>
                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-6 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedHistory}
                                className='col-8'
                                onChange={handleSearchHistory}
                                options={optionSearch}
                            />
                        </div>
                        {
                            showFormFilter &&
                            <div className='row form-input-filter mb-3'>
                                <input className="form-control col-5 mx-2" value={inputForm.startDate} onChange={e => setInputForm({ ...inputForm, startDate: e.target.value })} />
                                <span className="text-center"><FormatedText id="manage.to" /></span>
                                <input className="form-control col-5 mx-2" value={inputForm.endDate} onChange={e => setInputForm({ ...inputForm, endDate: e.target.value })} />
                                <button onClick={handleGetListHistoryByPeriod}><FormatedText id="manage.filter" /></button>
                            </div>
                        }
                    </div>
                    <table id="customers">

                        <tbody>
                            <tr>
                                <th><FormatedText id="table.name" /></th>
                                <th><FormatedText id="table.borrowBook" /></th>
                                <th><FormatedText id="table.borrowDate" /></th>
                                <th><FormatedText id="table.returnDate" /></th>
                            </tr>

                            {
                                listHistories && listHistories.length > 0 &&
                                listHistories.map((history) => {
                                    let nameVI = '', nameEN = '', book = ''
                                    if (!_.isEmpty(history.userData) && !_.isEmpty(history.bookHistoryData) && !_.isEmpty(history.bookHistoryData.authorData)) {
                                        nameVI = history.userData.lastName + ' ' + history.userData.firstName + ' (' + history.userData.phoneNumber + ')'
                                        nameEN = history.userData.firstName + ' ' + history.userData.lastName + ' (' + history.userData.phoneNumber + ')'
                                        book = history.bookHistoryData.name + ' - ' + history.bookHistoryData.authorData.name
                                    }
                                    return (
                                        <tr key={history.id} ref={el => historiesRef.current[history.id] = el}>
                                            <td>{language === languages.EN ? nameEN : nameVI}</td>
                                            <td>{book}</td>
                                            <td>{history.borrowDate}</td>
                                            <td>{history.returnDate}</td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                listHistories && listHistories.length === 0 &&
                                <tr colSpan={4}>
                                    <FormatedText id="table.noData" />
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}
