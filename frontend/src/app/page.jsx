import "./home.css"
import Header from '@/components/Header/header';

export default function Home() {
  return (
    <SidebarProvider>
    <div className="d-flex">
      <Header />
      
     
    </div>
    </SidebarProvider>
  );
}
