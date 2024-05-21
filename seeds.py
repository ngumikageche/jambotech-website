from app import create_app, db
from models.models import User, Blog, Category, Tag, Comment, Product, Order
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    db.create_all()

    # Create sample users
    user1 = User(username='john', email='joe@example.com', password_hash=generate_password_hash('password'))
    user2 = User(username='jane', email='joe@example.com', password_hash=generate_password_hash('password'))

    # Create sample categories
    cat1 = Category(name='Tech')
    cat2 = Category(name='Lifestyle')

    # Create sample tags
    tag1 = Tag(name='Python')
    tag2 = Tag(name='Flask')
    tag3 = Tag(name='Web Development')
    tag4 = Tag(name='Health')

    # Create sample blogs
    blog1 = Blog(title='Introduction to Flask', content='Flask is a micro web framework...', author=user1, category=cat1)
    blog2 = Blog(title='Healthy Living Tips', content='Health is wealth...', author=user2, category=cat2)
    blog1.tags.extend([tag1, tag2])
    blog2.tags.append(tag4)

    # Create sample products
    product1 = Product(name='Flask Book', description='A book about Flask', price=29.99, stock=10, category=cat1)
    product2 = Product(name='Yoga Mat', description='A high-quality yoga mat', price=19.99, stock=20, category=cat2)
    product1.tags.extend([tag1, tag2, tag3])
    product2.tags.append(tag4)

    # Create sample orders
    order1 = Order(user=user1, product=product1, quantity=1)
    order2 = Order(user=user2, product=product2, quantity=2)

    # Create sample comments
    comment1 = Comment(content='Great post!', author=user1, blog=blog2)
    comment2 = Comment(content='Very informative.', author=user2, blog=blog1)

    # Add all instances to the session and commit
    db.session.add_all([user1, user2, cat1, cat2, tag1, tag2, tag3, tag4, blog1, blog2, product1, product2, order1, order2, comment1, comment2])
    db.session.commit()

    print("Sample data added successfully!")