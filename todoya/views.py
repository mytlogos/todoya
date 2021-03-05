from . import models, serializers
from rest_framework import viewsets


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer


class BoardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.Board.objects.all()
    serializer_class = serializers.BoardSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer


class LabelViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.Label.objects.all()
    serializer_class = serializers.LabelSerializer


class ReminderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = models.Reminder.objects.all()
    serializer_class = serializers.ReminderSerializer
