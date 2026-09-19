import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import DoctorOverviewFoundation from "@/doctor-dashboard/components/DoctorOverviewFoundation";

export default function DoctorPage() {
  return (
    <div className="doctor-shell">
      <DoctorSidebar />
      <main className="doctor-main">
        <DoctorHeader />
        <DoctorOverviewFoundation />
      </main>
    </div>
  );
}
