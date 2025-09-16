"use client";

import {
  SchematicEmbed as SchematicEmbedComponent,
  EmbedProvider,
} from "@schematichq/schematic-components";

const SchematicEmbed = ({
  accessToken,
  componentId,
}: {
  accessToken: string;
  componentId: string;
}) => {
  return (
    <EmbedProvider>
      <SchematicEmbedComponent accessToken={accessToken} id={componentId} />
    </EmbedProvider>
  );
};

export default SchematicEmbed;
