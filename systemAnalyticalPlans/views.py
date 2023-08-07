from django.shortcuts import render, redirect
from django.core.serializers import serialize
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from django.template.loader import get_template
from django.conf import settings

import json, uuid
from io import BytesIO
import pdfkit
from .src.functions import getDate
from os.path import join
from django.conf import settings


# Importación de modelos
from .models.user import User
from .models.analytical_plan import Analytical_plan
from .models.plan_version import Plan_version
from .models.career import Career
from .models.level import Level
from .models.subject import Subject

import platform


# Módulos de envío de emails
from django.core.mail import EmailMessage


# Vista de inicio de sesión.
def signin(req):
    if req.method == 'POST':
        data = json.loads(req.body)

        user = User.objects.filter(username=data['username'])
        if not user:
            return JsonResponse({'usernameError': "Usuario no esta registrado."})
        else: user = user[0]

        if user.password != data['password']:
            return JsonResponse({'passwordError': "Contraseña incorrecta"})

        plansIds = []
        for plan in Analytical_plan.objects.filter(id_user_id=user.id):
            plansIds.append(plan.id)

        req.session['userid'] = user.id
        req.session['plans'] = plansIds

        return JsonResponse({'url': reverse('home')})
    return render(req, 'interfaces/login.html')



# Vista pagina principal al iniciar sesión
def home(req):
    userid = req.session.get('userid')
    req.session['openPlan'] = None

    if userid is None:
        return redirect('login')

    user = User.objects.get(id=userid)
    return render(req, 'interfaces/home.html', {
        'user_names': user.names,
        'user_surnames': user.surnames,
        'navTab': 'home'
    })



def signout(req):
    req.session.flush()
    return redirect('login')



# Devuelve los planes de un usuario.
def getPlans(req):
    plansData = []

    for planId in req.session.get('plans'):
        plan = Analytical_plan.objects.get(id=planId)
        planVersion = Plan_version.objects.get(id_plan_id=planId, is_actual=True)

        plansData.append({
            "id": planId,
            'name': planVersion.description,
            'creationDate': plan.creation_date,
            'updateDate': plan.update_date
        })

    return JsonResponse({'plans': plansData})





def createPlan(req):
    userId = req.session.get('userid')
    namePlan = req.POST.get('namePlan')
    content = json.dumps({})
    code = str(uuid.uuid4())

    plan = Analytical_plan(
        code = code,
        update_date = getDate(),
        creation_date = getDate(),
        id_user_id = userId
    )
    plan.save()

    planIds = req.session.get('plans')
    planIds.append(plan.id)
    req.session['plans'] = planIds

    version = Plan_version(
        description = namePlan,
        content = content,
        creation_date = getDate(),
        is_actual = True,
        id_plan_id = plan.id
    )
    version.save()

    req.session['openPlan'] = plan.id
    return redirect('editPlan')




def editPlan(req):
    userId = req.session.get('userid')
    openPlan = req.session.get('openPlan')
    if userId is None:
        return redirect('login')
    
    if openPlan is None:
        return redirect('home')

    user = User.objects.get(id=userId)
    return render(req, 'interfaces/editPlan.html', {
        'idPlan': req.session.get('openPlan'),
        'user_names': user.names,
        'user_surnames': user.surnames
    })




def getDataPlan(req):
    try:
        versions = Plan_version.objects.filter(id_plan_id=req.session.get('openPlan'))
        versions = list(versions.values())
        careers = list(Career.objects.all().values())
        levels = list(Level.objects.all().values())
        subjects = list(Subject.objects.all().values())

        return JsonResponse({
            'versions': versions,
            'careers': careers,
            'levels': levels,
            'subjects': subjects
        })
    
    except:
        return JsonResponse({'error': "No se obtuvieron las versiones"})









def deletePlan(req, idPlan):
    try:
        plan = Analytical_plan.objects.get(id=idPlan)
        plan.delete()

        planIds = req.session.get('plans')
        planIds.remove(idPlan)
        req.session['plans'] = planIds

        return JsonResponse({'delete': True})
    except:
        return JsonResponse({'delete': False})




def openPlan(req, idPlan):
    userId = req.session.get('userid')
    if userId is None:
        return redirect('login')

    req.session['openPlan'] = idPlan
    return JsonResponse({'url': reverse('editPlan')})




def saveVersion(req):
    try:
        dataVersion = json.loads(req.body)

        versionActual = Plan_version.objects.get(id=dataVersion['id'])
        versionActual.is_actual = False
        versionActual.save()

        newVersion = Plan_version(
            description=dataVersion['description'],
            content=dataVersion['content'],
            creation_date=getDate(),
            is_actual=True,
            id_plan_id=dataVersion['idPlan']
        )
        newVersion.save()

        version = Plan_version.objects.filter(is_actual=True, id_plan_id=dataVersion['idPlan']).values()

        plan = Analytical_plan.objects.get(id=dataVersion['idPlan'])
        plan.update_date = getDate()
        plan.save()
        return JsonResponse({'status': True, 'version': version[0]})

    except:
        return JsonResponse({'status': False})




def tasks(req):
    id_user = req.session.get('userid')
    if id_user is None:
        return redirect('login')

    return render(req, 'interfaces/tasks.html', {
        'navTab': "tasks",
        'user_names': req.session.get('userNames'),
        'user_surnames': req.session.get('userSurnames'),
    })





def pdf(req, idPlan):

    # try:
        plan = Analytical_plan.objects.get(id=idPlan)
        planVersion = Plan_version.objects.get(id_plan_id=idPlan, is_actual=True)

        code = plan.code
        data = json.loads(planVersion.content)

        if len(data) == 0:
            template = get_template('interfaces/pdf.html')
            html = template.render({'code': code})
        else:
            template = get_template('interfaces/pdf.html')
            html = template.render({
                'code': code,
                'field': data['fields'],
                'drop': data['dropdowns']
            })


        options = {
            'page-size': 'Letter',
            'margin-top': '0.20in',
            'margin-right': '0.20in',
            'margin-bottom': '0.20in',
            'margin-left': '0.20in',
        }

        sistema_operativo = platform.system()
        ruta = ''

        if sistema_operativo == "Linux":
            ruta = 'systemAnalyticalPlans/src/wkhtmltox_0.12.6.1-2.jammy_amd64.deb'
        elif sistema_operativo == "Windows":
            ruta = 'systemAnalyticalPlans/src/wkhtmltopdf/bin/wkhtmltopdf.exe'
        else:
            print("Estás ejecutando en un sistema operativo diferente.")


        config = pdfkit.configuration(wkhtmltopdf=join(settings.BASE_DIR, ruta))
        pdf_file = pdfkit.from_string(html, False, options=options, configuration=config)
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="{0}.pdf"'.format('Plan analitico')

        return response
    # except:
    #     return HttpResponse('none')





def sendEmail(req):
    if req.method == 'POST':
        email = json.loads(req.body)['email']
        user = User.objects.filter(email=email)

        if not user:
            return JsonResponse({'emailError': "Dirección de correo no registrado."})
        else: user = user[0]

        try:
            email = EmailMessage(
                "Recuperación de Credenciales",
                f"Tus Credenciales\n\nUsername: {user.username}\nPassword: {user.password}",
                settings.EMAIL_HOST_USER,
                [user.email]
            )
            email.send()

            return JsonResponse({
                'mailSuccessfully': f"Se ha enviado un correo a {user.email} con las credenciales recuperadas."
            })
        except:
            return JsonResponse({
                'networkError': "Funcionalidad no disponible"
            })