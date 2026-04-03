from flask import Flask, request, jsonify, session
import mysql.connector
from flask_cors import CORS
import hashlib

app = Flask(__name__)
app.secret_key = 'super_secret_key'
CORS(app) # Allow frontend to communicate with Python

# Database Configuration
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",      # Default XAMPP user
        password="",      # Default XAMPP password
        database="logmyclass_db"
    )

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # Hash password for security
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User already exists"}), 400
            
        # Insert user
        cursor.execute(
            "INSERT INTO users (full_name, email, password, role) VALUES (%s, %s, %s, %s)",
            (name, email, hashed_password, 'student') # Default role
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Signup successful!"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, hashed_password))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if user:
            session['user_id'] = user['user_id']
            return jsonify({"message": "Login successful!", "user": user}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
