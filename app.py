# app.py

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect  # Import CSRFProtect
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired
from werkzeug.utils import secure_filename
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask import jsonify
from flask_migrate import Migrate
import requests


db = SQLAlchemy()
login_manager = LoginManager()
bcrypt = Bcrypt()
def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    db.init_app(app)
    app.config["IMAGE_FOLDER"] = "static/images/"
    migrate = Migrate(app, db)
    from models.models import Product, Category

    
    @app.route('/')
    def index():
        """ Generate a UUID and convert it to a tring """
        cache_id = str(uuid.uuid4())
        return render_template('index.html', cache_id=cache_id)
    
    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/blog')
    def blog():
        return render_template('blog.html')

    @app.route('/blog-details')
    def blog_details():
        return render_template('blog-details.html')

    @app.route('/contact')
    def contact():
        return render_template('contact.html')
    
    @app.route('/shop')
    def shop():
        import requests
        
        # Fetch categories from the API
        category_response = requests.get('http://127.0.0.1:5001/categories')
        if category_response.status_code == 200:
            categories = category_response.json()
        else:
            categories = []

        # Fetch products from the API
        product_response = requests.get('http://127.0.0.1:5001/products')
        if product_response.status_code == 200:
            products = product_response.json()
        else:
            products = []

        # Merge products with their respective categories
        products_with_categories = []
        for product in products:
            category = next((cat for cat in categories if 'id' in cat and 'category_id' in product and int(cat['id']) == int(product['category_id'])), None)
            if category:
                products_with_categories.append({
                    'name': product['name'],
                    'description': product['description'],
                    'price': product['price'],
                    'category': category,
                    'image': product.get('image', 'default.jpg')
                })

        return render_template('shop.html', categories=categories, products=products, products_with_categories=products_with_categories)

    @app.route('/shop-details')
    def shop_details():
        return render_template('shop-details.html')

    @app.route('/services')
    def services():
        return render_template('services.html')

    @app.route('/team')
    def team():
        return render_template('team.html')
    
    @app.errorhandler(404)
    def invalid_route(e):
        """function that renders"""
        return jsonify({'errorCode': 404, 'message': 'Route not found'})

    return app  # Return the app instance here

if __name__ == '__main__':
    app = create_app()
    # with app.app_context():
    #     db.create_all()
    app.run(port="5000", debug="true")