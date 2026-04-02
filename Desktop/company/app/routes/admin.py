from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from app.models import Product, Order, User
from app.forms import ProductForm
from app import db
import cloudinary.uploader
import cloudinary

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash('Admin access required!', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_users = User.query.count()
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    
    return render_template('admin/dashboard.html', 
                         total_products=total_products,
                         total_orders=total_orders,
                         total_users=total_users,
                         recent_orders=recent_orders)

@admin_bp.route('/products')
@login_required
@admin_required
def admin_products():
    products = Product.query.all()
    return render_template('admin/products.html', products=products)

@admin_bp.route('/products/add', methods=['GET', 'POST'])
@login_required
@admin_required
def add_product():
    form = ProductForm()
    
    if form.validate_on_submit():
        # Handle image upload
        image_file = request.files.get('image')
        
        if image_file and image_file.filename:
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result['secure_url']
        else:
            image_url = 'https://via.placeholder.com/400x400?text=Product+Image'
        
        product = Product(
            name=form.name.data,
            description=form.description.data,
            price=form.price.data,
            category=form.category.data,
            stock=form.stock.data,
            image_url=image_url
        )
        
        db.session.add(product)
        db.session.commit()
        flash('Product added successfully!', 'success')
        return redirect(url_for('admin.admin_products'))
    
    return render_template('admin/edit_product.html', form=form, title='Add Product')

@admin_bp.route('/products/edit/<int:id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_product(id):
    product = Product.query.get_or_404(id)
    form = ProductForm(obj=product)
    
    if form.validate_on_submit():
        product.name = form.name.data
        product.description = form.description.data
        product.price = form.price.data
        product.category = form.category.data
        product.stock = form.stock.data
        
        # Handle image upload
        image_file = request.files.get('image')
        if image_file and image_file.filename:
            upload_result = cloudinary.uploader.upload(image_file)
            product.image_url = upload_result['secure_url']
        
        db.session.commit()
        flash('Product updated successfully!', 'success')
        return redirect(url_for('admin.admin_products'))
    
    return render_template('admin/edit_product.html', form=form, product=product, title='Edit Product')

@admin_bp.route('/products/delete/<int:id>')
@login_required
@admin_required
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    flash('Product deleted successfully!', 'success')
    return redirect(url_for('admin.admin_products'))

@admin_bp.route('/orders')
@login_required
@admin_required
def admin_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return render_template('admin/orders.html', orders=orders)

@admin_bp.route('/orders/update/<int:id>/<status>')
@login_required
@admin_required
def update_order_status(id, status):
    order = Order.query.get_or_404(id)
    order.status = status
    db.session.commit()
    flash(f'Order #{order.order_number} status updated to {status}!', 'success')
    return redirect(url_for('admin.admin_orders'))