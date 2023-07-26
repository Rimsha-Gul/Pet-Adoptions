import { Application } from "../../types/interfaces";
import { BooleanField, TextualField } from "./ApplicationFields";

interface ApplicationGroupedFieldsProps {
  groupedFields: { label: string; fields: string[] }[];
  application: Application;
}

const ApplicationGroupedFields = ({
  groupedFields,
  application,
}: ApplicationGroupedFieldsProps) => {
  return (
    <>
      {groupedFields.map((group) => (
        <div key={group.label}>
          <h2 className="text-2xl text-primary font-bold mb-4 mt-2">
            {group.label}
          </h2>
          <div className="border-b-2 border-gray-200 my-2"></div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start gap-10">
            {group.fields.map((field) => {
              const applicationField = field as keyof Application;
              if (
                field === "petActivities" ||
                field === "handlePetIssues" ||
                field === "moveWithPet" ||
                field === "petTravelPlans" ||
                field === "petOutlivePlans"
              )
                return (
                  <TextualField
                    field={applicationField}
                    application={application}
                    className="flex-col"
                  />
                );
              if (typeof application[field as keyof Application] === "boolean")
                return (
                  <BooleanField
                    field={applicationField}
                    application={application}
                    className="flex-row"
                  />
                );
              return (
                <TextualField
                  field={applicationField}
                  application={application}
                  className="flex-row"
                />
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default ApplicationGroupedFields;
