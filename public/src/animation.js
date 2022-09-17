$(document).ready(function () {
  $('.progress-bar').each(function () {
    let percentage = parseInt($(this).html());
    if (percentage > 0) {
      $(this).animate({ width: '' + percentage + '%' }, 800);
    } else {
      $(this).css({ color: 'black', background: 'none' }, 800);
    }
  });
});
