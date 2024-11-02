# File: db_utils.py

import mysql.connector
from datetime import datetime

# Database configuration
db_config = {
    'host': 'localhost',  # Update with your host
    'user': 'root',       # Update with your MySQL username
    'password': '06Ryawhi!',  # Update with your MySQL password
    'database': 'mapper_base'
}

# Establish a database connection
def get_db_connection():
    return mysql.connector.connect(**db_config)

# Function to log cell visit to the database
def log_cell_visit(player, team, lat_index, lng_index):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        sql = "INSERT INTO cell_visits (player, team, lat_index, lng_index, timestamp) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (player, team, lat_index, lng_index, datetime.now()))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Error logging cell visit: {str(e)}")
        return False
