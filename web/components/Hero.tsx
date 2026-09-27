import type { SiteContent } from '../lib/content';
import { NotifyForm } from './NotifyForm';
import { Wordmark } from './Wordmark';

export function Hero({ hero, notify }: { hero: SiteContent['hero']; notify: SiteContent['notify'] }) {
  return (
    <>
      <header className="bar">
        <div className="wrap bar__inner">
          <nav className="bar__nav bar__nav--start" aria-label="Sections">
            <a href="#programme">Programme</a>
            <a href="#alserkal">Alserkal Avenue</a>
          </nav>
          <Wordmark />
          <nav className="bar__nav bar__nav--end" aria-label="Actions">
            <a href="#designers">{hero.designersLink}</a>
          </nav>
        </div>
      </header>

      <section className="hero" aria-label="Purna Gallery, coming soon">
        <img className="hero__image" src={hero.image.src} alt={hero.image.alt} width={1600} height={1196} fetchPriority="high" />
        <div className="wrap hero__content">
          <div className="hero__copy">
            <p className="hero__status">
              <span>{hero.status}</span>
              <span>{hero.location}</span>
            </p>
            <h1 className="hero__tagline">{hero.tagline}</h1>
          </div>
          <div className="hero__form" id="notify">
            <NotifyForm notify={notify} />
          </div>
        </div>
      </section>
    </>
  );
}
