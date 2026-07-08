# Frontend Architecture & Scenario Diagrams

## 1. Component Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Application"
        App[App.jsx<br/>Main Router]
        
        subgraph "UI Components Layer"
            Button[Button.tsx<br/>Reusable Button]
            Input[Input.jsx<br/>Text Input Field]
            Label[Label.jsx<br/>Form Labels]
            Card[Card.jsx<br/>Card Container]
        end
        
        subgraph "Feature Pages Layer"
            HomePage[HomePage<br/>Dashboard]
            LoginPage[LoginPage.jsx<br/>Login Form]
            RegisterPage[RegisterPage.jsx<br/>Registration Form]
            ForgotPasswordPage[ForgotPasswordPage.jsx<br/>Password Reset Request]
            ResetPasswordPage[ResetPasswordPage.jsx<br/>New Password Set]
            VerifyEmailPage[VerifyEmailPage.jsx<br/>Email Verification]
        end
        
        subgraph "Hooks Layer"
            useAuth[useAuth.jsx<br/>Authentication Context]
        end
        
        subgraph "API Layer"
            ApiClient[client.js<br/>HTTP Client]
        end
        
        subgraph "Utilities"
            Utils[utils.ts/utils.js<br/>Helper Functions]
        end
    end
    
    subgraph "External Services"
        Backend[Backend API<br/>http://localhost:8000/api]
        LocalStorage[(Local Storage<br/>Tokens & User Data)]
    end
    
    %% App routing connections
    App --> HomePage
    App --> LoginPage
    App --> RegisterPage
    App --> ForgotPasswordPage
    App --> ResetPasswordPage
    App --> VerifyEmailPage
    
    %% Pages use UI components
    LoginPage --> Button
    LoginPage --> Input
    LoginPage --> Label
    LoginPage --> Card
    
    RegisterPage --> Button
    RegisterPage --> Input
    RegisterPage --> Label
    RegisterPage --> Card
    
    HomePage --> Button
    
    %% Pages use hooks
    HomePage --> useAuth
    LoginPage --> useAuth
    RegisterPage --> useAuth
    
    %% Hooks use API
    useAuth --> ApiClient
    
    %% API uses utilities
    ApiClient --> Utils
    
    %% API connects to backend and storage
    ApiClient --> Backend
    ApiClient --> LocalStorage
    useAuth --> LocalStorage
    
    style App fill:#e1f5fe
    style useAuth fill:#fff3e0
    style ApiClient fill:#f3e5f5
    style Backend fill:#ffebee
    style LocalStorage fill:#e8f5e9
```

---

## 2. Component Hierarchy Tree

```
App.jsx (Root)
│
├── BrowserRouter
│   └── Routes
│       ├── Route "/" → HomePage
│       │   ├── AuthProvider (Context)
│       │   │   └── useAuth Hook
│       │   ├── h1 "Social Network"
│       │   ├── Conditional Rendering
│       │   │   ├── IF user logged in:
│       │   │   │   ├── p (Welcome message)
│       │   │   │   ├── p (User email)
│       │   │   │   └── Button (Logout)
│       │   │   └── ELSE:
│       │   │       ├── Link → /login
│       │   │       │   └── Button (Login)
│       │   │       └── Link → /register
│       │   │           └── Button (Register)
│       │
│       ├── Route "/login" → LoginPage
│       │   ├── Card
│       │   │   ├── CardHeader
│       │   │   │   ├── CardTitle
│       │   │   │   └── CardDescription
│       │   │   ├── CardContent
│       │   │   │   └── Form
│       │   │   │       ├── Label (Email)
│       │   │   │       ├── Input (email)
│       │   │   │       ├── Label (Password)
│       │   │   │       ├── Input (password)
│       │   │   │       ├── Link (Forgot password)
│       │   │   │       ├── Error Message (conditional)
│       │   │   │       └── Button (Submit)
│       │   │   └── CardFooter
│       │   │       └── Link → /register
│       │   └── useAuth Hook
│       │
│       ├── Route "/register" → RegisterPage
│       │   ├── Card
│       │   │   ├── CardHeader
│       │   │   ├── CardContent
│       │   │   │   └── Form
│       │   │   │       ├── Input (email)
│       │   │   │       ├── Input (username)
│       │   │   │       ├── Input (password)
│       │   │   │       ├── Input (confirmPassword)
│       │   │   │       ├── Error/Success Messages
│       │   │   │       └── Button (Submit)
│       │   │   └── CardFooter
│       │   └── useAuth Hook
│       │
│       ├── Route "/forgot-password" → ForgotPasswordPage
│       ├── Route "/reset-password" → ResetPasswordPage
│       └── Route "/verify-email" → VerifyEmailPage
│
└── ProtectedRoute (Wrapper)
    └── Redirects to /login if not authenticated
```

---

## 3. Login Request/Return Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant LP as LoginPage.jsx
    participant AH as useAuth Hook
    participant AC as API Client
    participant LS as LocalStorage
    participant BE as Backend API

    Note over U,BE: Login Flow

    U->>LP: Enter email & password
    U->>LP: Click "Login" Button
    
    activate LP
    LP->>LP: handleSubmit(e)
    LP->>LP: setError('')
    LP->>LP: setSubmitting(true)
    
    LP->>AH: login(email, password)
    activate AH
    
    AH->>AC: api.login(email, password)
    activate AC
    
    AC->>AC: Build request body:<br/>{email, password}
    AC->>AC: Headers: Content-Type: application/json
    AC->>BE: POST /api/auth/login/<br/>Body: {email, password}
    activate BE
    
    BE-->>AC: Response 200 OK<br/>{access, refresh, user}
    deactivate BE
    
    AC->>LS: localStorage.setItem('access_token', access)
    AC->>LS: localStorage.setItem('refresh_token', refresh)
    AC-->>AH: Return {access, refresh, user}
    deactivate AC
    
    AH->>LS: localStorage.setItem('user', JSON.stringify(user))
    AH->>AH: setUser(user)
    AH-->>LP: Return user data
    deactivate AH
    
    LP->>LP: navigate('/')
    LP->>LP: setSubmitting(false)
    deactivate LP
    
    Note over U,BE: Login Complete - User redirected to home
```

### Login Input Values Table

| Field | Type | Validation | Example Value |
|-------|------|------------|---------------|
| email | string | Required, valid email format | `user@example.com` |
| password | string | Required | `SecurePass123!` |

### Login Response Structure

```javascript
{
  access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refresh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: 1,
    email: "user@example.com",
    username: "john_doe"
  }
}
```

---

## 4. Registration Request/Return Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant RP as RegisterPage.jsx
    participant AH as useAuth Hook
    participant AC as API Client
    participant BE as Backend API

    Note over U,BE: Registration Flow

    U->>RP: Enter email, username, password, confirm password
    U->>RP: Click "Register" Button
    
    activate RP
    RP->>RP: handleSubmit(e)
    RP->>RP: Validate passwords match
    RP->>RP: setError('')
    RP->>RP: setSubmitting(true)
    
    RP->>AH: register(email, username, password)
    activate AH
    
    AH->>AC: api.register(email, username, password)
    activate AC
    
    AC->>AC: Build request body:<br/>{email, username, password}
    AC->>AC: Headers: Content-Type: application/json
    AC->>BE: POST /api/auth/register/<br/>Body: {email, username, password}
    activate BE
    
    BE-->>AC: Response 201 Created<br/>{message or user data}
    deactivate BE
    
    AC-->>AH: Return response data
    deactivate AC
    
    AH-->>RP: Return success
    deactivate AH
    
    RP->>RP: setSuccess('Registration successful!...')
    RP->>RP: Clear form fields
    RP->>RP: setSubmitting(false)
    deactivate RP
    
    Note over U,BE: Registration Complete - Email verification required
```

### Registration Input Values Table

| Field | Type | Validation | Example Value |
|-------|------|------------|---------------|
| email | string | Required, valid email format | `newuser@example.com` |
| username | string | Required | `john_doe` |
| password | string | Required, minLength: 8 | `SecurePass123!` |
| confirmPassword | string | Required, minLength: 8, must match password | `SecurePass123!` |

### Registration Request Body

```javascript
{
  email: "newuser@example.com",
  username: "john_doe",
  password: "SecurePass123!"
}
```

---

## 5. API Request Flow with Token Refresh

```mermaid
sequenceDiagram
    participant C as Component
    participant AH as useAuth
    participant AC as API Client
    participant LS as LocalStorage
    participant BE as Backend API

    Note over C,BE: Protected API Request with Auto Token Refresh

    C->>AC: request('/protected/endpoint')
    activate AC
    
    AC->>LS: getAccessToken()
    LS-->>AC: access_token
    
    AC->>AC: Add Authorization header:<br/>Bearer {access_token}
    AC->>BE: GET /api/protected/endpoint
    activate BE
    
    alt Token Expired (401)
        BE-->>AC: Response 401 Unauthorized
        deactivate BE
        
        AC->>AC: tryRefresh()
        AC->>LS: getRefreshToken()
        LS-->>AC: refresh_token
        
        AC->>BE: POST /api/auth/token/refresh/<br/>Body: {refresh: refresh_token}
        activate BE
        
        alt Refresh Successful
            BE-->>AC: Response 200<br/>{access, refresh}
            deactivate BE
            
            AC->>LS: setTokens(new_access, new_refresh)
            AC->>AC: Retry original request with new token
            AC->>BE: GET /api/protected/endpoint<br/>Bearer {new_access_token}
            activate BE
            BE-->>AC: Response 200 OK + Data
            deactivate BE
            BE-->>C: Return data
        else Refresh Failed
            BE-->>AC: Response 401/400
            deactivate BE
            AC->>LS: clearTokens()
            AC-->>C: Throw Error
        end
    else Token Valid
        BE-->>AC: Response 200 OK + Data
        deactivate BE
        AC-->>C: Return data
    end
    
    deactivate AC
```

---

## 6. State Management Flow (AuthProvider)

```mermaid
stateDiagram-v2
    [*] --> Initializing: App Mounts
    
    state Initializing {
        [*] --> CheckLocalStorage
        CheckLocalStorage --> HasToken: Token exists
        CheckLocalStorage --> NoToken: No token
    }
    
    HasToken --> FetchUser: Call getMe()
    FetchUser --> Authenticated: Success
    FetchUser --> Unauthenticated: Failed (clear tokens)
    
    NoToken --> Unauthenticated
    
    Authenticated --> Idle: User logged in
    
    Unauthenticated --> LoginPending: User submits login
    LoginPending --> Authenticated: Login success
    LoginPending --> Unauthenticated: Login failed
    
    Authenticated --> LogoutPending: User clicks logout
    LogoutPending --> Unauthenticated: Logout complete
    
    Idle --> TokenRefreshing: Access token expired
    TokenRefreshing --> Idle: Refresh success
    TokenRefreshing --> Unauthenticated: Refresh failed
    
    note right of Authenticated
        User data stored in:
        - React state
        - localStorage
    end note
    
    note right of Unauthenticated
        No user data
        Tokens cleared
    end note
```

---

## 7. Component Communication Diagram

```mermaid
graph LR
    subgraph "Page Components"
        LP[LoginPage]
        RP[RegisterPage]
        HP[HomePage]
    end
    
    subgraph "Shared Context"
        AC[AuthContext]
    end
    
    subgraph "State"
        USR((user))
        LDG((loading))
    end
    
    subgraph "Actions"
        LOGIN[login fn]
        REGISTER[register fn]
        LOGOUT[logout fn]
    end
    
    LP --> AC
    RP --> AC
    HP --> AC
    
    AC --> USR
    AC --> LDG
    AC --> LOGIN
    AC --> REGISTER
    AC --> LOGOUT
    
    style AC fill:#ffecb3
    style USR fill:#c8e6c9
    style LDG fill:#c8e6c9
    style LOGIN fill:#bbdefb
    style REGISTER fill:#bbdefb
    style LOGOUT fill:#bbdefb
```

---

## 8. Error Handling Flow

```mermaid
flowchart TD
    A[API Request] --> B{Response Status}
    B -->|200-299| C[Parse JSON Response]
    C --> D[Return Data to Component]
    
    B -->|401 Unauthorized| E{Has Refresh Token?}
    E -->|Yes| F[Call Token Refresh Endpoint]
    F --> G{Refresh Success?}
    G -->|Yes| H[Retry Original Request]
    H --> B
    G -->|No| I[Clear All Tokens]
    I --> J[Throw Error]
    
    E -->|No| I
    
    B -->|400 Bad Request| K[Extract Error Detail]
    K --> L[Display Form Error]
    
    B -->|403 Forbidden| M[Display Permission Error]
    
    B -->|404 Not Found| N[Display Not Found Error]
    
    B -->|500 Server Error| O[Display Server Error]
    
    J --> P[Catch in Component]
    L --> P
    M --> P
    N --> P
    O --> P
    
    P --> Q[Set Error State]
    Q --> R[Show Error Message to User]
```

---

## 9. File Structure Overview

```
frontend/
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Main app with routing
│   │
│   ├── api/
│   │   └── client.js            # API client with auth handling
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx       # Button component
│   │   │   ├── input.jsx        # Input component
│   │   │   ├── label.jsx        # Label component
│   │   │   ├── card.jsx         # Card components
│   │   │   └── toggle.jsx       # Toggle component
│   │   └── login_card.jsx       # Login card wrapper
│   │
│   ├── features/
│   │   └── auth/
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── ForgotPasswordPage.jsx
│   │       ├── ResetPasswordPage.jsx
│   │       └── VerifyEmailPage.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.jsx          # Authentication context & hook
│   │
│   ├── lib/
│   │   ├── utils.ts             # Utility functions (TypeScript)
│   │   └── utils.js             # Utility functions (JavaScript)
│   │
│   └── utils/
│       └── utils.ts             # Additional utilities
│
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 10. Key Component Props & Interfaces

### Button Component
```typescript
interface ButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
  className?: string
  asChild?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}
```

### Input Component
```javascript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | ...
  className?: string
  placeholder?: string
  value?: string
  onChange?: (e) => void
  required?: boolean
  disabled?: boolean
  // All standard HTML input attributes
}
```

### Card Components
```javascript
<Card size="default" | "sm">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>Optional action</CardAction>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

---

## 11. Authentication State Transitions

| Current State | Action | New State | Side Effects |
|--------------|--------|-----------|--------------|
| Unauthenticated | Login Success | Authenticated | Store tokens & user in localStorage |
| Unauthenticated | Login Failed | Unauthenticated | Display error message |
| Authenticated | Logout | Unauthenticated | Clear tokens from localStorage |
| Authenticated | Token Expires | Refreshing | Auto-refresh token in background |
| Refreshing | Refresh Success | Authenticated | Update tokens in localStorage |
| Refreshing | Refresh Failed | Unauthenticated | Clear all tokens, redirect to login |
| Any | App Reload | Check localStorage | Restore session if valid tokens exist |

---

This documentation provides a comprehensive view of the frontend architecture, component relationships, data flow, and authentication scenarios.
