import { account } from '@/lib/appwrite/config';
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const EmailVerification = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying..."); // Loading, success, or error message

    useEffect(()=>{
        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');

        if (userId && secret) {
            account.updateVerification(userId, secret)
              .then((res) => {
                setStatus("✅ Email verified successfully! Redirecting to sign in page...");
                setTimeout(() => navigate("/sign-in"), 5000); // 5 second delay
                toast("Email verified successfully! Please sign in.",{
                    duration: 20000,
                    position: 'top-center',
                    style: {
                      background: 'linear-gradient(to right, #4dff4d, #00cc00)',
                      color: '#fff',
                      fontWeight: 'bold',
                    }
                });
              })
              .catch((err) => {
                console.error("Verification error", err);
                setStatus("❌ Verification failed. The link may be invalid or expired.");
                toast("Verification failed. The link may be invalid or expired.",{
                    duration: 20000,
                    position: 'top-center',
                    style: {
                      background: 'linear-gradient(to right, #ff0000, #ff7f00)',
                      color: '#fff',
                      fontWeight: 'bold',
                    }
                })
              });
          } else {
            setStatus("❌ Missing verification data in URL.");
          }
    },[]);


  return (
    <div>
        <h1 className='text-light-4 mt-10 text-center w-full'>Verifying your email......</h1>
        <p>{ status }</p>

    </div>
  )

}

export default EmailVerification