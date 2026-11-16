# Compassion Cloud

**Disaster Relief. Delivered with Compassion.**

Compassion Cloud is a centralised, web-based platform that helps disaster relief organisations manage and coordinate emergency response activities more effectively. It brings key response functions — information, requests, resources, volunteers, and updates — into one accessible, community-focused system.

## Purpose

Disaster response often involves many organisations, volunteers, donors, and affected communities. Compassion Cloud aims to reduce information gaps by providing a clear, structured, and transparent digital space for coordination.

### Key Principles
- Community first
- Clear and timely information
- Responsible resource coordination
- Accessible digital services
- Respect and dignity

## Features

- **Responsive multi-page website** – Works on desktop and mobile
- **Disaster response overview** – View active and past responses
- **Relief request form** – Structured request submission with browser-based demo tracker (LocalStorage)
- **Resource visibility** – See available resources
- **Volunteer registration** – Get involved page for volunteers
- **Updates & communication** – Publish and view relief updates
- **Contact & organisation details**
- **Accessible navigation** – Skip link, ARIA attributes, and mobile menu
- **Client-side form validation**
- **Google Sign-In** – Users can sign in and sign out using Google OAuth. When signed in, the user’s name and avatar appear in the navigation bar alongside a Sign out button

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Overview and call to action |
| About | `about.html` | Platform purpose and principles |
| Disaster Response | `disaster-response.html` | Active and past response information |
| Relief Requests | `relief-requests.html` | Request form + demo tracker |
| Resources | `resources.html` | Resource availability |
| Get Involved | `get-involved.html` | Volunteer registration |
| Updates | `updates.html` | Relief updates and news |
| Contact | `contact.html` | Contact form and details |

## Technology Stack

- **HTML5**
- **CSS3** (custom, no frameworks)
- **Vanilla JavaScript**
- **LocalStorage** (for demonstration relief requests)
- **Google OAuth / Google Sign-In**

No Bootstrap, Tailwind, React, or backend framework is used. This is a front-end demonstration.

## Getting Started

1. Clone or download the repository
2. Open the project folder in **Visual Studio Code**
3. Install the **Live Server** extension (if not already installed)
4. Right-click `index.html` → **Open with Live Server**

The site will run at:  
**http://localhost:5500**

## Deployment

This website is deployed on **Netlify**.

- Connect the GitHub repository to Netlify
- Netlify will automatically build and deploy on every push to the main branch
- Live site URL will be available in the Netlify dashboard after deployment

## Authentication

- A **Google Sign-In** button is available in the navigation.
- After signing in, the user’s name (e.g. “Thembela”) and profile initial appear in the header.
- A **Sign out** button allows the user to log out.

## Project Structure
