from django.contrib import admin

from .models import career, level, subject, subject_career_level
from .models import role, user, analytical_plan, plan_version
from .models import assignment, comment

# Register your models here.
admin.site.register(career.Career)
admin.site.register(level.Level)
admin.site.register(subject.Subject)
admin.site.register(subject_career_level.Subject_career_level)
admin.site.register(role.Role)
admin.site.register(user.User)
admin.site.register(analytical_plan.Analytical_plan)
admin.site.register(plan_version.Plan_version)
admin.site.register(assignment.Assignment)
admin.site.register(comment.Comment)
