import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render,redirect
from django.contrib import messages

from client.models import Cart, CartItem, Product, Utilisateur
from django.utils import timezone
from datetime import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required




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
            "CL": "shopping",
            "VD": "vendeur_dashboard"
        }.get(user.privilege, "login"))

    return render(request, "pageAuth/login.html")

@login_required(login_url='login')
def logout_user(request):
    logout(request)
    return redirect("home")

def shopping(request):
    products = Product.objects.all()
    product_nbre = Product.objects.count()

    context = {
        'products': products,
        'nbre_products': product_nbre
    }
    return render(request, 'services/shopping.html', context)


def register_seller(request):

    if request.method == "POST":

        first_name = request.POST.get("first_name")
        last_name  = request.POST.get("last_name")
        gender     = request.POST.get("gender")
        email      = request.POST.get("email")
        phone      = request.POST.get("phone_number")
        company    = request.POST.get("company_name")
        store_name = request.POST.get("store_name")
        password   = request.POST.get("password")
        confirm    = request.POST.get("confirm_password")
        newsletter = True if request.POST.get("newsletter") else False

        # ===================== VALIDATIONS =====================

        if password != confirm:
            messages.error(request, "Passwords do not match.")
            return redirect("register_seller")

        if Utilisateur.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return redirect("register_seller")

        # ===================== CREATION USER =====================

        user = Utilisateur.objects.create_user(
            username = f"{first_name}_{last_name}",
            email = email,
            password = password,
            first_name = first_name,
            last_name = last_name,
            numero_tel = phone,
            etatCompte = "A",
            privilege = "VD",
            derniere_modification = datetime.now().strftime("%Y-%m-%d"),
            heure_derniere_modification = timezone.now()
        )



        user.save()

        messages.success(request, "Seller account created successfully.")
        return redirect("login")

    return render(request, "pageAuth/registerSeller.html")

@login_required(login_url='login')
def gerer_profil(request):
    user = request.user  # utilisateur connecté

    if request.method == "POST":
        # Récupération des champs du formulaire
        user.first_name = request.POST.get("first_name", user.first_name)
        user.last_name = request.POST.get("last_name", user.last_name)
        user.email = request.POST.get("email", user.email)
        user.adresse = request.POST.get("adresse", user.adresse)
        user.numero_tel = request.POST.get("numero_tel", user.numero_tel)

        # Changement du mot de passe si les champs sont remplis
        current_password = request.POST.get("current_password")
        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")

        if current_password or new_password or confirm_password:
            if not check_password(current_password, user.password):
                messages.error(request, "Le mot de passe actuel est incorrect.")
                return redirect("gerer_profil")
            if new_password != confirm_password:
                messages.error(request, "Les nouveaux mots de passe ne correspondent pas.")
                return redirect("gerer_profil")
            if new_password:
                user.set_password(new_password)
                update_session_auth_hash(request, user)  # Garde l'utilisateur connecté

        # Mise à jour des timestamps
        user.derniere_modification = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        user.heure_derniere_modification = timezone.now()
        user.save()

        messages.success(request, "Profil mis à jour avec succès !")
        return redirect("gerer_profil")

    # GET : afficher le formulaire avec les valeurs actuelles
    return render(request, "services/gererProfil.html", {"user": user})

@login_required(login_url='login')
def dashboard(request):
    return render(request, 'services/dashboard_client.html')



def get_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart

@login_required(login_url='login')
def add_to_cart(request, slug):
    product = get_object_or_404(Product, slug=slug)
    cart = get_cart(request.user)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        item.quantity += 1
    item.save()

    return redirect("shopping")

@login_required(login_url='login')
def cart_detail(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return render(request, "services/panier.html", {"cart": cart})


def remove_from_cart(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id, cart__user=request.user)
        item.delete()

        # Calcul du total après suppression
        cart_total = sum(i.subtotal() for i in item.cart.items.all())

        return JsonResponse({
            "success": True,
            "cart_total": cart_total
        })
    except CartItem.DoesNotExist:
        return JsonResponse({"success": False, "error": "Item not found"}, status=404)

@login_required(login_url='login')
def update_cart_item(request, item_id):
    try:
        data = json.loads(request.body)
        quantity = int(data.get("quantity", 1))

        item = CartItem.objects.select_related("product","cart").get(
            id=item_id, cart__user=request.user
        )

        # Sécurité stock
        if quantity < 1:
            quantity = 1
        if quantity > item.product.stock:
            quantity = item.product.stock

        item.quantity = quantity
        item.save()

        cart = item.cart

        return JsonResponse({
            "success": True,
            "subtotal": float(item.subtotal()),
            "cart_total": float(cart.total())
        })

    except Exception:
        return JsonResponse({"success": False}, status=400)