import { Card, Col, Row } from "antd";
import ChartLinePluginVerticalLine from "./components/ChartLinePluginVerticalLine";

const ChartJs = () => {
    return (
        <div>
            <Row gutter={[24, 24]}>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Line plugin arbitrary vertical line" style={{ width: 400, height: 400 }}>
                        <ChartLinePluginVerticalLine />
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Card size="small" title="Small size card" style={{ width: 400, height: 400 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ChartJs;