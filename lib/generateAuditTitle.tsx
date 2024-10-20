import { ACTION, ENTITY_TYPE } from "@prisma/client";

interface props {
  entityTitle: string;
  entityType: ENTITY_TYPE;
  action: ACTION;
}

export const generateAuditTitle = ({
  entityTitle,
  entityType,
  action,
}: props): React.ReactNode => {
  const formattedEntityType = entityType.toLowerCase();

  switch (action) {
    case ACTION.CREATE:
      return (
        <span className="text-sm">
          {`Created ${formattedEntityType}`}{" "}
          <span className="font-bold text-muted-foreground">
            &quot;{entityTitle}&quot;
          </span>
        </span>
      );
    case ACTION.UPDATE:
      return (
        <span className="text-sm">
          {`Updated ${formattedEntityType}`}{" "}
          <span className="font-bold text-muted-foreground">
            &quot;{entityTitle}&quot;
          </span>
        </span>
      );
    case ACTION.DELETE:
      return (
        <span className="text-sm">
          {`Deleted ${formattedEntityType}`}{" "}
          <span className="font-bold text-muted-foreground">
            &quot;{entityTitle}&quot;
          </span>
        </span>
      );
    default:
      return (
        <span className="text-sm">
          {`Performed action on ${formattedEntityType}`}
          <span className="font-bold text-muted-foreground">
            &quot;{entityTitle}&quot;
          </span>
        </span>
      );
  }
};
