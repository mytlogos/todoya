from django.db import models

class Project(models.Model):
    title: models.TextField()
    parent: models.ForeignKey("Project", null=True, on_delete=models.CASCADE)

class Board(models.Model):
    title: models.TextField()
    project: models.ForeignKey(Project, on_delete=models.CASCADE)

class Task(models.Model):
    title: models.TextField()
    start: models.DateTimeField()
    due: models.DateTimeField()
    status: models.FloatField(default=0)
    completion_date: models.DateTimeField()
    location: models.TextField()
    description: models.TextField()
    board: models.ForeignKey(Board, on_delete=models.CASCADE)
    project: models.ForeignKey(Project, on_delete=models.CASCADE)

class Category(models.Model):
    title: models.TextField()
    tasks: models.ManyToManyField(Task)
