import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuthStore();
  const [ dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || user.email_verified_at || dismissed) {
    return null;
  }

  const handleSendVerification = async () => {
    setSending(true);
    const success = await sendVerificationEmail();
    setSending(false);

    if (success) {
      toast.success('Verification email sent!');
    } else {
      toast.error('Failed to send verification email');
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Please verify your email address.{' '}
              <button
                onClick={handleSendVerification}
                disabled={sending}
                className="font-medium text-yellow-900 underline hover:text-yellow-700 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send verification email'}
              </button>
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
