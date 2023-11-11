from django.db import models

class Role(models.Model):
    description = models.CharField(max_length=40)

    class Meta:
        db_table = "scv_role"