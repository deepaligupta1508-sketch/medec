#!/usr/bin/env python3
"""Minimal Flask + SocketIO backend for hospital data"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import socketio

app = Flask(__name__)
CORS(app)

# SocketIO configuration
sio = socketio.Server(
    cors_allowed_origins='*',
    async_mode='threading'
)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# Simple dictionary to store hospital data
hospitals = {}

@app.route('/')
def index():
    return jsonify({"status": "Backend running"})

@app.route('/api/hospitals', methods=['GET'])
def get_all_hospitals():
    """Return all hospitals"""
    return jsonify(list(hospitals.values()))

@sio.event
def connect(sid, environ):
    print(f'Client {sid} connected')

@sio.event
def disconnect(sid):
    print(f'Client {sid} disconnected')

@sio.on('update_hospital')
def on_hospital_update(sid, data):
    """Receive hospital update from admin"""
    try:
        hospital_name = data.get('hospitalName', 'Unknown')
        hospitals[hospital_name] = data
        print(f'Hospital {hospital_name} updated')
        sio.emit('live_update_received', data, broadcast=True)
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    print('Starting server on http://localhost:5000')
    app.run(host='0.0.0.0', port=5000, debug=False)
