import type { SiteContent } from '../lib/content';

export function Position({ position }: { position: SiteContent['position'] }) {
  return (
    <section className="section" aria-labelledby="position-title">
      <div className="wrap position">
        <div className="position__head">
          <p className="eyebrow">{position.eyebrow}</p>
          <h2 className="title" id="position-title">
            {position.heading}
          </h2>
        </div>
        <div className="position__body">
          <p className="position__lede">{position.lede}</p>
          {position.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className="audiences">
            <p className="eyebrow">{position.audienceLabel}</p>
            <ul>
              {position.audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
