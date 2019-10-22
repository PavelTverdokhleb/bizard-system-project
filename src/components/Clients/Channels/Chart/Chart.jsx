import React, {Component} from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';

ReactHighstock.Highcharts.setOptions({
    global: {
        timezoneOffset: new Date().getTimezoneOffset(),
    }
});

class Chart extends Component {

    componentDidUpdate() {
        let chart = this.refs.chart.getChart();
        chart.reflow = () => {};
    }

    render(){
        const {data, symbol, load, axisName = 'Hashrate'} = this.props;
        let config = {
            chart: {
                type: 'spline',
                zoomType: 'x',
                backgroundColor: '#ffffff',
                spacing: [20, 25, 20, 20],
                height: '400px',
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                },
                resetZoomButton: {
                    theme: {
                        style: {
                            fontFamily: '"Montserrat", sans-serif',
                        }
                    }
                }
            },
            tooltip: {
                style: {
                    fontFamily: '"Montserrat", sans-serif',
                },
            },
            title: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            yAxis: [
                {
                    title: {
                        text: `${axisName} (${symbol})`,
                        align: 'high',
                        rotation: 0,
                        offset: -50,
                        y: -10,
                        style: {
                            color: '#29323C',
                            fontSize: '12px',
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: '400'
                        }
                    },
                    labels: {
                        format: `{value}`,
                        style: {
                            color: '#29323C',
                            fontFamily: '"Montserrat", sans-serif',
                        },
                        y: 5
                    },
                    gridLineWidth: 1,
                    gridLineColor: 'rgba(41, 50, 60, 0.1)',
                    tickLength: 5,
                    tickWidth: 1,
                    tickPosition: 'outside',
                    tickColor: '#29323C',
                    lineWidth: 1,
                    lineColor: '#29323C',
                    opposite: false,
                    min: 0,
                    endOnTick: true,
                    startOnTick: true,
                    fontFamily: '"Montserrat", sans-serif',
                }
            ],
            xAxis: {
                reversed: false,
                title: {
                    enabled: false,
                },
                labels: {
                    style: {
                        color: '#29323C',
                        fontFamily: '"Montserrat", sans-serif',
                    },
                    y: 25
                },
                lineColor: '#29323C',
                tickLength: 5,
                tickWidth: 1,
                tickColor: '#29323C',
                maxPadding: 0.05,
                showLastLabel: true
            },
            plotOptions:{
                series:{
                    turboThreshold:5000,
                    dataGrouping: {
                        groupPixelWidth: 1
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, ReactHighstock.Highcharts.getOptions().colors[0]],
                            [1, ReactHighstock.Highcharts.Color(ReactHighstock.Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    threshold: null
                }
            },
            legend: {
                enabled: false
            },
            series:
                load ? [{
                        name: 'Hashrate',
                        yAxis: 0,
                        dataGrouping:{
                            enabled:false
                        },
                        color: '#29323C',
                        data: []
                    }]
                    : data,
            navigation: {
                menuItemStyle: {
                    fontSize: '10px',
                    fontFamily: '"Montserrat", sans-serif'
                }
            }
        };
        return (
            <div>
                <ReactHighstock
                    config={config}
                    isPureConfig={true}
                    ref="chart"
                />
            </div>
        );
    }
}

export default Chart;