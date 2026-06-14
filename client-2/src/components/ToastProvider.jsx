import { Toaster } from 'react-hot-toast';

const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
      },
      success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
      error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
    }}
  />
);

export default ToastProvider;
