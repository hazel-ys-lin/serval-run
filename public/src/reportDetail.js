const socket = io();

function labelFormatter(label, series) {
  return (
    '<div style="font-size:1.1rem; text-align:center; padding:2px; color: #fff; font-weight: 600;">' +
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
  console.log('message from progress: ', message);
  let success = Number(message.success);
  let failed = Number(message.fail);
  let total = Number($('.report-length').attr('examples'));
  let running = total - success - failed;
  let successRate = (success / total) * 100;
  let failRate = (failed / total) * 100;
  let pendingRate = (running / total) * 100;

  $(function () {
    if ($('.report-status').attr('status') !== 'true') {
      /*
       * PROGRESS BAR
       * ---------
       */
      $('.progress-finished').css({ width: `${successRate}%` }, 600);
      $('.progress-pending').css({ width: `${pendingRate}%` }, 600);
      $('.progress-failed').css({ width: `${failRate}%` }, 600);
      /*
       * DONUT CHART
       * ---------
       */
      let donutData = [
        {
          label: 'Pass',
          data: successRate,
          color: '#EA907A',
        },
        {
          label: 'Running',
          data: pendingRate,
          color: '#FFD36B',
        },
        {
          label: 'Fail',
          data: failRate,
          color: '#68B0AB',
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
          [1, Number(total)],
          [2, Number(success)],
          [3, Number(failed)],
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

$(function () {
  if ($('.report-status').attr('status') === 'true') {
    //- let passRate = Number($('.progress-finished').text().replace('%', ''));
    let passRate = Number($('.progress-finished').attr('rate'));
    //- let failRate = Number($('.progress-failed').text().replace('%', ''));
    let failRate = Number($('.progress-failed').attr('rate'));

    // FIXME: can't render progress bar
    $('.progress-finished').css({ width: `${passRate}%` }, 600);
    //- $('.progress-finished').text() = passRate;
    $('.progress-failed').css({ width: `${failRate}%` }, 600);
    //- $('.progress-failed').text() = failRate;
    //- $('.progress-bar.progress-failed').css('width', 0);

    let donutData = [
      {
        label: 'Pass',
        data: passRate,
        color: '#68B0AB',
      },
      {
        label: 'Fail',
        data: failRate,
        color: '#EA907A',
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
    let totalExamples = $('#bar-chart').attr('examples').split('/');
    let bar_data = {
      data: [
        [1, Number(totalExamples[0]) + Number(totalExamples[1])],
        [2, Number(totalExamples[0])],
        [3, Number(totalExamples[1])],
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
