import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import DoctorOverviewFoundation from "@/doctor-dashboard/components/DoctorOverviewFoundation";
import DoctorPatientManagement from "@/doctor-dashboard/components/DoctorPatientManagement";

export default function DoctorPage() {
  return (
    <div className="doctor-shell">
      <DoctorSidebar />
      <main className="doctor-main">
        <DoctorHeader />
        <DoctorOverviewFoundation />
        <DoctorPatientManagement />
      </main>
    </div>
  );
}
