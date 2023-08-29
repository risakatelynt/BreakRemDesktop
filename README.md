README

# BreakRem Desktop App

This repository contains break reminders application built using Angular, Electron and Django.

<img width="590" alt="theme layout2" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/c8f01d26-5c05-48eb-a00f-77f6d0328253">
<img width="590" alt="sound" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/ccbc5cb3-ce6f-44cc-88f8-f62c59bbfe20">
<img width="590" alt="signup" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/6bc58549-caf9-4237-bf7e-85c7fae424e3">
<img width="590" alt="tray notification" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/7194f7f8-cce8-43c5-ba60-7d4a575fb4bb">
<img width="590" alt="screen notification" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/dbd9c9c4-a982-4438-a617-d45c65cb0072">
<img width="590" alt="screen 10" src="https://github.com/risakatelynt/BreakRemDesktop/assets/124533180/4544a938-8144-41c1-9b53-62c17eeb9b7e">

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
