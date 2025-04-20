An POC app to do a FireStore to Postgres migration

It's a simple blog platform.

## Features

### User module

- [x] User can sign up
- [x] User can sign in
- [x] User can sign out

### Post module

As a post owner, I can:
- [x] create a post
- [x] delete a post 
- [x] edit a post

As a post viewer, I can:
- [x] view a post
- [x] view the list of posts

### Comment module

As a user, I can:

- [x] comment on a post
- [x] delete my comment

## Tech stacks

- Next.js 15 app router
- All pages are client components
- Firestore as DB
- Firebase/auth as auth service


### Stage 1

All DB operations are done in the client component.


### Stage 2

All DB operations are done in the API route.


### Stage 3

Migrate DB to postgres.
