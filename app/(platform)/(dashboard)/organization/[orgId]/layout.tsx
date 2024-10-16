import OrgController from "@/components/Dashboard/org/OrgContoller";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col size-full">
      <OrgController />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default OrganizationLayout;
