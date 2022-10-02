// $('.btn-log_out').on('click', function (event) {
//   console.log('log out clicked');
//   event.preventDefault();

//   axios({
//     method: 'post',
//     url: '/user/logout',
//     headers: { 'Content-Type': 'application/json' },
//   })
//     .then((response) => {
//       if (response.status === 200) {
//         swal({
//           text: 'You have logged out',
//           confirmButtonClass: 'btn-success',
//         });
//         setTimeout(() => {
//           window.location.assign('http://localhost:3001/');
//         }, 2000);
//       } else if (response.status === 201) {
//         window.location.assign('http://localhost:3001/');
//       }
//     })
//     .catch((error) => {
//       console.log('catch error: ', error);
//       window.location.reload();
//     });
// });

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
        window.location.assign('http://localhost:3001/profile');
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
          window.location.assign('http://localhost:3001/signin');
        }, 3000);
      } else {
        swal({
          text: 'Redirect failed',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.assign('http://localhost:3001/');
        }, 3000);
      }
    });
});

$('.btn-my_project').on('click', function (event) {
  console.log('my project clicked');
  event.preventDefault();

  axios({
    method: 'get',
    url: '/projects',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (response.status === 200) {
        console.log('status 200');
        window.location.assign('http://localhost:3001/projects');
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
          window.location.assign('http://localhost:3001/signin');
        }, 3000);
      } else {
        swal({
          text: 'Redirect failed',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.assign('http://localhost:3001/');
        }, 3000);
      }
    });
});
