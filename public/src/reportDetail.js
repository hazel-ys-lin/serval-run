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
  console.log('socket.id when connection: ', socket.id);
});

socket.on('test', (message) => {
  console.log('test: ', message);
});

socket.on('progress', (message) => {
  //   console.log('message from progress: ', message);
  $('.progress-bar.progress-finished').css(
    'width',
    `${message.success / message.success + message.fail}%`
  );
  $('.progress-bar.progress-failed').css(
    'width',
    `${message.fail / message.success + message.fail}%`
  );

  $(function () {
    if ($('.report-status').attr('status') !== true) {
      let donutData = [
        {
          label: 'Pass',
          data: message.success / message.success + message.fail,
          color: '#FA7070',
        },
        {
          label: 'Fail',
          data: message.fail / message.success + message.fail,
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
          [1, message.success + message.fail],
          [2, message.success],
          [3, message.fail],
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
    }
  });
});

// $(function () {
//   let donutData = [
//     {
//       label: 'Pass',
//       data: 60,
//       color: '#FA7070',
//     },
//     {
//       label: 'Fail',
//       data: 40,
//       color: '#54BAB9',
//     },
//   ];
//   $.plot('#donut-chart', donutData, {
//     series: {
//       pie: {
//         show: true,
//         radius: 1,
//         innerRadius: 0.5,
//         label: {
//           show: true,
//           radius: 2 / 3,
//           formatter: labelFormatter,
//           threshold: 0.1,
//         },
//       },
//     },
//     legend: {
//       show: false,
//     },
//   });

//   /*
//    * BAR CHART
//    * ---------
//    */
//   let bar_data = {
//     data: [
//       [1, 5],
//       [2, 3],
//       [3, 2],
//     ],
//     bars: { show: true },
//   };
//   $.plot('#bar-chart', [bar_data], {
//     grid: {
//       borderWidth: 1,
//       borderColor: '#f3f3f3',
//       tickColor: '#f3f3f3',
//     },
//     series: {
//       bars: {
//         show: true,
//         barWidth: 0.5,
//         align: 'center',
//       },
//     },
//     colors: ['#6E85B7'],
//     xaxis: {
//       ticks: [
//         [1, 'Total'],
//         [2, 'Pass'],
//         [3, 'Fail'],
//       ],
//     },
//   });
//   /* END BAR CHART */
// });
