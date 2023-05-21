export const path = {
    HOME: '/',
    HOMEPAGE: '/home',
    LOGIN: '/login',
    LOG_OUT: '/logout',
    SYSTEM: '/admin',
    DETAIL_DOCTOR: '/detail-doctor/:id',
    DETAIL_CLINIC: '/detail-clinic/:id',
    VERIFY_BOOKING: '/verify-booking/:token&:doctorId',
    DETAIL_SPECIALTY: '/detail-specialty/:id'
};

export const languages = {
    VI: 'vi',
    EN: 'en'
};

export const NAME_LOCAL_STORED = 'vantai_load_user'
export const NAME_BACK_LOCATION = 'back_location'
export const SCROLL_BACK_LOCATION = 'scroll_back_location'

export const manageActions = {
    ADD: "ADD",
    EDIT: "EDIT",
    DELETE: "DELETE"
};

export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N'
}

export const user_role = {
    ADMIN: 'R1',
    USER: 'R2'
}

export const gender = {
    MALE: 'M',
    FEMALE: 'F',
    OTHER: 'O'
}

export const linkAvatarDefault = {
    MALE: 'https://th.bing.com/th/id/OIP.LNc4A3inta5VbQTHVF_ipgAAAA?pid=ImgDet&rs=1',
    FEMALE: "https://th.bing.com/th/id/OIP.gDZNFmTo3c8r6oIdhYyNEwAAAA?pid=ImgDet&rs=1",
    OTHER: "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
}
export const URL_BACK_END = 'http://localhost:5000'

export const category_book = {
    COMIC: 'C1',
    TEXTBOOKS: 'C2',
    REFBOOK: "C3",
    SKILLBOOK: 'C4'
}

export const status_cart = {
    BORROWING: 'B',
    WAITING: "W"
}

export const title_notify = {
    ADMIN: "A",
    MESSAGE: "M",
    SYSTEM: "ST",
    USER: "U"
}

export const keyMap_period = {
    IN_THE_DATE: 'D',
    ON_WEEK: 'W',
    IN_MONTHS: 'M',
    PERIOD: 'P',
}

export const period = [
    { keyMap: "D", valueEn: "In the Date", valueVi: "Trong Ngày" },
    { keyMap: "W", valueEn: "On Week", valueVi: "Trong tuần" },
    { keyMap: "M", valueEn: "In Months", valueVi: "Trong tháng" },
    { keyMap: "P", valueEn: "Period", valueVi: "Trong Khoảng" },
]

export const environment = {
    REACT_APP_URL_BACK_END: "https://book-library-be.onrender.com",
    REACT_APP_LOCAL_STORE_TOKEN_NAME: "jhdhajhdauyeiqeyqeiqu"
}