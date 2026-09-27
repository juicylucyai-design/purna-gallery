import { Designers } from '../components/Designers';
import { Hero } from '../components/Hero';
import { Location } from '../components/Location';
import { Position } from '../components/Position';
import { Programme } from '../components/Programme';
import { SiteFooter } from '../components/SiteFooter';
import { content } from '../lib/content';

// The coming-soon page: each section is one component fed from content/site.json.
export default function HomePage() {
  return (
    <>
      <Hero hero={content.hero} notify={content.notify} />
      <main>
        <Position position={content.position} />
        <Programme programme={content.programme} />
        <Location location={content.location} contact={content.contact} />
        <Designers designers={content.designers} />
      </main>
      <SiteFooter contact={content.contact} />
    </>
  );
}
