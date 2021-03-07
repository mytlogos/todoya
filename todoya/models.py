from django.db import models


class Project(models.Model):
    title = models.TextField()
    parent = models.ForeignKey("Project", null=True, on_delete=models.CASCADE)


class Board(models.Model):
    title = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class Category(models.Model):
    title = models.TextField()


class Label(models.Model):
    title = models.TextField()
    color = models.TextField()


class Task(models.Model):
    title = models.TextField()
    start = models.DateTimeField(null=True)
    due = models.DateTimeField(null=True)
    status = models.FloatField(default=0)
    completion_date = models.DateTimeField(null=True)
    location = models.TextField(blank=True)
    description = models.TextField(blank=True)
    board = models.ForeignKey(Board, null=True, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    parent_task = models.ForeignKey("Task", null=True, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category, blank=True)
    labels = models.ManyToManyField(Label, blank=True)


class Reminder(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    when = models.DateTimeField()
