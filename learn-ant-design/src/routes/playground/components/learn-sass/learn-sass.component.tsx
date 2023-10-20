import s from './learn-sass.module.scss';

const LearnSASS = () => {
  return (
    <>
      <div>
        <span className={s['hello']}>Hehe</span>
        <span className={s['what']}>Hoho</span>
      </div>
      <br />
      <nav>
        <ul>
          <li><a href="">HTML</a></li>
          <li><a href="">CSS</a></li>
          <li><a href="">SASS</a></li>
        </ul>
      </nav>
      <br />
      <nav>
        <ul>
          <li><span className={s["info"]}>Info</span></li>
          <li><span className={s["alert"]}>Alert</span></li>
          <li><span className={s["success"]}>Success</span></li>
          <li><span className={s["message"]}>Message</span></li>
        </ul>
      </nav>
      <br />

      <div className={s["container"]}>
        <aside role='complementary'>
          <nav>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
            </ul>
          </nav>
        </aside>
        <article role='main'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui corporis, officiis laudantium numquam quod eos suscipit vel molestiae doloribus, exercitationem totam distinctio accusantium praesentium sint voluptatum, voluptate odio enim ea.
            Alias optio nisi autem reiciendis incidunt adipisci cumque deserunt facilis modi fuga eius libero laboriosam, iste totam? Unde tempora sint quidem magnam maxime, deserunt cumque quam cupiditate eos nobis. Consequatur!</p>
        </article>
      </div>
    </>
  );
};

export default LearnSASS;