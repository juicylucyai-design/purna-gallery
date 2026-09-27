-- Waitlist module: people who asked to hear when Purna opens.

CREATE TABLE waitlist_subscribers (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE CHECK (email = lower(email) AND length(email) BETWEEN 3 AND 254),
  source        TEXT NOT NULL DEFAULT 'coming-soon',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
