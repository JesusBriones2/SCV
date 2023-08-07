/*

* Example of the object.
dropdown.create({
  id: 'id_dropdown',
  containerId: 'id_container',
  options: [
    'option 1',
    'option 2'
  ],
  optionDefault: 0
});

*/

export default function Dropdown() {
    const dropdownObjects = {};
  
    this.getSelected = function(id) {
      if (id) {
        return dropdownObjects[id];
      }
      return dropdownObjects;
    }

    this.select = function(option, id) {
      document.getElementById(id).querySelector('span').textContent = option;
      dropdownObjects[id] = option;
    }
  
    this.create = function({ id, containerId, options=[], optionDefault }) {
      let selected = optionDefault != undefined ? options[optionDefault]: 'None';
  
      const elem = document.createElement('div');
      const menu = document.createElement('ul');
  
      let items = '<li class="item">None</li>';
      for(let option of options) {
        items += `<li class="item">${option}</li>`
      }
  
      menu.classList.add('menu');
      elem.classList.add('dropdown');
      menu.innerHTML = items;
      elem.innerHTML = `
        <button class="btn">
          <span>${selected}</span>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
        </button>`;
      elem.appendChild(menu);
      document.getElementById(containerId).appendChild(elem);
  
      // Maneja el foco del Boton
      let focusedButton = null;
      elem.addEventListener('click', (e) => {
        let button = e.target.closest('.btn');
  
        if (button == focusedButton){
          button.blur()
          focusedButton = null;
        }
        else {
          button.addEventListener('blur', () => {
            focusedButton = null;
          })
          focusedButton = button;
        }
      })
  
      // Maneja la opción seleccionada
      menu.addEventListener('mousedown', (e) => {
        selected = e.target.textContent;
        focusedButton.querySelector('span').textContent = selected;
        dropdownObjects[id] = selected;
      })
  
      dropdownObjects[id] = selected;
    }
  }