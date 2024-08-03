For creating Django project:
**Step 1:** Create EC2 instance

**Step 2:** install
Go to django official page --> Get started with Django
Install python and install django using PIP

Verify:
import django
print(django.get_version())

**Step 3:** Install django admin:
django-admin startproject <project_name> (django-admin is similar to Ansible galaxy)
django-admin startproject devops
It created skeleton of the project 'devops'

I. django admin created Configuration of entire project: devops --> devops --> settings.py 
It has the followings
a. What are the IPs you can whitelist
b. What is the database you are going to connect
c. If you have any secret keys
d. If you have any secure information
e. If you want to use any django middleware
f. If you want to support any template
g. Any web server interface gateways

II. devops --> devops --> urls.py
Responsible to serving the content: if has /demo folder
http://<IP>:<port>/demo

**Step 4:** To create application
python manage.py startapp <App name>
python manage.py startapp demo

I. It created demo folder and all application files under it except templates
II. Write python code under: devops --> demo --> views.py 
   In this python code it excuted against rendering the template using devops --> demo --> templates --> demo_site.html

from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return render(request, 'demo_site.html')

-----------------------------------------------------------------------------------------------------------

In **Real-time project**s, it will have 
a. More packages
b. May change the entry point, cmd in etc in dockerfile.
