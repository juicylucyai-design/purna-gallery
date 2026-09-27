import type { SiteContent } from '../lib/content';

export function Programme({ programme }: { programme: SiteContent['programme'] }) {
  return (
    <section className="section" id="programme" aria-labelledby="programme-title" style={{ paddingTop: 0 }}>
      <div className="wrap programme">
        <div className="programme__head">
          <div>
            <p className="eyebrow">{programme.eyebrow}</p>
            <h2 className="title" id="programme-title">
              {programme.heading}
            </h2>
          </div>
        </div>
        <ul className="programme__grid">
          {programme.pillars.map((pillar) => (
            <li className="work" key={pillar.name}>
              <div className="work__frame">
                <img src={pillar.image.src} alt={pillar.image.alt} loading="lazy" />
              </div>
              <div className="work__caption">
                <h3>{pillar.name}</h3>
                <p>{pillar.summary}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="programme__closing">{programme.closing}</p>
      </div>
    </section>
  );
}
