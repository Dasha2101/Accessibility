import React from 'react';
import './footer.css';

const FooterElem: React.FC = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-left">
        <p className="footer-slogan">
          Access, Check, Enjoy.{' '}
          <span className="footer-slogan-highlight">
            Make the web accessible!
          </span>
        </p>
        <div className="footer-contacts">
          <div className="contact-item">
            <a
              href="mailto:shilnikova.dar@yandex.ru"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  borderRadius: '100px',
                  border: '1px solid #f7d8d2',
                  backgroundColor: '#fff1ef',
                  padding: '12px',
                  cursor: 'pointer',
                }}
              >
                <path
                  d="M4 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17V7C3 6.44772 3.44772 6 4 6Z"
                  stroke="#5a3e36"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 7L12 13L3 7"
                  stroke="#5a3e36"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <div className="contact-item">
            <a href="tel:+78121234567">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  borderRadius: '100px',
                  border: '1px solid #f7d8d2',
                  backgroundColor: '#fff1ef',
                  padding: '8px',
                }}
              >
                <g transform="translate(12,12) scale(0.6) translate(-12,-12)">
                  <path
                    d="M6.62 10.79C8.06 13.53 10.47 15.94 13.21 17.38L15.41 15.18C15.79 14.8 16.37 14.71 16.79 14.95C18.27 15.75 19.88 16.25 21.57 16.43C22.11 16.48 22.57 16.91 22.6 17.46V21.57C22.6 22.15 22.11 22.6 21.54 22.57C10.15 22.02 2.98 14.85 2.43 3.46C2.4 2.89 2.85 2.4 3.43 2.43H7.54C8.09 2.46 8.52 2.92 8.57 3.46C8.75 5.15 9.25 6.76 10.05 8.24C10.29 8.66 10.2 9.24 9.82 9.62L6.62 10.79Z"
                    stroke="#5a3e36"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-right">
        <h4>Связаться с нами</h4>
        <ul>
          <li>
            <p>
              Адрес:{' '}
              <a
                href="https://maps.google.com?q=Кронверкский+пр.,+49,+Санкт-Петербург,+Россия,+197101"
                target="_blank"
              >
                Университет ИТМО
              </a>
            </p>
          </li>
          <p>Режим работы: Пн-Пт 09:00–18:00</p>
        </ul>
      </div>
    </footer>
  );
};

export default FooterElem;
