import type { SchemaType } from "../generated/models.gen.ts";
import { ToriiQueryBuilder } from "@dojoengine/sdk";
import { type Bounds, MAX_DIMENSION, QUERY_BUFFER } from "@pixelaw/core";

export function getQueryBounds(viewBounds: Bounds): Bounds {
  let [[left, top], [right, bottom]] = viewBounds;

  left = Math.max(left - (left % QUERY_BUFFER), 0);
  right = Math.min(
    right + (QUERY_BUFFER - (right % QUERY_BUFFER)),
    MAX_DIMENSION,
  );
  top = Math.max(top - (top % QUERY_BUFFER), 0);
  bottom = Math.min(
    bottom + (QUERY_BUFFER - (bottom % QUERY_BUFFER)),
    MAX_DIMENSION,
  );

  return [
    [left, top],
    [right, bottom],
  ];
}

export function buildSubscriptionQuery(): ToriiQueryBuilder<SchemaType> {
  const builder = new ToriiQueryBuilder<SchemaType>();
  const timestamp = Date.now();
  // TODO tweak the query, it works with withLimit(10) and withOffset(10) but removing them
  // leads to a grpc error.
  const query = builder
    .withLimit(10)
    .withOffset(0)
    .addEntityModel("pixelaw-Pixel")
    .updatedAfter(timestamp);
  return query;
}

export const SUBSCRIPTION_QUERY = {
  pixelaw: {
    Pixel: {
      $: {
        where: {
          And: [
            { x: { $gte: 0 } },
            { y: { $gte: 0 } },
            { x: { $lte: MAX_DIMENSION } },
            { y: { $lte: MAX_DIMENSION } },
          ],
        },
      },
    },
  },
};
