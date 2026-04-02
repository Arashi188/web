from flask import Blueprint, render_template, request, current_app
from flask_login import login_required, current_user
from app.models import Product, Order
from app import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Homepage with featured products"""
    featured_products = Product.query.limit(8).all()
    return render_template('index.html', products=featured_products)

@main_bp.route('/products')
def products():
    """Products listing page with search and filters"""
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = Product.query
    
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%') | 
                             Product.description.ilike(f'%{search}%'))
    
    if category:
        query = query.filter(Product.category == category)
    
    products = query.all()
    
    # Get all unique categories for filter sidebar
    categories = db.session.query(Product.category).distinct().all()
    categories = [c[0] for c in categories if c[0]]
    
    return render_template('products.html', 
                         products=products, 
                         categories=categories, 
                         search=search,
                         selected_category=category)

@main_bp.route('/product/<int:id>')
def product_detail(id):
    """Individual product detail page"""
    product = Product.query.get_or_404(id)
    
    # Get related products from same category
    related_products = Product.query.filter(
        Product.category == product.category, 
        Product.id != id
    ).limit(4).all()
    
    return render_template('product_detail.html', 
                         product=product, 
                         related_products=related_products)

@main_bp.route('/about')
def about():
    """About Us page"""
    return render_template('about.html')

@main_bp.route('/contact')
def contact():
    """Contact page"""
    return render_template('contact.html')

@main_bp.route('/faq')
def faq():
    """Frequently Asked Questions page"""
    return render_template('faq.html')

@main_bp.route('/terms')
def terms():
    """Terms of Service page"""
    return render_template('terms.html')

@main_bp.route('/privacy')
def privacy():
    """Privacy Policy page"""
    return render_template('privacy.html')

@main_bp.route('/my-orders')
@login_required
def my_orders():
    """User's order history"""
    orders = Order.query.filter_by(user_id=current_user.id)\
                        .order_by(Order.created_at.desc())\
                        .all()
    return render_template('my_orders.html', orders=orders)

@main_bp.route('/search')
def search():
    """AJAX search endpoint for instant search"""
    query = request.args.get('q', '')
    if query:
        products = Product.query.filter(
            Product.name.ilike(f'%{query}%')
        ).limit(10).all()
        
        results = [{
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image_url': p.image_url,
            'category': p.category
        } for p in products]
        
        return {'results': results}
    return {'results': []}

@main_bp.route('/categories')
def categories():
    """Get all categories for filter dropdown"""
    categories = db.session.query(Product.category).distinct().all()
    return {'categories': [c[0] for c in categories if c[0]]}

@main_bp.errorhandler(404)
def page_not_found(e):
    """404 error handler"""
    return render_template('404.html'), 404

@main_bp.errorhandler(500)
def internal_server_error(e):
    """500 error handler"""
    return render_template('500.html'), 500

# Context processor to make certain variables available to all templates
@main_bp.app_context_processor
def utility_processor():
    def get_cart_count():
        if current_user.is_authenticated:
            from app.models import Cart
            return Cart.query.filter_by(user_id=current_user.id).count()
        return 0
    
    def get_categories():
        categories = db.session.query(Product.category).distinct().all()
        return [c[0] for c in categories if c[0]]
    
    return dict(
        cart_count=get_cart_count,
        all_categories=get_categories,
        current_year=2024
    )