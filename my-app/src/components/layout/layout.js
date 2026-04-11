import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import HeaderElem from '../header/header';
import FooterElem from '../footer/footer';
const Layout = ({ children }) => {
    return (_jsxs(_Fragment, { children: [_jsx(HeaderElem, {}), _jsx("main", { className: "page", children: children }), _jsx(FooterElem, {})] }));
};
export default Layout;
