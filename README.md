# Social Network Platform

A Django-based social networking platform centered on niche community discovery, enabling users to find, join, and engage with groups of shared interest within a larger public ecosystem.

## 🚀 Features

- **User Authentication**: JWT-based authentication with email signup/login
- **User Profiles**: Customizable profiles with bio, profile picture, website, and location
- **Posts & Comments**: Create posts and nested comments with replies
- **Post Likes**: Like/unlike posts
- **Community Discovery**: Discover and engage with niche communities
- **RESTful API**: Full REST API backend with Django Rest Framework
- **Modern Frontend**: React + Vite frontend with responsive design

## 🏗️ Architecture

### Backend
- **Framework**: Django 6.0.5
- **API**: Django Rest Framework 3.17.1
- **Authentication**: djangorestframework-simplejwt, django-allauth
- **Database**: PostgreSQL 17.10
- **Image Processing**: django-imagekit
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React with Vite
- **UI Components**: shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds

## 📋 Prerequisites

- Python 3.x
- Node.js & npm
- Docker & Docker Compose (for PostgreSQL)
- Git

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-network
```

### 2. Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5433.

### 3. Backend Setup

#### Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install dependencies:

```bash
pip install -r requirements.txt
```

#### Configure environment variables:

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# SMTP settings for production email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-password

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173

# Database settings
POSTGRES_DB=social_network
POSTGRES_USER=social_network_user
POSTGRES_PASSWORD=testpostgress
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
```

#### Run migrations:

```bash
python manage.py migrate
```

#### Create a superuser (optional):

```bash
python manage.py createsuperuser
```

#### Start the backend server:

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### 4. Frontend Setup

#### Navigate to the frontend directory:

```bash
cd frontend
```

#### Install dependencies:

```bash
npm install
```

#### Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
social-network/
├── core/                   # Main Django app
│   ├── models.py          # Data models (User, Profile, Post, Comment, etc.)
│   ├── views/             # API views
│   ├── serializers/       # DRF serializers
│   ├── services/          # Business logic services
│   └── tests/             # Test suite
├── social_network/        # Django project settings
│   ├── settings.py        # Configuration
│   ├── urls.py            # Root URL configuration
│   └── wsgi.py           # WSGI application
├── frontend/              # React frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
├── docs/                  # Documentation
├── media/                 # Uploaded media files
├── docker-compose.yml     # Docker services configuration
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
└── seed_data.py          # Data seeding script
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `POST /api/auth/token/refresh/` - Refresh access token

### Users
- `GET /api/users/me/` - Get current user profile
- `PUT /api/users/me/` - Update current user profile

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get post details
- `PUT /api/posts/{id}/` - Update post
- `DELETE /api/posts/{id}/` - Delete post
- `POST /api/posts/{id}/like/` - Like a post
- `POST /api/posts/{id}/unlike/` - Unlike a post

### Comments
- `GET /api/posts/{post_id}/comments/` - List comments for a post
- `POST /api/posts/{post_id}/comments/` - Add comment to post
- `DELETE /api/comments/{id}/` - Delete comment

## 🧪 Testing

### Backend Tests

```bash
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🐳 Docker

Run the entire stack with Docker (if configured):

```bash
docker-compose up --build
```

## 📝 Development

### Running Migrations

After making model changes:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Seed Database

Populate the database with sample data:

```bash
python seed_data.py
```

### Code Formatting

Ensure code follows project standards before committing.

## 🎯 Design Principles

- **Discovery-Driven**: The interface intuitively guides users toward new, relevant communities and content
- **Community-Centric**: Design emphasizes group identity and shared interest over individual-only feeds
- **Seamless Consumption**: Content consumption is fluid, low-friction, and highly engaging

## 📄 License

[Add your license information here]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.
