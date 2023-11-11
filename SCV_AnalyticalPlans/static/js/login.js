import ToastNotification from './toastNotification.js';
import Form from './form.js';

(() => {
  const className = "form--hide";
  
  const loginForm = new Form('loginForm', (action, data) => {
    fetch(action,{
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': "application/json",
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      if (data?.usernameError) {
        loginForm.message(loginForm.form['username'], data.usernameError)
        return
      }

      if (data?.passwordError) {
        loginForm.message(loginForm.form['password'], data.passwordError)
        return
      }

      if (data?.url) {
        window.location.href = data.url;
        loginForm.clear();
      };

    })
    .catch(error => {
      console.log(error);
    })
  });

  loginForm.validateField('username', value => {
    const regex = /[^\w]|^.{16,}$|\s/;
    return regex.test(value) ? "Nombre de usuario no valido.": 0
  })

  loginForm.validateField('password', value => {
    const regex = /\s+/;
    return regex.test(value) ? "Contraseña no valida.": 0
  })




  const toast = new ToastNotification();

  //* -----------------------------------------------------------------------------------------------
  //* Retrieve credentials
  const rcForm = new Form('rcForm', (action, data, button) => {
    const iconArrow = rcForm.form.querySelector('.icon-arrow-left');
    button.innerHTML = `<i class="icon-circle-notch"></i>`;
    iconArrow.style.display = 'none';

    fetch(action, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      iconArrow.style.display = 'block';
      button.innerHTML = "Enviar";

      if (data?.emailError) {
        rcForm.message(rcForm.form['email'], data.emailError)
        return
      }

      if (data?.mailSuccessfully) {
        
        rcForm.form.classList.add(className);
        rcForm.clear();
        loginForm.form.classList.remove(className);
        
        toast.addToast({
          type: 'success',
          title: 'Email Enviado',
          description: data.mailSuccessfully
        })
        return
      }
    
      toast.addToast({
        type: 'error',
        title: 'Error',
        description: data.networkError
      })
    })
    .catch(error => {
      button.innerHTML = "Enviar";
      iconArrow.style.display = 'block';
    })
  });

  rcForm.validateField('email', value => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return !regex.test(value) ? "Dirección de correo no valida.": 0
  }, false)



  // Funcionalidad de ocultar y mostrar contraseña.
  document.getElementById("wrapperLabel").addEventListener("click", () => {
    loginForm.form['password'].type = loginForm.form['checkbox'].checked ? "password" : "text";
  });


  // Evento del link recuperar credenciales.
  document.getElementById('linkRC').addEventListener('click', () => {
    rcForm.form.classList.remove(className);
    loginForm.form.classList.add(className);
    loginForm.clear();
  })

  rcForm.form.querySelector('.icon-arrow-left').addEventListener('click', () => {
    rcForm.form.classList.add('form--hide');
    loginForm.form.classList.remove('form--hide');
    rcForm.clear();
  })

})();