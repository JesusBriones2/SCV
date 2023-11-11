from django.db import models
from .analytical_plan import Analytical_plan
from .user import User

class Assignment(models.Model):
    description = models.CharField(max_length=80)
    assignment_status = models.CharField(max_length=20)
    deadline = models.DateTimeField()
    creation_date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    id_plan = models.ForeignKey(Analytical_plan, on_delete=models.CASCADE)
    id_user = models.ForeignKey(User, related_name="user" , on_delete=models.CASCADE)
    id_assigner_user = models.ForeignKey(User, related_name="assigner", on_delete=models.CASCADE)

    class Meta:
        db_table = "scv_assignment"