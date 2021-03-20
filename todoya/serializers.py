from .models import (
    Action, Board,
    CheckItem,
    CheckList,
    Label,
    Priority,
    PriorityList,
    Reminder,
    Task,
    Category,
    Project,
)
from rest_framework import serializers


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = "__all__"


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = "__all__"


class CheckItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckItem
        fields = ["id", "title", "checked", "list"]


class CheckListSerializer(serializers.ModelSerializer):
    items = CheckItemSerializer(many=True, read_only=True)

    class Meta:
        model = CheckList
        fields = ["id", "title", "items", "task"]


class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = "__all__"


class PriorityListSerializer(serializers.ModelSerializer):
    items = PrioritySerializer(many=True, read_only=True)

    class Meta:
        model = PriorityList
        fields = ["id", "title", "items", "project", "default"]


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = "__all__"