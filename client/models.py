from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from django.conf import settings



# Create your models here.



class Utilisateur(AbstractUser): # creation de la classe Utilisateur

    #les choix pour les champs nécessitant un choix
    ETAT_COMPTE_CHOICES = [
        ('A', 'Active'),
        ('D', 'Desactive'),

    ]

    PRIVILEGE_UTILISATEUR_CHOICES = [
        ('AD', 'Administrateur'),
        ('CL', 'Client'),
        ('VD', 'Vendeur')       
    ]



    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    adresse = models.CharField(max_length=100)
    numero_tel = models.TextField(max_length=20)
    etatCompte = models.CharField(max_length=100, choices=ETAT_COMPTE_CHOICES)
    DateCreation = models.DateTimeField(default=datetime.now())
    privilege = models.CharField(max_length=100, choices=PRIVILEGE_UTILISATEUR_CHOICES)
    derniere_modification = models.CharField(max_length=100, null=True)
    heure_derniere_modification = models.DateTimeField(null=True)

   

    #configurons les constantes pour nos utilisateurs

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username", "password", "etatCompte", "privilege", "numero_tel"]


    
    
class Product(models.Model):

    BADGE_CHOICES = [
        ('new', 'New'),
        ('hot', 'Hot'),
        ('sale', 'Sale'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')
    category = models.CharField(max_length=100)

    # VENDEUR = UTILISATEUR privilege VD
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
        limit_choices_to={"privilege": "VD"}
    )

    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    badge = models.CharField(max_length=10, choices=BADGE_CHOICES, blank=True, null=True)

    rating = models.FloatField(default=0)
    rating_count = models.PositiveIntegerField(default=0)

    stock = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def discount_percent(self):
        if self.old_price:
            return round(100 - (self.price * 100 / self.old_price))
        return 0

    def __str__(self):
        return self.title