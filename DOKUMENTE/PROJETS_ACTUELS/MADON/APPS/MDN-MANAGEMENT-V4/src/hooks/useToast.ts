import { toast as hotToast } from 'react-hot-toast';

interface ToastOptions {
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function useToast() {
  return ({ description, type }: ToastOptions) => {
    const options = {
      duration: 5000,
      style: {
        background: type === 'error' ? '#FEE2E2' : 
                   type === 'success' ? '#ECFDF5' :
                   type === 'warning' ? '#FEF3C7' : '#EFF6FF',
        color: type === 'error' ? '#991B1B' :
               type === 'success' ? '#065F46' :
               type === 'warning' ? '#92400E' : '#1E40AF',
        padding: '16px',
        borderRadius: '8px',
      },
    };

    hotToast(description, options);
  };
} 