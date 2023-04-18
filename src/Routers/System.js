import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Header from '../Container/System/Header';
import { useSelector } from 'react-redux';
import { user_role } from '../utils/constant';
import { Navigate } from 'react-router';
export default function System() {
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const userInfor = useSelector(state => state.auth.userInfor)
    useEffect(() => {
        if (isAuthenticated && userInfor.roleId === user_role.ADMIN) {
            return navigate('/system/manage-borrow')
        }
        if (isAuthenticated && userInfor.roleId !== user_role.ADMIN) {
            return navigate('/')
        }
        if (isAuthenticated === false) {
            return navigate('/')
        }
    }, [isAuthenticated, userInfor])

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
