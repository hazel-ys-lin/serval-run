$('.btn-profile').on('click', function (event) {
  console.log('my profile clicked');
  event.preventDefault();

  axios({
    method: 'get',
    url: '/profile',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.assign('/profile');
      }
    })
    .catch((error) => {
      console.log('catch error: ', error);
      if (error.response.status === 403) {
        swal({
          text: 'Please log in first',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.assign('https://serval.run/user');
        }, 3000);
      } else {
        swal({
          text: 'Redirect failed',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.assign('https://serval.run/');
        }, 3000);
      }
    });
});
