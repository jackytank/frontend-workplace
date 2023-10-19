import { Card } from "antd";
import { withTimer } from "../../../../../utils";

const Sample = ({ title, content }: {
  title: string,
  content: string;
}) => {
  return (
    <>
      <Card
        title={title}
      >
        {content}
      </Card>
    </>
  );
};

const SampleWithTimer = withTimer(Sample);

const HigherOrderComponent = () => {
  return (
    <>
      <SampleWithTimer
        title={'Sample wrapped with withTimer HOC'}
        content={"Hello HOC"}
      />
    </>
  );
};

export default HigherOrderComponent;


