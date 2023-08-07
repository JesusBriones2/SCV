from django.db import models

class Career(models.Model):
    description = models.CharField(max_length=80)

    class Meta:
        db_table = "scv_career"
