import Dropdown from "./dropdown.js";
import ToastNotification from "./toastNotification.js";

try {
  document.querySelector(".backgroundUser").addEventListener("click", () => {
    document.getElementById("user-checkbox").checked = false;
  });

  let tabActive = 0;
  const sideNavTabs = document.getElementById("sideNavTabs");

  sideNavTabs.addEventListener("click", (e) => {
    const childs = sideNavTabs.children;
    let tab = e.target.dataset.tab;

    childs[tabActive].classList.remove("sideNav__tab--active");
    childs[tab].classList.add("sideNav__tab--active");
    tabActive = tab;
  });
} catch (err) {
  console.log(err);
}



function getDataPlan() {
  const fields = document.querySelectorAll('.input-data');
  const title = document.querySelector('.sideNav__index-title');

  const data = {
    fields: {},
    dropdowns: dropdown.getSelected(),
    title: title.textContent
  }

  for (let field of fields) {
    data.fields[field.name] = field.value;
  }

  return data;
}



const contVersions = document.querySelector(".sideNav__versions");
contVersions.addEventListener('click', (e) => {
  if (e.target.tagName == 'SPAN') {
    renderData(e.target.id)
  }
})


function renderData(version) {
  const fields = document.querySelectorAll('.input-data');
  const title = document.querySelector('.sideNav__index-title');

  title.textContent = plan.versions[version].description;

  for (let field of fields) {
    const fieldName = field.name;
    let data = plan?.versions[version]?.content?.fields?.[fieldName]
    field.value = data ? data: ''
  }

  const dropdownSelected = plan.versions[version].content.dropdowns;
  if (dropdownSelected) {
    for (let id of Object.keys(dropdownSelected)) {
      dropdown.select(dropdownSelected[id], id);
    }
  }else {
    for (let id of ['carreraDrop', 'asignaturaDrop', 'periodoDrop', 'uocDrop']) {
      dropdown.select('None', id);
    }
  }

  
  contVersions.innerHTML = "";
  for (let v of Object.keys(plan.versions)) {
    const span = document.createElement("SPAN");
    span.id = v;
    if (v == version) {span.classList.add('v-selected')}
    span.classList.add("sideNav__version");
    span.innerHTML = `<i class="icon-clock-rotate-left"></i>${v} - ${plan.versions[v].creation_date}`;
    contVersions.insertAdjacentElement("afterbegin", span);
  }
}







const dropdown = new Dropdown();
const notification = new ToastNotification();
const plan = {};

fetch("/getDataPlan/")
  .then((res) => res.json())
  .then((data) => {
    plan.versions = {};

    for (let version of data.versions) {
      if (version.is_actual) {
        plan.id = version.id_plan_id;
        plan.versionActual = version.id;
      }

      version.content = JSON.parse(version.content)
      plan.versions[version.id] = version;
    }

    const datasDB = [[],[],[]]
    for (let career of data.careers) {
      datasDB[0].push(career.description)
    }
    for (let subject of data.subjects) {
      datasDB[1].push(subject.description)
    }
    for (let level of data.levels) {
      datasDB[2].push(level.description)
    }

    dropdown.create({
      id: 'carreraDrop',
      containerId: 'carreraDrop',
      options: datasDB[0]
    });

    dropdown.create({
      id: 'asignaturaDrop',
      containerId: 'asignaturaDrop',
      options: datasDB[1]
    });
    
    dropdown.create({
      id: 'periodoDrop',
      containerId: 'periodoDrop',
      options: datasDB[2]
    });

    dropdown.create({
      id: 'uocDrop',
      containerId: 'uocDrop',
      options: ['Básico', 'Profesional', 'Titulación']
    });
    

    console.log(plan.id);
    renderData(plan.versionActual);
  })
  .catch((err) => {
    console.log(err);
  });






document.getElementById("saveVersion").addEventListener("click", () => {
  const data = getDataPlan();

  const dataVersion = {
    id: plan.versionActual,
    idPlan: plan.id,
    description: data.title,
    content: JSON.stringify(getDataPlan())
  };

  fetch("/saveVersion/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(dataVersion),
  })
  .then((res) => res.json())
  .then((data) => {

    if (data.status) {
      const v = data.version
      v.content = JSON.parse(v.content)
      plan.versions[v.id] = v;
      plan.versionActual = v.id;
      renderData(v.id);

      notification.addToast({
        type: 'success', // 'error', 'warning', 'success', 'info'
        title: 'Version',
        description: 'Nueva version guardada correctamente.',
        autoClose: true// false, true
      })

      return;
    }

    notification.addToast({
      type: 'error', // 'error', 'warning', 'success', 'info'
      title: '!Error',
      description: 'No se ha podido guardar una nueva version.',
      autoClose: false// false, true
    })
  })
  .catch((err) => {
    notification.addToast({
      type: 'error', // 'error', 'warning', 'success', 'info'
      title: '!Error inesperado',
      description: err,
      autoClose: false// false, true
    })
  });
});



