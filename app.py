from flask import Flask, request, jsonify
from flask_cors import CORS
import socketio
import threading

# Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Socket.IO server
sio = socketio.Server(
    cors_allowed_origins='*',
    async_mode='threading',
    ping_timeout=60,
    ping_interval=25
)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# In-memory hospital storage
hospital_data_store = {}

@app.route('/')
def home():
    return jsonify({"message": "Backend is Live! In-memory storage active."})

@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    """Get all hospitals from in-memory storage"""
    try:
        hospitals = list(hospital_data_store.values())
        return jsonify(hospitals), 200
    except Exception as e:
        print(f"Error in get_hospitals: {e}")
        return jsonify({"error": str(e)}), 500

@sio.event
def connect(sid, environ):
    print(f'✓ Client connected: {sid}')

@sio.event
def disconnect(sid):
    print(f'✗ Client disconnected: {sid}')

@sio.on('update_hospital')
def handle_hospital_update(sid, data):
    """Handle hospital data submission from admin"""
    try:
        hospital_name = data.get('hospitalName', 'Unknown')
        hospital_data_store[hospital_name] = data
        print(f"✓ Received update from: {hospital_name}")
        print(f"  ICU Beds: {data.get('icuBeds', 0)}, General Beds: {data.get('generalBeds', 0)}")
        # Broadcast to all connected clients
        sio.emit('live_update_received', data, broadcast=True)
    except Exception as e:
        print(f"✗ Error handling hospital update: {e}")

if __name__ == '__main__':
    print("Starting Flask/SocketIO server on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
