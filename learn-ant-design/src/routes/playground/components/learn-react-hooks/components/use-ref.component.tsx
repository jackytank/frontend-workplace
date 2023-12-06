import { Button, Card, Divider, Input, InputNumber, InputRef, Space, message } from "antd";
import { useEffect, useRef, useState } from "react";

const UseRef = () => {
  return (
    <>
      <Card
        title='LogButtonClick'
      >
        <LogButtonClick />
      </Card>
      <Divider />
      <Card
        title='StopWatch'
      >
        <StopWatch />
      </Card>
      <Divider />
      <Card
        title='AccessingElement'
      >
        <AccessingElement />
      </Card>
      <Divider />
      <Card
        title='RefFocusElement'
      >
        <RefFocusElement />
      </Card>
    </>
  );
};

export default UseRef;

const RefFocusElement = () => {
  const ref = useRef<InputRef | null>(null);

  const handleClick = () => {
    ref.current?.focus();
  }
  return (
    <Space>
      <Input type="text" ref={ref}/>
      <Button onClick={handleClick}>Comment</Button>
    </Space>
  );
};

const LogButtonClick = () => {
  const countRef = useRef(0);

  const handle = (): void => {
    ++countRef.current;
    void message.info(`Clicked ${countRef.current} times`);
  };

  void message.warning('I render!');

  return (
    <>
      <Button
        type="primary"
        onClick={handle}
      >
        Click me
      </Button>
    </>
  );
};

const StopWatch = () => {
  const timeIdRef = useRef<number>(0);
  const [count, setCount] = useState<number>(0);

  const startHandler = () => {
    if (timeIdRef.current) return;
    timeIdRef.current = setInterval(() => setCount(c => c + 1), 1000);
  };

  const stopHandler = () => {
    clearInterval(timeIdRef.current);
    timeIdRef.current = 0;
  };

  useEffect(() => {
    return () => {
      clearInterval(timeIdRef.current);
    };
  }, []);


  return (
    <Space>
      <h3>Timer: {count}</h3>
      <Button
        type="primary"
        onClick={startHandler}
      >
        Start
      </Button>
      <Button
        type="primary"
        danger
        onClick={stopHandler}
      >
        Stop
      </Button>
      <Button
        type="dashed"
        onClick={() => {
          clearInterval(timeIdRef.current);
          setCount(0);
        }}
      >
        Clear
      </Button>
    </Space>
  );
};

const AccessingElement = () => {
  const elementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    elementRef.current?.focus();
  }, []);

  return (
    <InputNumber
      ref={elementRef}
      placeholder="Enter number..."
    />
  );
}


