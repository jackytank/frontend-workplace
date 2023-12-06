import { Card, Divider } from "antd";
import { withLoading, withMousePosition, withTimer } from "../../../../../utils/hoc";
import { PanelMouseLogger, PointMouseLogger } from "./utils";

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
const PanelMouseTracker = withMousePosition(PanelMouseLogger);
const PointMouseTracker = withMousePosition(PointMouseLogger);

const HigherOrderComponent = () => {
  return (
    <>
      <SampleWithTimer
        title={'Sample wrapped with withTimer HOC'}
        content={"Hello HOC"}
      />
      <Divider />
      <SampleWithLoading
        title={'Sample wrapped with withLoading HOC'}
        content={"Hello HOC"}
      />
      <Divider />
      <PanelMouseTracker />
      <Divider />
      <PointMouseTracker />
    </>
  );
};

export default HigherOrderComponent;


