#Timer App

## Project Overview
A comprehensive Timer Application built as part of a technical assignment, featuring advanced timer management and user-friendly interfaces.

## Steps to Run the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
1. Clone the repository
```bash

git clone [REPOSITORY_URL]
cd timer

Install dependencies

bashCopynpm install

Start the development server

bashCopynpm run dev

Run tests

bashCopynpm test
Enhancements and Changes
Completed Assignment Criteria

UI Matching

Implemented a pixel-perfect UI matching the provided screenshots
Responsive design using Tailwind CSS
Consistent styling across components


Simultaneous Timers

Refactored timer store to support multiple concurrent timers
Implemented advanced timer management logic
Able to run and track multiple timers simultaneously


Snackbar Behavior

Integrated Sonner for toast notifications
Implemented audio notifications for timer completion
Added dismissable notifications with custom styling


Error Handling

Comprehensive form validation
Detailed error messages for invalid inputs
Robust error handling in timer and audio utilities


Modal Improvements

Created a unified TimerModal for adding and editing timers
Extracted common components to reduce code duplication
Implemented responsive and user-friendly modal design


Persistent Storage

Integrated localStorage for timer persistence
Implemented error-safe storage mechanisms
Timers persist across page refreshes


Testing

Set up Vitest for comprehensive testing
Added unit tests for:

Validation utilities
Timer store actions
Component rendering


Improved test coverage



Additional Enhancements

Advanced audio utility with multiple sound methods
Improved type safety with TypeScript
Optimized performance with efficient state management
Responsive design with mobile-first approach

Technical Challenges Solved

Implementing simultaneous timer tracking
Creating a flexible, reusable modal component
Managing complex audio state
Ensuring robust error handling and validation

Future Improvements

Add more advanced timer features
Implement user preferences
Enhance test coverage
Add theme customization options

Technologies Used

React
Redux Toolkit
TypeScript
Tailwind CSS
Vitest
Sonner (Notifications)


