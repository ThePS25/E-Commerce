import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { updateQuantity, removeFromCart, setPromoCode, applyCoupon, clearCoupon, selectAppliedCoupon } from '@/store/cartSlice';
import { groupCartItems, formatPrice, calcCartTotal, calcOrderTotal, formatCouponLabel } from '@/utils/formatters';
import { getProductPhotoUrl } from '@/api/axiosClient';
import { couponApi } from '@/api/couponApi';
import useAuth from '@/hooks/useAuth';
import './Cart.scss';

const Cart = () => {
  const items = useAppSelector((s) => s.cart.items);
  const promoCode = useAppSelector((s) => s.cart.promoCode);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const [suggestedCoupons, setSuggestedCoupons] = useState([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const subtotal = calcCartTotal(items);
  const total = calcOrderTotal(items, appliedCoupon);

  useEffect(() => {
    couponApi.getActive()
      .then(({ data }) => setSuggestedCoupons(data?.coupons || []))
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (code) => {
    const value = (code || promoCode).trim();
    if (!value) return;
    try {
      const { data } = await couponApi.validate(value, subtotal);
      if (data.success) {
        dispatch(applyCoupon(data.coupon));
        toast.success(`Coupon ${data.coupon.code} applied!`);
      } else {
        dispatch(clearCoupon());
        toast.error(data.message || 'Invalid coupon');
      }
    } catch {
      toast.error('Could not validate coupon');
    }
  };

  if (!items.length) {
    return (
      <PageTransition>
        <div className="page-content app-container">
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Explore our collection!"
            action={() => navigate('/products')}
            actionLabel="Start Shopping"
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-content app-container cart-page">
        <h1>Shopping Cart ({items.length} items)</h1>

        <div className="cart-page__layout">
          <div className="cart-page__items">
            {groupCartItems(items).map((item) => (
              <div key={item._id} className="cart-item">
                <img src={getProductPhotoUrl(item._id)} alt={item.name} loading="lazy" />
                <div className="cart-item__info">
                  <Link to={`/products/${item.slug}`}>{item.name}</Link>
                  <span className="cart-item__price">{formatPrice(item.price)}</span>
                </div>
                <div className="cart-item__qty">
                  <button type="button" onClick={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity - 1 }))} aria-label="Decrease quantity"><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity + 1 }))} aria-label="Increase quantity"><FiPlus /></button>
                </div>
                <span className="cart-item__total">{formatPrice(item.price * item.quantity)}</span>
                <button type="button" className="cart-item__remove" onClick={() => { for (let i = 0; i < item.quantity; i++) dispatch(removeFromCart(item._id)); toast.success('Item removed'); }} aria-label="Remove item"><FiTrash2 /></button>
              </div>
            ))}
          </div>

          <aside className="cart-page__summary">
            <h3>Order Summary</h3>

            {suggestedCoupons.length > 0 && (
              <div className="cart-page__suggestions">
                <p className="cart-page__suggestions-label">Available coupons</p>
                <div className="cart-page__coupon-chips">
                  {suggestedCoupons.slice(0, 3).map((c) => (
                    <button key={c.code} type="button" className={`cart-page__coupon-chip ${appliedCoupon?.code === c.code ? 'active' : ''}`} onClick={() => handleApplyCoupon(c.code)}>
                      {c.code} · {formatCouponLabel(c)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="cart-page__promo">
              <input type="text" placeholder="Enter coupon code" value={promoCode} onChange={(e) => dispatch(setPromoCode(e.target.value.toUpperCase()))} />
              <button type="button" className="btn btn-brand-outline" onClick={() => handleApplyCoupon()}>Apply</button>
            </div>

            {appliedCoupon && (
              <p className="cart-page__applied-coupon">
                {appliedCoupon.code} applied (−{formatPrice(appliedCoupon.discountAmount)})
                <button type="button" onClick={() => dispatch(clearCoupon())}>Remove</button>
              </p>
            )}

            <div className="cart-page__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {appliedCoupon && (
              <div className="cart-page__row cart-page__row--discount">
                <span>Discount</span><span>−{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}
            <div className="cart-page__row cart-page__row--total"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button type="button" className="btn btn-brand w-100" onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/auth/login', { state: '/checkout' })}>
              {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </button>
            <Link to="/products" className="cart-page__continue">Continue Shopping</Link>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
