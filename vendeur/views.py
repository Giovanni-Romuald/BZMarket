from django.shortcuts import get_object_or_404, redirect, render
from django.utils.text import slugify
from client.models import Product
from django.contrib import messages

# Create your views here.

def vendeur_dashboard(request):
    products = Product.objects.filter(seller=request.user).order_by('-created_at')
    active_products_count = Product.objects.filter(is_active=True).count()

    # Exemple pour la tendance (différence par rapport au mois précédent)
    # Ici juste un exemple simple basé sur la date de création
    from django.utils import timezone
    from datetime import timedelta

    today = timezone.now()
    last_month = today - timedelta(days=30)

    # Produits créés le mois précédent
    last_month_count = Product.objects.filter(is_active=True, created_at__lt=today, created_at__gte=last_month).count()

    # Calcul de la différence
    trend = active_products_count - last_month_count
    context = {
        'products': products,
        'active_products_count': active_products_count,
        'trend': trend
    }

    return render(request, 'vendeur/pageVendeur.html',context)


def add_product(request):

    # Sécurité : seuls les vendeurs
    if request.user.privilege != "VD":
        messages.error(request, "Access denied.")
        return redirect("login")

    if request.method == "POST":

        title       = request.POST.get("title")
        category = request.POST.get("category")
        price       = request.POST.get("price")
        old_price   = request.POST.get("old_price")
        stock       = request.POST.get("stock", 1)
        badge       = request.POST.get("badge")
        description = request.POST.get("description")
        image       = request.FILES.get("image")

        # Sécurité
        if not title or not category or not price or not image:
            messages.error(request, "Please fill all required fields.")
            return redirect("vendeur_dashboard")

        Product.objects.create(
            title = title,
            slug = slugify(title),
            category= category,
            price = price,
            old_price = old_price if old_price else None,
            stock = stock,
            badge = badge if badge else None,
            description = description,
            image = image,
            seller = request.user
        )

        messages.success(request, "Product added successfully.")
        return redirect("vendeur_dashboard")
    



def edit_product(request, pk):
    # On récupère le produit en vérifiant que c'est bien le vendeur connecté
    product = get_object_or_404(Product, pk=pk, seller=request.user)

    if request.method == "POST":
        # Récupération des champs du formulaire
        title = request.POST.get('title')
        category = request.POST.get('category')
        price = request.POST.get('price')
        old_price = request.POST.get('old_price') or None
        stock = request.POST.get('stock')
        badge = request.POST.get('badge') or None
        description = request.POST.get('description')
        image = request.FILES.get('image')  # Si une nouvelle image est uploadée

        # Mise à jour des champs
        product.title = title
        product.category = category
        product.price = price
        product.old_price = old_price
        product.stock = stock
        product.badge = badge
        product.description = description

        if image:
            product.image = image

        product.save()
        messages.success(request, "Product updated successfully!")
        return redirect('vendeur_dashboard')  # Redirection vers la liste des produits

    context = {
        'product': product,
    }
    return render(request, 'vendeur/edit_product.html', context)


def delete_product(request, pk):
    # Récupère le produit et vérifie que le vendeur connecté est bien le propriétaire
    product = get_object_or_404(Product, pk=pk, seller=request.user)

    product.delete()
    messages.success(request, "Product deleted successfully!")
    return redirect('vendeur_dashboard')  # Redirection vers la liste des produits

    # Si ce n'est pas POST, afficher une confirmation

