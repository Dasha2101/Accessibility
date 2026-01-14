import React from 'react';
import ResultTable from '../../components/table/table';

const MainPage: React.FC = () => {
  return (
    <main>
      <nav>
        <a>Ссылка без href</a>
        <div role="link">Неверная навигация</div>
    </nav>
      <div style={{ padding: '20px' }}>
        <h1 className="header-title" style={{ color: '#e8d6d6', backgroundColor: '#ffffff' }}>Заголовок</h1>
        <h3>Подзаголовок без h2</h3>
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
        <div>
          <label htmlFor="input2">Имя</label>
          <input type="text" id="input2" />
          <input type="text" id="input3" />
        </div>
        <ul>
          <li>Элемент 1</li>
          <div>Ошибка в списке</div>
        </ul>
        <table>
          <tr>
            <td>Тт</td>
          </tr>
        </table>
        <ResultTable />
      </div>
      <div role="presentation">
        <p>экранным читалкам</p>
      </div>
    </main>
  )
}
export default MainPage;