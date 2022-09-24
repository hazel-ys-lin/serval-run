const socket = io();

function labelFormatter(label, series) {
  return (
    '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">' +
    label +
    '<br>' +
    Math.round(series.percent) +
    '%</div>'
  );
}

// TODO: socket on the message from socket handler in backend
socket.on('connection', (socket) => {
  console.log(socket.id);
});

socket.on('progress', (message) => {
  console.log('message from progress: ', message);
  $('.progress-finished').text() = `${message.result.success}%`
});

$(function () {
  let donutData = [
    {
      label: 'Pass',
      data: 60,
      color: '#FA7070',
    },
    {
      label: 'Fail',
      data: 40,
      color: '#54BAB9',
    },
  ];
  $.plot('#donut-chart', donutData, {
    series: {
      pie: {
        show: true,
        radius: 1,
        innerRadius: 0.5,
        label: {
          show: true,
          radius: 2 / 3,
          formatter: labelFormatter,
          threshold: 0.1,
        },
      },
    },
    legend: {
      show: false,
    },
  });

  /*
   * BAR CHART
   * ---------
   */
  let bar_data = {
    data: [
      [1, 5],
      [2, 3],
      [3, 2],
    ],
    bars: { show: true },
  };
  $.plot('#bar-chart', [bar_data], {
    grid: {
      borderWidth: 1,
      borderColor: '#f3f3f3',
      tickColor: '#f3f3f3',
    },
    series: {
      bars: {
        show: true,
        barWidth: 0.5,
        align: 'center',
      },
    },
    colors: ['#6E85B7'],
    xaxis: {
      ticks: [
        [1, 'Total'],
        [2, 'Pass'],
        [3, 'Fail'],
      ],
    },
  });
  /* END BAR CHART */
});
