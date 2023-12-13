import { Card } from "antd";
import { BasicHookForm, BasicHookFormWithYup } from "../learn-react-hooks.utils";

const LearnReactHookForm = () => {
  return (
    <div>
      <Card
        title='Basic Form'
      >
        <BasicHookForm />
      </Card>
      <Card
        title='Basic Form with Yup'
      >
        <BasicHookFormWithYup />
      </Card>
    </div>
  );
};

export default LearnReactHookForm;