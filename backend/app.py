import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Demo only: records reset whenever this process/container restarts.
students = [
    {"id": 1, "name": "Aarav Patel", "email": "aarav@example.com", "course": "Computer Science"},
    {"id": 2, "name": "Mira Shah", "email": "mira@example.com", "course": "Information Technology"},
]
next_id = 3

@app.get('/health')
def health(): return jsonify(status='ok', service='student-api')

@app.get('/api/students')
def list_students(): return jsonify(students)

@app.post('/api/students')
def add_student():
    global next_id
    data = request.get_json(silent=True) or {}
    name, email, course = (str(data.get(k, '')).strip() for k in ('name','email','course'))
    if not name or not email or not course:
        return jsonify(error='Name, email, and course are required.'), 400
    student = {'id': next_id, 'name': name, 'email': email, 'course': course}
    students.append(student); next_id += 1
    return jsonify(student), 201

@app.delete('/api/students/<int:student_id>')
def delete_student(student_id):
    global students
    before = len(students)
    students = [s for s in students if s['id'] != student_id]
    if len(students) == before: return jsonify(error='Student not found.'), 404
    return '', 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')))
