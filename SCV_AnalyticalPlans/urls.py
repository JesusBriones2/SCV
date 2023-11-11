from django.urls import path
from .views import *

urlpatterns = [
    # path('', prueba, name='prueba'),
    path('', signin, name='login'),
    path('home/', home, name='home'),
    path('logout/', signout, name='logout'),
    path('sendEmail/', sendEmail, name='sendEmail'),
    path('editPlan/', editPlan, name='editPlan'),
    path('createPlan/', createPlan, name='createPlan'),
    path('getPlans/', getPlans, name='getPlans'),
    path('tasks/', tasks, name='tasks'),
    path('openPlan/<int:idPlan>', openPlan, name='openPlan'),
    path('getDataPlan/', getDataPlan, name='getDataPlan'),
    path('deletePlan/<int:idPlan>',deletePlan, name='deletePlan'),
    path('saveVersion/', saveVersion, name='saveVersion'),
    path('pdf/<int:idPlan>', pdf, name='pdf'),
]