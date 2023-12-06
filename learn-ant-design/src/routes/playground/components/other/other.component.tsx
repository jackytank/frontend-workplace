import { Card, Space } from "antd";
import { CustomCarousal } from "./other.utils";

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