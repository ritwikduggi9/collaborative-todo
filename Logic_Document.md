# 🧠 Logic\_Document.md

## ✅ Smart Assign Logic

**Smart Assign** is a backend logic feature that ensures fair and automatic task distribution when a task is created without an assigned user.

### 🔍 How It Works:

* When a task is created **without an `assignedTo` value**, the backend triggers Smart Assign.
* It queries all users from the MongoDB database.
* For each user, it calculates the number of tasks already assigned.
* The user with the **fewest assigned tasks** is automatically selected.
* That user ID is inserted into the `assignedTo` field of the new task.

> **Example:**
>
> * User A has 3 tasks
> * User B has 1 task
> * User C has 2 tasks
>   ✅ Smart Assign will allocate the new task to **User B**

This mechanism helps prevent uneven workload distribution and ensures smoother collaboration across the team.

---

## ⚔️ Conflict Handling Logic

**Conflict Handling** is built to manage simultaneous updates to the same task across multiple users in a real-time environment.

### 🔍 How It Works:

* Real-time communication is powered using **Socket.IO**.
* When a task is modified (drag-drop, text update, status change), a socket event is sent to the server.
* The backend updates the task in MongoDB and immediately **broadcasts the new task state** to all connected users.
* If two users modify the same task simultaneously:

  * The **first update received** is accepted.
  * The **second update is ignored or overridden**, and the user is updated with the new task state.
  * An optional message (not yet implemented) can be shown to inform about the conflict.

> **Example:**
>
> * User A moves Task Y to "Done"
> * At the same moment, User B edits Task Y’s title
> * User A’s change reaches the server first
> * User B’s UI receives the updated "Done" status through the socket

This approach maintains **synchronization and data integrity** across all sessions.

---

✅ This document explains the custom backend logic implemented for Smart Assign and Conflict Handling in your MERN-based collaborative Kanban board.

Built by **Ritwik Duggi** — 2025
