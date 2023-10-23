import { Divider } from "antd";
import styled from "styled-components";
import AuthorBox from "./author-box.component";

const LearnStyleComponents = () => {
    return (
        <>
            <AuthorBox />
            <Divider />
            <Learn1 />
        </>
    );
};

const Learn1 = () => {
    const WrapperSc = styled.section`
        padding: 2em;
        background: papayawhip;
    `;

    const TitleSc = styled.h1`
        font-size: 1.5em;
        text-align: center;
        color: red;
        border-radius: 5px;
        border: 1px dotted blue;
        box-shadow: 2px 5px grey;
        padding: 5px;
        margin-bottom: 5px;
    `;
    return (
        <>
            <WrapperSc>
                <TitleSc>
                    Hello Styled Components 1
                </TitleSc>
            </WrapperSc>
        </>
    );
};

export default LearnStyleComponents;