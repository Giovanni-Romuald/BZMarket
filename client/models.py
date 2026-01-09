from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


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
    
