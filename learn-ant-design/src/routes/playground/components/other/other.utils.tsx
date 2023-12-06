import { Space, Button } from "antd";
import { useState, useEffect, Children, cloneElement } from "react";

export const CustomCarousal = ({
  children
}: {
  children: React.ReactElement[];
}) => {
  const [picIndex, setPicIndex] = useState(0);

  const movePic = (n: number) => {
    showPic(picIndex + n);
  };

  const showPic = (index: number) => {
    setPicIndex(index);
    if (index < 0) {
      setPicIndex(children.length - 1);
    }
    if (index > children.length - 1) {
      setPicIndex(0);
    }
  };

  useEffect(() => {
    showPic(0);
    return () => showPic(0);
  }, []);

  return (
    <Space direction="horizontal">
      <Button
        size="small"
        onClick={() => movePic(-1)}
      >
        {'<'}
      </Button>
      {Children.map(children, (child: React.ReactElement, index) => (
        cloneElement(child, {
          style: {
            ...child.props.style,
            display: index === picIndex ? 'block' : 'none',
            width: '100px',
            height: '100px',
          },
        })
      ))}
      <Button
        size="small"
        onClick={() => movePic(1)}
      >
        {'>'}
      </Button>
    </Space>
  );
};