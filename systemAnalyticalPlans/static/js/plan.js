import ToastNotification from "./toastNotification.js";

const modal = document.getElementById("homeBackground");

let objPlan = {};
const notification = new ToastNotification();

modal.addEventListener("click", (e) => {
  let id = e.target.id;

  if (id == "ctaAceptar") {
    modal.style.display = "none";

    fetch(`/deletePlan/${objPlan.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.delete) {
          objPlan.parent.removeChild(objPlan.elem);
        }

        notification.addToast({
          type: "success", // 'error', 'warning', 'success', 'info'
          title: 'Plan eliminado',
          description: `${objPlan.title} se eliminó correctamente`,
          autoClose: true, // false, true
        });
      })
      .catch((err) => {
        notification.addToast({
            type: 'error', // 'error', 'warning', 'success', 'info'
            title: `!Error`,
            description: `Error al eliminar ${objPlan.title} : ${err}`,
            autoClose: false// false, true
        })
      });
    return;
  }

  if (id == "ctaCancelar") {
    modal.style.display = "none";
    return;
  }
});

export default function PlanCard(obj) {
  const parent = document.getElementById(obj.idParent);

  const elem = document.createElement("DIV");
  elem.id = obj.id;
  elem.classList.add("planCard");
  elem.innerHTML = `
        <div class="planCard__info">
            <i class="icon-file-lines"></i>
            <h3 class="planCard__title">${obj.title}</h3>
            <div class="planCard__date">
                <span>Creado: ${obj.creationDate}</span>
                <span>Ultima modificado: ${obj.modified}</span>
            </div>
        </div>
        <div class="planCard__cta">
            <i class="icon-file-arrow-down"></i>
            <i class="icon-trash"></i>
        </div>`;
  parent.appendChild(elem);

  const functionsCardPlan = (e) => {
    let name = e.target.className;

    if (name == "planCard__cta") return;

    if (name == "icon-file-arrow-down") {
      
      fetch(`/pdf/${obj.id}`)
      .then(res => res.blob())
      .then(res => {

        // Crear una URL temporal para el Blob
        const pdfUrl = URL.createObjectURL(res);

        // Crear un enlace para que el usuario descargue el PDF automáticamente
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = 'Plan analítico.pdf'; // Nombre del archivo que se descargará
        downloadLink.click();

      })
      .catch(err => {
        console.log(err);
      })

      return;
    }

    if (name == "icon-trash") {
      objPlan.id = obj.id;
      objPlan.elem = elem;
      objPlan.title = obj.title;
      objPlan.parent = parent;

      modal.querySelector(".title2").textContent = obj.title;
      modal.style.display = "block";
      return;
    }

    fetch(`/openPlan/${obj.id}`)
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  elem.addEventListener("click", functionsCardPlan);
}

// const planCard = new PlanCard({
//     id: 1,
//     idParent: 'main',
//     title: 'Hola mundo',
//     creationDate: 'lun 25, 12:10',
//     modified: 'vie 29, 13:30'
// })
