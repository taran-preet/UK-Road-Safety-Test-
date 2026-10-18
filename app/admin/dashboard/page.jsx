import {redirect} from 'next/navigation';
import {isAdmin} from '../../../lib/server/adminAuth';
import Dashboard from '../../../components/admin/Dashboard';
import '../admin.css';
export const dynamic='force-dynamic';
export const metadata={title:'Admin Dashboard'};
export default async function DashboardPage(){
  if(!await isAdmin())redirect('/admin');
  return <Dashboard/>;
}
