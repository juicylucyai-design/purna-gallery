import type { SiteContent } from '../lib/content';

export function Location({ location, contact }: { location: SiteContent['location']; contact: SiteContent['contact'] }) {
  return (
    <section className="section dark" id="alserkal" aria-labelledby="location-title">
      <div className="wrap location">
        <img className="location__image" src={location.image.src} alt={location.image.alt} loading="lazy" />
        <div className="location__text">
          <img className="location__ornament" src="/images/ornament.png" alt="" width={44} height={160} />
          <p className="eyebrow">{location.eyebrow}</p>
          <h2 className="title" id="location-title">
            {location.heading}
          </h2>
          {location.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p className="location__address">{contact.location}</p>
        </div>
      </div>
    </section>
  );
}
