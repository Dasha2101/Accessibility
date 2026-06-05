import React from 'react';
import HeaderElem from '../header/header';
import FooterElem from '../footer/footer';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <HeaderElem />
      <main className="page">{children}</main>
      <FooterElem />
    </>
  );
};

export default Layout;
