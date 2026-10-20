# Experiment 2(B) — REST API Testing using Postman

This guide covers building a **Student Management RESTful API** using **Node.js** and **Express.js**, and testing all CRUD operations (Create, Read, Update, Delete) using **Postman**.

---

## 🎯 Aim:
To design and implement a RESTful Web API for student management using Node.js and Express, and to verify and test all HTTP endpoints (`GET`, `POST`, `PUT`, `DELETE`) using Postman.

---

## 💻 Tech Stack & Prerequisites:
- **Node.js** (v18+ or v20+)
- **npm** (Node Package Manager)
- **Express.js** (`^5.2.1`)
- **Postman Desktop App** (or Postman Web / VS Code Postman Extension / cURL)

---

## 📁 Directory Structure:

```text
Postman/
├── package.json                                    # Project metadata and dependencies
├── server.js                                       # Express REST API server
├── Cloud_Lab_Ex2B_Student_API.postman_collection.json # One-click importable Postman collection
├── STEPS.md                                        # Full guide with Postman steps & screenshots
└── STEPS.txt                                       # Quick terminal reference
```

---

## 🚀 Step-by-Step Procedure:

### Step 1 — Navigate to the Directory and Install Dependencies
Open your terminal (PowerShell, Command Prompt, or Bash) and execute:

```bash
cd Postman
npm install
```

This installs `express` into `node_modules/` based on `package.json`.

---

### Step 2 — Start the Express Server
Run:

```bash
node server.js
```
*(or `npm start`)*

**Console Output:**
```text
Server Running on Port 5000
```

> [!NOTE]
> Keep this terminal open while testing. The server runs at `http://localhost:5000`.

---

## 📬 Postman Testing Guide:

You can test either by **Importing the pre-built Collection** (Quickest!) or by creating requests manually.

### ⚡ Option A: Quick Import (Recommended)
1. Open **Postman**.
2. Click **Import** (top-left near My Workspace).
3. Select the file:
   `Postman/Cloud_Lab_Ex2B_Student_API.postman_collection.json`
4. All 4 requests will be automatically loaded into your sidebar with URLs and sample bodies pre-filled!

---

### 🛠️ Option B: Manual Request Creation

#### 1. POST Request — Add a Student (Create)
- **Method:** `POST`
- **URL:** `http://localhost:5000/student`
- **Headers:**
  - Key: `Content-Type` | Value: `application/json`
- **Body:**
  - Select **raw** → choose **JSON** from the dropdown
  - Paste:
    ```json
    {
      "name": "Loknaath",
      "age": 20,
      "department": "CSE"
    }
    ```
- Click **Send**.
- **Expected Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Student added successfully",
    "data": {
      "name": "Loknaath",
      "age": 20,
      "department": "CSE"
    }
  }
  ```

---

#### 2. GET Request — Retrieve All Students (Read)
- **Method:** `GET`
- **URL:** `http://localhost:5000/student`
- Click **Send**.
- **Expected Status:** `200 OK`
- **Response Body:**
  ```json
  [
    {
      "name": "Loknaath",
      "age": 20,
      "department": "CSE"
    }
  ]
  ```

---

#### 3. PUT Request — Update Student by Name (Update)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/student/Loknaath`
- **Headers:**
  - Key: `Content-Type` | Value: `application/json`
- **Body:**
  - Select **raw** → choose **JSON**
  - Paste:
    ```json
    {
      "age": 21,
      "department": "IT"
    }
    ```
- Click **Send**.
- **Expected Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Student updated successfully",
    "data": {
      "name": "Loknaath",
      "age": 21,
      "department": "IT"
    }
  }
  ```

> [!TIP]
> **Error Handling Test:** Try updating a name that does not exist, e.g. `http://localhost:5000/student/Unknown`.
> - Status: `404 Not Found`
> - Body: `{ "message": "Student not found" }`

---

#### 4. DELETE Request — Remove Student by Name (Delete)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/student/Loknaath`
- Click **Send**.
- **Expected Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Loknaath deleted successfully"
  }
  ```

---

#### 5. Verify Deletion with GET
- **Method:** `GET`
- **URL:** `http://localhost:5000/student`
- Click **Send**.
- **Expected Status:** `200 OK`
- **Response Body:**
  ```json
  []
  ```
  *(Returns an empty array, confirming that the student was removed).*

---

## 📊 Summary of REST Endpoints:

| Operation | HTTP Method | Endpoint | Request Body | Success Response | Status |
|---|---|---|---|---|---|
| **Add Student** | `POST` | `/student` | `{ "name": "...", "age": 20, "department": "..." }` | `{ "message": "Student added successfully", "data": ... }` | `200 OK` |
| **Get All** | `GET` | `/student` | None | Array of all student objects `[...]` | `200 OK` |
| **Update** | `PUT` | `/student/:name` | `{ "name": "...", "age": ..., "department": "..." }` | `{ "message": "Student updated successfully", "data": ... }` | `200 OK` (or `404`) |
| **Delete** | `DELETE` | `/student/:name` | None | `{ "message": "<name> deleted successfully" }` | `200 OK` |

---

## ⚡ Quick Testing via Node / cURL (No Postman GUI needed):

In another terminal window:

```bash
# 1. Add Student
node -e "fetch('http://localhost:5000/student', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:'Loknaath', age:20, department:'CSE'})}).then(r=>r.json()).then(console.log)"

# 2. View All Students
node -e "fetch('http://localhost:5000/student').then(r=>r.json()).then(console.log)"

# 3. Update Student
node -e "fetch('http://localhost:5000/student/Loknaath', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({age:21, department:'IT'})}).then(r=>r.json()).then(console.log)"

# 4. Delete Student
node -e "fetch('http://localhost:5000/student/Loknaath', {method:'DELETE'}).then(r=>r.json()).then(console.log)"
```

---

## 🌐 Part 2 — Third-Party API Integration using Postman

In this part, we connect and consume real-world external cloud APIs directly in Postman.

### Example 1: Live Cloud Weather API (Open-Meteo) — *No API Key Required*
Open-Meteo is an open cloud weather API providing real-time meteorological forecasts.

#### Steps to Integrate:
1. Open **Postman** and click **+** (New Request Tab).
2. Set the HTTP Method to **`GET`**.
3. In the request URL bar, enter the base endpoint:
   ```text
   https://api.open-meteo.com/v1/forecast
   ```
4. Click on the **Params** tab below the URL bar and add the following Query Parameters:
   | Key | Value | Description |
   |---|---|---|
   | `latitude` | `9.9252` | Latitude (Madurai) |
   | `longitude` | `78.1198` | Longitude (Madurai) |
   | `current_weather` | `true` | Request live temperature & wind speed |

   *(Postman automatically appends them to form the final URL:)*
   `https://api.open-meteo.com/v1/forecast?latitude=9.9252&longitude=78.1198&current_weather=true`

5. Click **Send**.
6. **Expected Status:** `200 OK`
7. **Response Body (JSON):**
   ```json
   {
     "latitude": 9.947276,
     "longitude": 78.11024,
     "timezone": "GMT",
     "elevation": 141.0,
     "current_weather": {
       "time": "2026-10-21T05:00",
       "interval": 900,
       "temperature": 25.5,
       "windspeed": 1.3,
       "winddirection": 188,
       "weathercode": 3
     }
   }
   ```

---

### Example 2: API Key-Based Cloud API (OpenWeatherMap API)
For third-party services that require an API key:

#### Steps to Integrate:
1. Obtain an API key from the provider (e.g. [OpenWeatherMap](https://openweathermap.org/api)).
2. In Postman, open a new **`GET`** request tab.
3. Enter URL:
   ```text
   https://api.openweathermap.org/data/2.5/weather
   ```
4. In the **Params** tab, add:
   - `q`: `Madurai`
   - `appid`: `<YOUR_API_KEY>`
   - `units`: `metric`
5. Click **Send** to receive temperature, humidity, pressure, and weather description.

---

### Example 3: Header-Based Third-Party API (GitHub REST API)
For third-party APIs that require specific HTTP headers:

#### Steps to Integrate:
1. In Postman, create a **`GET`** request.
2. Enter URL:
   ```text
   https://api.github.com/users/octocat
   ```
3. Click on the **Headers** tab.
4. Add header:
   - Key: `Accept`
   - Value: `application/vnd.github+json`
5. Click **Send**.
6. **Expected Status:** `200 OK` (returns user profile info, avatar, public repos count).

---

## 🏆 Result:
Thus, the Student RESTful API was developed using Express.js with all CRUD endpoints verified, and external third-party cloud APIs were successfully integrated and tested using Postman.
