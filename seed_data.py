import random

from faker import Faker

from django.apps import apps
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from django.db import models


fake = Faker()


class Command(BaseCommand):

    help = "Generate dynamic test database data"


    def add_arguments(self, parser):

        parser.add_argument(
            "--count",
            type=int,
            default=10,
            help="Number of objects per model"
        )



    def handle(self,*args,**options):

        count = options["count"]


        self.stdout.write(
            "Creating test data..."
        )


        self.create_users(count)


        for model in apps.get_models():

            if model._meta.abstract:
                continue


            if model._meta.proxy:
                continue


            if model in [
                get_user_model()
            ]:
                continue


            self.create_model_objects(
                model,
                count
            )


        self.stdout.write(
            self.style.SUCCESS(
                "Database seeded successfully"
            )
        )



    def create_users(self,count):

        User=get_user_model()


        for i in range(count):

            username=fake.user_name()

            if User.objects.filter(
                username=username
            ).exists():

                continue


            User.objects.create_user(

                username=username,

                email=fake.email(),

                password="TestPassword123"

            )


        self.stdout.write(
            "Users created"
        )



    def create_model_objects(
            self,
            model,
            count
    ):


        for _ in range(count):

            data={}


            for field in model._meta.fields:


                if field.primary_key:
                    continue


                if field.auto_created:
                    continue


                value=self.generate_value(
                    field
                )


                if value is not None:

                    data[field.name]=value



            try:

                model.objects.create(
                    **data
                )


            except Exception:

                # Some models require special handling
                pass



    def generate_value(self,field):


        if field.null:

            if random.choice(
                [True,False]
            ):
                return None



        if isinstance(
            field,
            models.CharField
        ):

            return fake.text(
                max_nb_chars=
                min(field.max_length or 50,50)
            )


        if isinstance(
            field,
            models.TextField
        ):

            return fake.paragraph()



        if isinstance(
            field,
            models.BooleanField
        ):

            return random.choice(
                [True,False]
            )


        if isinstance(
            field,
            models.IntegerField
        ):

            return random.randint(
                0,
                100
            )


        if isinstance(
            field,
            models.FloatField
        ):

            return random.random()*100



        if isinstance(
            field,
            models.DateField
        ):

            return fake.date()



        if isinstance(
            field,
            models.DateTimeField
        ):

            return fake.date_time()



        if isinstance(
            field,
            models.ForeignKey
        ):

            related_model=field.related_model


            obj=related_model.objects.order_by("?").first()


            return obj



        return None