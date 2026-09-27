import type { SiteContent } from '../lib/content';
import { Wordmark } from './Wordmark';

export function SiteFooter({ contact }: { contact: SiteContent['contact'] }) {
  return (
    <footer className="dark footer">
      <div className="wrap">
        <div className="footer__grid">
          <Wordmark />
          <div className="footer__col">
            <p className="eyebrow">Visit</p>
            <p>{contact.location}</p>
            <p>Opening soon</p>
          </div>
          <div className="footer__col">
            <p className="eyebrow">Write</p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}
            <a href="#designers">Designer enquiries</a>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} Purna Gallery</span>
          <span>A South Asian design house in Dubai</span>
        </div>
      </div>
    </footer>
  );
}
