from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import uuid
import datetime


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    # db.init_app(app)
    app.config["IMAGE_FOLDER"] = "static/images/"

    
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

    @app.route('/portfolio')
    def portfolio():
        return render_template('portfolio.html')

    @app.route('/portfolio-details')
    def portfolio_details():
        return render_template('portfolio-details.html')

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
    app.run(port="5001", debug="true")