import { Divider } from 'antd';
import _1 from './learn-sass-1.module.scss';
import _2 from './learn-sass-2.module.scss';

const LearnSASS = () => {
  return (
    <>
      <div>
        <h2 className={_2['h2-font-fl-1']}></h2>
      </div>
      <div>
        <h2 className={_2['h2-fg-color-fg-font-size-1']}>fg-color-fg-font-size</h2>
      </div>
      <div>
        <button className={_2['btn-button-state']}>button-state</button>
      </div>
      <Divider />
      <div>
        <span className={_1['hello']}>Hehe</span>
        <span className={_1['what']}>Hoho</span>
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
          <li><span className={_1["info"]}>Info</span></li>
          <li><span className={_1["alert"]}>Alert</span></li>
          <li><span className={_1["success"]}>Success</span></li>
          <li><span className={_1["message"]}>Message</span></li>
        </ul>
      </nav>
      <br />

      <div className={_1["container"]}>
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