/*
 * ESM port of node_modules/echarts/theme/dark.js (Apache ECharts, Apache License 2.0)
 *
 * Why does this file exist?
 * The original file 'echarts/theme/dark.js' is a UMD/CommonJS module which does require('echarts/lib/echarts').
 * Mixing this CommonJS module with the ESM imports from 'echarts/core', 'echarts/charts' and 'echarts/renderers'
 * causes the Vite/Rolldown dependency pre-bundler (ng serve) to wrap ECharts into lazy initializers.
 * As a result, `CanvasRenderer` from 'echarts/renderers' gets registered before the CanvasPainter is initialized,
 * which leads to: "Error: Renderer 'canvas' is not imported. Please import it first."
 *
 * Usage: import '<relative-path>/components/charts/echarts-dark-theme';
 * Do NOT import 'echarts/theme/dark.js' anymore.
 */
import { registerTheme } from 'echarts/core';

const contrastColor = '#B9B8CE';
const backgroundColor = '#100C2A';

const axisCommon = () => {
    return {
        axisLine: {
            lineStyle: {
                color: contrastColor
            }
        },
        splitLine: {
            lineStyle: {
                color: '#484753'
            }
        },
        splitArea: {
            areaStyle: {
                color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)']
            }
        },
        minorSplitLine: {
            lineStyle: {
                color: '#20203B'
            }
        }
    };
};

const colorPalette = [
    '#4992ff',
    '#7cffb2',
    '#fddd60',
    '#ff6e76',
    '#58d9f9',
    '#05c091',
    '#ff8a45',
    '#8d48e3',
    '#dd79ff'
];

const categoryAxis = axisCommon();
const theme = {
    darkMode: true,

    color: colorPalette,
    backgroundColor: backgroundColor,
    axisPointer: {
        lineStyle: {
            color: '#817f91'
        },
        crossStyle: {
            color: '#817f91'
        },
        label: {
            // TODO Contrast of label backgorundColor
            color: '#fff'
        }
    },
    legend: {
        textStyle: {
            color: contrastColor
        }
    },
    textStyle: {
        color: contrastColor
    },
    title: {
        textStyle: {
            color: '#EEF1FA'
        },
        subtextStyle: {
            color: '#B9B8CE'
        }
    },
    toolbox: {
        iconStyle: {
            borderColor: contrastColor
        }
    },
    dataZoom: {
        borderColor: '#71708A',
        textStyle: {
            color: contrastColor
        },
        brushStyle: {
            color: 'rgba(135,163,206,0.3)'
        },
        handleStyle: {
            color: '#353450',
            borderColor: '#C5CBE3'
        },
        moveHandleStyle: {
            color: '#B0B6C3',
            opacity: 0.3
        },
        fillerColor: 'rgba(135,163,206,0.2)',
        emphasis: {
            handleStyle: {
                borderColor: '#91B7F2',
                color: '#4D587D'
            },
            moveHandleStyle: {
                color: '#636D9A',
                opacity: 0.7
            }
        },
        dataBackground: {
            lineStyle: {
                color: '#71708A',
                width: 1
            },
            areaStyle: {
                color: '#71708A'
            }
        },
        selectedDataBackground: {
            lineStyle: {
                color: '#87A3CE'
            },
            areaStyle: {
                color: '#87A3CE'
            }
        }
    },
    visualMap: {
        textStyle: {
            color: contrastColor
        }
    },
    timeline: {
        lineStyle: {
            color: contrastColor
        },
        label: {
            color: contrastColor
        },
        controlStyle: {
            color: contrastColor,
            borderColor: contrastColor
        }
    },
    calendar: {
        itemStyle: {
            color: backgroundColor
        },
        dayLabel: {
            color: contrastColor
        },
        monthLabel: {
            color: contrastColor
        },
        yearLabel: {
            color: contrastColor
        }
    },
    timeAxis: axisCommon(),
    logAxis: axisCommon(),
    valueAxis: axisCommon(),
    categoryAxis: {
        ...categoryAxis,
        splitLine: {
            ...categoryAxis.splitLine,
            show: false
        }
    },

    line: {
        symbol: 'circle'
    },
    graph: {
        color: colorPalette
    },
    gauge: {
        title: {
            color: contrastColor
        }
    },
    candlestick: {
        itemStyle: {
            color: '#FD1050',
            color0: '#0CF49B',
            borderColor: '#FD1050',
            borderColor0: '#0CF49B'
        }
    }
};

registerTheme('dark', theme);

