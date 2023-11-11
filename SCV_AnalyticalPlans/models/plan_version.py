from django.db import models
from .analytical_plan import Analytical_plan

class Plan_version(models.Model):
    description = models.CharField(max_length=80)
    creation_date = models.CharField(max_length=10)
    content = models.JSONField()
    is_actual = models.BooleanField(default=False)
    id_plan = models.ForeignKey(Analytical_plan, on_delete=models.CASCADE)

    class Meta:
        db_table = "scv_plan_version"
