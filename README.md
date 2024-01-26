# Purrfect Adoptions

### Implemented Features:
- Basic Auth
- Adoption application process
  - Applying for adoption
  - Updating application status
  - Scheduling visits
  - Auto application expiry in certain conditions
  - Reactivating application process
- Adding a pet
  - By admin and shelter
- Inviting a shelter
  - Admin task to invite shelter to sign up on the website
- Shelter Reviews and Ratings
  - Rating and reviewing shelter after user has visited it
- Notifications
- Search and filtering in pets and applications
- Settings
  - Change email
  - Change password
- Testing:
  - Frontend
    - e2e cypress tests
    - unit tests
  - Backend
    - Integration tests using jest

## Setup and run

There is `.env.example` file present at root of the project.

Remember to provide environment variables.

### Development

```bash
    npm run dev
```

### Production

Commits to production branch automatically deploy the application

### Testing

Run cypress tests

```bash
    npm run cypress:run
```

Run unit tests

```bash
    npm run test
```
