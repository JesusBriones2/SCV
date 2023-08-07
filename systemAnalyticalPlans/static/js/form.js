export default function Form(idForm, request) {

  this.form = document.getElementById(idForm);
  this.fields = this.form.querySelectorAll('input.input-active');

  let validations = {};

  // Muestra mensaje de error en el input.
  this.message = function(field, content) {
    const messageElem = field.closest('.form__group').querySelector('.inputMessage');
    messageElem.lastElementChild.textContent = content;
    messageElem.classList.add('inputMessage--active')
  }


  // Quita el mensaje de error en el input.
  this.removeMessage = function(field) {
    const messageElem = field.closest('.form__group').querySelector('.inputMessage');
    messageElem.lastElementChild.textContent = '';
    messageElem.classList.remove('inputMessage--active')
  }


  // Limpia los campos activos del formulario.
  this.clear = function() {
    for (let field of this.fields) {
      field.value = '';
      validations = {}
      this.removeMessage(field);
    }
  }


  // Confirma si todas las validaciones son correctas.
  this.confirmValidations = function() {
    for (let key of Object.keys(validations) ) {
      if (validations[key].status == false) {
        this.message(validations[key].field, validations[key].error)
        return true;
      }
    }
  }

  
  // Verifica si los campos están vacíos.
  this.checkEmptyFields = function() {
    for (let field of this.fields) {
      if (!field.value.trim()) {
        this.message(field, "Debes completar el campo.");
        return true
      }
    }
  }


  // Agrega validaciones extra a los campos.
  this.validateField = function(fieldName, fn, smsShow=true) {
    const field = this.form[fieldName];
    
    field.addEventListener('keyup', e => {
      if (e.key != "Enter") {
        const res = fn(e.target.value);
        this.removeMessage(field);

        if (res) {
          validations[fieldName] = {'error':res,'field':field,'status':false};
          smsShow ? this.message(field, res): 0
          return
        }
        
        validations[fieldName] = {'status':true};
      }
    })
  }


  // Evento de envió del formulario para la petición.
  this.form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Verifica que las validaciones sean correctas y que los campos no estén vacíos.
    if (this.checkEmptyFields()) return;
    if (this.confirmValidations()) return;

    const data = {}
    for(let field of this.fields) {
      data[field.name] = field.value;
    }

    request(this.form.action, data, this.form.querySelector('.form__cta'));
  });
}