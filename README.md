# 🎫 IT Service Management & Ticketing System

A full-stack, role-based **IT Service Management and Ticketing System** built with **Spring Boot, React, PostgreSQL, and Spring Security with JWT**.

The system allows employees to raise IT support tickets, support agents to manage and resolve tickets, and administrators to manage users and roles.

---

## 🚀 Project Overview

The **IT Service Management & Ticketing System** provides a centralized platform for managing IT support requests within an organization.

Instead of handling support requests through emails or informal communication, employees can create and track tickets through the application.

The system provides different functionality based on the user's role:

👨‍💻 **Employee**
- Create support tickets
- View submitted tickets
- Track ticket status
- Add comments
- Close resolved tickets

🛠️ **Support Agent**
- View assigned and available tickets
- Assign tickets
- Update ticket status
- Change ticket priority
- Add comments
- Handle and resolve support requests

👑 **Administrator**
- Manage users
- Manage user roles
- View the overall ticketing system
- Delete tickets when required
- Control administrative operations

---

## ✨ Key Features

### 🔐 Authentication & Security

- User registration
- User login
- JWT-based authentication
- Password encryption
- Role-based authorization
- Email verification using OTP
- Password reset functionality
- Protected REST APIs
- Method-level security using Spring Security

### 🎫 Ticket Management

- Create tickets
- View tickets
- View individual ticket details
- Assign tickets to support agents
- Update ticket priority
- Update ticket status
- Close tickets
- Delete tickets
- Add comments to tickets
- View ticket comments

### 👥 Role-Based Access Control

The application supports three roles:

| Role | Responsibilities |
|------|------------------|
| 👨‍💻 Employee | Create and track support tickets |
| 🛠️ Support Agent | Manage, assign and resolve tickets |
| 👑 Admin | Manage users, roles and system operations |

---

## 🏗️ System Architecture

```text
                    🌐 React Frontend
                           │
                           │ HTTP / REST API
                           ▼
                 🚀 Spring Boot Backend
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        🔐 Security     🎫 Services    👥 Users
        JWT + Roles     Ticket Logic   Management
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    🗄️ PostgreSQL
                       Database
