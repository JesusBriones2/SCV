import PlanCard from "./plan.js";

(() => {
  // Carga de la lista de planes del usuario.
  fetch("/getPlans/")
    .then((res) => res.json())
    .then((data) => {
      data.plans.reverse();

      for (let plan of data.plans) {
        new PlanCard({
          id: plan.id,
          idParent: "planContainer",
          title: plan.name,
          creationDate: plan.creationDate,
          modified: plan.updateDate,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
})();
