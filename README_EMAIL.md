Email configuration
-------------------

This project uses the Resend API to send contact form submissions.

Setup:
- Create a free account at https://resend.com and get an API key.
- Add the following env vars to your deployment (Vercel -> Project Settings -> Environment Variables):
  - RESEND_API_KEY = your_key
  - EMAIL_FROM = "Portfolio <onboarding@resend.dev>" or a verified domain sender
  - EMAIL_TO = ilansas94@gmail.com

Locally, create a .env.local file with the same keys.


