"""
URL configuration for social_network project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path , include ,re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('',include('core.urls')),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
    

]
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4NjAxNjk0MSwiaWF0IjoxNzg1NDEyMTQxLCJqdGkiOiIyOGIyNDdiYzk2ZmM0YTliODMwNzAyYWEzZDEwMWY1MyIsInVzZXJfaWQiOiIxMSJ9.gdWubYVxnV0sIMRWhAxkaN_YfZGOJjn3QUsfNRKuWII
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg1NDEzMDQxLCJpYXQiOjE3ODU0MTIxNDMsImp0aSI6ImQwNDAwYzZiODE2NjRmMWQ4MzEwNzk2ZDg1MDM3MTE0IiwidXNlcl9pZCI6IjExIn0.TufybFSOUOTrYYyemawk1x4WLA4Ck_xcYc1Ua6PQf3w