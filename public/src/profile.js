function labelFormatter(label, series) {
  return (
    '<div style="font-size:1.1rem; text-align:center; padding:2px; color: #001a4e; font-weight: 600;">' +
    label +
    '<br>' +
    Math.round(series.percent) +
    '%</div>'
  );
}

$(function () {
  let donutData = [
    {
      label: 'Pass',
      data: 50,
      color: '#68B0AB',
    },
    {
      label: 'Fail',
      data: 50,
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
  let reportDetail = JSON.parse($('.report-detail').attr('report-detail'));
  console.log('reportDetail: ', reportDetail);

  let bar_data = {
    data: [
      [1, 6],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
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
        [1, 'stylish'],
        [2, 'Wolfon'],
        [3, 'DataCat'],
        [4, 'filmo'],
        [5, 'turtlemq'],
      ],
    },
  });
  /* END BAR CHART */
});
