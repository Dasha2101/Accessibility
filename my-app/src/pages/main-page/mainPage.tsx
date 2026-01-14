import React from 'react';
import ResultTable from '../../components/table/table';

const MainPage: React.FC = () => {
  return (
     <div style={{ padding: '20px' }}>
      <h1 className="header-title" style={{ color: '#e8d6d6', backgroundColor: '#ffffff' }}>Заголовок</h1>
      <div>
        <button id="btn1">Нажми меня</button>
        <div role="button" id="btn2" tabIndex={-1}>Скрытая кнопка</div>
        <a href="/home">Ссылка домой</a>
        <input type="text" id="input1" />
      </div>
      <div>
        <img src="logo.png" alt="Company Logo" />
        <img src="test.jpg" />
        <img src="icon.svg" alt="" />
      </div>
      <ResultTable />
    </div>
  )
}
export default MainPage;