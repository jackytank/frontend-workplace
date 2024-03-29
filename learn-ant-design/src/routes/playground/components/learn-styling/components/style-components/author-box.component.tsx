import styled from "styled-components";
import { Row, Col, Divider } from 'antd';
import { ReactNode } from "react";

const sizeS = "14px";
const sizeM = "16px";
const sizeL = "24px";

type WrapperProps = {
  isPrimary: boolean;
};

const Wrapper = styled.div<WrapperProps>`
    display: flex;
    color: #fff;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: center;
    padding: ${sizeS};
    border: solid 1px grey;
    background-color: ${(props) => (props.isPrimary ? "#3F51B5" : "#312f41")};
`;

const Name = styled.h3`
    font-size: ${sizeL};
    margin-bottom: 0;
`;

const Bio = styled.p`
  font-size: ${sizeM};
`;

const SocialURL = styled.a`
  text-decoration: none;
  font-size: ${sizeS};
  color: #2196f3;
`;

const ButtonSc = styled.button<{ $primary?: boolean; }>`
  display: inline-block;
  color: #BF4F74;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
  display: block;
`;

const TomatoButtonSc = styled(ButtonSc)`
  color: tomato;
  border-color: tomato;
  font-size: 1.2em;
`;

type ReversedButtonScProps = {
  children: string | ReactNode;
};

const ReversedButtonSc = (props: ReversedButtonScProps) => (
  <ButtonSc {...props}>
    {(props.children as string).split('').reverse()}
  </ButtonSc>
);

const AuthorBox = ({
  isPrimary
}: {
  isPrimary: boolean;
}) => {
  return (
    <>
      <div>
        <ButtonSc>Normal Button</ButtonSc>
        <ButtonSc as={ReversedButtonSc}>Custom Button with Normal Button styles</ButtonSc>
      </div>
      <Divider/>
      <Wrapper isPrimary={isPrimary}>
        <img src="https://picsum.photos/id/237/200/200" alt="" />
        <Name>Author name</Name>
        <Bio>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam non dolores, quasi exercitationem in tempore reprehenderit, impedit voluptates temporibus quod distinctio alias iste voluptate eveniet magnam accusamus corrupti odit dicta!
        </Bio>
        <SocialURL>
          Social URL
        </SocialURL>
        <Row
          align='middle'
          justify='center'
        >
          <Col>
            <ButtonSc as="a" href="#" $primary>Webpage</ButtonSc>
          </Col>
          <Col>
            <TomatoButtonSc as="a" href="#" $primary>Store</TomatoButtonSc>
          </Col>
        </Row>
      </Wrapper>
    </>
  );
};

export default AuthorBox;