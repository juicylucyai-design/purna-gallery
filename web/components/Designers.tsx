import type { SiteContent } from '../lib/content';
import { EnquiryForm } from './EnquiryForm';

export function Designers({ designers }: { designers: SiteContent['designers'] }) {
  return (
    <section className="section" id="designers" aria-labelledby="designers-title">
      <div className="wrap designers">
        <div className="designers__intro">
          <p className="eyebrow">{designers.eyebrow}</p>
          <h2 className="title" id="designers-title">
            {designers.heading}
          </h2>
          {designers.intro.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <ul className="ways">
            {designers.ways.map((way) => (
              <li key={way.title}>
                <h3>{way.title}</h3>
                <p>{way.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <EnquiryForm designers={designers} />
      </div>
    </section>
  );
}
