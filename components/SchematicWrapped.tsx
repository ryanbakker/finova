"use client";

import { useUser } from "@clerk/nextjs";
import { useSchematicEvents } from "@schematichq/schematic-react";
import React, { useEffect } from "react";

function SchematicWrapped({ children }: { children: React.ReactNode }) {
  const { identify } = useSchematicEvents();
  const { user } = useUser();

  useEffect(() => {
    const userName =
      user?.username ??
      user?.fullName ??
      user?.emailAddresses[0]?.emailAddress ??
      user?.id;

    if (user?.id) {
      identify({
        // Company Level
        company: {
          keys: {
            id: user.id,
          },
          name: userName,
        },

        // User Level
        keys: {
          id: user.id,
        },
        name: userName,
      });
    }
  }, [user, identify]);

  return children;
}

export default SchematicWrapped;
