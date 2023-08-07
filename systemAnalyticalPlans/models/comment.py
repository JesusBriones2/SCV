from django.db import models
from .assignment import Assignment
from .user import User

class Comment(models.Model):
    content = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)

    id_assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    id_user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "scv_comment"