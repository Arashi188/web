from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from app.models import Cart, Product, Order, OrderItem
from app.forms import CheckoutForm
from app import db
import uuid

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/')
@login_required
def view_cart():
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    total = sum(item.product.price * item.quantity for item in cart_items)
    return render_template('cart.html', cart_items=cart_items, total=total)

@cart_bp.route('/count')
@login_required
def cart_count():
    """Get cart count for current user"""
    count = Cart.query.filter_by(user_id=current_user.id).count()
    return jsonify({'count': count})

@cart_bp.route('/add/<int:product_id>')
@login_required
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)
    
    cart_item = Cart.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    
    if cart_item:
        if cart_item.quantity + 1 <= product.stock:
            cart_item.quantity += 1
            flash(f'Added another {product.name} to cart!', 'success')
        else:
            flash(f'Sorry, only {product.stock} items in stock!', 'danger')
    else:
        if product.stock > 0:
            cart_item = Cart(user_id=current_user.id, product_id=product_id, quantity=1)
            db.session.add(cart_item)
            flash(f'{product.name} added to cart!', 'success')
        else:
            flash(f'Sorry, {product.name} is out of stock!', 'danger')
    
    db.session.commit()
    return redirect(request.referrer or url_for('main.index'))

@cart_bp.route('/update/<int:item_id>', methods=['POST'])
@login_required
def update_cart(item_id):
    cart_item = Cart.query.get_or_404(item_id)
    
    if cart_item.user_id != current_user.id:
        flash('Unauthorized action!', 'danger')
        return redirect(url_for('cart.view_cart'))
    
    quantity = request.form.get('quantity', type=int)
    
    if quantity and quantity > 0:
        if quantity <= cart_item.product.stock:
            cart_item.quantity = quantity
            flash('Cart updated!', 'success')
        else:
            flash(f'Sorry, only {cart_item.product.stock} items in stock!', 'danger')
    else:
        flash('Invalid quantity!', 'danger')
    
    db.session.commit()
    return redirect(url_for('cart.view_cart'))

@cart_bp.route('/remove/<int:item_id>')
@login_required
def remove_from_cart(item_id):
    cart_item = Cart.query.get_or_404(item_id)
    
    if cart_item.user_id != current_user.id:
        flash('Unauthorized action!', 'danger')
        return redirect(url_for('cart.view_cart'))
    
    db.session.delete(cart_item)
    db.session.commit()
    flash('Item removed from cart!', 'success')
    return redirect(url_for('cart.view_cart'))

@cart_bp.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    
    if not cart_items:
        flash('Your cart is empty!', 'warning')
        return redirect(url_for('cart.view_cart'))
    
    total = sum(item.product.price * item.quantity for item in cart_items)
    form = CheckoutForm()
    
    if form.validate_on_submit():
        # Create order
        order_number = str(uuid.uuid4())[:8].upper()
        order = Order(
            order_number=order_number,
            user_id=current_user.id,
            total_amount=total,
            whatsapp_number=form.whatsapp_number.data,
            shipping_address=form.shipping_address.data
        )
        db.session.add(order)
        
        # Create order items
        for cart_item in cart_items:
            order_item = OrderItem(
                order=order,
                product_id=cart_item.product_id,
                product_name=cart_item.product.name,
                product_price=cart_item.product.price,
                quantity=cart_item.quantity
            )
            db.session.add(order_item)
            
            # Update stock
            cart_item.product.stock -= cart_item.quantity
            db.session.delete(cart_item)
        
        db.session.commit()
        
        # WhatsApp message
        whatsapp_msg = f"Hello! I've placed an order.\n\nOrder #{order_number}\nTotal: ${total:.2f}\n\nItems:\n"
        for item in order.items:
            whatsapp_msg += f"- {item.product_name} x{item.quantity} = ${item.product_price * item.quantity:.2f}\n"
        whatsapp_msg += f"\nShipping to: {form.shipping_address.data}"
        
        whatsapp_url = f"https://wa.me/{form.whatsapp_number.data}?text={whatsapp_msg.replace(' ', '%20').replace('\n', '%0A')}"
        
        flash(f'Order placed successfully! Order #{order_number}', 'success')
        return redirect(whatsapp_url)
    
    return render_template('checkout.html', form=form, cart_items=cart_items, total=total)