# File: app.py

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS to allow cross-origin requests
import db_utils

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/")
def home():
    return render_template("grid.html")

# API endpoint to record multiple cell visits at once (bulk)
@app.route("/log_cell_visit_bulk", methods=["POST"])
def log_cell_visit_bulk():
    data = request.json
    print(f"Received Data: {data}")  # Debugging to confirm data received
    try:
        for cell in data:
            player = 1
            team = 'red'
            lat_index = cell['latIndex']
            lng_index = cell['lngIndex']
            success = db_utils.log_cell_visit(player, team, lat_index, lng_index)
            if not success:
                raise Exception("Database insertion failed")
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error logging data: {e}")  # Debugging
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
