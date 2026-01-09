from django.shortcuts import get_object_or_404, render,redirect
from django.contrib import messages

from client.models import Utilisateur
from django.utils import timezone
from datetime import datetime
from django.contrib.auth import authenticate, login, logout



# Create your views here.


def home(request):
    return render(request, 'visite/index.html')

def register(request):
    if request.method == "POST":

        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        numero_tel = request.POST.get("numero_tel")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect("register")

        if Utilisateur.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return redirect("register")

        user = Utilisateur.objects.create_user(
            email=email,
            username=f"{first_name} {last_name}",
            password=password,
            numero_tel=numero_tel,
            etatCompte="A",
            privilege="CL",
            DateCreation=timezone.now()
        )

        messages.success(request, "Account successfully created")
        return redirect("login")

    return render(request, "pageAuth/register.html")



def login_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        remember = request.POST.get('remember')

        user = authenticate(request, username=email, password=password)

        if user is None:
            messages.error(request, "Invalid email or password.")
            return render(request, "pageAuth/login.html")

        if user.etatCompte != "A":
            messages.error(request, "Your account is disabled.")
            return render(request, "pageAuth/login.html")

        login(request, user)

        request.session["username"] = user.username
        request.session["email"] = user.email
        request.session["privilege"] = user.privilege

        # Gestion session
        request.session.set_expiry(1209600 if remember else 0)

        # Redirection
        return redirect({
            "AD": "pageAdmin",
            "CL": "pageSuperAdmin",
            "VD": "pageVendeur"
        }.get(user.privilege, "login"))

    return render(request, "pageAuth/login.html")


def logout_user(request):
    logout(request)
    return redirect("login")


def shopping(request):
    return render(request, 'services/shopping.html')