README

# BreakRem Desktop App

This repository contains break reminders desktop application built using Angular, Electron and Django.

<img width="590" alt="theme layout2" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/72f62240-848d-4235-ada6-4fca88f7feeb">
<img width="590" alt="sound" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/54c70b72-c520-4cdd-ae00-db83c5931fec">
<img width="590" alt="signup" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/1115d5e4-db84-4369-a66f-3ebe5d8af971">
<img width="590" alt="screen notification" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/42bd241d-297a-4ae4-86c2-2947390bc219">
<img width="590" alt="screen 12" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/10dde06c-1401-487f-973e-a4ba3c17e67f">
<img width="590" alt="screen 10" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/e6ed44df-9bbd-4654-b93f-1e4d44d34f72">
<img width="590" alt="notification1" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/083f451b-5f52-47c0-a689-898958925154">
<img width="590" alt="tray notification" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/e6ad93a4-b27f-45ba-9f8c-2885dc4cbcd9">

## Features

BreakRem is a dynamic desktop application designed to streamline your work-break routine. With BreakRem, users can:
- Register and log in securely to access the application's features.
- Create personalized break reminders with descriptions, images, and animations.
- Customize reminder intervals and durations for effective work-break scheduling.
- Benefit from a user-friendly interface that allows easy navigation and modification of reminders.
- Choose from a collection of predefined work break ideas for enhanced productivity.
- Explore the "Dashboard" to manage and organize all created break reminders efficiently.
- Tailor application settings, screen display, sound, and notifications to personal preferences.
- Personalize user accounts with profile pictures, usernames, and email IDs.

## Technologies Used

- Angular: Typescript based framework.
- Django: Python web framework for building backend applications.
- SQLite: Relational database management system.
- Bootstrap: CSS for web design.
- Electron: Creates Desktop applications

## Installation

1. Clone the repository:

```
git clone <repository-url>
```

2. Install the required dependencies:

```
npm install
```

3. Build up the app:

```
ng build
```

4. Start the frontend development server:

```
npm start
```

5. Setup and activate a virtual environment:

```
source venv/bin/activate   # For Unix/Linux
venv\Scripts\activate   # For Windows
```

6. Set up the database:

```
python manage.py migrate
```

7. Start the backend development server:

```
python manage.py runserver
```
