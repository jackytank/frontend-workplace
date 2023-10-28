import { Divider, Space } from "antd";
import styled from "styled-components";
import AuthorBox from "./author-box.component";
import { Link } from "react-router-dom";

const LearnStyleComponents = () => {
    return (
        <>
            <Learn2 />
            <Divider />
            <AuthorBox isPrimary={false} />
            <Divider />
            <Learn1 />
        </>
    );
};

const Learn2 = () => {
    const StyledLinkSc = styled(Link)`
        color: #BF4F74;
        font-weight: bold;
    `;

    const InputSc = styled.input<{ $inputColor?: string; }>`
        padding: 0.5rem;
        margin: 0.5em;
        color: ${props => props.$inputColor || "#ff1060"};
        background: papayawhip;
        border: none;
        border-radius: 3px;
    `;

    const ThingSc = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
        color: blue;
        &:hover {
            color: red; // <Thing> when hovered
        }
        & ~ & {
            background: tomato; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
        }
        & + & {
            background: lime; // <Thing> next to <Thing>
        }
        &.something {
            background: orange; // <Thing> tagged with an additional CSS class ".something"
        }
        .something-else & {
            border: 1px solid; // <Thing> inside another element labeled ".something-else"
        }
    `;

    return (
        <>
            <div>
                <ThingSc>Hello world!</ThingSc>
                <ThingSc>How ya doing?</ThingSc>
            </div>
            <br />
            <Space>
                <InputSc defaultValue="@probablyup" type="text"></InputSc>
                <InputSc defaultValue="@probablyup" type="text" $inputColor="purple"></InputSc>
            </Space>
            <br />
            <Space>
                <Link to={"/"}>Unstyled, Boring Link</Link>
                <StyledLinkSc to="/">Styled, Exciting Link</StyledLinkSc>
            </Space>
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