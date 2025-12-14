// pages/index.js
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Forum Replica — LSPD</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/style.css" />
      </Head>

      <div className="theme-dark">
        <header className="topbar">
          <div className="container">
            <div className="logo">Arizona RP</div>
            <nav className="nav">
              <Link href="#">Форумы</Link>
              <Link href="#">Помощь</Link>
              <Link href="#">Профиль</Link>
            </nav>
          </div>
        </header>

        <main className="container">
          {/* CATEGORY 1 */}
          <section className="forum-category">
            <h2>1. Общение и взаимопомощь</h2>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/1-1" className="node-title">
                  1.1 Для студентов
                </Link>
                <p className="node-desc">
                  Вопросы по обучению, экзамены, практика, опыт разных курсов и
                  вузов
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 120</span>
                <span>Сообщений: 1 430</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/1-2" className="node-title">
                  1.2 Для медицинских работников
                </Link>
                <p className="node-desc">
                  Рабочие ситуации, протоколы, организация отделений,
                  выгорание
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 98</span>
                <span>Сообщений: 2 012</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/1-3" className="node-title">
                  1.3 Студенты ↔ Специалисты
                </Link>
                <p className="node-desc">
                  Консультации, «Спросить у врача», менторство и
                  наставничество
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 76</span>
                <span>Сообщений: 845</span>
              </div>
            </div>
          </section>

          {/* CATEGORY 2 */}
          <section className="forum-category">
            <h2>2. Клинические темы</h2>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/2-1" className="node-title">
                  2.1 Терапия
                </Link>
                <p className="node-desc">
                  Частые случаи, неотложные состояния, разбор сложных кейсов
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 210</span>
                <span>Сообщений: 3 540</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/2-2" className="node-title">
                  2.2 Хирургия
                </Link>
                <p className="node-desc">
                  Операции, осложнения, травматология и ортопедия
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 154</span>
                <span>Сообщений: 2 980</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/2-3" className="node-title">
                  2.3 Педиатрия
                </Link>
                <p className="node-desc">
                  Диагностика, инфекции, ведение детей в ОРИТ
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 89</span>
                <span>Сообщений: 1 120</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/2-4" className="node-title">
                  2.4 Гинекология / Акушерство
                </Link>
                <p className="node-desc">
                  Беременность, неотложные состояния, плановое ведение
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 67</span>
                <span>Сообщений: 910</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/2-5" className="node-title">
                  2.5 Диагностика
                </Link>
                <p className="node-desc">
                  Анализы, КТ / МРТ / рентген, дифференциальная диагностика
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 132</span>
                <span>Сообщений: 2 300</span>
              </div>
            </div>
          </section>

          {/* CATEGORY 3 */}
          <section className="forum-category">
            <h2>3. Кейсы и ситуации</h2>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/3-1" className="node-title">
                  3.1 Реальные случаи (анонимно)
                </Link>
                <p className="node-desc">
                  Лёгкие, средние, тяжёлые и редкие клинические случаи
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 145</span>
                <span>Сообщений: 2 780</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/3-2" className="node-title">
                  3.2 Учебные клинические задачи
                </Link>
                <p className="node-desc">
                  Ситуационные задачи и принятие решений
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 64</span>
                <span>Сообщений: 520</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/3-3" className="node-title">
                  3.3 Ошибки и разборы
                </Link>
                <p className="node-desc">
                  Диагностические и тактические ошибки, альтернативные решения
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 58</span>
                <span>Сообщений: 690</span>
              </div>
            </div>
          </section>

          {/* CATEGORY 4 */}
          <section className="forum-category">
            <h2>4. Тематические конспекты и карьера</h2>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/4-1" className="node-title">
                  Советы от старших курсов
                </Link>
                <p className="node-desc">
                  Конспекты, лайфхаки, рекомендации по обучению
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 41</span>
                <span>Сообщений: 360</span>
              </div>
            </div>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/4-3" className="node-title">
                  4.3 Карьера в медицине
                </Link>
                <p className="node-desc">
                  Специальности, резидентура, работа в больнице
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 72</span>
                <span>Сообщений: 890</span>
              </div>
            </div>
          </section>

          {/* CATEGORY 5 */}
          <section className="forum-category">
            <h2>5. Свободные темы</h2>
            <div className="forum-node">
              <div className="node-main">
                <Link href="/subtopic/5-1" className="node-title">
                  Свободное общение
                </Link>
                <p className="node-desc">
                  Медицинские новости, исследования, технологии, разговоры вне
                  медицины
                </p>
              </div>
              <div className="node-stats">
                <span>Тем: 190</span>
                <span>Сообщений: 4 560</span>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">
            <span>© Arizona RP</span>
            <nav>
              <Link href="#">Контакты</Link>
              <Link href="#">Правила</Link>
              <Link href="#">Помощь</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
