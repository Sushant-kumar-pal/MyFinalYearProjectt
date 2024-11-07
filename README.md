---

# **Google Classroom Clone || PRIDIM**

## **Description**
A fully functional **PRIDIM** built with the **MERN stack**. This project allows teachers and students to interact in a virtual classroom environment, facilitating file uploads, assignments, and real-time communication.

## **Features**
1. **Authentication System**  
   - Login and signup with role-based access control (Teacher/Student).
   - Session-based authentication to secure API routes.

2. **Classroom Management**  
   - Create and join classrooms.
   - Class creator (teacher) cannot join their own class as a student.
   - Teachers can upload files and announcements.
   - Students can upload files with descriptions, edit their own files, and comment.
   - Teachers can delete any comment or document but can only edit/delete their own.

3. **Assignments**  
   - Teachers can create assignments with due dates.
   - Students can submit files for assignments before the due date.
   - Teachers can view all submissions for an assignment.

4. **Real-time Communication**  
   - Comment sections on announcements, assignments, and uploaded files.
   - Real-time chat for classroom discussion (Socket.IO or similar).

## **Tech Stack**
- **Frontend**: React.js, TailwindCSS/Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time**: Socket.IO

## **Setup & Installation**
1. Clone this repository.
2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd client && npm install
   ```
3. Set up environment variables:
   - `MONGO_URI` for MongoDB connection.
   - `JWT_SECRET` for authentication tokens.

4. Run the development server:
   ```bash
   npm run dev
   ```

## **Future Enhancements**
- Improved UI design
- Push notifications
- Integration with Google Drive for document management

## **Contributing**
Contributions are welcome! Feel free to fork the project and submit pull requests.

---
