import { Card } from "antd";
import { BasicHookForm, BasicHookFormWithYup, useLearnFormik } from "../../learn-react-hooks.utils";

const LearnReactHookForm = () => {
  const { onSubmit } = useLearnFormik();

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
        <BasicHookFormWithYup 
          onSubmit={onSubmit}
        />
      </Card>
    </div>
  );
};

export default LearnReactHookForm;