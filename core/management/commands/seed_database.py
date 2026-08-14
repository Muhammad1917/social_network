from django.core.management.base import BaseCommand
from faker import Faker
import random 
from core.models import User , Post , Comment
fake = Faker()
from django.db import transaction

@transaction.atomic
class Command(BaseCommand):
    help = "Generate development data"
    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=10,
            help="Number of users to create"
        )

        parser.add_argument(
            "--posts",
            type=int,
            default=50,
            help="Number of posts to create"
        )

        parser.add_argument(
            "--comments",
            type=int,
            default=100,
            help="Number of comments to create"
        )

    def handle(self, *args, **options):
        self.stdout.write("Creating fake data...")
        self.create_users(options["users"])
        self.create_posts(options["posts"])
        self.create_comments(options["comments"]) 
        print(users)
        print(posts)
        print(comments)

    def create_users(self ,count) :
        for i in range(count):
            User.objects.create_user(
                username=fake.user_name(),
                email=fake.email(),
                password="password123"
            )

    def create_posts(self , count) :
        
        users = list(User.objects.all())

        for _ in range(count):

            Post.objects.create(
                author=random.choice(users),
                content=fake.paragraph(nb_sentences=5)
            )
    def create_comments(self , count) :
        posts = list(Post.objects.all())

        for _ in range(count):

            Comment.objects.create(
                author=random.choice(users),
                post=random.choice(posts),
                content=fake.sentence()
            )