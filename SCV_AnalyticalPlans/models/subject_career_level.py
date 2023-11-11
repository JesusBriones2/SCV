from django.db import models
from .career import Career
from .level import Level
from .subject import Subject

class Subject_career_level(models.Model):
    id_career = models.ForeignKey(Career, on_delete=models.CASCADE)
    id_level = models.ForeignKey(Level, on_delete=models.CASCADE)
    id_subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        db_table = "scv_subject_career_level"

        constraints = [
            models.UniqueConstraint(fields=['id_career', 'id_level', 'id_subject'], name='pk_compuesta'),
        ]