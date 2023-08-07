from django.db import models
from .role import Role
from .subject import Subject

class User(models.Model):
    username = models.CharField(max_length=15, blank=True)
    password = models.CharField(max_length=15, blank=True)
    names = models.CharField(max_length=40)
    surnames = models.CharField(max_length=40)
    email = models.EmailField()
    created_by = models.IntegerField()
    creation_date = models.DateTimeField(auto_now_add=True)
    
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        db_table = "scv_user"