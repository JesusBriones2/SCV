# Generated by Django 4.2.3 on 2023-07-23 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('systemAnalyticalPlans', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, max_length=15),
        ),
    ]
