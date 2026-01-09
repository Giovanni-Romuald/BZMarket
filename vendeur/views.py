from django.shortcuts import render

# Create your views here.

def vendeur_dashboard(request):
    return render(request, 'vendeur/pageVendeur.html')
