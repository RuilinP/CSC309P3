from django.shortcuts import get_object_or_404

# views.py
from rest_framework import generics
from .models import Pet
from .serializers import PetSerializer
from .filters import PetFilter
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated,SAFE_METHODS
from .permissions import IsShelterUser
from rest_framework.response import Response
from django.db.models import Case, When
from django.db import models
from accounts.models import Seeker, Shelter
from notifications.signals import create_notification_for_user
from django.core.paginator import Paginator
from rest_framework.views import APIView


class PetsInShelterView(APIView):
    permission_classes = [IsAuthenticated, IsShelterUser]

    def get(self, request, shelter_id):
        get_object_or_404(Shelter, pk=shelter_id)

        pets = Pet.objects.filter(shelter=shelter_id)
        paginator = Paginator(pets, 10)
        page_number = request.query_params.get('page')
        page_obj = paginator.get_page(page_number)

        pet_list = list(page_obj.object_list.values())

        return Response({
            'pets': pet_list,
            'page': page_obj.number,
            'total_pages': paginator.num_pages
        })


class PetCreateView(generics.CreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer


    permission_classes = [IsAuthenticated, IsShelterUser]

    def perform_create(self, serializer):
        pet = serializer.save(shelter=self.request.user.id)

        # logic to create notif for seekers who has the preference for the pet's specie
        all_seekers = Seeker.objects.all()
        matching_seekers = []

        # Iterate through seekers and check their preferences
        for seeker in all_seekers:
            # Fetch preferences for each seeker
            seeker_preferences = seeker.preferences.all() 

            # Check if any of the preferences match the pet's species
            for preference in seeker_preferences:
                if preference.preference.lower() == pet.specie.lower():
                    matching_seekers.append(seeker)
                    break

        for seeker in matching_seekers:
            create_notification_for_user(seeker, pet, "Hello there! A furry friend who matches your preferences has just arrived. Hurry and check them out at ")
            


class PetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        else:
            return [IsAuthenticated(), IsShelterUser()]
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Save the shelter as the authenticated user's ID
        serializer.validated_data['shelter'] = request.user.id
        self.perform_update(serializer)
        return Response(serializer.data)
        
    




class PetListSearch(generics.ListAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    filter_backends = []
    filterset_class = PetFilter

    def get_queryset(self):
        sort = self.request.query_params.get('sort', 'id')
        

        name = self.request.query_params.get('name')
        shelter_param = self.request.query_params.get('shelter')
        status_param = self.request.query_params.get('status')
        gender_param = self.request.query_params.get('gender')
        specie_param = self.request.query_params.get('specie')
        breed_param = self.request.query_params.get('breed')
        age_param = self.request.query_params.get('age')
        size_param = self.request.query_params.get('size')
        queryset = Pet.objects.all()
        if sort == 'age':
            age_ordering = Case(
                When(age='Baby', then=0),
                When(age='Young', then=1),
                When(age='Adult', then=2),
                When(age='Senior', then=3),
                default=4,  # Any other value should come after the defined ones
                output_field=models.IntegerField(),
            )
            queryset = queryset.order_by(age_ordering)
        elif sort == 'size':
            size_ordering = Case(
                When(size='Small', then=0),
                When(size='Medium', then=1),
                When(size='Large', then=2),
                default=3,  # Any other value should come after the defined ones
                output_field=models.IntegerField(),
            )
            queryset = queryset.order_by(size_ordering)
        else:
            queryset = Pet.objects.all().order_by(sort)
        # queryset = Pet.objects.all().order_by(sort)
        if not status_param:
            status_param = 'Available'  
            queryset = queryset.filter(status=status_param)
        else:
            statuses = status_param.split(',')
            query_filter = Q()
            for status in statuses:
                query_filter |= Q(status=status)
            queryset = queryset.filter(query_filter)
            

        

        if name:
            queryset = queryset.filter(name__icontains=name)
        if shelter_param:
            shelters = shelter_param.split(',')
            query_filter = Q()
            for shelter in shelters:
                query_filter |= Q(shelter=shelter)
            queryset = queryset.filter(query_filter)
        if age_param:
            ages = age_param.split(',')
            query_filter = Q()
            for age in ages:
                query_filter |= Q(age=age)
            queryset = queryset.filter(query_filter)
        if specie_param:
            species = specie_param.split(',')
            query_filter = Q()
            for specie in species:
                query_filter |= Q(specie=specie)
            queryset = queryset.filter(query_filter)
        if breed_param:
            breeds = breed_param.split(',')
            query_filter = Q()
            for breed in breeds:
                query_filter |= Q(breed__icontains=breed)
            queryset = queryset.filter(query_filter)

        if gender_param:
            genders = gender_param.split(',')
            query_filter = Q()
            for gender in genders:
                query_filter |= Q(gender=gender)
            queryset = queryset.filter(query_filter)
            
        if size_param:
            sizes = size_param.split(',')
            query_filter = Q()
            for size in sizes:
                query_filter |= Q(size=size)  # Change 'size' to match your Pet model's field name for size
            queryset = queryset.filter(query_filter)
        return queryset