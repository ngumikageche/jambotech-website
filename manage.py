import os 
from flask import jsonify
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import db, create_app

# Create the Flask app instance
app = create_app()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Create the Flask-Script manager instance
manager = Manager(app)

# Add database commands to Flask-Script manager
manager.add_command('db', MigrateCommand)

# Configuration from environment variables
# configuration = os.getenv('APP_SETTINGS')
# app.config.from_object(configuration)

# Error handler for 404 Not Found errors
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'error': 'Not Found'}), 404

# Error handler for 500 Internal Server Error
@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({'error': 'Internal Server Error'}), 500

# Error handler for unhandled exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    # Log the exception
    app.logger.exception('Unhandled Exception: %s', e)
    # Return a JSON response with an error message
    return jsonify({'error': 'Internal Server Error'}), 500

# Run the manager
if __name__ == '__main__':
    # Configuring logging
    import logging
    logging.basicConfig(level=logging.INFO)
    manager.run()