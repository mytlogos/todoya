from django.db import models


class Project(models.Model):
    title = models.TextField()
    parent = models.ForeignKey("Project", null=True, on_delete=models.CASCADE)


class Board(models.Model):
    title = models.TextField()
    position = models.IntegerField(default=0)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class Category(models.Model):
    title = models.TextField()


class Label(models.Model):
    title = models.TextField()
    color = models.TextField()


class Priority(models.Model):
    title = models.TextField()
    value = models.IntegerField()


class PriorityList(models.Model):
    title = models.TextField()
    items = models.ManyToManyField(Priority)
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    default = models.ForeignKey(Priority, related_name="+", on_delete=models.RESTRICT)


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
    priority = models.ForeignKey(Priority, on_delete=models.RESTRICT)


class CheckList(models.Model):
    title = models.TextField()
    task = models.ForeignKey(Task, on_delete=models.CASCADE)


class CheckItem(models.Model):
    title = models.TextField()
    checked = models.BooleanField()
    list = models.ForeignKey(CheckList, related_name="items", on_delete=models.CASCADE)


class Reminder(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    when = models.DateTimeField()


class Action(models.Model):
    condition = models.TextField()
    action = models.TextField()
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
