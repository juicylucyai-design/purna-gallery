-- Enquiry module: designers and studios who wrote in about working with Purna.

CREATE TABLE designer_enquiries (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  studio         TEXT,
  based_in       TEXT,
  portfolio_link TEXT,
  programme_area TEXT CHECK (programme_area IN ('contemporary-design', 'art-ceramics-objects', 'vintage-found', 'architectural-hardware', 'other')),
  message        TEXT NOT NULL,
  received_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX designer_enquiries_received_at_idx ON designer_enquiries (received_at DESC);
