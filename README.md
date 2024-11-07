
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

## **PREVIEW**


**SIGNUP AND LOGIN**
![image](https://github.com/user-attachments/assets/22e30df8-8cef-48a3-9320-584df15ea88e)
![image](https://github.com/user-attachments/assets/1c88abeb-29f6-4093-92c2-09891c799c2e)
![image](https://github.com/user-attachments/assets/912ccbf5-2349-468a-b0be-6cf7c304bd66)

---

**TEACHER DASHBOARD** 


![image](https://github.com/user-attachments/assets/c744c921-92dd-4497-8bbd-da1b82d83996)
![image](https://github.com/user-attachments/assets/1d5a66ed-b1cf-489d-91f3-ac1a0d0d094a)
![image](https://github.com/user-attachments/assets/98352687-ad78-45f1-a684-58a282df2665)

---
 
**STUDENT DASHBOARD**


![image](https://github.com/user-attachments/assets/37848f48-b983-4cbb-9e75-2afb875a5ade)
![image](https://github.com/user-attachments/assets/7754eac0-6119-40b7-80c4-c3be77a9b9db)
![image](https://github.com/user-attachments/assets/9be32ad0-849e-40b1-b401-cc8ead7f0db7)

---

**CREATE, JOIN AND UPDATE**


![image](https://github.com/user-attachments/assets/96d09f61-89d4-4afc-b574-84bcbf911495)
![image](https://github.com/user-attachments/assets/91193c8b-c6c6-4656-8b38-798c53f46798)
![image](https://github.com/user-attachments/assets/ce879bdb-e84b-4e5d-ac97-df28ff06d07f)
![image](https://github.com/user-attachments/assets/499046f0-0a18-4073-9ced-23a01ac2ce0e)

**notice** 
create an folder: uploads








