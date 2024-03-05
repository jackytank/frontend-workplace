/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Row, Switch } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Plugin, ChartData, ChartOptions } from 'chart.js';
// import chartjs line plugin
import '';

import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const baseChartData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
        },
    ],
};

const options: ChartOptions = {

};

const linePlugin: Plugin = {
    id: 'line-plugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const activeTooltip = chart?.tooltip?._active;
        if (activeTooltip && activeTooltip?.length) {
            const xCoor = chart.scales.x.getPixelForValue(chart.tooltip.dataPoints[0].dataIndex);
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#cccccc';
            ctx.setLineDash([5, 7]);
            ctx.moveTo(xCoor, chart.chartArea.top);
            ctx.lineTo(xCoor, chart.chartArea.bottom);
            ctx.stroke();
            ctx.restore();
            ctx.closePath();
        }
    }
};

const ChartLinePluginVerticalLine = () => {
    return (
        <div>
            <Row gutter={[24, 24]}>
                <Chart
                    type={'bar'}
                    plugins={[linePlugin]}
                    data={baseChartData}
                    height={200}
                    options={options}
                />
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