from django.db import models
from .user import User

class Analytical_plan(models.Model):
    code = models.CharField(max_length=40)
    creation_date = models.CharField(max_length=10)
    update_date = models.CharField(max_length=10)
    id_user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "scv_analytical_plan"