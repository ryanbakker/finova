import SchematicComponent from "@/components/schematic/SchematicComponent";
import { PlanUpdateTest } from "@/components/admin/PlanUpdateTest";

function ManagePlan() {
  return (
    <div className="page-content">
      <div className="pb-5">
        <h1 className="page-title">Plan & Billing</h1>
        <h2 className="page-sub-title">
          Manage your Finova subscription and billing details.
        </h2>
      </div>

      {/* Temporary test component - remove after fixing webhook issues */}
      <div className="mb-8">
        <PlanUpdateTest />
      </div>

      <SchematicComponent
        componentId={process.env.NEXT_PUBLIC_SCHEMATIC_COMPONENT_ID!}
      />
    </div>
  );
}

export default ManagePlan;
