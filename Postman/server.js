const express = require("express");
const app = express();

app.use(express.json());

let students = [];

app.post("/student", (req, res) => {
    students.push(req.body);

    res.json({
        message: "Student added successfully",
        data: req.body
    });
});

app.get("/student", (req, res) => {
    res.json(students);
});

app.delete("/student/:name", (req, res) => {
    const name = req.params.name;

    students = students.filter(student => student?.name !== name);

    res.json({
        message: `${name} deleted successfully`
    });
});

app.put("/student/:name", (req, res) => {
    const name = req.params.name;

    const student = students.find(student => student?.name === name);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    student.name = req.body.name || student.name;
    student.age = req.body.age || student.age;
    student.department = req.body.department || student.department;

    res.json({
        message: "Student updated successfully",
        data: student
    });
});

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});
