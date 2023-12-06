import { Card } from "antd";
import { withLoading, withTimer } from "../../../../../utils/hoc";

const Sample = ({ title, content }: {
  title: string,
  content: string;
}) => {
  return (
    <Card
      title={title}
    >
      {content}
    </Card>
  );
};

const SampleWithTimer = withTimer(Sample);
const SampleWithLoading = withLoading(Sample);

const HigherOrderComponent = () => {
  return (
    <>
      <SampleWithTimer
        title={'Sample wrapped with withTimer HOC'}
        content={"Hello HOC"}
      />
      <br />
      <SampleWithLoading
        title={'Sample wrapped with withLoading HOC'}
        content={"Hello HOC"}
      />
    </>
  );
};

export default HigherOrderComponent;


