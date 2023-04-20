import './App.scss';
import { Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import HomePage from './HomePage/HomePage';
import Home from '../Routers/Home'
import Register from './Auth/Register'
import Login from './Auth/Login'
import EnterInforUser from './Auth/EnterInforUser';
import HandleForgotPassword from './Auth/HandleForgotPassword';
import Authenticate from '../Container/Auth/Authenticate'
import BookInfor from './Book/BookInfor';
import System from '../Routers/System';
import ManageUser from './System/ManageUser';
import ManageBook from './System/ManageBook';
import ManageAuthor from './System/ManageAuthor';
import ManageShelf from './System/ManageShelf';
import ManageHistory from './System/ManageHistory';
import ManageBorrow from './System/ManageBorrow';
import ListBooks from './Book/ListBooks'
import ExtraInforUser from './Auth/ExtraInfor/ExtraInforUser';
import HistoryTransaction from './Auth/ExtraInfor/HistoryTransaction';
import NotFound from './NotFound';
import InforAuthor from './Author/InforAuthor';

function App() {

  return (
    <>
      <Authenticate>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/infor-book/:id' element={<BookInfor />} />
          <Route path='/list-books/:categoryId/:limit' element={<ListBooks />} />
          <Route path='/extra-infor-user' element={<ExtraInforUser />} />
          <Route path='/history-transaction' element={<HistoryTransaction />} />
          <Route path='/infor-author/:id' element={<InforAuthor />} />
          <Route path='/system' element={<System />} >
            <Route path="manage-borrow" element={<ManageBorrow />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="manage-book" element={<ManageBook />} />
            <Route path="manage-author" element={<ManageAuthor />} />
            <Route path="manage-shelf" element={<ManageShelf />} />
            <Route path="manage-history" element={<ManageHistory />} />
          </Route>
          <Route path="/register/extra-infor/:email/:language" exact element={<EnterInforUser />} />
          <Route path="/auth/forgot-password/:email/:phoneNumber/:language" exact element={<HandleForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Authenticate>
    </>
  )
}

export default App;
