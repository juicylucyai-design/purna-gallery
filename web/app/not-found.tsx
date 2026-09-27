import { Wordmark } from '../components/Wordmark';

export default function NotFound() {
  return (
    <main className="lost dark">
      <Wordmark />
      <p className="title">This page isn't here yet.</p>
      <a className="text-link" href="/">
        Return to Purna
      </a>
    </main>
  );
}
