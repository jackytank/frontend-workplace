import { Card, Divider } from "antd";
import { BasicUseFormik, FullFormik } from "../learn-react-hooks.utils";

const LearnFormik = () => {
    return (
        <>
            <Card
                title="Formik useFormik hook"
            >
                <BasicUseFormik />
            </Card>
            <Divider/>
            <Card
                title="Full Formik using component Formik"
            >
                <FullFormik />
            </Card>
        </>
    );
};

export default LearnFormik;