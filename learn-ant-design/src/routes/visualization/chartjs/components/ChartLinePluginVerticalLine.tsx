import { Col, Row, Switch } from 'antd';
import React from 'react';

const ChartLinePluginVerticalLine = () => {
    return (
        <div>
            <Row gutter={[24, 24]}>
            </Row>
            <Row
                gutter={[24, 24]}
                justify={'end'}
            >
                {/* align the Col to the flex end */}
                <Col
                >
                    <Switch
                        checkedChildren="Dark"
                        unCheckedChildren="Light"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ChartLinePluginVerticalLine;