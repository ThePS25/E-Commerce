import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps } from 'antd';
import DropIn from 'braintree-web-drop-in-react';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTransition from '@/components/PageTransition';
import { orderApi } from '@/api/orderApi';
import { couponApi } from '@/api/couponApi';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { clearCart, setPromoCode, applyCoupon, clearCoupon, selectAppliedCoupon } from '@/store/cartSlice';
import useAuth from '@/hooks/useAuth';
import { formatPrice, calcCartTotal, calcOrderTotal, groupCartItems, formatCouponLabel } from '@/utils/formatters';
import { getProductPhotoUrl } from '@/api/axiosClient';
import './Checkout.scss';

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedCoupons, setSuggestedCoupons] = useState([]);
  const [address, setAddress] = useState({ street: '', city: '', zip: '', phone: '' });
  const items = useAppSelector((s) => s.cart.items);
  const promoCode = useAppSelector((s) => s.cart.promoCode);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const subtotal = calcCartTotal(items);
  const total = calcOrderTotal(items, appliedCoupon);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: '/checkout' });
      return;
    }
    if (user?.address) {
      const addr = typeof user.address === 'string' ? { street: user.address } : user.address;
      setAddress((prev) => ({ ...prev, ...addr, phone: user.phone || '' }));
    }
    orderApi.getBraintreeToken()
      .then(({ data }) => setClientToken(data.clientToken))
      .catch(() => {});
    couponApi.getActive()
      .then(({ data }) => setSuggestedCoupons(data?.coupons || []))
      .catch(() => {});
  }, [isAuthenticated, user, navigate]);

  const validateAndApplyCoupon = useCallback(async (code) => {
    if (!code?.trim()) return;
    try {
      const { data } = await couponApi.validate(code.trim(), subtotal);
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
  }, [dispatch, subtotal]);

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  const grouped = groupCartItems(items);

  const placeOrder = async () => {
    try {
      setLoading(true);
      const payload = {
        cart: items,
        couponCode: appliedCoupon?.code || null,
      };

      if (paymentMethod === 'cod') {
        await orderApi.placeCodOrder(payload);
      } else {
        const { nonce } = await instance.requestPaymentMethod();
        await orderApi.processPayment({ ...payload, nonce });
      }

      dispatch(clearCart());
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Address' },
    { title: 'Payment' },
    { title: 'Review' },
    { title: 'Done' },
  ];

  return (
    <PageTransition>
      <div className="page-content app-container checkout">
        <h1>Checkout</h1>
        <Steps current={step} items={steps} className="checkout__steps" />

        {step === 0 && (
          <div className="checkout__panel">
            <h2>Shipping Address</h2>
            <div className="checkout__form">
              <input placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <div className="checkout__form-row">
                <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input placeholder="ZIP Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
              </div>
              <input placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            </div>
            <button type="button" className="btn btn-brand" onClick={() => setStep(1)}>Continue to Payment</button>
          </div>
        )}

        {step === 1 && (
          <div className="checkout__panel">
            <h2>Payment Method</h2>

            <div className="checkout__payment-options">
              <button
                type="button"
                className={`checkout__payment-option ${paymentMethod === 'online' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('online')}
              >
                <FiCreditCard size={22} />
                <div>
                  <strong>Pay Online</strong>
                  <span>Card / PayPal via Braintree</span>
                </div>
              </button>
              <button
                type="button"
                className={`checkout__payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <FiTruck size={22} />
                <div>
                  <strong>Pay on Delivery</strong>
                  <span>Cash or card when your order arrives</span>
                </div>
              </button>
            </div>

            {paymentMethod === 'online' && clientToken && (
              <div className="checkout__dropin">
                <DropIn
                  options={{ authorization: clientToken, paypal: { flow: 'vault' } }}
                  onInstance={setInstance}
                />
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="checkout__cod-note">
                You will pay {formatPrice(total)} when your order is delivered.
              </div>
            )}

            <div className="checkout__nav">
              <button type="button" className="btn btn-brand-outline" onClick={() => setStep(0)}>Back</button>
              <button
                type="button"
                className="btn btn-brand"
                onClick={() => setStep(2)}
                disabled={paymentMethod === 'online' && !instance}
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout__panel">
            <h2>Review Your Order</h2>

            <div className="checkout__coupons">
              <h3>Apply a coupon</h3>
              {suggestedCoupons.length > 0 && (
                <div className="checkout__coupon-suggestions">
                  {suggestedCoupons.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className={`checkout__coupon-chip ${appliedCoupon?.code === c.code ? 'active' : ''}`}
                      onClick={() => validateAndApplyCoupon(c.code)}
                    >
                      <strong>{c.code}</strong>
                      <span>{c.description || formatCouponLabel(c)}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="checkout__coupon-input">
                <input
                  placeholder="Enter coupon code"
                  value={promoCode}
                  onChange={(e) => dispatch(setPromoCode(e.target.value.toUpperCase()))}
                />
                <button type="button" className="btn btn-brand-outline" onClick={() => validateAndApplyCoupon(promoCode)}>
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="checkout__coupon-applied">
                  Applied: <strong>{appliedCoupon.code}</strong> (−{formatPrice(appliedCoupon.discountAmount)})
                  <button type="button" onClick={() => dispatch(clearCoupon())}>Remove</button>
                </p>
              )}
            </div>

            <div className="checkout__review">
              {grouped.map((item) => (
                <div key={item._id} className="checkout__review-item">
                  <img src={getProductPhotoUrl(item._id)} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="checkout__review-summary">
                <div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {appliedCoupon && (
                  <div className="discount"><span>Coupon discount</span><span>−{formatPrice(appliedCoupon.discountAmount)}</span></div>
                )}
                <div><span>Payment</span><span>{paymentMethod === 'cod' ? 'Pay on Delivery' : 'Online'}</span></div>
                <div className="total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div>
              </div>
            </div>

            <div className="checkout__nav">
              <button type="button" className="btn btn-brand-outline" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn btn-brand" onClick={placeOrder} disabled={loading}>
                {loading ? 'Placing order...' : paymentMethod === 'cod' ? `Place Order (${formatPrice(total)})` : `Pay ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout__success">
            <div className="checkout__success-icon">✓</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. You can track your order in your dashboard.</p>
            <button type="button" className="btn btn-brand" onClick={() => navigate('/dashboard/orders')}>
              View Orders
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Checkout;
