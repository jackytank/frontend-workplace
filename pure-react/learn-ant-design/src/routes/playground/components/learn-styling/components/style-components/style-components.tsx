import { Divider, Space } from "antd";
import styled, { ThemeProvider, createGlobalStyle, css, keyframes } from "styled-components";
import AuthorBox from "./author-box.component";
import { Link } from "react-router-dom";

const LearnStyleComponents = () => {
    return (
        <>
            <Learn5Theme />
            <Divider />
            <Learn4 />
            <Divider />
            <Learn3 />
            <Divider />
            <Learn2 />
            <Divider />
            <AuthorBox isPrimary={false} />
            <Divider />
            <Learn1 />
        </>
    );
};

const Learn5Theme = () => {
    const ButtonSc1 = styled.button<{ theme: { main: string; }; }>`
        font-size: 1em;
        margin: 1em;
        padding: 0.25em 1em;
        border-radius: 3px;
        color: ${props => props.theme.main};
    `;

    ButtonSc1.defaultProps = {
        theme: {
            main: "red",
        }
    };

    const theme1 = {
        main: "mediumseagreen"
    };

    const ButtonSc2 = styled.button<{ theme: ThemeProps; }>`
        color: ${p => p.theme.fg};
        border: 2px dotted ${p => p.theme.bg};
        background: ${p => p.theme.bg};
        font-size: 1em;
        margin: 1em;
        padding: 0.25em 1em;
        border-radius: 3px;
    `;

    interface ThemeProps {
        fg: string;
        bg: string;
    }

    const theme2 = {
        fg: '#BF4F74',
        bg: 'white'
    };


    const invertTheme = ({ fg, bg }: ThemeProps): ThemeProps => ({
        fg: bg,
        bg: fg
    });

    return <>
        <div>
            <ButtonSc2 theme={{ main: "royalblue" }}>Ad hoc theme</ButtonSc2>
            <ThemeProvider theme={theme2}>
                <div>
                    <ButtonSc2>Themed</ButtonSc2>
                    <ButtonSc2 theme={{ main: "darkorange" }}>Overridden</ButtonSc2>
                </div>
            </ThemeProvider>
        </div>
        <div>
            <ThemeProvider theme={theme2}>
                <div>
                    <ButtonSc2>Default Theme</ButtonSc2>

                    <ThemeProvider theme={invertTheme}>
                        <ButtonSc2>Inverted Theme</ButtonSc2>
                    </ThemeProvider>
                </div>
            </ThemeProvider>
        </div>
        <br />
        <div>
            <ButtonSc1>Normal</ButtonSc1>
            <ThemeProvider theme={theme1}>
                <ButtonSc1>Themed</ButtonSc1>
            </ThemeProvider>
        </div>
    </>;
};

const Learn4 = () => {
    const ThingSc = styled.div`
        && {
            color: blue;
        }
    `;

    const GlobalStyleSc = createGlobalStyle`
        div${ThingSc}{
            color:red;
        }
    `;

    const Thing2Sc = styled.div`
        color: blue;
        .something{
            border: 1px solid red;
            display: block;
        }
        .what{
            color: white;
            background-color: black;
            border: 1px dotted wheat;
            border-radius: 5px;
            box-shadow: 5px 5px grey;
            padding: 5px;
            margin-bottom: 20px;
        }
    `;

    const rotate = keyframes`
        from {
            transform: rotate(0deg);
        }
        to{
            transform: rotate(360deg);
        }
    `;

    const RotateSc = styled.div`
        display: inline-block;
        animation: ${rotate} 2s linear infinite;
        padding: 2rem 1rem;
        font-size: 1.2rem;
    `;

    return <>
        <RotateSc>&lt; 💅🏾 &gt;</RotateSc>
        <Thing2Sc>
            <label htmlFor="" className="what">What</label>
            <label htmlFor="foo-button" className="something">Coolshit Button</label>
            <button id="foo-button">What do I do?</button>
        </Thing2Sc>
        <GlobalStyleSc />
        <ThingSc>
            I'm blue. muahahahahahha
        </ThingSc>
    </>;
};

const Learn3 = () => {
    const Input1Sc = styled.input.attrs({
        type: 'checkbox'
    })``;

    const Label1Sc = styled.label`
        align-items: center;
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
    `;

    interface LabelText1ScProps {
        $mode: string;
    }

    const LabelText1Sc = styled.span<LabelText1ScProps>`
        ${(props) => {
            switch (props.$mode) {
                case 'dark':
                    return css`
                        background-color: black;
                        color: white;
                        $(Input1Sc):checked + && {
                            color: border-left: unset;
                        }
                    `;
                default:
                    return css`
                        background-color: white;
                        color:black;
                        $(Input1Sc):checked + && {
                            color: red;
                        }
                    `;
            }
        }}
    `;

    return <>
        <Label1Sc>
            <Input1Sc defaultChecked />
            <LabelText1Sc $mode="">Foo-None</LabelText1Sc>
        </Label1Sc>
        <Label1Sc>
            <Input1Sc />
            <LabelText1Sc $mode="dark">Foo-Dark</LabelText1Sc>
        </Label1Sc>
        <Label1Sc>
            <Input1Sc defaultChecked />
            <LabelText1Sc $mode="">Foo-None</LabelText1Sc>
        </Label1Sc>
        <Label1Sc>
            <Input1Sc defaultChecked />
            <LabelText1Sc $mode="dark">Foo-Dark</LabelText1Sc>
        </Label1Sc>
    </>;
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
            background: blue; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
            color: white;
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
                <ThingSc className="something">The sun is shining...</ThingSc>
                <div>Pretty nice day today.</div>
                <ThingSc>Don't you think?</ThingSc>
                <div className="something-else">
                    <ThingSc>Splendid.</ThingSc>
                </div>
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