from django.db import models

class Library(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    price=models.IntegerField()
    image=models.ImageField(upload_to='images/',null=True,blank=True)

    def __str__(self):
        return self.name
