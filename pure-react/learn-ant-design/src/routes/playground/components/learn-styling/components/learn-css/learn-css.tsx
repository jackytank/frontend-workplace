import styled from "styled-components";
import './learn-css-1.scss';

const LearnCSS = () => {
  return (
    <One />
  );
};

const One = () => {
  const P = styled.p`
    width: 100px;
    height: 50px;
    padding: 20px;
    border: 1px solid black;
  `;
  const Body = styled.body`
    font-family: sans-serif;
    padding: 2em;
  `;

  return <>
    <div>
      <div className="wrapper">
        <article className="flow">
          <h2>Downloads</h2>
          <ul>
            <li>
              <a href="my-image.jpg">An example image</a>
            </li>
            <li>
              <a href="my-document.pdf">An example document</a>
            </li>
            <li>
              <a href="my-document.pdf">Another example document</a>
            </li>
          </ul>
        </article>
      </div>
    </div>
    <br />
    <div>
      <a href="https.whatisthis.example.co2m">https.whatisthis.example.co2m</a>
    </div>
    <div>
      <div data-type='primary'>Primary</div>
      <div data-type='secondary'>Secondary</div>
    </div>
    <Body>
      <P>I am a paragraph of text that has a few words in it.</P>
    </Body>
  </>;
};

export default LearnCSS;