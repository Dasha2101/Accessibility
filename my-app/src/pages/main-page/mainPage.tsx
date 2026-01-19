import React from 'react';
import ResultTable from '../../components/table/table';
import './mainPage.css';

const MainPage: React.FC = () => {
  return (
    <main className="page">
      <h1 className="page-title">Демонстрационная страница проверки доступности</h1>
      <section className="section">
        <h2>Навигация</h2>
        <div className="section-content nav-demo">
          <a>Ссылка без href</a>
          <div role="link">Неверная навигация</div>
        </div>
      </section>
      <section className="section">
        <h2>Заголовки</h2>
        <div className="section-content">
          <h1>Главный заголовок</h1>
          <h3>Подзаголовок без h2</h3>
        </div>
      </section>
      <section className="section elem">
        <h2>Интерактивные элементы</h2>
        <div className="section-content">
          <button id="btn1">Нажми меня</button>
          <div role="button" id="btn2" tabIndex={-1}>
            Скрытая кнопка
          </div>
          <a href="/home">Ссылка домой</a>
          <input type="text" id="input1" placeholder="Поле ввода" />
        </div>
      </section>
      <section className="section">
        <h2>Изображения</h2>
        <div className="section-content">
          <img src="logo.png" alt="Company Logo" />
          <img src="test.jpg" />
          <img src="icon.svg" alt="" />
        </div>
      </section>
      <section className="section">
        <h2>Формы</h2>
        <div className="section-content">
          <label htmlFor="input2">Имя</label>
          <input type="text" id="input2" />
          <input type="text" id="input3" />
        </div>
      </section>
      <section className="section">
        <h2>Списки и таблицы</h2>
        <div className="section-content list">
          <ul>
            <li>Элемент 1</li>
            <div>Ошибка в списке</div>
          </ul>
          <table>
            <tr>
              <td>Проверка ошибки td</td>
            </tr>
          </table>
        </div>
      </section>
      <section className="section media">
        <h2>Мультимедиа</h2>
        <h3>Видео без субтитров</h3>
        <video controls>
          <source src="video.mp4" type="video/mp4" />
        </video>
        <h3>Видео с субтитрами</h3>
        <video controls>
          <source src="video.mp4" type="video/mp4" />
          <track
            kind="subtitles"
            src="subtitles.vtt"
            srcLang="ru"
            label="Русские субтитры"
            default
          />
        </video>
      </section>
      <ResultTable />
    </main>
  );
};

export default MainPage;
