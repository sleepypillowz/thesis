# MediTrakk

**A Web-Based Hospital Management System for Efficient Patient Care and Medicine Tracking**

![Project Screenshot](public/admin.png)

## About

MediTrakk is a web-based hospital management system designed to streamline healthcare operations by centralizing patient records, medicine inventory, and treatment statistics in one secure and accessible platform. The system focuses on improving coordination between doctors and patients, ensuring that essential medical data is efficiently recorded, managed, and retrieved.

The platform is built using Django for backend management and Next.js with TypeScript and Tailwind CSS for the frontend, offering a responsive and modern interface. The database is hosted on Supabase, providing reliable cloud storage and real-time updates.

## Features

* Patient Management Module – Stores and organizes patient information, medical history, and prescriptions for easy access and updates by doctors.

* Appointment Scheduling System – Allows patients to conveniently book appointments online and lets doctors manage their daily schedules efficiently.

* Medicine Inventory System – Monitors medicine stock levels, tracks expiration dates, and automates inventory updates to avoid shortages or waste.

* Data Analytics Dashboard – Displays summarized reports and visual insights on patient demographics, medicine usage, and hospital statistics.

* User Authentication and Role Management – Provides secure login for both patients and doctors, ensuring proper access control and data privacy.

* Modern UI/UX Design – Utilizes Tailwind CSS and ShadCN components to create a clean, user-friendly, and fully responsive interface.

## Getting Started

### Installation

```bash
git clone https://github.com/sleepypillowz/thesis.git
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

cd frontend
pnpm install
```
## Usage
```
cd backend
venv\Scripts\activate
python manage.py runserver

cd frontend
pnpm dev
```
