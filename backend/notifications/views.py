from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404



# get, update read status, delete
class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, notification_id):
        notification = get_object_or_404(Notification, pk=notification_id, recipient=request.user)
        notification.is_read = True
        notification.save()

        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
    
    def delete(self, request, notification_id):
        notification = get_object_or_404(Notification, pk=notification_id, recipient=request.user)
        notification.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



# list
class ListNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        queryset = Notification.objects.filter(recipient=self.request.user)

        read_status = self.request.query_params.get('is_read')
        if read_status == 'true':
            queryset = queryset.filter(is_read = True)
        elif read_status == 'false':
            queryset = queryset.filter(is_read = False)

        return queryset
    
    def delete(self, request, *args, **kwargs):
        # delete all notifications for the user
        Notification.objects.filter(recipient=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  
          


# return if unread exists
class CheckUnreadNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Check if there are any unread notifications for the authenticated user
        has_unread_notifications = Notification.objects.filter(recipient=request.user, is_read=False).exists()

        # Return the boolean result
        return Response({"has_unread_notifications": has_unread_notifications})