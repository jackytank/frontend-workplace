import { Button, Card, Space } from "antd";
import { Children, cloneElement, useEffect, useState } from "react";

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

const Other = () => {
  const images = [
    'https://i.ebayimg.com/images/g/OgsAAOSw9dNjf0EQ/s-l1200.jpg',
    'https://gigamall.com.vn/data/2019/09/17/15485781_LOGO-AKA-HOUSE-500x500.jpg',
    'https://www.saltandlavender.com/wp-content/uploads/2020/07/teriyaki-chicken-stir-fry-11-500x500.jpg',
    'https://www.justonecookbook.com/wp-content/uploads/2023/04/Spicy-Shoyu-Ramen-8055-I-500x500.jpg'
  ];

  return (
    <Space direction="vertical">
      <Card title='Carousal in React'>
        <CustomCarousal>
          {images.map((image) => (
            <img key={image} src={image} alt={image} />
          ))}
        </CustomCarousal>
      </Card>
    </Space>
  );
};

export default Other;