import {redirect} from 'next/navigation';
import {isAdmin} from '../../lib/server/adminAuth';
import LoginForm from '../../components/admin/LoginForm';
import './admin.css';
export const dynamic='force-dynamic';
export const metadata={title:'Admin Login'};
export default function AdminLogin(){
  if(isAdmin())redirect('/admin/dashboard');
  return <LoginForm/>;
}
