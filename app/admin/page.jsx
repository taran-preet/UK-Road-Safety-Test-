import {redirect} from 'next/navigation';
import {isAdmin} from '../../lib/server/adminAuth';
import LoginForm from '../../components/admin/LoginForm';
import './admin.css';
export const dynamic='force-dynamic';
export const metadata={title:'Admin Login'};
export default async function AdminLogin(){
  if(await isAdmin())redirect('/admin/dashboard');
  return <LoginForm/>;
}
