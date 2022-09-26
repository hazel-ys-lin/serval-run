$('.btn-sign_up').on('click', function (event) {
  console.log('sign up clicked');
  event.preventDefault();
  const userName = $('.input_signup-username').val();
  const userEmail = $('.input_signup-email').val();
  const userPassword = $('.input_signup-password').val();

  axios({
    method: 'post',
    url: '/user/signup',
    data: {
      userName: userName,
      userEmail: userEmail,
      userPassword: userPassword,
    },
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (response.status === 200) {
        swal({
          text: 'Welcome to servalRun!',
          icon: 'success',
          confirmButtonClass: 'btn-success',
        });
        setTimeout(() => {
          window.location.assign('./profile');
        }, 2000);
        //- alert('Welcome to servalRun!')
        //- window.location.assign('./profile');
      }
    })
    .catch((error) => {
      //- console.log('catch error: ', error.response.status)
      if (error.response.status === 403) {
        swal({
          text: 'Email already exists. Please sign in.',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (error.response.status === 422) {
        let errorArray = [];
        error.response.data.errorMessages.forEach((elem) => {
          errorArray.push(elem.msg);
        });
        let errorMsg = errorArray.join('\n');
        swal({
          //- text: 'Please input your information properly',
          text: errorMsg,
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        swal({
          text: 'Create account error',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      //- alert('Create account error')
      //- window.location.reload();
    });
});

$('.btn-sign_in').on('click', function (event) {
  //- console.log('sign in clicked')
  event.preventDefault();
  const userEmail = $('.input_signin-email').val();
  const userPassword = $('.input_signin-password').val();

  axios({
    method: 'post',
    url: '/user/signin',
    data: {
      userEmail: userEmail,
      userPassword: userPassword,
    },
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (response.status === 200) {
        //- alert("Welcome back to servalRun!");
        swal({
          text: 'Welcome back to servalRun!',
          icon: 'success',
          confirmButtonClass: 'btn-success',
        });
        setTimeout(() => {
          window.location.assign('./profile');
        }, 2000);
      }
    })
    .catch((error) => {
      //- console.log('catch error: ', error)
      if (error.response.status === 403) {
        swal({
          text: 'Sign in failed\nPlease check your email or password',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (error.response.status === 422) {
        let errorArray = [];
        error.response.data.errorMessages.forEach((elem) => {
          errorArray.push(elem.msg);
        });
        let errorMsg = errorArray.join('\n');
        swal({
          //- text: 'Please input your information properly',
          text: errorMsg,
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        swal({
          text: 'Sign in error',
          icon: 'error',
          confirmButtonClass: 'btn-danger',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
});
